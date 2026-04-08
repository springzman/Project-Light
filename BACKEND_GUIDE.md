# Fortnite Backend Quick Start Guide

## What Has Been Created

A complete backend server for your Fortnite emulator (build 12.41) has been successfully implemented. The backend follows the industry-standard Express.js architecture and includes all necessary endpoints for the game client to function properly.

## Directory Structure

```
Project-Light/
├── index.js                    # Main server entry point
├── package.json                # Node.js dependencies
├── .env                        # Configuration (PORT=3551)
├── .gitignore                  # Git ignore rules
├── README.md                   # Comprehensive documentation
└── src/
    ├── routes/                 # API endpoint handlers
    │   ├── auth.js            # OAuth authentication
    │   ├── account.js         # Account management
    │   ├── mcp.js             # Profile operations
    │   ├── lightswitch.js     # Service status
    │   ├── cloudstorage.js    # Cloud storage
    │   ├── contentpages.js    # Content pages
    │   ├── version.js         # Version & timeline
    │   ├── keychain.js        # Storefront keychain
    │   └── datarouter.js      # Data routing
    ├── responses/              # JSON response files
    │   └── keychain.json      # Keychain data
    ├── utils/                  # Utility functions (for future use)
    └── config/                 # Configuration files (for future use)
```

## How to Use

### 1. Install Dependencies
```bash
cd /home/runner/work/Project-Light/Project-Light
npm install
```

### 2. Start the Server
```bash
npm start
```

The server will start on `http://127.0.0.1:3551`

### 3. Test the Server
Open your browser or use curl:
```bash
curl http://127.0.0.1:3551/
```

You should see:
```json
{
  "status": "OK",
  "message": "Fortnite Backend is running",
  "build": "12.41"
}
```

## Available Endpoints

### Authentication (`src/routes/auth.js`)
- `POST /account/api/oauth/token` - Get OAuth token
- `POST /account/api/oauth/verify` - Verify OAuth token
- `DELETE /account/api/oauth/sessions/kill` - Kill all sessions
- `DELETE /account/api/oauth/sessions/kill/:token` - Kill specific session

### Account Management (`src/routes/account.js`)
- `POST /fortnite/api/game/v2/tryPlayOnPlatform/account/:accountId` - Platform check
- `GET /account/api/public/account/:accountId/externalAuths` - External authentication
- `GET /fortnite/api/game/v2/enabled_features` - Enabled features
- `GET /content-controls/:accountId` - Content controls
- `GET /account/api/public/account` - Public account info
- `GET /account/api/public/account/:accountId` - Specific account info
- `POST /api/v1/user/setting` - User settings
- `GET /socialban/api/public/v1/:accountId` - Social bans
- `GET /presence/api/v1/_/:accountId/settings/subscriptions` - Presence subscriptions
- `GET /fortnite/api/game/v2/privacy/account/:accountId` - Privacy settings

### MCP - Profile Operations (`src/routes/mcp.js`)
- `POST /fortnite/api/game/v2/profile/:accountId/client/:operation` - Profile operations

### Lightswitch - Service Status (`src/routes/lightswitch.js`)
- `GET /lightswitch/api/service/Fortnite/status` - Fortnite service status
- `GET /lightswitch/api/service/bulk/status` - Bulk service status

### Cloud Storage (`src/routes/cloudstorage.js`)
- `GET /fortnite/api/cloudstorage/system` - System cloud storage
- `GET /fortnite/api/cloudstorage/user/:accountId` - User cloud storage
- `PUT /fortnite/api/cloudstorage/user/:accountId/:fileName` - Upload to cloud storage

### Content Pages (`src/routes/contentpages.js`)
- `GET /content/api/pages/fortnite-game` - Fortnite game content pages

### Version & Timeline (`src/routes/version.js`)
- `GET /fortnite/api/v2/versioncheck` - Version check
- `GET /fortnite/api/v2/versioncheck/:version` - Version check for specific version
- `GET /fortnite/api/calendar/v1/timeline` - Game timeline/calendar

### Keychain (`src/routes/keychain.js`)
- `GET /fortnite/api/storefront/v2/keychain` - Storefront keychain data

### Data Router (`src/routes/datarouter.js`)
- `POST /datarouter/api/v1/public/data` - Public data routing

## Configuration

Edit the `.env` file to change settings:
```
PORT=3551
```

## Next Steps

1. **Configure Your Game Client**: Point your Fortnite client to this backend URL
2. **Use the DLLs**: The DLLs in the repository root can be used for redirection
3. **Customize Responses**: Edit the route files in `src/routes/` to customize responses
4. **Add Logic**: Currently all endpoints return mock data. Add your own logic as needed

## Testing Endpoints

Test any endpoint with curl:
```bash
# Test OAuth token
curl -X POST http://127.0.0.1:3551/account/api/oauth/token

# Test service status
curl http://127.0.0.1:3551/lightswitch/api/service/Fortnite/status

# Test timeline
curl http://127.0.0.1:3551/fortnite/api/calendar/v1/timeline
```

## Troubleshooting

### Port Already in Use
If port 3551 is already in use, change the `PORT` in `.env` file:
```
PORT=8080
```

### Server Won't Start
1. Make sure Node.js is installed: `node --version`
2. Install dependencies: `npm install`
3. Check for errors in the console

### Endpoints Not Working
1. Verify the server is running
2. Check the URL and HTTP method (GET, POST, DELETE, PUT)
3. Look at server console for error messages

## Security Notes

- This is a basic backend for development/testing purposes
- The `.env` file is excluded from git to protect sensitive data
- All responses are currently mocked (no authentication validation)
- For production use, implement proper authentication and data validation

## Credits

- Backend guide: [PongooDev/Fortnite-Backend-Guide](https://github.com/PongooDev/Fortnite-Backend-Guide)
- Keychain data: LawinserverV2

## Support

For issues or questions about the backend implementation, refer to:
- The comprehensive README.md file
- The PongooDev guide linked above
- Individual route files for endpoint-specific details
