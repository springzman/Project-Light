# 🗂️ VISUAL FILE STRUCTURE DIAGRAM

## Complete Directory Map with Exact Locations

```
Project-Light/                                    ← YOUR PROJECT ROOT FOLDER
│
├─── 📄 index.js                                 ← MAIN SERVER FILE (START HERE)
├─── 📄 package.json                             ← NPM DEPENDENCIES
├─── 📄 .env                                     ← YOUR SETTINGS (CREATE FROM .env.example)
├─── 📄 .env.example                             ← SETTINGS TEMPLATE
├─── 📄 .gitignore                               ← GIT IGNORE RULES
│
├─── 📘 README.md                                ← MAIN DOCUMENTATION
├─── 📘 CHECKLIST.md                             ← SETUP CHECKLIST
├─── 📘 FILE_PLACEMENT_GUIDE.md                  ← THIS GUIDE
├─── 📘 ARCHITECTURE.md                          ← ARCHITECTURE INFO
├─── 📘 COMPARISON.md                            ← FEATURE COMPARISON
├─── 📘 IMPLEMENTATION_SUMMARY.md                ← IMPLEMENTATION DETAILS
├─── 📘 BACKEND_GUIDE.md                         ← BACKEND GUIDE
├─── 📘 COMPLETE_CODE.md                         ← CODE REFERENCE
│
├─── 📁 Config/                                  ← CONFIGURATION FOLDER
│    └─── 📄 config.json                        ← MAIN CONFIG (Discord, Gameserver, MongoDB)
│
├─── 📁 discord/                                 ← DISCORD BOT FOLDER
│    │
│    ├─── 📄 bot.js                             ← DISCORD BOT MAIN FILE
│    │
│    └─── 📁 commands/                          ← COMMANDS FOLDER
│         │
│         ├─── 📁 user/                         ← USER COMMANDS (Everyone can use)
│         │    ├─── 📄 create.js               ← /create command
│         │    ├─── 📄 details.js              ← /details command
│         │    ├─── 📄 exchange-code.js        ← /exchange-code command
│         │    ├─── 📄 lookup.js               ← /lookup command
│         │    └─── 📄 vbucks.js               ← /vbucks command
│         │
│         └─── 📁 admin/                        ← ADMIN COMMANDS (Moderators only)
│              ├─── 📄 addall.js               ← /addall command
│              ├─── 📄 addvbucks.js            ← /addvbucks command
│              ├─── 📄 ban.js                  ← /ban command
│              ├─── 📄 unban.js                ← /unban command
│              └─── 📄 delete.js               ← /delete command
│
└─── 📁 src/                                     ← SOURCE CODE FOLDER
     │
     ├─── 📁 models/                             ← DATABASE MODELS
     │    ├─── 📄 user.js                       ← User model (MongoDB schema)
     │    ├─── 📄 profiles.js                   ← Profiles model
     │    └─── 📄 friends.js                    ← Friends model
     │
     ├─── 📁 routes/                             ← API ROUTE HANDLERS
     │    ├─── 📄 api.js                        ← Account creation API
     │    ├─── 📄 auth.js                       ← OAuth authentication
     │    ├─── 📄 account.js                    ← Account management
     │    ├─── 📄 mcp.js                        ← Profile operations
     │    ├─── 📄 lightswitch.js                ← Service status
     │    ├─── 📄 cloudstorage.js               ← Cloud storage
     │    ├─── 📄 contentpages.js               ← Content pages
     │    ├─── 📄 version.js                    ← Version & timeline
     │    ├─── 📄 keychain.js                   ← Keychain
     │    └─── 📄 datarouter.js                 ← Data router
     │
     ├─── 📁 structs/                            ← UTILITY FUNCTIONS
     │    ├─── 📄 functions.js                  ← Helper functions
     │    ├─── 📄 log.js                        ← Logging system
     │    ├─── 📄 error.js                      ← Error handling
     │    └─── 📄 middleware.js                 ← Auth middleware
     │
     ├─── 📁 tokenManager/                       ← JWT TOKEN SYSTEM
     │    ├─── 📄 tokenCreation.js              ← Create JWT tokens
     │    └─── 📄 tokenVerify.js                ← Verify JWT tokens
     │
     ├─── 📁 xmpp/                               ← XMPP SERVER
     │    └─── 📄 xmpp.js                       ← XMPP server (WebSocket)
     │
     ├─── 📁 matchmaker/                         ← MATCHMAKING SYSTEM
     │    └─── 📄 matchmaker.js                 ← Matchmaker (WebSocket)
     │
     └─── 📁 responses/                          ← JSON RESPONSE DATA
          └─── 📄 keychain.json                 ← Keychain data
```

