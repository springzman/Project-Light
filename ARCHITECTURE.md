# Backend v2.0 Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Fortnite Client (Build 12.41)                │
└────────────┬────────────────────────┬────────────────────┬──────┘
             │                        │                    │
             │ HTTP/REST              │ WebSocket (XMPP)   │ WebSocket (Matchmaker)
             │                        │                    │
┌────────────▼────────────────────────▼────────────────────▼──────┐
│                     HTTP Server (Express.js)                     │
│                         Port: 3551                               │
└────────────┬────────────────────────┬────────────────────┬──────┘
             │                        │                    │
    ┌────────▼────────┐      ┌───────▼────────┐   ┌──────▼───────┐
    │   API Routes    │      │  XMPP Server   │   │  Matchmaker  │
    │                 │      │                │   │              │
    │ • Auth          │      │ • Presence     │   │ • Queueing   │
    │ • Account       │      │ • Messaging    │   │ • Sessions   │
    │ • MCP           │      │ • Parties      │   │ • Assignment │
    │ • Lightswitch   │      │ • Friends      │   │              │
    │ • CloudStorage  │      └────────┬───────┘   └──────────────┘
    │ • Version       │               │
    │ • Keychain      │               │
    │ • Datarouter    │               │
    └────────┬────────┘               │
             │                        │
             │                        │
    ┌────────▼────────────────────────▼────────┐
    │        JWT Token Manager                 │
    │                                          │
    │  • Token Creation                        │
    │  • Token Verification                    │
    │  • Access/Refresh/Client Tokens          │
    └────────┬─────────────────────────────────┘
             │
             │
    ┌────────▼─────────────────────────────────┐
    │         MongoDB Database                 │
    │                                          │
    │  Collections:                            │
    │  • users       (accounts, auth)          │
    │  • profiles    (athena, common_core)     │
    │  • friends     (social connections)      │
    └──────────────────────────────────────────┘
```

## Request Flow Examples

### 1. User Login Flow

```
Client                  Backend                 Database
  │                       │                        │
  ├─ POST /oauth/token ──>│                        │
  │  (username/password)  │                        │
  │                       ├─ Find user ───────────>│
  │                       │<─ User data ───────────┤
  │                       │                        │
  │                       ├─ Verify password       │
  │                       ├─ Generate JWT          │
  │                       │                        │
  │<─ Access Token ───────┤                        │
  │   Refresh Token       │                        │
  │                       │                        │
```

### 2. XMPP Connection Flow

```
Client                  XMPP Server             Database
  │                       │                        │
  ├─ WebSocket Connect ──>│                        │
  │  (protocol: xmpp)     │                        │
  │                       │                        │
  │<─ <open> ─────────────┤                        │
  │                       │                        │
  ├─ <auth> ─────────────>│                        │
  │  (token)              ├─ Verify token          │
  │                       ├─ Find user ───────────>│
  │                       │<─ User data ───────────┤
  │                       │                        │
  │<─ <success> ──────────┤                        │
  │                       │                        │
  ├─ <iq bind> ──────────>│                        │
  │                       ├─ Assign JID            │
  │                       ├─ Add to Clients[]      │
  │                       │                        │
  │<─ <iq result> ────────┤                        │
  │   (JID assigned)      │                        │
  │                       │                        │
  ├─ <presence> ─────────>│                        │
  │                       ├─ Notify friends ──────>│
  │                       │                        │
```

### 3. Matchmaking Flow

```
Client              Matchmaker              Database
  │                     │                      │
  ├─ WebSocket ────────>│                      │
  │  (non-xmpp)         │                      │
  │                     │                      │
  │<─ "Connecting" ─────┤                      │
  │                     │                      │
  │<─ "Waiting" ────────┤                      │
  │                     │                      │
  │<─ "Queued" ─────────┤                      │
  │   (ticketId)        │                      │
  │                     │                      │
  │<─ "SessionAssignment"                      │
  │   (matchId)         │                      │
  │                     │                      │
  │<─ "Play" ───────────┤                      │
  │   (sessionId)       │                      │
  │                     │                      │
```

## Component Details

### API Routes (`src/routes/`)

| Route | Purpose | Authentication |
|-------|---------|----------------|
| `/api/v1/account/create` | Create new account | ❌ None |
| `/api/v1/account/exchange-code` | Generate login code | ❌ None |
| `/account/api/oauth/token` | Get auth token | ❌ None |
| `/account/api/oauth/verify` | Verify token | ✅ Required |
| `/account/api/public/account/:id` | Get account info | ✅ Required |
| `/fortnite/api/game/v2/profile/:id/client/:op` | MCP operations | ✅ Required |
| `/lightswitch/api/service/Fortnite/status` | Service status | ❌ None |
| `/fortnite/api/calendar/v1/timeline` | Game timeline | ❌ None |

### Database Models (`src/models/`)

#### User Schema
```javascript
{
  accountId: String (unique),
  username: String (unique),
  username_lower: String (unique),
  email: String (unique),
  password: String (hashed),
  matchmakingId: String (unique),
  vbucks: Number,
  banned: Boolean,
  created: Date
}
```

#### Profiles Schema
```javascript
{
  accountId: String (unique),
  profiles: {
    athena: Object,
    common_core: Object,
    creative: Object
  }
}
```

#### Friends Schema
```javascript
{
  accountId: String (unique),
  friends: [{
    accountId: String,
    status: String (ACCEPTED/PENDING),
    direction: String (OUTBOUND/INBOUND),
    created: Date,
    favorite: Boolean
  }],
  blocked: [{
    accountId: String,
    created: Date
  }]
}
```

### Security Features

| Feature | Implementation | Purpose |
|---------|---------------|---------|
| Password Hashing | bcrypt (10 rounds) | Secure password storage |
| JWT Tokens | jsonwebtoken | Stateless authentication |
| Token Expiration | 8h (access), 24h (refresh) | Automatic security |
| Rate Limiting | 55 req/30sec | DDoS protection |
| Auth Middleware | Token verification | Route protection |
| Exchange Codes | 5-minute expiry | Secure one-time login |

## Performance Characteristics

- **Concurrent Connections**: Unlimited (limited by system resources)
- **WebSocket Clients**: Tracked globally for XMPP
- **Token Validation**: O(1) with JWT
- **Database Queries**: Indexed on accountId, username, email
- **Rate Limit**: 55 requests per 30 seconds per IP
- **Memory Usage**: ~50MB base + ~1KB per connected client

## Future Enhancements

1. **Redis Integration**: Session storage, caching
2. **Load Balancing**: Horizontal scaling support
3. **Metrics**: Prometheus/Grafana monitoring
4. **Logging**: Winston/Morgan for production
5. **WebSocket Clustering**: Socket.io adapter
6. **Database Sharding**: MongoDB sharding for scale
7. **CDN Integration**: Static asset delivery
8. **GraphQL**: Alternative to REST for complex queries
