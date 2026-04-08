# 🔧 Troubleshooting Guide

## Common Errors and Solutions

### 1. ❌ Error: Cannot find module 'express' (or any other module)

```
Error: Cannot find module 'express'
Require stack:
- C:\Users\Admin\Desktop\Project Light\index.js
```

**Cause:** Dependencies are not installed.

**Solution:**
```bash
# Make sure you're in the project directory
cd "C:\Users\Admin\Desktop\Project Light"

# Install all dependencies
npm install

# Wait for it to complete (2-5 minutes)
# You should see node_modules folder created
```

**Verify it worked:**
```bash
# Check if node_modules exists
dir node_modules    # Windows
ls node_modules     # Mac/Linux
```

---

### 2. ❌ Error: Cannot connect to MongoDB

```
Error: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

**Cause:** MongoDB is not running or connection string is wrong.

**Solutions:**

**Option A - Start Local MongoDB:**
```bash
# Windows (if installed as service):
net start MongoDB

# Mac/Linux:
sudo systemctl start mongod
```

**Option B - Use MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fortnite-backend
   ```

**Option C - Install MongoDB:**
- Download: https://www.mongodb.com/try/download/community
- Install and restart computer
- Start MongoDB service

---

### 3. ❌ Error: Port 3551 already in use

```
Error: listen EADDRINUSE: address already in use :::3551
```

**Cause:** Another application is using port 3551.

**Solutions:**

**Option A - Stop the other application:**
```bash
# Windows - Find what's using the port:
netstat -ano | findstr :3551

# Kill the process (replace PID with actual number):
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3551 | xargs kill -9
```

**Option B - Use a different port:**
Edit `.env` file:
```env
PORT=3552
```

---

### 4. ❌ Error: Discord bot won't connect

```
Error: An invalid token was provided.
```

**Cause:** Missing or invalid Discord bot token.

**Solution:**

1. **Create Discord Bot:**
   - Go to https://discord.com/developers/applications
   - Click "New Application"
   - Go to "Bot" section
   - Click "Add Bot"
   - Copy the token

2. **Enable Intents:**
   - In Bot section, scroll down
   - Enable these intents:
     - ✅ Presence Intent
     - ✅ Server Members Intent
     - ✅ Message Content Intent

3. **Update .env:**
   ```env
   DISCORD_TOKEN=your-bot-token-here
   DISCORD_CLIENT_ID=your-application-id
   DISCORD_GUILD_ID=your-server-id
   ```

4. **Invite Bot:**
   - Go to OAuth2 → URL Generator
   - Select scopes: `bot`, `applications.commands`
   - Select permissions: Administrator (or specific ones)
   - Copy and visit the generated URL
   - Add bot to your server

---

### 5. ❌ Error: gyp ERR! or build errors during npm install

```
gyp ERR! stack Error: `C:\Program Files (x86)\MSBuild\14.0\bin\msbuild.exe` failed
```

**Cause:** Missing build tools for native modules (bcrypt).

**Solutions:**

**Windows:**
```bash
# Install Windows Build Tools (as Administrator):
npm install --global windows-build-tools

# Or install Visual Studio Build Tools:
# Download from: https://visualstudio.microsoft.com/downloads/
# Select "C++ build tools"

# Then try again:
npm install
```

**Mac:**
```bash
# Install Xcode Command Line Tools:
xcode-select --install

npm install
```

**Linux:**
```bash
# Install build essentials:
sudo apt-get install build-essential

npm install
```

---

### 6. ❌ Error: Permission denied

```
Error: EACCES: permission denied
```

**Cause:** Insufficient permissions.

**Solutions:**

**Windows:**
- Run Command Prompt or PowerShell as Administrator
- Right-click → "Run as administrator"

**Mac/Linux:**
```bash
# DON'T use sudo with npm install!
# Instead, fix npm permissions:

mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then try again:
npm install
```

---

