# Fortnite Emulator Backend v2.0 - Advanced Edition (Build 12.41)

## Overview
This is an advanced, feature-rich backend for a Fortnite emulator (Build 12.41) with complete database integration, XMPP server, and advanced matchmaking capabilities.

## 🚀 Features

### Core Features
- ✅ **MongoDB Integration** - Full database support with Mongoose ODM
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **XMPP Server** - Real-time messaging, parties, and presence
- ✅ **Advanced Matchmaker** - WebSocket-based matchmaking system
- ✅ **Account System** - Complete user management with registration
- ✅ **Rate Limiting** - Built-in protection against abuse
- ✅ **Profile Management** - Athena, Common Core, and Creative profiles

### Authentication
- OAuth token generation (password, exchange code, refresh token, client credentials)
- Token verification and refresh
- Session management
- Exchange code system for easy login

### Account Management
- User registration and login
- Account information retrieval
- External authentication support
- Privacy settings
- Social features

### XMPP Features
- Real-time presence management
- Party system (MUCs)
- Direct messaging (whispers)
- Party chat
- Friend notifications
- Online/offline status

### Matchmaking
- Queue management
- Session assignment
- Automatic game server connection
- Multiple gameserver support ready

## 📋 Prerequisites

- **Node.js** v14 or higher
- **MongoDB** v4.4 or higher (local or cloud instance)
- **npm** (comes with Node.js)

## 🛠️ Installation

### 1. Install MongoDB

**Windows:**
```bash
# Download and install from: https://www.mongodb.com/try/download/community
# MongoDB will run automatically as a service
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 2. Install Backend Dependencies

```bash
cd /path/to/Project-Light
npm install
```

### 3. Configure Environment

Edit `.env` file:
```env
PORT=3551
MONGODB_URI=mongodb://localhost:27017/fortnite
JWT_SECRET=your-secret-key-here
XMPP_PORT=80
MATCHMAKER_PORT=80
```

## 🏃 Running the Backend

### Start the server:
```bash
npm start
```

The backend will start:
- **HTTP Server**: `http://localhost:3551`
- **XMPP Server**: WebSocket on port 80 (or configured port)
- **Matchmaker**: WebSocket on port 80 (or configured port)

### Verify it's running:
```bash
curl http://localhost:3551/
```

Expected response:
```json
{
  "status": "OK",
  "message": "Fortnite Backend v2.0 - Advanced Edition",
  "build": "12.41",
  "features": ["MongoDB", "XMPP", "Matchmaker", "JWT Auth"],
  "uptime": 123.456,
  "clients": 0
}
```

## 📝 API Documentation

### Account Creation

**Create an account:**
```bash
POST /api/v1/account/create
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "PlayerName",
  "password": "SecurePassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Account created successfully",
  "accountId": "abc123...",
  "username": "PlayerName",
  "email": "user@example.com"
}
```

### Get Exchange Code

**Generate exchange code for login:**
```bash
POST /api/v1/account/exchange-code
Content-Type: application/json

{
  "username": "PlayerName",
  "password": "SecurePassword123"
}
```

Response:
```json
{
  "success": true,
  "exchangeCode": "abc123...",
  "expiresInSeconds": 300,
  "message": "Use this code to login in the game"
}
```

### OAuth Authentication

**Login with password:**
```bash
POST /account/api/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=PlayerName&password=SecurePassword123
```

**Login with exchange code:**
```bash
POST /account/api/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=exchange_code&exchange_code=abc123...
```

**Refresh token:**
```bash
POST /account/api/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=eg1~...
```

## 🎮 Game Client Setup

### Using Exchange Code

1. Create an account via API:
```bash
curl -X POST http://localhost:3551/api/v1/account/create \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"TestPlayer","password":"test123"}'
```

2. Generate exchange code:
```bash
curl -X POST http://localhost:3551/api/v1/account/exchange-code \
  -H "Content-Type: application/json" \
  -d '{"username":"TestPlayer","password":"test123"}'
```

3. Use the exchange code in the game launcher

### Using Fiddler

Configure Fiddler to redirect Fortnite traffic:
```javascript
if (oSession.hostname.Contains("epicgames")) {
    if (oSession.HTTPMethodIs("CONNECT")) {
        oSession["x-replywithtunnel"] = "ServerTunnel";
        return;
    }
    oSession.fullUrl = "http://127.0.0.1:3551" + oSession.PathAndQuery;
}
```

## 🗂️ Project Structure

