const WebSocket = require("ws").Server;
const XMLBuilder = require("xmlbuilder");
const XMLParser = require("xml-parser");
const functions = require("../structs/functions");
const log = require("../structs/log");
const User = require("../models/user");
const Friends = require("../models/friends");
const { verifyToken } = require("../tokenManager/tokenVerify");

let wss;
global.xmppDomain = "prod.ol.epicgames.com";
global.Clients = [];
global.MUCs = {};

function setupXMPP(server) {
    wss = new WebSocket({ server, clientTracking: true });
    
    const port = process.env.XMPP_PORT || 80;
    log.xmpp(`XMPP Server initialized on port ${port}`);

    wss.on('connection', async (ws, req) => {
        // Only handle XMPP connections
        if (!ws.protocol || ws.protocol.toLowerCase() !== "xmpp") {
            return;
        }

        ws.on('error', (err) => {
            log.error(`XMPP WebSocket error: ${err.message}`);
        });

        let accountId = "";
        let displayName = "";
        let jid = "";
        let resource = "";
        let ID = "";
        let Authenticated = false;
        let joinedMUCs = [];
        let clientExists = false;

        ws.on('message', async (message) => {
            if (Buffer.isBuffer(message)) message = message.toString();

            const msg = XMLParser(message);
            if (!msg || !msg.root || !msg.root.name) return;

            switch (msg.root.name) {
                case "open":
                    if (!ID) ID = functions.MakeID();

                    ws.send(XMLBuilder.create("open")
                        .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing")
                        .attribute("from", global.xmppDomain)
                        .attribute("id", ID)
                        .attribute("version", "1.0")
                        .attribute("xml:lang", "en")
                        .toString());

                    ws.send(XMLBuilder.create("stream:features")
                        .attribute("xmlns:stream", "http://etherx.jabber.org/streams")
                        .element("mechanisms")
                            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
                            .element("mechanism").text("PLAIN").up()
                        .up()
                        .element("ver")
                            .attribute("xmlns", "urn:xmpp:features:rosterver")
                        .up()
                        .element("starttls")
                            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-tls")
                        .up()
                        .element("bind")
                            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-bind")
                        .up()
                        .element("compression")
                            .attribute("xmlns", "http://jabber.org/features/compress")
                            .element("method").text("zlib")
                        .up()
                        .element("session")
                            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-session")
                        .toString());
                    break;

                case "auth":
                    if (!msg.root.content) break;

                    try {
                        const token = Buffer.from(msg.root.content, 'base64').toString().split('\u0000')[2];
                        const tokenVerification = verifyToken(token);

                        if (!tokenVerification.valid) {
                            ws.send(XMLBuilder.create("failure")
                                .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
                                .element("not-authorized")
                                .toString());
                            ws.close();
                            break;
                        }

                        accountId = tokenVerification.decoded.accountId;
                        const user = await User.findOne({ accountId }).lean();

                        if (!user) {
                            ws.send(XMLBuilder.create("failure")
                                .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
                                .element("not-authorized")
                                .toString());
                            ws.close();
                            break;
                        }

                        displayName = user.username;
                        Authenticated = true;

                        ws.send(XMLBuilder.create("success")
                            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
                            .toString());
                    } catch (error) {
                        log.error(`XMPP auth error: ${error.message}`);
                        ws.close();
                    }
                    break;

                case "iq":
                    if (!Authenticated) break;

                    const iq = msg.root;
                    const iqType = iq.attributes.type;
                    const iqId = iq.attributes.id;
                    const iqChild = iq.children && iq.children[0];

                    if (iqType === "get") {
                        ws.send(XMLBuilder.create("iq")
                            .attribute("to", jid)
                            .attribute("from", global.xmppDomain)
                            .attribute("id", iqId)
                            .attribute("type", "result")
                            .toString());
                    } else if (iqType === "set") {
                        if (iqChild && iqChild.name === "bind") {
                            resource = iqChild.children && iqChild.children[0] && iqChild.children[0].content || functions.MakeID();
                            jid = `${accountId}@${global.xmppDomain}/${resource}`;

                            // Add to clients list
                            const existingClient = global.Clients.find(c => c.accountId === accountId);
                            if (existingClient) {
                                existingClient.ws.close();
                                global.Clients = global.Clients.filter(c => c.accountId !== accountId);
                            }

                            global.Clients.push({
                                ws,
                                accountId,
                                displayName,
                                jid,
                                resource
                            });

                            ws.send(XMLBuilder.create("iq")
                                .attribute("to", jid)
                                .attribute("id", iqId)
                                .attribute("type", "result")
                                .element("bind")
                                    .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-bind")
                                    .element("jid").text(jid)
                                .toString());

                            log.xmpp(`${displayName} (${accountId}) connected`);
                        } else if (iqChild && iqChild.name === "session") {
                            ws.send(XMLBuilder.create("iq")
                                .attribute("to", jid)
                                .attribute("from", global.xmppDomain)
                                .attribute("id", iqId)
                                .attribute("type", "result")
                                .toString());
                        }
                    }
                    break;

                case "presence":
                    if (!Authenticated) break;

                    const presence = msg.root;
                    const presenceTo = presence.attributes.to;

                    if (presenceTo) {
                        // Joining a MUC (party)
                        const roomId = presenceTo.split("@")[0];
                        
                        if (!global.MUCs[roomId]) {
                            global.MUCs[roomId] = {
                                members: []
                            };
                        }

                        if (!global.MUCs[roomId].members.find(m => m.accountId === accountId)) {
                            global.MUCs[roomId].members.push({
                                accountId,
                                displayName,
                                jid: presenceTo
                            });
                            joinedMUCs.push(roomId);
                        }

                        // Send presence to all members
                        global.MUCs[roomId].members.forEach(member => {
                            const client = global.Clients.find(c => c.accountId === member.accountId);
                            if (client) {
                                client.ws.send(XMLBuilder.create("presence")
                                    .attribute("from", presenceTo)
                                    .attribute("to", client.jid)
                                    .toString());
                            }
                        });
                    } else {
                        // Broadcast presence to friends
                        const friends = await Friends.findOne({ accountId }).lean();
                        if (friends && friends.friends) {
                            friends.friends.filter(f => f.status === "ACCEPTED").forEach(friend => {
                                const friendClient = global.Clients.find(c => c.accountId === friend.accountId);
                                if (friendClient) {
                                    friendClient.ws.send(XMLBuilder.create("presence")
                                        .attribute("from", jid)
                                        .attribute("to", friendClient.jid)
                                        .attribute("type", "available")
                                        .toString());
                                }
                            });
                        }
                    }
                    break;

                case "message":
                    if (!Authenticated) break;

                    const message_msg = msg.root;
                    const messageTo = message_msg.attributes.to;
                    const messageType = message_msg.attributes.type || "chat";
                    const messageBody = message_msg.children && message_msg.children.find(c => c.name === "body");

                    if (!messageBody || !messageBody.content) break;

                    if (messageType === "chat") {
                        // Direct message
                        const toAccountId = messageTo.split("@")[0];
                        const recipientClient = global.Clients.find(c => c.accountId === toAccountId);

                        if (recipientClient) {
                            recipientClient.ws.send(XMLBuilder.create("message")
                                .attribute("from", jid)
                                .attribute("to", recipientClient.jid)
                                .attribute("type", "chat")
                                .element("body").text(messageBody.content)
                                .toString());
                        }
                    } else if (messageType === "groupchat") {
                        // MUC message
                        const roomId = messageTo.split("@")[0];
                        const muc = global.MUCs[roomId];

                        if (muc) {
                            muc.members.forEach(member => {
                                if (member.accountId !== accountId) {
                                    const client = global.Clients.find(c => c.accountId === member.accountId);
                                    if (client) {
                                        client.ws.send(XMLBuilder.create("message")
                                            .attribute("from", messageTo)
                                            .attribute("to", client.jid)
                                            .attribute("type", "groupchat")
                                            .element("body").text(messageBody.content)
                                            .toString());
                                    }
                                }
                            });
                        }
                    }
                    break;

                case "close":
                    ws.close();
                    break;
            }
        });

        ws.on('close', async () => {
            if (!Authenticated) return;

            // Remove from clients
            global.Clients = global.Clients.filter(c => c.accountId !== accountId);

            // Remove from MUCs
            joinedMUCs.forEach(roomId => {
                if (global.MUCs[roomId]) {
                    global.MUCs[roomId].members = global.MUCs[roomId].members.filter(m => m.accountId !== accountId);
                    if (global.MUCs[roomId].members.length === 0) {
                        delete global.MUCs[roomId];
                    }
                }
            });

            // Send offline presence to friends
            const friends = await Friends.findOne({ accountId }).lean();
            if (friends && friends.friends) {
                friends.friends.filter(f => f.status === "ACCEPTED").forEach(friend => {
                    const friendClient = global.Clients.find(c => c.accountId === friend.accountId);
                    if (friendClient) {
                        friendClient.ws.send(XMLBuilder.create("presence")
                            .attribute("from", jid)
                            .attribute("to", friendClient.jid)
                            .attribute("type", "unavailable")
                            .toString());
                    }
                });
            }

            log.xmpp(`${displayName} (${accountId}) disconnected`);
        });
    });
}

module.exports = setupXMPP;
