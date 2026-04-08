# 📚 API DOCUMENTATION - v3.0

Complete API reference for Fortnite Backend v3.0 Ultimate Edition

---

## 🔐 Authentication

Most endpoints require JWT authentication. Include token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get token from `/account/api/oauth/token` endpoint.

---

## 📡 Core Endpoints

### Server Status
```http
GET /
```
Returns server information, uptime, and features.

### Health Check
```http
GET /health
```
Returns detailed health metrics including database status, memory, uptime.

### API Information
```http
GET /api/v1/info
```
Returns available API features and endpoints.

### Gameserver Information
```http
GET /api/v1/gameserver
```
Returns gameserver IP and port configuration.

---

## 🔑 Authentication API

### Get OAuth Token
```http
POST /account/api/oauth/token
Content-Type: application/json

{
  "grant_type": "password",
  "username": "player",
  "password": "password123"
}
```

Grant types supported:
- `password` - Username/password login
- `exchange_code` - Exchange code login
- `refresh_token` - Refresh expired token
- `client_credentials` - Service authentication

### Verify Token
```http
GET /account/api/oauth/verify
Authorization: Bearer YOUR_TOKEN
```

### Kill Session
```http
DELETE /account/api/oauth/sessions/kill/:token
Authorization: Bearer YOUR_TOKEN
```

---

## 👤 Account API

### Create Account
```http
POST /api/v1/account/create
Content-Type: application/json

{
  "email": "player@example.com",
  "username": "Player123",
  "password": "securepassword"
}
```

### Get Account Info
```http
GET /account/api/public/account/:accountId
Authorization: Bearer YOUR_TOKEN
```

### Generate Exchange Code
```http
POST /api/v1/account/exchange-code
Content-Type: application/json

{
  "username": "Player123",
  "password": "securepassword"
}
```

---

## ⚙️ Settings API (NEW in v3.0)

### Get All Settings
```http
GET /api/v1/settings
Authorization: Bearer YOUR_TOKEN
```

Returns all user settings including gameplay, audio, video, HUD, privacy, social, and keybinds.

### Update Settings
```http
PUT /api/v1/settings
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "settings": {
    "gameplay": {
      "mouseSensitivity": 0.7,
      "autoRun": true
    },
    "audio": {
      "masterVolume": 0.8
    }
  }
}
```

### Update Settings Category
```http
PATCH /api/v1/settings/:category
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "mouseSensitivity": 0.7,
  "autoRun": true
}
```

Categories: `gameplay`, `audio`, `video`, `hud`, `privacy`, `social`, `keybinds`

### Reset Settings to Defaults
```http
DELETE /api/v1/settings
Authorization: Bearer YOUR_TOKEN
```

### Export Settings
```http
POST /api/v1/settings/export
Authorization: Bearer YOUR_TOKEN
```

Downloads settings as JSON file.

### Import Settings
```http
POST /api/v1/settings/import
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "settings": { /* imported settings */ }
}
```

### List Settings Backups
```http
GET /api/v1/settings/backup/list
Authorization: Bearer YOUR_TOKEN
```

---

## 📊 Stats API (NEW in v3.0)

### Get User Stats
```http
GET /api/v1/stats
Authorization: Bearer YOUR_TOKEN
```

Returns all stats including overall, solo, duo, squad, LTM, and records.

### Get Stats for Specific User
```http
GET /api/v1/stats/:accountId
Authorization: Bearer YOUR_TOKEN
```

### Update Stats After Match
```http
POST /api/v1/stats/update
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "mode": "solo",
  "matchData": {
    "won": true,
    "kills": 8,
    "deaths": 1,
    "assists": 2,
    "placement": 1,
    "damageDealt": 1250,
    "damageTaken": 320,
    "timePlayedSeconds": 1200
  }
}
```

Modes: `solo`, `duo`, `squad`, `ltm`, `creative`

### Get Leaderboard
```http
GET /api/v1/leaderboard/:mode?sortBy=wins&limit=100
Authorization: Bearer YOUR_TOKEN
```

Modes: `overall`, `solo`, `duo`, `squad`  
Sort by: `wins`, `kills`, `kd`, `winrate`  
Limit: 1-100 (default 100)

### Get Achievements
```http
GET /api/v1/stats/achievements
Authorization: Bearer YOUR_TOKEN
```

### Unlock Achievement
```http
POST /api/v1/stats/achievements
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "achievementId": "first_win",
  "name": "Victory Royale",
  "description": "Win your first match",
  "progress": 1,
  "maxProgress": 1
}
```

### Get Stats Summary
```http
GET /api/v1/stats/summary
Authorization: Bearer YOUR_TOKEN
```

Returns condensed stats overview with K/D, win rate, and records.

---

## 🎒 Inventory API (NEW in v3.0)

### Get Inventory
```http
GET /api/v1/inventory
Authorization: Bearer YOUR_TOKEN
```

Returns all items in athena and common_core profiles.

### Add Item to Inventory
```http
POST /api/v1/inventory/item
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "itemId": "AthenaCharacter:CID_001",
  "itemType": "outfit",
  "quantity": 1,
  "attributes": {
    "level": 1,
    "favorite": false
  }
}
```

### Remove Item from Inventory
```http
DELETE /api/v1/inventory/item/:itemGuid
Authorization: Bearer YOUR_TOKEN
```