---

## 🎯 Quick Reference: Folder Purposes

| Folder | Purpose | Files |
|--------|---------|-------|
| **Root** | Main files, docs | 9 files |
| **Config/** | Configuration | 1 file |
| **discord/** | Discord bot | 1 file |
| **discord/commands/user/** | User commands | 5 files |
| **discord/commands/admin/** | Admin commands | 5 files |
| **src/models/** | Database schemas | 3 files |
| **src/routes/** | API endpoints | 10 files |
| **src/structs/** | Helper functions | 4 files |
| **src/tokenManager/** | JWT tokens | 2 files |
| **src/xmpp/** | XMPP server | 1 file |
| **src/matchmaker/** | Matchmaker | 1 file |
| **src/responses/** | JSON data | 1 file |

---

## 📍 Exact Path Examples

### Discord Bot File:
```
Project-Light/discord/bot.js
```

### User Command Example:
```
Project-Light/discord/commands/user/create.js
```

### Admin Command Example:
```
Project-Light/discord/commands/admin/ban.js
```

### Database Model Example:
```
Project-Light/src/models/user.js
```

### API Route Example:
```
Project-Light/src/routes/auth.js
```

### Utility Example:
```
Project-Light/src/structs/log.js
```

---

## ✅ Simple Checklist

Place files in this order:

**Step 1: Root Files**
- [ ] index.js → Project-Light/
- [ ] package.json → Project-Light/
- [ ] .env.example → Project-Light/ (then copy to .env)
- [ ] All .md files → Project-Light/

**Step 2: Config**
- [ ] config.json → Project-Light/Config/

**Step 3: Discord Bot**
- [ ] bot.js → Project-Light/discord/
- [ ] 5 user commands → Project-Light/discord/commands/user/
- [ ] 5 admin commands → Project-Light/discord/commands/admin/

**Step 4: Source Files**
- [ ] 3 models → Project-Light/src/models/
- [ ] 10 routes → Project-Light/src/routes/
- [ ] 4 structs → Project-Light/src/structs/
- [ ] 2 token files → Project-Light/src/tokenManager/
- [ ] 1 xmpp file → Project-Light/src/xmpp/
- [ ] 1 matchmaker file → Project-Light/src/matchmaker/
- [ ] 1 keychain.json → Project-Light/src/responses/

---

## 🔍 How to Verify

Run these commands to verify structure:

```bash
# Check Discord bot structure
ls discord/bot.js
ls discord/commands/user/*.js
ls discord/commands/admin/*.js

# Check source structure
ls src/models/*.js
ls src/routes/*.js
ls src/structs/*.js
ls src/tokenManager/*.js
ls src/xmpp/*.js
ls src/matchmaker/*.js
ls src/responses/*.json

# Check config
ls Config/config.json

# Check root files
ls index.js package.json .env
```

All commands should succeed without errors!

---

## 🚀 After Placing Files

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure settings:**
   - Edit `.env` with your Discord token
   - Edit `Config/config.json` with your settings

3. **Start the backend:**
   ```bash
   npm start
   ```

---

**Everything is now in the correct location!** ✅