```
Project-Light/
├── index.js                    # Main server entry point
├── package.json                # Dependencies
├── .env                        # Environment configuration
├── src/
│   ├── models/                 # MongoDB models
│   │   ├── user.js            # User schema
│   │   ├── profiles.js        # Profile schema
│   │   └── friends.js         # Friends schema
│   ├── routes/                 # API endpoints
│   │   ├── api.js             # Account management API
│   │   ├── auth.js            # OAuth endpoints
│   │   ├── account.js         # Account info endpoints
│   │   ├── mcp.js             # Profile operations
│   │   ├── lightswitch.js     # Service status
│   │   ├── cloudstorage.js    # Cloud storage
│   │   ├── contentpages.js    # Content pages
│   │   ├── version.js         # Version & timeline
│   │   ├── keychain.js        # Storefront keychain
│   │   └── datarouter.js      # Data routing
│   ├── structs/                # Utility modules
│   │   ├── functions.js       # Helper functions
│   │   ├── log.js             # Logging system
│   │   ├── error.js           # Error handling
│   │   └── middleware.js      # Authentication middleware
│   ├── tokenManager/           # JWT token management
│   │   ├── tokenCreation.js   # Token generation
│   │   └── tokenVerify.js     # Token verification
│   ├── xmpp/                   # XMPP server
│   │   └── xmpp.js            # WebSocket XMPP implementation
│   └── matchmaker/             # Matchmaking system
│       └── matchmaker.js      # WebSocket matchmaker
└── Config/                     # Configuration files (future)
```

## 🔧 Configuration

### MongoDB Connection

The backend connects to MongoDB using the URI in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/fortnite
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fortnite
```

### Ports

- `PORT` - HTTP API server port (default: 3551)
- `XMPP_PORT` - XMPP WebSocket port (default: 80)
- `MATCHMAKER_PORT` - Matchmaker WebSocket port (default: 80)

### JWT Secret

The `JWT_SECRET` is used to sign authentication tokens. Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🔐 Security

- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 8 hours (access) / 24 hours (refresh)
- Exchange codes expire after 5 minutes
- Rate limiting: 55 requests per 30 seconds
- Authentication required for most endpoints

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3551/health
```

### Test Account Creation
```bash
curl -X POST http://localhost:3551/api/v1/account/create \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"TestUser","password":"testpass123"}'
```

### Test Login
```bash
curl -X POST http://localhost:3551/account/api/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=TestUser&password=testpass123"
```

## 📊 Monitoring

### Active Clients

Check connected XMPP clients:
```bash
curl http://localhost:3551/
```

The response includes the number of connected clients.

### Database Status

Check MongoDB connection:
```bash
curl http://localhost:3551/health
```

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error:** `MongoDB failed to connect`

**Solution:**
1. Make sure MongoDB is installed and running:
   ```bash
   # Windows: Check Services
   # Linux: sudo systemctl status mongodb
   # macOS: brew services list
   ```
2. Verify the MongoDB URI in `.env`
3. Check MongoDB logs for errors

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
1. Change the port in `.env`
2. Or kill the process using the port:
   ```bash
   # Windows: netstat -ano | findstr :3551
   # Linux/macOS: lsof -ti:3551 | xargs kill
   ```

### XMPP Connection Issues

**Problem:** XMPP clients can't connect

**Solution:**
1. Make sure WebSocket port is not blocked by firewall
2. Check that the port matches in game client configuration
3. Verify HTTPS/SSL settings if using secure connections

## 🚧 Roadmap

- [ ] Item shop system
- [ ] Locker customization
- [ ] Friends system (add, remove, block)
- [ ] V-Bucks management
- [ ] Battle pass system
- [ ] Challenges and quests
- [ ] Stats tracking
- [ ] Refund system
- [ ] Discord bot integration
- [ ] Web dashboard

## 📜 Notes on DLLs

The DLLs in this repository are for OGFN redirection:
- They redirect to a specific Radmin VPN and IP
- **Not recommended for your own use**
- `console.dll` - Unlocks Unreal Engine console (usable)
- `eor.dll` - Universal edit on release (usable)

## 🙏 Credits

- Backend architecture inspired by [Project-Reload/Reload-Backend](https://github.com/Project-Reload/Reload-Backend)
- Original simple backend guide: [PongooDev/Fortnite-Backend-Guide](https://github.com/PongooDev/Fortnite-Backend-Guide)
- Keychain data: LawinserverV2

## 📄 License

This project is for educational purposes. Ensure you have proper licenses and permissions for any Fortnite-related content.

## ⚠️ Disclaimer

This is an educational project. The developers are not responsible for any misuse. Epic Games and Fortnite are trademarks of Epic Games, Inc. This project is not affiliated with or endorsed by Epic Games.

