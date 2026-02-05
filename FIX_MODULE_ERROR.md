# 🎯 ERROR SOLUTION: Cannot find module 'express'

## ⚡ IMMEDIATE FIX

You're seeing this error because **you haven't installed the Node.js dependencies yet.**

### Run This Now:

```bash
# Windows (Command Prompt):
cd "C:\Users\Admin\Desktop\Project Light"
npm install

# Mac/Linux (Terminal):
cd "/path/to/Project Light"
npm install
```

**Wait 2-5 minutes for installation to complete.**

---

## 🤔 Why This Happens

Your project needs 12 external packages (express, mongoose, bcrypt, etc.) that aren't included in the GitHub repository. The `npm install` command downloads and installs all of them from the npm registry.

**Think of it like this:**
- `package.json` = Shopping list
- `npm install` = Going shopping
- `node_modules` = Your groceries

Without running `npm install`, you have the shopping list but no groceries!

---

## ✅ Complete Setup (First Time)

If this is your first time setting up:

### Option A: Automated (Easiest)

**Windows:**
```bash
# Just double-click:
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option B: Manual (3 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Create configuration file
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux

# 3. Edit .env with your MongoDB URI and settings
# Then start the server:
npm start
```

---

## 🔍 Verify Installation Worked

After `npm install`, check:

```bash
# Should see node_modules folder:
dir node_modules        # Windows
ls node_modules         # Mac/Linux

# Should list 278+ packages:
npm list --depth=0
```

If you see `node_modules` folder created with lots of packages inside, installation worked! ✅

---

## 🚨 Common Issues

### Issue: npm: command not found

**Fix:** Install Node.js from https://nodejs.org/

### Issue: Permission denied

**Fix (Windows):** Run Command Prompt as Administrator

**Fix (Mac/Linux):** Don't use sudo! Fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Issue: gyp ERR! during install

**Fix (Windows):**
```bash
npm install --global windows-build-tools
```

**Fix (Mac):**
```bash
xcode-select --install
```

### Issue: Still failing?

Try clean install:
```bash
# Delete old files:
rm -rf node_modules package-lock.json

# Reinstall:
npm install
```

---

## 📚 Documentation Index

Need more help? Check these guides:

| Guide | When to Use |
|-------|-------------|
| **QUICKSTART.md** | 1-minute quick reference |
| **INSTALLATION.md** | Complete first-time setup |
| **TROUBLESHOOTING.md** | Fixing specific errors |
| **README.md** | Full documentation |

---

## 🎮 After Installation

Once `npm install` completes successfully:

1. **Configure MongoDB:**
   - Edit `.env` file
   - Set `MONGODB_URI` to your MongoDB connection

2. **Start the backend:**
   ```bash
   npm start
   ```

3. **You should see:**
   ```
   [SUCCESS] MongoDB Connected Successfully
   [SUCCESS] HTTP Server started on http://0.0.0.0:3551
   [SUCCESS] XMPP Server started on port 8080
   [SUCCESS] Matchmaker Server started on port 8080
   [INFO] Backend v3.0 Ready!
   ```

4. **Test it:**
   - Open browser: http://localhost:3551/health
   - Should see: `{"status":"healthy",...}`

---

## 💡 Understanding the Error

```
Error: Cannot find module 'express'
Require stack:
- C:\Users\Admin\Desktop\Project Light\index.js
```

**Translation:**
- `index.js` is trying to `require('express')`
- Node.js looks in `node_modules/express`
- That folder doesn't exist (because you haven't run `npm install`)
- Error!

**After `npm install`:**
- npm downloads express (and 11 other packages)
- npm puts them in `node_modules/`
- Node.js finds them
- No error! ✅

---

## 🔧 What npm install Does

When you run `npm install`, it:

1. Reads `package.json`
2. Downloads 12 packages you need:
   - express (web server)
   - mongoose (MongoDB)
   - bcrypt (password hashing)
   - jsonwebtoken (authentication)
   - ws (WebSocket)
   - discord.js (Discord bot)
   - And 6 more...
3. Downloads all their dependencies too (278 total)
4. Puts everything in `node_modules/`
5. Creates `package-lock.json` (locks versions)

**Result:** ~100-200 MB of code in `node_modules/`

---

## ⚠️ Important Notes

1. **ALWAYS run `npm install` first** when setting up a Node.js project
2. **`node_modules` is NOT committed to Git** (it's too large)
3. **Every developer must run `npm install`** after cloning
4. **If you delete `node_modules`**, run `npm install` again
5. **Update packages:** `npm update` (be careful!)

---

## 🎯 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm start` | Start the backend server |
| `npm run bot` | Start Discord bot |
| `npm update` | Update packages |
| `npm list` | Show installed packages |

---

## ✅ Success Checklist

After running `npm install`:

- [ ] `node_modules` folder exists
- [ ] `package-lock.json` file exists
- [ ] No error messages in terminal
- [ ] Can see `node_modules/express` folder
- [ ] `npm list` shows packages installed
- [ ] `npm start` works without module errors

---

## 🆘 Still Stuck?

1. **Read the error message carefully** - It tells you what's wrong
2. **Check TROUBLESHOOTING.md** - Has solutions for 10+ common errors
3. **Verify Node.js version:** `node --version` (need v14+)
4. **Verify npm version:** `npm --version` (need v6+)
5. **Try clean install** - Delete `node_modules` and reinstall
6. **Check internet connection** - npm needs to download packages

---

## 🎉 You're Almost There!

The error you're seeing is **completely normal** for first-time setup. Every Node.js developer sees it when they forget to run `npm install`!

Just run:
```bash
npm install
```

Then wait for it to complete, and you'll be ready to go! 🚀

---

**Questions?** Check the documentation files or create a GitHub issue!
