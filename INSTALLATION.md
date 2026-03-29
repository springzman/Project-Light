# 🚀 Installation Guide - Fortnite Backend v3.0

## ⚠️ IMPORTANT: Fixing "Cannot find module 'express'" Error

If you're seeing this error:
```
Error: Cannot find module 'express'
```

**This means you haven't installed the Node.js dependencies yet!**

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v14.0.0 or higher)
   - Download from: https://nodejs.org/
   - Check version: `node --version`

2. **npm** (comes with Node.js)
   - Check version: `npm --version`

3. **MongoDB** (local or MongoDB Atlas)
   - Local: https://www.mongodb.com/try/download/community
   - Atlas (Cloud): https://www.mongodb.com/atlas

4. **Git** (for cloning)
   - Download from: https://git-scm.com/

## 🔧 Installation Steps

### Step 1: Navigate to Project Directory

Open your terminal/command prompt and go to the project folder:

```bash
cd "C:\Users\Admin\Desktop\Project Light"
```

Or wherever you placed the project files.

### Step 2: Install Node.js Dependencies

This is the **MOST IMPORTANT** step that fixes the "Cannot find module" error:

```bash
npm install
```

This command will:
- Read the `package.json` file
- Download and install all 12 required packages:
  - express
  - mongoose
  - bcrypt
  - jsonwebtoken
  - uuid
  - ws
  - xml-parser
  - xmlbuilder
  - dotenv
  - axios
  - express-rate-limit
  - discord.js

**Wait for installation to complete!** This may take 2-5 minutes depending on your internet speed.

### Step 3: Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env
```

Then edit `.env` with your details:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/fortnite-backend

# Server Configuration
PORT=3551
HOST=0.0.0.0

# JWT Secret (change this to a random string!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Discord Bot (if using)
DISCORD_TOKEN=your-discord-bot-token
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_GUILD_ID=your-discord-server-id

# Game Server
GAMESERVER_IP=127.0.0.1
GAMESERVER_PORT=7777
```

### Step 4: Start MongoDB

If using local MongoDB:

```bash
# Windows (if MongoDB is installed as a service):
net start MongoDB

# Mac/Linux:
sudo systemctl start mongod
# or
mongod
```

If using MongoDB Atlas (cloud), make sure your connection string is in the `.env` file.

### Step 5: Start the Backend

```bash
npm start
```

You should see:
```
[SUCCESS] MongoDB Connected Successfully
[SUCCESS] HTTP Server started on http://0.0.0.0:3551
[SUCCESS] XMPP Server started on port 8080
[SUCCESS] Matchmaker Server started on port 8080
[INFO] Backend v3.0 Ready!
```

### Step 6 (Optional): Start Discord Bot

If you want to use the Discord bot:

```bash
npm run bot
```

## 🔍 Verification

Test that everything is working:

```bash
# Test the API (in a new terminal):
curl http://localhost:3551/health

# Or open in browser:
# http://localhost:3551/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "mongodb": "connected",
  "xmpp": "running",
  "matchmaker": "running"
}
```

## ❌ Common Errors and Solutions

### Error: Cannot find module 'express'

**Solution:** You forgot to run `npm install`. Go back to Step 2!

### Error: Cannot connect to MongoDB

**Solutions:**
1. Make sure MongoDB is running (Step 4)
2. Check your `MONGODB_URI` in `.env`
3. For Atlas, check your IP is whitelisted
4. Check firewall settings

### Error: Port 3551 already in use

**Solution:** Either:
1. Stop the other process using that port
2. Change `PORT` in `.env` to a different number (e.g., 3552)

### Error: EADDRINUSE on port 8080

**Solution:** Another application is using port 8080. Options:
1. Stop the other application
2. Change XMPP/Matchmaker ports in `index.js`

### Error: Discord bot won't start

**Solutions:**
1. Make sure you created a Discord bot at: https://discord.com/developers/applications
2. Copy the bot token to `.env` as `DISCORD_TOKEN`
3. Enable all intents in Discord Developer Portal
4. Invite bot to your server

### Error: Permission denied (Windows)

**Solution:** Run Command Prompt or PowerShell as Administrator

### Error: gyp ERR! during npm install

**Solutions:**
1. Install Windows Build Tools: `npm install --global windows-build-tools`
2. Or install Visual Studio Build Tools
3. Restart terminal and try `npm install` again

## 📁 What Gets Installed

After `npm install`, you'll see a new folder:

```
Project-Light/
├── node_modules/          ← NEW! (contains all 12 packages + dependencies)
├── package.json           ← Lists what to install
├── package-lock.json      ← NEW! (locks dependency versions)
├── index.js
├── src/
├── discord/
└── Config/
```

**Note:** The `node_modules` folder is LARGE (100-200 MB) and is automatically ignored by Git.

## 🎮 Quick Start Summary

```bash
# 1. Navigate to project
cd "C:\Users\Admin\Desktop\Project Light"

# 2. Install dependencies (REQUIRED!)
npm install

# 3. Create .env file
copy .env.example .env

# 4. Edit .env with your settings
notepad .env

# 5. Start the backend
npm start
```

## 🆘 Still Having Issues?

1. Make sure you're in the correct directory
2. Delete `node_modules` folder and `package-lock.json`, then run `npm install` again
3. Update Node.js to the latest LTS version
4. Check that your `package.json` file exists and is not corrupted
5. Try running with administrator/sudo privileges

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Discord.js Guide](https://discordjs.guide/)
- [Express.js Documentation](https://expressjs.com/)

## ✅ Installation Complete!

Once you see no errors and the server is running, you're ready to:
- Connect your Fortnite client
- Use the Discord bot
- Make API requests
- Test XMPP and Matchmaker

Happy gaming! 🎉
