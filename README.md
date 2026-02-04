# Fortnite Backend v2.0 - Complete Edition with Discord Bot

## 🎮 Complete Backend Solution for Fortnite Build 12.41

A production-ready backend with MongoDB, XMPP, Advanced Matchmaker, JWT Authentication, and Discord Bot integration.

---

## 📦 Complete File Structure

```
Project-Light/
├── index.js                          # Main server file
├── package.json                      # Dependencies
├── .env.example                      # Environment template
├── Config/
│   └── config.json                  # Main configuration
├── discord/
│   ├── bot.js                       # Discord bot main file
│   └── commands/
│       ├── user/                    # User commands
│       │   ├── create.js           # Create account
│       │   ├── details.js          # View account details
│       │   ├── exchange-code.js    # Generate login code
│       │   ├── lookup.js           # Look up users
│       │   └── vbucks.js           # Check V-Bucks
│       └── admin/                   # Admin commands
│           ├── addall.js           # Give all cosmetics
│           ├── addvbucks.js        # Add V-Bucks
│           ├── ban.js              # Ban users
│           ├── unban.js            # Unban users
│           └── delete.js           # Delete accounts
├── src/
│   ├── models/                      # Database models
│   │   ├── user.js
│   │   ├── profiles.js
│   │   └── friends.js
│   ├── routes/                      # API routes
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── account.js
│   │   ├── mcp.js
│   │   ├── lightswitch.js
│   │   ├── cloudstorage.js
│   │   ├── contentpages.js
│   │   ├── version.js
│   │   ├── keychain.js
│   │   └── datarouter.js
│   ├── structs/                     # Utilities
│   │   ├── functions.js
│   │   ├── log.js
│   │   ├── error.js
│   │   └── middleware.js
│   ├── tokenManager/                # JWT tokens
│   │   ├── tokenCreation.js
│   │   └── tokenVerify.js
│   ├── xmpp/                        # XMPP server
│   │   └── xmpp.js
│   ├── matchmaker/                  # Matchmaker
│   │   └── matchmaker.js
│   └── responses/                   # JSON responses
│       └── keychain.json
```

---

## 🚀 Quick Start Guide

### Step 1: Install Prerequisites

1. **Install Node.js** (v14 or higher)
   - Download from: https://nodejs.org/

2. **Install MongoDB** (v4.4 or higher)
   - Windows: https://www.mongodb.com/try/download/community
   - Linux: `sudo apt-get install mongodb`
   - macOS: `brew install mongodb-community`

### Step 2: Setup Files

1. **Copy all the files** to your project directory

2. **Create .env file** (copy from .env.example):
```bash
cp .env.example .env
```

3. **Edit .env** with your settings:
```env
PORT=3551
MONGODB_URI=mongodb://localhost:27017/fortnite
JWT_SECRET=your-secret-key-change-this
XMPP_PORT=80
MATCHMAKER_PORT=80
GAMESERVER_IP=127.0.0.1
GAMESERVER_PORT=7777
DISCORD_TOKEN=YOUR_BOT_TOKEN
DISCORD_CLIENT_ID=YOUR_CLIENT_ID
DISCORD_GUILD_ID=YOUR_GUILD_ID
DISCORD_ENABLED=true
```

4. **Edit Config/config.json**:
```json
{
  "port": 3551,
  "gameServerIP": "127.0.0.1:7777",
  "gameServerPort": 7777,
  "mongodb": {
    "database": "mongodb://localhost:27017/fortnite"
  },
  "discord": {
    "enabled": true,
    "token": "YOUR_DISCORD_BOT_TOKEN",
    "clientId": "YOUR_CLIENT_ID",
    "guildId": "YOUR_GUILD_ID"
  },
  "moderators": ["YOUR_DISCORD_USER_ID"]
}
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- express (Web framework)
- mongoose (MongoDB)
- bcrypt (Password hashing)
- jsonwebtoken (JWT auth)
- discord.js (Discord bot)
- ws (WebSocket for XMPP/Matchmaker)
- xml-parser & xmlbuilder (XMPP)
- express-rate-limit (Rate limiting)
- And more...

### Step 4: Start MongoDB

**Windows:**
```bash
# MongoDB should start automatically as a service
# Or: net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**macOS:**
```bash
brew services start mongodb-community
```