### Equip Cosmetic Item
```http
POST /api/v1/inventory/equip
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "itemId": "AthenaCharacter:CID_001",
  "slot": "character"
}
```

Slots: `character`, `backpack`, `pickaxe`, `glider`, `contrail`, `loadingscreen`, `musicpack`

### Unequip Cosmetic Item
```http
POST /api/v1/inventory/unequip
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "slot": "character"
}
```

### Get Current Loadout
```http
GET /api/v1/inventory/loadout
Authorization: Bearer YOUR_TOKEN
```

### Toggle Favorite on Item
```http
POST /api/v1/inventory/favorite
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "itemGuid": "abc123...",
  "favorite": true
}
```

### Mark Items as Seen
```http
POST /api/v1/inventory/mark-seen
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "itemGuids": ["abc123...", "def456..."]
}
```

### Get Cosmetics by Type
```http
GET /api/v1/inventory/cosmetics/:type
Authorization: Bearer YOUR_TOKEN
```

Types: `outfit`, `backpack`, `pickaxe`, `glider`, `emote`, `wrap`, `contrail`, `loadingscreen`, `music`

---

## 👥 Friends API (NEW in v3.0)

### Get Friends List
```http
GET /api/v1/friends
Authorization: Bearer YOUR_TOKEN
```

Returns all friends with status (PENDING, ACCEPTED), direction (INBOUND, OUTBOUND).

### Send Friend Request
```http
POST /api/v1/friends/add
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "username": "Player123"
}
```

### Accept Friend Request
```http
POST /api/v1/friends/accept
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "accountId": "abc123..."
}
```

### Remove Friend
```http
DELETE /api/v1/friends/remove
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "accountId": "abc123..."
}
```

### Block User
```http
POST /api/v1/friends/block
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "accountId": "abc123..."
}
```

### Unblock User
```http
DELETE /api/v1/friends/unblock
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "accountId": "abc123..."
}
```

### Get Blocked Users List
```http
GET /api/v1/friends/blocked
Authorization: Bearer YOUR_TOKEN
```

### Toggle Favorite Friend
```http
POST /api/v1/friends/favorite
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "accountId": "abc123...",
  "favorite": true
}
```

---

## 🎮 MCP (Profile) API

### Get Profile
```http
POST /fortnite/api/game/v2/profile/:accountId/client/QueryProfile
Authorization: Bearer YOUR_TOKEN
```

### Set MCP Keybinds
```http
POST /fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform
Authorization: Bearer YOUR_TOKEN
```

### Mark Item Seen
```http
POST /fortnite/api/game/v2/profile/:accountId/client/MarkItemSeen
Authorization: Bearer YOUR_TOKEN
```

### Equip Battle Royale Customization
```http
POST /fortnite/api/game/v2/profile/:accountId/client/EquipBattleRoyaleCustomization
Authorization: Bearer YOUR_TOKEN
```

---

## 🌐 Other Core APIs

### Service Status
```http
GET /lightswitch/api/service/Fortnite/status
```

### Timeline/Calendar
```http
GET /fortnite/api/calendar/v1/timeline
```

### Cloud Storage
```http
GET /fortnite/api/cloudstorage/system
GET /fortnite/api/cloudstorage/user/:accountId
```

### Content Pages
```http
GET /content/api/pages/fortnite-game
```

### Keychain
```http
GET /fortnite/api/storefront/v2/keychain
```

---

## 📈 System API (Admin)

### System Statistics
```http
GET /api/v1/system/stats
```

Returns server stats, database info, memory usage, CPU usage.

---

## 🚦 Rate Limits

Different endpoints have different rate limits:

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/v1/settings | 30 req | 60s |
| /api/v1/stats | 60 req | 60s |
| /api/v1/inventory | 50 req | 60s |
| /api/v1/friends | 40 req | 60s |
| /account/api/oauth | 10 req | 300s |
| General | 55 req | 30s |

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Error description",
  "status": 400
}
```

---

## 🔒 Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## 💡 Usage Examples

### Complete Flow Example

```bash
# 1. Create account
curl -X POST http://localhost:3551/api/v1/account/create \
  -H "Content-Type: application/json" \
  -d '{"email":"player@test.com","username":"Player1","password":"pass123"}'

# 2. Login
TOKEN=$(curl -X POST http://localhost:3551/account/api/oauth/token \
  -H "Content-Type: application/json" \
  -d '{"grant_type":"password","username":"Player1","password":"pass123"}' \
  | jq -r '.access_token')

# 3. Get settings
curl http://localhost:3551/api/v1/settings \
  -H "Authorization: Bearer $TOKEN"

# 4. Update settings
curl -X PUT http://localhost:3551/api/v1/settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"settings":{"gameplay":{"mouseSensitivity":0.8}}}'

# 5. Get stats
curl http://localhost:3551/api/v1/stats \
  -H "Authorization: Bearer $TOKEN"

# 6. Get leaderboard
curl http://localhost:3551/api/v1/leaderboard/solo?sortBy=wins&limit=10 \
  -H "Authorization: Bearer $TOKEN"

# 7. Get friends
curl http://localhost:3551/api/v1/friends \
  -H "Authorization: Bearer $TOKEN"
```

---

**Complete API with 50+ endpoints!** 🚀
