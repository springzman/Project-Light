# 🎯 QUICK REFERENCE CARD - File Locations

## One-Page Reference for All File Locations

### 📍 Root Files (Project-Light/)
```
index.js               ← Main server
package.json           ← Dependencies  
.env                   ← Your settings (create from .env.example)
.env.example           ← Template
.gitignore             ← Git rules
README.md              ← Documentation
```

### 📍 Config/ 
```
config.json            ← Discord token, gameserver, MongoDB
```

### 📍 discord/
```
bot.js                 ← Main bot file
```

### 📍 discord/commands/user/
```
create.js              ← /create command
details.js             ← /details command
exchange-code.js       ← /exchange-code command
lookup.js              ← /lookup command
vbucks.js              ← /vbucks command
```

### 📍 discord/commands/admin/
```
addall.js              ← /addall command
addvbucks.js           ← /addvbucks command
ban.js                 ← /ban command
unban.js               ← /unban command
delete.js              ← /delete command
```

### 📍 src/models/
```
user.js                ← User database schema
profiles.js            ← Profiles schema
friends.js             ← Friends schema
```

### 📍 src/routes/
```
api.js                 ← Account creation
auth.js                ← OAuth login
account.js             ← Account info
mcp.js                 ← Profile operations
lightswitch.js         ← Service status
cloudstorage.js        ← Cloud storage
contentpages.js        ← Content pages
version.js             ← Version/timeline
keychain.js            ← Keychain
datarouter.js          ← Data router
```

### 📍 src/structs/
```
functions.js           ← Helper functions
log.js                 ← Logging
error.js               ← Error handling
middleware.js          ← Auth middleware
```

### 📍 src/tokenManager/
```
tokenCreation.js       ← Create JWT tokens
tokenVerify.js         ← Verify JWT tokens
```

### 📍 src/xmpp/
```
xmpp.js                ← XMPP WebSocket server
```

### 📍 src/matchmaker/
```
matchmaker.js          ← Matchmaking system
```

### 📍 src/responses/
```
keychain.json          ← Keychain data
```

---

## 🚀 Quick Setup

```bash
# 1. Create folders
mkdir -p Config discord/commands/{user,admin} src/{models,routes,structs,tokenManager,xmpp,matchmaker,responses}

# 2. Copy all files to correct locations

# 3. Setup environment
cp .env.example .env

# 4. Install
npm install

# 5. Configure
# Edit .env and Config/config.json

# 6. Start
npm start
```

---

## ✅ Verify

```bash
# Should show 43
find . -name "*.js" -o -name "*.json" | grep -v node_modules | wc -l

# Check structure
tree -L 3 -I node_modules
```

---

## 📊 File Count

| Location | Count |
|----------|-------|
| Root | 9 |
| Config | 1 |
| Discord | 11 |
| Models | 3 |
| Routes | 10 |
| Structs | 4 |
| Tokens | 2 |
| XMPP | 1 |
| Matchmaker | 1 |
| Responses | 1 |
| **Total** | **43** |

---

**For detailed info, see FILE_PLACEMENT_GUIDE.md** 📘