### Step 5: Start the Backend

```bash
npm start
```

You should see:
```
[BACKEND] Successfully connected to MongoDB!
[BACKEND] Backend Server started on port 3551
[BACKEND] Gameserver configured: 127.0.0.1:7777
[XMPP] XMPP Server initialized on port 80
[MATCHMAKER] Matchmaker Server initialized on port 80
✅ Discord bot logged in as YourBot#1234
```

---

## 🤖 Discord Bot Setup

### Creating Your Discord Bot

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Give it a name (e.g., "Fortnite Backend Bot")
4. Go to "Bot" tab
5. Click "Add Bot"
6. **Copy the TOKEN** - this is your `DISCORD_TOKEN`
7. Enable these Privileged Gateway Intents:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT

### Getting IDs

**Client ID:**
- Go to "General Information" tab
- Copy "APPLICATION ID"

**Guild ID:**
- Enable Developer Mode in Discord (Settings > Advanced > Developer Mode)
- Right-click your server > Copy ID

**Your User ID:**
- Right-click yourself in Discord > Copy ID

### Inviting the Bot

Use this URL (replace CLIENT_ID):
```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

---

## 💬 Discord Commands

### User Commands (Everyone)

| Command | Description | Usage |
|---------|-------------|-------|
| `/create` | Create a new account | `/create email:user@email.com username:Player password:pass123` |
| `/details` | View your account info | `/details` |
| `/exchange-code` | Get login code for game | `/exchange-code` |
| `/lookup` | Look up another user | `/lookup username:Player` |
| `/vbucks` | Check your V-Bucks | `/vbucks` |

### Admin Commands (Moderators Only)

| Command | Description | Usage |
|---------|-------------|-------|
| `/addall` | Give all cosmetics | `/addall username:Player` |
| `/addvbucks` | Add V-Bucks to user | `/addvbucks username:Player amount:1000` |
| `/ban` | Ban a user | `/ban username:Player reason:Cheating` |
| `/unban` | Unban a user | `/unban username:Player` |
| `/delete` | Delete an account | `/delete username:Player` |

---

## 🎮 Using the Backend

### Creating an Account (Discord)

1. Use `/create` command in Discord:
```
/create email:player@email.com username:Player1 password:mypassword
```

2. Use `/exchange-code` to get login code:
```
/exchange-code
```

3. Copy the code and use it in your Fortnite launcher

### Creating an Account (API)

```bash
curl -X POST http://localhost:3551/api/v1/account/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@email.com",
    "username": "Player1",
    "password": "mypassword"
  }'
```

### Generating Exchange Code (API)

```bash
curl -X POST http://localhost:3551/api/v1/account/exchange-code \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Player1",
    "password": "mypassword"
  }'
```

---

## 🌐 API Endpoints

### Public Endpoints

```
GET  /                              # Server info
GET  /health                        # Health check
GET  /api/v1/gameserver            # Gameserver info

POST /api/v1/account/create        # Create account
POST /api/v1/account/exchange-code # Get exchange code

POST /account/api/oauth/token      # Login (password/exchange_code/refresh_token)
POST /account/api/oauth/verify     # Verify token
POST /account/api/oauth/exchange   # Generate exchange code (requires auth)

GET  /lightswitch/api/service/Fortnite/status  # Service status
GET  /fortnite/api/calendar/v1/timeline        # Game timeline
```

### Authenticated Endpoints

```
GET  /account/api/public/account/:id        # Account details
GET  /account/api/public/account            # Multiple accounts
POST /fortnite/api/game/v2/profile/:id/client/:op  # Profile operations
GET  /fortnite/api/cloudstorage/system      # Cloud storage
GET  /fortnite/api/cloudstorage/user/:id    # User cloud storage
```

---

## ⚙️ Configuration

### Gameserver Configuration

The backend supports connecting to your Fortnite gameserver:

**config.json:**
```json
{
  "gameServerIP": "127.0.0.1:7777",
  "gameServerPort": 7777
}
```

**Environment (.env):**
```env
GAMESERVER_IP=127.0.0.1
GAMESERVER_PORT=7777
```

### MongoDB Configuration

**Local MongoDB:**
```
mongodb://localhost:27017/fortnite
```

**MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster.mongodb.net/fortnite
```

