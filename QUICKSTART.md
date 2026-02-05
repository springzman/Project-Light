# 🚀 QUICK START GUIDE

## 🎯 Fix "Cannot find module 'express'" Error

**This error means you haven't installed the dependencies yet!**

### Option 1: Use Setup Script (Easiest)

**Windows:**
```bash
# Just double-click setup.bat
# Or run in Command Prompt:
setup.bat
```

**Mac/Linux:**
```bash
# Run in Terminal:
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup (3 Steps)

```bash
# Step 1: Install dependencies (REQUIRED!)
npm install

# Step 2: Create .env file
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux

# Step 3: Start the server
npm start
```

---

## ✅ That's It!

If you see this, you're done:
```
[SUCCESS] MongoDB Connected Successfully
[SUCCESS] HTTP Server started on http://0.0.0.0:3551
[SUCCESS] XMPP Server started on port 8080
[SUCCESS] Matchmaker Server started on port 8080
[INFO] Backend v3.0 Ready!
```

---

## ❌ Still Getting Errors?

### MongoDB Error?
```bash
# Make sure MongoDB is running:
# Windows:
net start MongoDB

# Mac/Linux:
sudo systemctl start mongod
```

### Port in Use?
Edit `.env` and change `PORT=3551` to a different number.

### Build Errors?
```bash
# Windows (as Administrator):
npm install --global windows-build-tools

# Mac:
xcode-select --install

# Then:
npm install
```

---

## 📚 Need More Help?

- **Full Guide:** [INSTALLATION.md](INSTALLATION.md)
- **Error Fixes:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Complete Docs:** [README.md](README.md)

---

## 🎮 What This Backend Does

- ✅ Fortnite OAuth Authentication
- ✅ Account Management
- ✅ Profile System (MCP)
- ✅ Settings Storage
- ✅ Stats Tracking
- ✅ Inventory Management
- ✅ Friends System
- ✅ XMPP Chat Server
- ✅ Advanced Matchmaker
- ✅ Discord Bot with 10 Commands
- ✅ Cloud Storage
- ✅ Version/Timeline API
- ✅ 50+ API Endpoints

---

## 🔗 Important Files

| File | Purpose |
|------|---------|
| `package.json` | Lists all dependencies |
| `.env` | Your configuration |
| `index.js` | Main server file |
| `setup.bat` / `setup.sh` | Automatic setup |
| `INSTALLATION.md` | Full setup guide |
| `TROUBLESHOOTING.md` | Error solutions |

---

## 💡 Pro Tips

1. **Always run `npm install` first!**
2. Make sure MongoDB is running
3. Edit `.env` with your settings
4. Use `npm start` to run the server
5. Use `npm run bot` for Discord bot

---

## 🆘 Emergency Fix

If nothing works:

```bash
# Delete everything and start fresh:
rm -rf node_modules package-lock.json
npm install

# Still broken? Update Node.js:
# Download latest from: https://nodejs.org/
```

---

**Ready to play? Start the backend and connect your Fortnite client!** 🎉
