# 📁 EXACT FILE PLACEMENT GUIDE

## Complete Directory Structure with Exact Locations

This guide shows **EXACTLY** where to place every single file in your project.

---

## 🗂️ Root Directory Files

Place these files in the **main project folder** (`Project-Light/`):

```
Project-Light/
├── index.js                          ← Main server file (REQUIRED)
├── package.json                      ← Dependencies (REQUIRED)
├── .env                             ← Your environment variables (REQUIRED - create from .env.example)
├── .env.example                     ← Environment template (PROVIDED)
├── .gitignore                       ← Git ignore rules (RECOMMENDED)
├── README.md                        ← Main documentation (PROVIDED)
├── CHECKLIST.md                     ← Setup checklist (PROVIDED)
├── ARCHITECTURE.md                  ← Architecture docs (PROVIDED)
├── COMPARISON.md                    ← Feature comparison (PROVIDED)
├── IMPLEMENTATION_SUMMARY.md        ← Implementation details (PROVIDED)
├── BACKEND_GUIDE.md                 ← Backend guide (PROVIDED)
└── COMPLETE_CODE.md                 ← Code reference (PROVIDED)
```

---

## 📂 Config/ Directory

Create a folder named `Config` in the root and place:

```
Project-Light/
└── Config/
    └── config.json                  ← Main configuration file (REQUIRED)
```

**Exact path:** `Project-Light/Config/config.json`

---

## 🤖 discord/ Directory

Create a folder named `discord` in the root:

```
Project-Light/
└── discord/
    ├── bot.js                       ← Discord bot main file (REQUIRED)
    └── commands/                    ← Commands folder
        ├── user/                    ← User commands folder
        │   ├── create.js           ← /create command
        │   ├── details.js          ← /details command
        │   ├── exchange-code.js    ← /exchange-code command
        │   ├── lookup.js           ← /lookup command
        │   └── vbucks.js           ← /vbucks command
        └── admin/                   ← Admin commands folder
            ├── addall.js           ← /addall command
            ├── addvbucks.js        ← /addvbucks command
            ├── ban.js              ← /ban command
            ├── unban.js            ← /unban command
            └── delete.js           ← /delete command
```

**Exact paths:**
- `Project-Light/discord/bot.js`
- `Project-Light/discord/commands/user/create.js`
- `Project-Light/discord/commands/user/details.js`
- `Project-Light/discord/commands/user/exchange-code.js`
- `Project-Light/discord/commands/user/lookup.js`
- `Project-Light/discord/commands/user/vbucks.js`
- `Project-Light/discord/commands/admin/addall.js`
- `Project-Light/discord/commands/admin/addvbucks.js`
- `Project-Light/discord/commands/admin/ban.js`
- `Project-Light/discord/commands/admin/unban.js`
- `Project-Light/discord/commands/admin/delete.js`

---

## 📦 src/ Directory

Create a folder named `src` in the root with the following structure:

### src/models/

Database models go here:

```
Project-Light/
└── src/
    └── models/
        ├── user.js                  ← User model (REQUIRED)
        ├── profiles.js              ← Profiles model (REQUIRED)
        └── friends.js               ← Friends model (REQUIRED)
```

**Exact paths:**
- `Project-Light/src/models/user.js`
- `Project-Light/src/models/profiles.js`
- `Project-Light/src/models/friends.js`

### src/routes/

API route handlers go here:

```
Project-Light/
└── src/
    └── routes/
        ├── api.js                   ← Account creation API (REQUIRED)
        ├── auth.js                  ← OAuth authentication (REQUIRED)
        ├── account.js               ← Account management (REQUIRED)
        ├── mcp.js                   ← Profile operations (REQUIRED)
        ├── lightswitch.js           ← Service status (REQUIRED)
        ├── cloudstorage.js          ← Cloud storage (REQUIRED)
        ├── contentpages.js          ← Content pages (REQUIRED)
        ├── version.js               ← Version & timeline (REQUIRED)
        ├── keychain.js              ← Keychain (REQUIRED)
        └── datarouter.js            ← Data router (REQUIRED)
```

**Exact paths:**
- `Project-Light/src/routes/api.js`
- `Project-Light/src/routes/auth.js`
- `Project-Light/src/routes/account.js`
- `Project-Light/src/routes/mcp.js`
- `Project-Light/src/routes/lightswitch.js`
- `Project-Light/src/routes/cloudstorage.js`
- `Project-Light/src/routes/contentpages.js`
- `Project-Light/src/routes/version.js`
- `Project-Light/src/routes/keychain.js`
- `Project-Light/src/routes/datarouter.js`