### Discord Bot Configuration

**Enable/Disable:**
```json
{
  "discord": {
    "enabled": true  // Set to false to disable
  }
}
```

**Moderators:**
Add Discord user IDs to moderators array:
```json
{
  "moderators": [
    "123456789012345678",
    "987654321098765432"
  ]
}
```

---

## 🔒 Security

- **Passwords**: Hashed with bcrypt (10 rounds)
- **JWT Tokens**: 8h access, 24h refresh
- **Rate Limiting**: 55 requests per 30 seconds
- **MongoDB**: Secure connection with authentication
- **Discord**: Bot token kept secret

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error:** `MongoDB failed to connect`

**Solution:**
1. Make sure MongoDB is running:
   - Windows: Check Services (net start MongoDB)
   - Linux: `sudo systemctl status mongodb`
   - macOS: `brew services list`

2. Check connection string in .env and config.json

### Discord Bot Not Starting

**Error:** `Discord bot logged in` not shown

**Solutions:**
1. Check `DISCORD_TOKEN` is correct
2. Verify bot has correct permissions
3. Make sure `discord.enabled` is `true` in config.json
4. Check bot is invited to your server

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
Change port in .env or config.json:
```env
PORT=8080
```

### Commands Not Showing

**Problem:** Discord commands don't appear

**Solutions:**
1. Make sure bot has `applications.commands` scope
2. Wait a few minutes for commands to register
3. Restart Discord client
4. Check bot has permissions in server

---

## 📊 Features

### ✅ Implemented

- MongoDB database integration
- JWT authentication (multiple grant types)
- XMPP server (messaging, parties, presence)
- Advanced matchmaker
- Discord bot with 10 commands
- User account system
- V-Bucks system
- Rate limiting
- Gameserver configuration
- Health monitoring
- API endpoints

### 🔄 Ready to Add

- Item shop
- Locker customization
- Friends system (add/remove/block)
- Battle pass
- Challenges/quests
- Stats tracking
- Web dashboard

---

## 📝 File Checklist

Make sure you have ALL these files:

```
✅ index.js
✅ package.json
✅ .env (copy from .env.example)
✅ Config/config.json
✅ discord/bot.js
✅ discord/commands/user/create.js
✅ discord/commands/user/details.js
✅ discord/commands/user/exchange-code.js
✅ discord/commands/user/lookup.js
✅ discord/commands/user/vbucks.js
✅ discord/commands/admin/addall.js
✅ discord/commands/admin/addvbucks.js
✅ discord/commands/admin/ban.js
✅ discord/commands/admin/unban.js
✅ discord/commands/admin/delete.js
✅ src/models/user.js
✅ src/models/profiles.js
✅ src/models/friends.js
✅ src/routes/ (all route files)
✅ src/structs/ (all struct files)
✅ src/tokenManager/ (token files)
✅ src/xmpp/xmpp.js
✅ src/matchmaker/matchmaker.js
✅ src/responses/keychain.json
```

---

## 🎯 Testing

### Test Backend

```bash
curl http://localhost:3551/
```

### Test Account Creation

```bash
curl -X POST http://localhost:3551/api/v1/account/create \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"TestPlayer","password":"test123"}'
```

### Test Discord Bot

In Discord:
```
/create email:test@test.com username:TestPlayer password:test123
/details
/vbucks
```

---

## 💡 Tips

1. **Keep .env file secret** - Never commit it to git
2. **Use strong JWT_SECRET** - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Set up MongoDB backups** - Important for production
4. **Monitor logs** - Check console for errors
5. **Test locally first** - Before deploying to production

---

## 📞 Support

If you encounter issues:

1. Check MongoDB is running
2. Verify all configuration files
3. Check Discord bot token and IDs
4. Look at console logs for errors
5. Ensure all npm packages installed

---

## 🏆 Credits

- Backend architecture: Project-Reload/Reload-Backend
- Original guide: PongooDev/Fortnite-Backend-Guide
- Keychain data: LawinserverV2

---

## ⚠️ Disclaimer

This is for educational purposes only. Fortnite is a trademark of Epic Games, Inc. This project is not affiliated with or endorsed by Epic Games.

---

**Version:** 2.0.0  
**Build:** 12.41  
**Status:** Production Ready 🚀