### 7. ❌ Error: .env file not found

```
Warning: .env file not found
```

**Cause:** Environment variables file is missing.

**Solution:**
```bash
# Copy the example file:
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env

# Then edit it with your settings:
notepad .env    # Windows
nano .env       # Mac/Linux
```

---

### 8. ❌ Error: Cannot GET /

```
Cannot GET /
```

**Cause:** Normal - this just means the root endpoint isn't configured.

**Solution:** This is not an error! Try these endpoints instead:
- http://localhost:3551/health
- http://localhost:3551/api/info
- http://localhost:3551/account/api/oauth/token

---

### 9. ❌ Server starts but can't connect from Fortnite client

**Possible Causes & Solutions:**

1. **Firewall blocking:**
   - Add exception for Node.js in Windows Firewall
   - Allow incoming connections on ports 3551, 8080

2. **Wrong IP in Fortnite client:**
   - Use `127.0.0.1` or `localhost` for local testing
   - Use your public IP for remote connections

3. **Port forwarding (for remote access):**
   - Forward ports 3551 and 8080 in your router
   - Use your public IP in Fortnite client

4. **SSL/HTTPS required:**
   - Some builds require HTTPS
   - See HTTPS setup in documentation

---

### 10. ❌ npm: command not found

```
'npm' is not recognized as an internal or external command
```

**Cause:** Node.js is not installed or not in PATH.

**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install it (use default options)
3. Restart your terminal/command prompt
4. Verify: `node --version` and `npm --version`

---

## 🆘 Still Having Issues?

### Step-by-Step Debug Process:

1. **Check Node.js version:**
   ```bash
   node --version
   # Should be v14.0.0 or higher
   ```

2. **Check npm version:**
   ```bash
   npm --version
   # Should be 6.0.0 or higher
   ```

3. **Verify you're in correct directory:**
   ```bash
   # Should show index.js, package.json, etc.
   dir        # Windows
   ls -la     # Mac/Linux
   ```

4. **Check if node_modules exists:**
   ```bash
   # If it doesn't exist, run: npm install
   dir node_modules        # Windows
   ls -la node_modules     # Mac/Linux
   ```

5. **Check if .env exists:**
   ```bash
   # If it doesn't exist, copy from .env.example
   dir .env        # Windows
   ls -la .env     # Mac/Linux
   ```

6. **Try clean install:**
   ```bash
   # Delete node_modules and package-lock.json
   rm -rf node_modules package-lock.json
   
   # Reinstall
   npm install
   ```

7. **Check MongoDB:**
   ```bash
   # Make sure MongoDB is running
   # Test connection at: mongodb://localhost:27017
   ```

8. **Check logs:**
   - Look at the terminal output when starting
   - Note any ERROR messages
   - Check if all services started successfully

---

## 📋 Success Checklist

Before asking for help, verify:

- [ ] Node.js v14+ is installed
- [ ] npm is installed
- [ ] You're in the project directory
- [ ] `npm install` was run successfully
- [ ] `node_modules` folder exists
- [ ] `.env` file exists with your settings
- [ ] MongoDB is running (local or Atlas)
- [ ] No other app is using ports 3551, 8080
- [ ] Firewall allows Node.js connections

---

## 🔍 Getting More Help

If you still have issues:

1. **Check the console output** - Look for specific error messages
2. **Read [INSTALLATION.md](INSTALLATION.md)** - Full setup guide
3. **Check [README.md](README.md)** - Complete documentation
4. **Search the error message** - Google the exact error
5. **Check GitHub Issues** - Someone may have had the same problem

---

## 📞 Report a Bug

If you found a bug in the code:

1. Go to: https://github.com/springzman/Project-Light/issues
2. Click "New Issue"
3. Include:
   - Error message (full text)
   - Steps to reproduce
   - Your OS and Node.js version
   - What you've already tried

---

Happy troubleshooting! 🎉
