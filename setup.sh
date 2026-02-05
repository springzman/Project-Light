#!/bin/bash
# Quick Setup Script for Fortnite Backend v3.0
# This script will install dependencies and set up the environment

echo "========================================"
echo "Fortnite Backend v3.0 - Quick Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo ""
    echo "Please download and install Node.js from:"
    echo "https://nodejs.org/"
    echo ""
    exit 1
fi

echo "[OK] Node.js is installed"
node --version
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed!"
    echo ""
    exit 1
fi

echo "[OK] npm is installed"
npm --version
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "[ERROR] package.json not found!"
    echo "Are you in the correct directory?"
    echo ""
    exit 1
fi

echo "[OK] package.json found"
echo ""

# Install dependencies
echo "========================================"
echo "Installing Dependencies..."
echo "This may take 2-5 minutes..."
echo "========================================"
echo ""

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Installation failed!"
    echo ""
    echo "Check your internet connection or see TROUBLESHOOTING.md for help."
    echo ""
    exit 1
fi

echo ""
echo "[SUCCESS] Dependencies installed!"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "Creating .env file from template..."
        cp .env.example .env
        echo "[SUCCESS] .env file created!"
        echo ""
        echo "IMPORTANT: Edit .env with your settings!"
        echo "- MongoDB connection string"
        echo "- JWT secret"
        echo "- Discord bot token (if using)"
        echo "- Server ports"
        echo ""
    else
        echo "[WARNING] .env.example not found"
        echo "You'll need to create .env manually"
        echo ""
    fi
else
    echo "[OK] .env file already exists"
    echo ""
fi

# Create storage directories
echo "Creating storage directories..."
mkdir -p storage/settings storage/backups storage/logs
echo "[SUCCESS] Storage directories created"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit .env file with your configuration:"
echo "   - MongoDB URI"
echo "   - JWT secret"
echo "   - Discord token (if using)"
echo ""
echo "2. Make sure MongoDB is running:"
echo "   - Local: sudo systemctl start mongod"
echo "   - Or use MongoDB Atlas cloud"
echo ""
echo "3. Start the backend:"
echo "   npm start"
echo ""
echo "4. (Optional) Start Discord bot:"
echo "   npm run bot"
echo ""
echo "========================================"
echo "For help, see:"
echo "- INSTALLATION.md"
echo "- TROUBLESHOOTING.md"
echo "- README.md"
echo "========================================"
echo ""