### src/structs/

Utility functions go here:

```
Project-Light/
└── src/
    └── structs/
        ├── functions.js             ← Helper functions (REQUIRED)
        ├── log.js                   ← Logging system (REQUIRED)
        ├── error.js                 ← Error handling (REQUIRED)
        └── middleware.js            ← Auth middleware (REQUIRED)
```

**Exact paths:**
- `Project-Light/src/structs/functions.js`
- `Project-Light/src/structs/log.js`
- `Project-Light/src/structs/error.js`
- `Project-Light/src/structs/middleware.js`

### src/tokenManager/

JWT token management goes here:

```
Project-Light/
└── src/
    └── tokenManager/
        ├── tokenCreation.js         ← Create tokens (REQUIRED)
        └── tokenVerify.js           ← Verify tokens (REQUIRED)
```

**Exact paths:**
- `Project-Light/src/tokenManager/tokenCreation.js`
- `Project-Light/src/tokenManager/tokenVerify.js`

### src/xmpp/

XMPP server goes here:

```
Project-Light/
└── src/
    └── xmpp/
        └── xmpp.js                  ← XMPP server (REQUIRED)
```

**Exact path:**
- `Project-Light/src/xmpp/xmpp.js`

### src/matchmaker/

Matchmaker system goes here:

```
Project-Light/
└── src/
    └── matchmaker/
        └── matchmaker.js            ← Matchmaker (REQUIRED)
```

**Exact path:**
- `Project-Light/src/matchmaker/matchmaker.js`

### src/responses/

JSON response files go here:

```
Project-Light/
└── src/
    └── responses/
        └── keychain.json            ← Keychain data (REQUIRED)
```

**Exact path:**
- `Project-Light/src/responses/keychain.json`

---

## 🎯 Complete Visual Tree

Here's the complete directory structure:

```
Project-Light/
│
├── index.js                          ← Main server
├── package.json                      ← Dependencies
├── .env                             ← Your config (create this)
├── .env.example                     ← Template
├── .gitignore                       ← Git ignore
│
├── README.md                        ← Documentation
├── CHECKLIST.md
├── ARCHITECTURE.md
├── COMPARISON.md
├── IMPLEMENTATION_SUMMARY.md
├── BACKEND_GUIDE.md
├── COMPLETE_CODE.md
│
├── Config/
│   └── config.json                  ← Main configuration
│
├── discord/
│   ├── bot.js                       ← Discord bot
│   └── commands/
│       ├── user/                    ← User commands (5 files)
│       │   ├── create.js
│       │   ├── details.js
│       │   ├── exchange-code.js
│       │   ├── lookup.js
│       │   └── vbucks.js
│       └── admin/                   ← Admin commands (5 files)
│           ├── addall.js
│           ├── addvbucks.js
│           ├── ban.js
│           ├── unban.js
│           └── delete.js
│
└── src/
    ├── models/                      ← Database models
    │   ├── user.js
    │   ├── profiles.js
    │   └── friends.js
    │
    ├── routes/                      ← API routes
    │   ├── api.js
    │   ├── auth.js
    │   ├── account.js
    │   ├── mcp.js
    │   ├── lightswitch.js
    │   ├── cloudstorage.js
    │   ├── contentpages.js
    │   ├── version.js
    │   ├── keychain.js
    │   └── datarouter.js
    │
    ├── structs/                     ← Utilities
    │   ├── functions.js
    │   ├── log.js
    │   ├── error.js
    │   └── middleware.js
    │
    ├── tokenManager/                ← JWT tokens
    │   ├── tokenCreation.js
    │   └── tokenVerify.js
    │
    ├── xmpp/                        ← XMPP server
    │   └── xmpp.js
    │
    ├── matchmaker/                  ← Matchmaker
    │   └── matchmaker.js
    │
    └── responses/                   ← JSON data
        └── keychain.json
```

---

## 📋 Step-by-Step Setup

### Step 1: Create Main Folders

In your `Project-Light` folder, create these folders:

