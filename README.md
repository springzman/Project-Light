# Fortnite Emulator Backend (Build 12.41)

## Overview
This is a custom backend for a Fortnite emulator (Build 12.41). It provides all necessary API endpoints for the game client to connect and function properly.

## Prerequisites
- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment (optional):
   - Edit `.env` file to change the port (default is 3551)

## Running the Backend

Start the server:
```bash
npm start
```

Or for development:
```bash
npm run dev
```

The server will start on `http://127.0.0.1:3551` (or your configured port).

## Features

The backend includes the following endpoints:

### Authentication
- OAuth token generation
- OAuth verification
- Session management

### Account Management
- Account information
- External authentication
- Privacy settings
- User settings

### Game Services
- MCP (Profile) operations
- Lightswitch (service status)
- Cloud storage (system and user)
- Content pages
- Version checking
- Timeline/Calendar
- Keychain (storefront)
- Data router

## Project Structure

```
.
├── index.js              # Main server file
├── package.json          # Project dependencies
├── .env                  # Environment configuration
├── src/
│   ├── routes/          # API route handlers
│   │   ├── auth.js
│   │   ├── account.js
│   │   ├── mcp.js
│   │   ├── lightswitch.js
│   │   ├── cloudstorage.js
│   │   ├── contentpages.js
│   │   ├── version.js
│   │   ├── keychain.js
│   │   └── datarouter.js
│   ├── responses/       # JSON response files
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
```

## Configuration

Edit the `.env` file to configure:
- `PORT`: Server port (default: 3551)

## Usage

1. Start the backend server
2. Configure your Fortnite client to point to this backend
3. Use the DLLs for redirection as needed

## Notes on DLLs

The DLLs in this repository are for OGFN redirection:
- They redirect to a specific Radmin VPN and IP
- **ZERO point using these for your own project/hosting**
- `console.dll` and `eor.dll` are useable:
  - `eor.dll`: Universal edit on release
  - `console.dll`: Unlocks Unreal Engine console

## Credits

Backend guide based on: [PongooDev/Fortnite-Backend-Guide](https://github.com/PongooDev/Fortnite-Backend-Guide)

## License

This project is for educational purposes. Ensure you have proper licenses and permissions for any Fortnite-related content.
