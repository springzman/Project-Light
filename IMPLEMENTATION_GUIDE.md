# Complete Implementation Guide - Project Light Backend

This guide provides specifications and architecture for implementing your Fortnite backend.

## Overview

You need to build a backend system with:
- REST API for authentication and game services
- MongoDB database for user data persistence
- WebSocket XMPP server for real-time chat
- WebSocket Matchmaker for game sessions
- Discord bot for account management

## File Structure

```
project-light-backend/
├── index.js                    # Main server entry point
├── package.json                # Dependencies
├── .env                        # Environment variables
├── Config/
│   └── config.json            # Server configuration
├── storage/
│   ├── settings/              # User settings backups
│   ├── cloud/                 # Cloud storage files
│   ├── analytics/             # Game analytics
│   └── logs/                  # Server logs
├── src/
│   ├── models/                # MongoDB schemas
│   │   ├── user.js
│   │   ├── profiles.js
│   │   ├── friends.js
│   │   ├── settings.js
│   │   └── stats.js
│   ├── routes/                # API endpoints
│   │   ├── auth.js
│   │   ├── account.js
│   │   ├── api.js            # Custom API routes
│   │   ├── mcp.js
│   │   ├── cloudstorage.js
│   │   ├── contentpages.js
│   │   ├── datarouter.js
│   │   ├── keychain.js
│   │   ├── lightswitch.js
│   │   ├── version.js
│   │   ├── settings.js
│   │   ├── stats.js
│   │   ├── inventory.js
│   │   └── friends.js
│   ├── structs/               # Utilities
│   │   ├── error.js
│   │   ├── functions.js
│   │   ├── log.js
│   │   └── middleware.js
│   ├── tokenManager/          # JWT tokens
│   │   ├── tokenCreation.js
│   │   └── tokenVerify.js
│   ├── xmpp/                  # XMPP server
│   │   └── xmpp.js
│   └── matchmaker/            # Matchmaker
│       └── matchmaker.js
└── discord/                   # Discord bot
    ├── bot.js
    └── commands/
        ├── user/
        │   ├── create.js
        │   ├── details.js
        │   ├── exchange-code.js
        │   ├── lookup.js
        │   └── vbucks.js
        └── admin/
            ├── addall.js
            ├── addvbucks.js
            ├── ban.js
            ├── unban.js
            └── delete.js
```

## API Specifications

### api.js Routes (Your Custom API)

This file should implement:

**POST /api/v1/account/create**
- Accept: email, username, password
- Validate input
- Check for existing user
- Hash password with bcrypt
- Create user in MongoDB
- Create default profiles
- Return: accountId, username, email

**POST /api/v1/account/exchange-code**
- Accept: username, password
- Verify credentials
- Generate exchange code (UUID)
- Store in memory with 5-minute expiry
- Return: code, expiresInSeconds

**GET /api/v1/gameserver/info**
- Read from Config/config.json
- Return: gameserver IP and port

### Implementation Pattern for api.js

```
1. Import required modules (express, bcrypt, models)
2. Create Express router
3. Define endpoint handlers:
   - Validate request body
   - Query database
   - Process data
   - Return JSON response
4. Export router
```

## Database Models

### User Model Schema
- accountId: String (unique)
- username: String
- username_lower: String (for case-insensitive search)
- email: String (unique)
- password: String (hashed)
- created: Date
- matchmakingId: String
- vbucks: Number (default: 0)
- banned: Boolean (default: false)
- discordId: String (optional)

### Profiles Model Schema
- accountId: String (reference to User)
- profiles: Object
  - athena: Object (Battle Royale profile)
  - common_core: Object (Core profile)
  - creative: Object (Creative profile)

### Friends Model Schema
- accountId: String (reference to User)
- friends: Array of Objects
- blocked: Array of Strings

### Settings Model Schema
- accountId: String (reference to User)
- gameplay: Object
- audio: Object
- video: Object
- controls: Object
- lastModified: Date

### Stats Model Schema
- accountId: String (reference to User)
- solo: Object (wins, kills, matches, etc.)
- duo: Object
- squad: Object
- achievements: Array

## Authentication Flow

1. Client requests token with username/password
2. Server validates credentials
3. Server generates JWT token
4. Client uses token in Authorization header
5. Middleware validates token on protected routes

## XMPP Server Specifications

WebSocket server that:
- Accepts connections on /xmpp path
- Parses XML messages
- Handles authentication
- Manages presence (online/offline)
- Routes chat messages
- Supports party (group chat)

## Matchmaker Specifications

WebSocket server that:
- Accepts connections on /matchmaker path
- Manages queue system
- Assigns players to sessions
- Provides gameserver connection info

## Discord Bot Specifications

### User Commands
1. /create - Create account (prompts for email, username, password)
2. /details - Show account info
3. /exchange-code - Generate login code
4. /lookup - Find user by username
5. /vbucks - Check V-Bucks balance

### Admin Commands (Moderator only)
1. /addall - Give all cosmetics
2. /addvbucks - Add V-Bucks
3. /ban - Ban user
4. /unban - Unban user
5. /delete - Delete account

## Environment Variables (.env)

```
MONGODB_URI=mongodb://localhost:27017/projectlight
PORT=3551
JWT_SECRET=your-secret-key-here
DISCORD_TOKEN=your-bot-token
DISCORD_CLIENT_ID=your-client-id
DISCORD_GUILD_ID=your-server-id
GAMESERVER_IP=127.0.0.1
GAMESERVER_PORT=7777
```

## Dependencies (package.json)

Required packages:
- express: ^4.18.2
- mongoose: ^7.0.0
- bcrypt: ^5.1.0
- jsonwebtoken: ^9.0.0
- uuid: ^9.0.0
- ws: ^8.13.0
- xml-parser: ^1.2.1
- xmlbuilder: ^15.1.1
- express-rate-limit: ^6.7.0
- axios: ^1.4.0
- dotenv: ^16.0.3
- discord.js: ^14.11.0
- cors: ^2.8.5

## Implementation Steps

1. **Setup Project**
   - Run `npm init`
   - Install dependencies
   - Create folder structure
   - Configure .env

2. **Build Database Models**
   - Define Mongoose schemas
   - Add validation
   - Export models

3. **Create Utility Functions**
   - Error handlers
   - Logging system
   - JWT middleware
   - Helper functions

4. **Implement Routes**
   - Start with auth routes
   - Add account routes
   - Implement custom API
   - Add game routes

5. **Build WebSocket Services**
   - XMPP server
   - Matchmaker server

6. **Create Discord Bot**
   - Bot initialization
   - Command handlers
   - Database integration

7. **Test Everything**
   - Test authentication
   - Test API endpoints
   - Test WebSocket connections
   - Test Discord commands

## Security Considerations

- Always hash passwords with bcrypt (10+ rounds)
- Use JWT for authentication
- Validate all inputs
- Rate limit API endpoints
- Never expose sensitive data
- Use HTTPS in production
- Sanitize user inputs
- Implement proper error handling

## Next Steps

Use this guide to implement your own unique version. Each component can be built independently and tested separately before integration.

For questions or issues, refer to the official documentation of each dependency.
