const WebSocket = require("ws").Server;
const functions = require("../structs/functions");
const log = require("../structs/log");

let wss;

function setupMatchmaker(server) {
    wss = new WebSocket({ server, clientTracking: true });
    
    const port = process.env.MATCHMAKER_PORT || 80;
    log.matchmaker(`Matchmaker Server initialized on port ${port}`);

    wss.on('connection', async (ws, req) => {
        // Only handle non-XMPP connections (matchmaker)
        if (ws.protocol && ws.protocol.toLowerCase() === "xmpp") {
            return;
        }

        ws.on('error', (err) => {
            log.error(`Matchmaker WebSocket error: ${err.message}`);
        });

        handleMatchmaking(ws);
    });
}

async function handleMatchmaking(ws) {
    const ticketId = functions.MakeID().replace(/-/ig, "");
    const matchId = functions.MakeID().replace(/-/ig, "");
    const sessionId = functions.MakeID().replace(/-/ig, "");

    log.matchmaker("New matchmaking connection");

    // Step 1: Connecting
    sendStatus(ws, { state: "Connecting" });
    await functions.sleep(800);

    // Step 2: Waiting
    sendStatus(ws, {
        totalPlayers: 1,
        connectedPlayers: 1,
        state: "Waiting"
    });
    await functions.sleep(1000);

    // Step 3: Queued
    sendStatus(ws, {
        ticketId: ticketId,
        queuedPlayers: 0,
        estimatedWaitSec: 0,
        status: {},
        state: "Queued"
    });
    await functions.sleep(4000);

    // Step 4: SessionAssignment
    sendStatus(ws, {
        matchId: matchId,
        state: "SessionAssignment"
    });
    await functions.sleep(2000);

    // Step 5: Join
    sendPlay(ws, matchId, sessionId);
    
    log.matchmaker(`Session assigned: ${sessionId}`);
}

function sendStatus(ws, payload) {
    try {
        ws.send(JSON.stringify({
            payload: payload,
            name: "StatusUpdate"
        }));
    } catch (error) {
        log.error(`Failed to send status: ${error.message}`);
    }
}

function sendPlay(ws, matchId, sessionId) {
    try {
        ws.send(JSON.stringify({
            payload: {
                matchId: matchId,
                sessionId: sessionId,
                joinDelaySec: 1
            },
            name: "Play"
        }));
    } catch (error) {
        log.error(`Failed to send play: ${error.message}`);
    }
}

module.exports = setupMatchmaker;