```bash
mkdir Config
mkdir discord
mkdir discord/commands
mkdir discord/commands/user
mkdir discord/commands/admin
mkdir src
mkdir src/models
mkdir src/routes
mkdir src/structs
mkdir src/tokenManager
mkdir src/xmpp
mkdir src/matchmaker
mkdir src/responses
```

### Step 2: Place Root Files

Copy these files to the root (`Project-Light/`) folder:
- ✅ index.js
- ✅ package.json
- ✅ .env.example (then copy to .env and edit)
- ✅ .gitignore
- ✅ All .md documentation files

### Step 3: Place Config

Copy to `Project-Light/Config/`:
- ✅ config.json

### Step 4: Place Discord Bot Files

Copy to `Project-Light/discord/`:
- ✅ bot.js

Copy to `Project-Light/discord/commands/user/`:
- ✅ create.js
- ✅ details.js
- ✅ exchange-code.js
- ✅ lookup.js
- ✅ vbucks.js

Copy to `Project-Light/discord/commands/admin/`:
- ✅ addall.js
- ✅ addvbucks.js
- ✅ ban.js
- ✅ unban.js
- ✅ delete.js

### Step 5: Place Source Files

**Models** → `Project-Light/src/models/`:
- ✅ user.js
- ✅ profiles.js
- ✅ friends.js

**Routes** → `Project-Light/src/routes/`:
- ✅ api.js
- ✅ auth.js
- ✅ account.js
- ✅ mcp.js
- ✅ lightswitch.js
- ✅ cloudstorage.js
- ✅ contentpages.js
- ✅ version.js
- ✅ keychain.js
- ✅ datarouter.js

**Utilities** → `Project-Light/src/structs/`:
- ✅ functions.js
- ✅ log.js
- ✅ error.js
- ✅ middleware.js

**Token Manager** → `Project-Light/src/tokenManager/`:
- ✅ tokenCreation.js
- ✅ tokenVerify.js

**XMPP** → `Project-Light/src/xmpp/`:
- ✅ xmpp.js

**Matchmaker** → `Project-Light/src/matchmaker/`:
- ✅ matchmaker.js

**Responses** → `Project-Light/src/responses/`:
- ✅ keychain.json

---

## ✅ Verification

After placing all files, verify with:

```bash
# Check all folders exist
ls -la Config/
ls -la discord/
ls -la discord/commands/user/
ls -la discord/commands/admin/
ls -la src/models/
ls -la src/routes/
ls -la src/structs/
ls -la src/tokenManager/
ls -la src/xmpp/
ls -la src/matchmaker/
ls -la src/responses/

# Count files (should be 42+ files)
find . -type f \( -name "*.js" -o -name "*.json" \) | grep -v node_modules | wc -l
```

---

## 🚨 Important Notes

1. **DO NOT create folders inside node_modules/** - that folder is auto-generated by npm
2. **Create .env from .env.example** - Don't use .env.example directly
3. **All paths are case-sensitive** on Linux/Mac
4. **Use forward slashes** (/) not backslashes (\)
5. **Don't add extra folders** - follow the structure exactly

---

## 🔧 Quick Create Script

If you want to create all folders at once, use:

```bash
# Navigate to your project root
cd Project-Light

# Create all folders
mkdir -p Config
mkdir -p discord/commands/user
mkdir -p discord/commands/admin
mkdir -p src/models
mkdir -p src/routes
mkdir -p src/structs
mkdir -p src/tokenManager
mkdir -p src/xmpp
mkdir -p src/matchmaker
mkdir -p src/responses

echo "✅ All folders created!"
```

---

## 📊 File Count Summary

| Location | Files | Description |
|----------|-------|-------------|
| Root | 9 | Main files + docs |
| Config/ | 1 | config.json |
| discord/ | 11 | Bot + 10 commands |
| src/models/ | 3 | Database models |
| src/routes/ | 10 | API endpoints |
| src/structs/ | 4 | Utilities |
| src/tokenManager/ | 2 | JWT tokens |
| src/xmpp/ | 1 | XMPP server |
| src/matchmaker/ | 1 | Matchmaker |
| src/responses/ | 1 | JSON data |
| **TOTAL** | **43** | **All files** |

---

## 🎯 Ready to Start

Once all files are in place:

1. Run `npm install` to install dependencies
2. Edit `.env` with your settings
3. Edit `Config/config.json` with Discord bot token
4. Run `npm start` to start the backend

**All files are now exactly where they should be!** ✅
