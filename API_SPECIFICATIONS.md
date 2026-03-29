# API Endpoint Specifications

Complete specifications for all API endpoints.

## Custom API Endpoints (src/routes/api.js)

### POST /api/v1/account/create

**Purpose**: Create a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "PlayerName",
  "password": "securePassword123"
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "accountId": "abc123def456...",
    "username": "PlayerName",
    "email": "user@example.com"
  }
}
```

**Error Responses**:
- 400: Missing fields or account exists
- 500: Server error

**Implementation Notes**:
- Validate all fields are present
- Check if email or username already exists
- Hash password with bcrypt (10 rounds recommended)
- Generate unique accountId (UUID without dashes)
- Create user, profiles, and friends documents
- Return success with account details

---

### POST /api/v1/account/exchange-code

**Purpose**: Generate login code for launcher

**Request Body**:
```json
{
  "username": "PlayerName",
  "password": "securePassword123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "exchangeCode": "xyz789abc123...",
  "expiresInSeconds": 300,
  "message": "Use this code in the game launcher"
}
```

**Error Responses**:
- 400: Missing credentials
- 401: Invalid credentials
- 403: Account banned
- 500: Server error

**Implementation Notes**:
- Find user by username or email
- Verify password with bcrypt.compare
- Check if account is banned
- Generate exchange code (UUID without dashes)
- Store in global.exchangeCodes array with timestamp
- Clean up expired codes (older than 5 minutes)
- Return code with expiry time

---

### GET /api/v1/gameserver/info

**Purpose**: Get gameserver connection information

**Success Response (200)**:
```json
{
  "success": true,
  "gameserver": {
    "ip": "127.0.0.1",
    "port": 7777,
    "status": "online"
  }
}
```

**Implementation Notes**:
- Read from Config/config.json
- Return gameserver IP and port
- Include status field

---

## Settings API Endpoints (src/routes/settings.js)

### GET /api/v1/settings/:accountId

**Purpose**: Get user settings

**Success Response (200)**:
```json
{
  "success": true,
  "settings": {
    "gameplay": {...},
    "audio": {...},
    "video": {...}
  }
}
```

---

### PUT /api/v1/settings/:accountId

**Purpose**: Update all settings

**Request Body**: Complete settings object

---

### PATCH /api/v1/settings/:accountId

**Purpose**: Update specific settings

**Request Body**: Partial settings object

---

## Stats API Endpoints (src/routes/stats.js)

### GET /api/v1/stats/:accountId

**Purpose**: Get player statistics

**Success Response (200)**:
```json
{
  "success": true,
  "stats": {
    "solo": {"wins": 10, "kills": 150},
    "duo": {"wins": 5, "kills": 80},
    "squad": {"wins": 8, "kills": 120}
  }
}
```

---

### POST /api/v1/stats/:accountId/update

**Purpose**: Update player statistics after match

**Request Body**:
```json
{
  "mode": "solo",
  "wins": 1,
  "kills": 5,
  "placement": 1
}
```

---

### GET /api/v1/leaderboard/:mode

**Purpose**: Get leaderboard for game mode

**Query Parameters**:
- limit: Number of results (default: 100)
- offset: Pagination offset

**Success Response (200)**:
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "username": "Player1",
      "wins": 100,
      "kills": 5000
    }
  ]
}
```

---

## Inventory API Endpoints (src/routes/inventory.js)

### GET /api/v1/inventory/:accountId

**Purpose**: Get user inventory

---

### POST /api/v1/inventory/:accountId/add

**Purpose**: Add item to inventory

**Request Body**:
```json
{
  "itemId": "cosmetic_id",
  "templateId": "AthenaCharacter:cid_001",
  "quantity": 1
}
```

---

### DELETE /api/v1/inventory/:accountId/:itemId

**Purpose**: Remove item from inventory

---

### POST /api/v1/inventory/:accountId/equip

**Purpose**: Equip cosmetic item

**Request Body**:
```json
{
  "slotName": "Character",
  "itemId": "item_uuid"
}
```

---

## Friends API Endpoints (src/routes/friends.js)

### GET /api/v1/friends/:accountId

**Purpose**: Get friends list

**Success Response (200)**:
```json
{
  "success": true,
  "friends": [
    {
      "accountId": "friend_id",
      "username": "FriendName",
      "status": "online"
    }
  ]
}
```

---

### POST /api/v1/friends/:accountId/add

**Purpose**: Send friend request

**Request Body**:
```json
{
  "targetAccountId": "friend_id"
}
```

---

### DELETE /api/v1/friends/:accountId/:friendId

**Purpose**: Remove friend

---

### POST /api/v1/friends/:accountId/block

**Purpose**: Block user

**Request Body**:
```json
{
  "targetAccountId": "user_to_block"
}
```

---

## Authentication Endpoints (src/routes/auth.js)

### POST /account/api/oauth/token

**Purpose**: Get OAuth token

**Request Body**:
```json
{
  "grant_type": "password",
  "username": "player",
  "password": "pass"
}
```

**Grant Types**:
- password: Username/password login
- exchange_code: Exchange code login
- refresh_token: Refresh existing token
- client_credentials: Client token

**Success Response (200)**:
```json
{
  "access_token": "jwt_token_here",
  "expires_in": 28800,
  "expires_at": "2024-01-01T12:00:00.000Z",
  "token_type": "bearer",
  "refresh_token": "refresh_token_here",
  "refresh_expires": 86400,
  "refresh_expires_at": "2024-01-02T00:00:00.000Z",
  "account_id": "user_account_id",
  "client_id": "fortnite",
  "displayName": "PlayerName"
}
```

---

### POST /account/api/oauth/verify

**Purpose**: Verify token validity

**Headers**: `Authorization: bearer TOKEN`

---

### DELETE /account/api/oauth/sessions/kill

**Purpose**: Logout/invalidate session

---

## Game Service Endpoints

### POST /fortnite/api/game/v2/profile/:accountId/client/:operation

**Purpose**: Handle profile operations (MCP)

**Operations**:
- QueryProfile: Get full profile
- ClientQuestLogin: Login query
- MarkItemSeen: Mark items as seen
- SetItemFavoriteStatusBatch: Set favorites
- EquipBattleRoyaleCustomization: Equip items
- SetCosmeticLockerSlot: Update locker
- SetBattleRoyaleBanner: Set banner

---

### GET /fortnite/api/cloudstorage/system

**Purpose**: Get system cloud storage files

---

### GET /fortnite/api/cloudstorage/user/:accountId

**Purpose**: Get user cloud storage files

---

### GET /content/api/pages/fortnite-game

**Purpose**: Get game content pages

---

### GET /lightswitch/api/service/Fortnite/status

**Purpose**: Get Fortnite service status

---

### GET /fortnite/api/calendar/v1/timeline

**Purpose**: Get game timeline/events

---

## Response Format Standards

All custom API responses should follow:

**Success**:
```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

**Error**:
```json
{
  "success": false,
  "message": "Error description",
  "error": "error_code"
}
```

## Rate Limiting

All endpoints are rate limited to:
- 55 requests per 30 seconds per IP

## Authentication

Protected endpoints require:
- Header: `Authorization: bearer JWT_TOKEN`
- Token must be valid and not expired
- User must exist and not be banned
