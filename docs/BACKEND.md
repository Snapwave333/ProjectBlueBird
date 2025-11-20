# Backend Documentation

Complete backend architecture and implementation guide for the ANTE Poker Platform.

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Real-time**: Socket.IO
- **Blockchain**: Solana Web3.js
- **Security**: Helmet, express-rate-limit, CORS
- **Logging**: Winston (custom logger)

## Project Structure

```
backend/
├── app.ts                 # Main Express application entry point
├── controllers/          # Request handlers
│   ├── authController.ts
│   ├── gameController.ts
│   ├── tournamentController.ts
│   ├── merchController.ts
│   ├── userController.ts
│   └── devController.ts
├── models/               # MongoDB schemas
│   ├── User.ts
│   ├── Tournament.ts
│   ├── Product.ts
│   ├── EcosystemStats.ts
│   ├── BadBeat.ts
│   └── Table.ts
├── routes/              # API route definitions
│   ├── auth.ts
│   ├── games.ts
│   ├── tournaments.ts
│   ├── merch.ts
│   ├── users.ts
│   └── dev.ts
├── services/           # Business logic services
│   ├── SolanaService.ts
│   ├── WalletService.ts
│   ├── BotService.ts
│   ├── HandEvaluator.ts
│   └── GameManager.ts
├── middleware/         # Express middleware
│   ├── walletAuth.ts
│   ├── errorHandler.ts
│   └── validator.ts
├── src/                # Core game logic
│   └── GameController.ts
└── utils/              # Utility functions
    └── logger.ts
```

## Environment Variables

See `backend/env.example` for complete list. Key variables:

### Database
- `MONGODB_URI`: MongoDB connection string

### Server
- `PORT`: API server port (default: 3001)
- `NODE_ENV`: Environment (development, production)
- `FRONTEND_URL`: Allowed origin for CORS

### Solana
- `ANTE_TOKEN_MINT_ADDRESS`: $ANTE token mint address (optional, enables real mode)
- `SOLANA_RPC_URL`: Solana RPC endpoint (default: devnet)
- `MOCK_SOLANA`: Force mock mode (true/false)

### Security
- `RATE_LIMIT_WINDOW_MS`: Rate limit window (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 1000)

## Core Services

### SolanaService

Handles all Solana blockchain interactions.

**Methods:**
- `getAnteBalance(walletAddress)`: Get user's $ANTE balance
- `verifyBuyInTransaction(signature, amount, from, to)`: Verify transaction
- `canHostGames(walletAddress)`: Check if user can host games

**Mock Mode:**
When `ANTE_TOKEN_MINT_ADDRESS` is not set, uses `mockAnteBalance` from User model.

### GameManager

Centralized service for managing all active game instances.

**Exports:**
- `activeGames`: Map of `tableId` → `GameController`
- `createNewGame(players, settings, isTournament)`: Create new game
- `getGameById(tableId)`: Get game by ID
- `removeGame(tableId)`: Remove game from active games

### GameController

Wrapper around `@idealic/poker-engine` providing game state management.

**Key Methods:**
- `initializeEngine(config)`: Initialize poker engine
- `addPlayer(player)`: Add player to game
- `playerAction(action)`: Process player action
- `completeHand(winnerIds, wentToShowdown)`: Complete hand with rake
- `distributePot(winnerIds, potAmount)`: Distribute pot with 2% rake
- `evaluateShowdown(playerIds, communityCards)`: Evaluate hands for showdown

**Features:**
- Automatic rake collection (2%)
- Bad beat detection (Aces full of Kings or better)
- Tournament elimination tracking
- Player stats tracking (handsPlayed, handsWon)

### BotService

Simple rules-based AI for bot players.

**Methods:**
- `makeDecision(gameState, playerId, playerHand)`: Get bot action decision

**Logic:**
- Pre-flop: Based on hand strength (pairs, premium hands)
- Post-flop: Based on hand evaluation (two pair+, one pair, draws)
- Conservative play: Folds on high bets, calls on small bets

### StreamingService

Manages live streaming sessions for poker games.

**Methods:**
- `startStream(tableId, hostWalletAddress, config)`: Start a new stream session
- `stopStream(tableId, hostWalletAddress)`: Stop an active stream
- `getStreamStatus(tableId)`: Get current stream status
- `updateViewerCount(tableId, count)`: Update viewer count

**Features:**
- RTMP stream key generation
- Stream session persistence
- Viewer count tracking
- Stream delay configuration (default: 30 seconds)

### WalletService

Manages Solana wallet operations and balance checks.

**Methods:**
- `getBalance(walletAddress)`: Get $ANTE token balance
- `verifyTransaction(signature, amount, from, to)`: Verify Solana transaction
- `canHostGames(walletAddress)`: Check hosting eligibility
- `checkHostingBalance(walletAddress)`: Verify minimum balance for hosting

### ComplianceService

Handles KYC/AML compliance checks and security monitoring.

**Methods:**
- `performKYCCheck(walletAddress, amount)`: Perform KYC verification
- `performAMLCheck(walletAddress, transaction)`: Perform AML screening
- `checkWithdrawalLimit(walletAddress, amount)`: Check withdrawal limits
- `logSecurityAlert(walletAddress, alertType, details)`: Log security alerts

**Features:**
- KYC threshold checking
- AML transaction screening
- Withdrawal limit enforcement
- Security alert generation

### AntiCheatService

Detects and prevents cheating and collusion.

**Methods:**
- `detectCollusion(gameState, players)`: Detect potential collusion
- `analyzeTimingPatterns(playerId, actions)`: Analyze action timing
- `checkMultiAccount(deviceFingerprint, walletAddress)`: Detect multi-accounting
- `flagSuspiciousActivity(playerId, reason)`: Flag suspicious behavior

**Features:**
- Collusion pattern detection
- Timing analysis for bot detection
- Multi-account detection via device fingerprinting
- Suspicious activity flagging

### PaymentService

**DEPRECATED**: Legacy payment service for fiat payments. No longer used as platform uses Solana $ANTE tokens directly.

### DiscordBot

Manages Discord bot integration for community features.

**Methods:**
- `sendTournamentAnnouncement(tournament)`: Announce tournament
- `updateLeaderboard(users)`: Update leaderboard in Discord
- `sendAnnouncement(message)`: Send general announcement

**Features:**
- Tournament announcements
- Leaderboard updates
- Community notifications
- Configurable channel IDs

### HandEvaluator

Evaluates poker hands and determines rank.

**Methods:**
- `evaluateHand(holeCards, communityCards)`: Evaluate hand strength
- `isQualifyingBadBeat(handRank)`: Check if hand qualifies for bad beat

## API Routes

### Authentication (`/api/auth`)
- `POST /connect`: Connect wallet and authenticate
- `PUT /username`: Update username (requires authentication)

### Games (`/api/games`)
- `GET /`: Get all games
- `GET /lobby`: Get available games for lobby
- `POST /host`: Host a new cash game
- `GET /:id`: Get game details
- `POST /:id/join`: Join game
- `POST /:id/action`: Perform game action

### Tables (`/api/tables`)
- `GET /:id/state`: Get table state snapshot
- `POST /`: Create new table (legacy endpoint)

### Tournaments (`/api/tournaments`)
- `GET /`: List all tournaments
- `GET /:id`: Get tournament details
- `POST /:id/register`: Register for tournament

### Users (`/api/users`)
- `GET /`: Get leaderboard (public, optional auth)
- `GET /me`: Get current user profile (requires auth)
- `GET /stats`: Get user statistics (requires auth)

### Merch (`/api/merch`)
- `GET /`: List products (public, optional auth)
- `GET /:id`: Get product details (public, optional auth)
- `POST /buy/:id`: Purchase product (requires auth)

### Wallet (`/api/wallet`)
- `GET /balance`: Get $ANTE token balance
- `POST /verify-buy-in`: Verify buy-in transaction
- `GET /hosting-eligibility`: Check hosting eligibility

### Streaming (`/api/stream`)
- `GET /games/:gameId`: Get streaming status for a game
- `POST /games/:gameId/start`: Start streaming a game (requires auth)
- `POST /games/:gameId/stop`: Stop streaming a game (requires auth)

### Payments (`/api/payments`)
- **DEPRECATED**: All payment routes return 410 error. Use `/api/wallet` routes instead.

### Developer Tools (`/api/dev`) - Development Only
- `POST /mock-airdrop`: Get mock $ANTE
- `POST /create-game`: Create dev game with bots
- `POST /seed-tournament`: Create test tournament
- `POST /seed-merch`: Create mock products
- `POST /run-payout`: Run monthly rewards distribution
- `GET /ecosystem-stats`: Get ecosystem statistics
- `POST /auth/bypass`: Bypass auth for testing (strictly dev only)

## Database Models

### User
- `walletAddress`: Primary key (Solana address)
- `username`: Unique username
- `mockAnteBalance`: Mock balance (lamports)
- `handsPlayed`: Total hands participated
- `handsWon`: Total hands won
- `totalGamesPlayed`: Total games played
- `totalGamesWon`: Total games won
- `totalWinnings`: Total winnings (lamports)
- `createdAt`: Account creation timestamp
- `lastLoginAt`: Last login timestamp

### Tournament
- `title`: Tournament name
- `startTime`: Scheduled start time
- `buyInAmount`: Buy-in amount (lamports)
- `prizePool`: Current prize pool (lamports)
- `players`: Array of registered wallet addresses
- `status`: REGISTERING, RUNNING, COMPLETED, CANCELLED
- `gameTables`: Array of table IDs
- `eliminatedPlayers`: Array of eliminated players with ranks
- `maxPlayers`: Maximum number of players
- `createdAt`: Tournament creation timestamp

### Product
- `name`: Product name
- `description`: Product description
- `imageUrl`: Product image URL
- `priceAnte`: Price in $ANTE (lamports)
- `priceUsd`: Price in USD
- `stock`: Stock level (0 = unlimited)
- `category`: Product category
- `isNftRedeemable`: Whether product can be redeemed for NFT
- `createdAt`: Product creation timestamp

### EcosystemStats
- `totalRakeCollected`: Total rake collected (lamports)
- `badBeatCount`: Total bad beats logged
- `lastPayoutDate`: Last monthly payout date
- `updatedAt`: Last update timestamp

### BadBeat
- `losingHand`: Description of losing hand
- `winningHand`: Description of winning hand
- `loserUsername`: Username of loser
- `winnerUsername`: Username of winner
- `loserWalletAddress`: Wallet address of loser
- `winnerWalletAddress`: Wallet address of winner
- `potSize`: Pot size (lamports)
- `tableId`: Game table ID where bad beat occurred
- `createdAt`: Bad beat timestamp

### Table
- `tableId`: Unique table identifier
- `state`: Complete game state snapshot
- `createdAt`: Table creation timestamp
- `updatedAt`: Last state update timestamp

### StreamSession
- `tableId`: Associated game table ID
- `hostWalletAddress`: Wallet address of stream host
- `streamKey`: Unique stream key for RTMP
- `status`: Stream status (live, ended, paused)
- `viewerCount`: Current viewer count
- `startedAt`: Stream start timestamp
- `endedAt`: Stream end timestamp

### Wallet
- `walletAddress`: Solana wallet address
- `anteBalance`: On-chain $ANTE balance (lamports)
- `lastBalanceCheck`: Last balance check timestamp
- `transactionHistory`: Array of transaction records

### KYCVerification
- `walletAddress`: User wallet address
- `status`: Verification status (pending, approved, rejected)
- `kycProvider`: KYC service provider
- `verificationId`: External verification ID
- `submittedAt`: Submission timestamp
- `verifiedAt`: Verification completion timestamp
- `documents`: Array of uploaded document references

### AMLCheck
- `walletAddress`: User wallet address
- `checkType`: Type of AML check (deposit, withdrawal, transaction)
- `status`: Check status (pending, cleared, flagged)
- `riskScore`: Risk assessment score
- `checkedAt`: Check timestamp
- `details`: Additional check details

### DeviceFingerprint
- `fingerprint`: Unique device fingerprint hash
- `walletAddresses`: Array of wallet addresses associated with device
- `ipAddress`: IP address
- `userAgent`: Browser user agent
- `createdAt`: First seen timestamp
- `lastSeenAt`: Last activity timestamp

### PaymentIntent
- `walletAddress`: User wallet address
- `amount`: Payment amount (lamports)
- `currency`: Currency type (ANTE, USD)
- `status`: Payment status (pending, completed, failed)
- `paymentMethod`: Payment method identifier
- `transactionId`: External transaction ID
- `createdAt`: Payment creation timestamp

### SecurityAlert
- `walletAddress`: Associated wallet address
- `alertType`: Type of security alert
- `severity`: Alert severity (low, medium, high, critical)
- `description`: Alert description
- `resolved`: Whether alert has been resolved
- `createdAt`: Alert timestamp
- `resolvedAt`: Resolution timestamp

## Socket.IO Events

### Client → Server

#### `join_game`
Join a game table.

```typescript
socket.emit('join_game', { tableId: string });
```

#### `playerAction`
Perform a game action.

```typescript
socket.emit('playerAction', {
  tableId: string,
  action: 'fold' | 'call' | 'raise' | 'check' | 'all-in' | 'bet',
  amount?: number
});
```

### Server → Client

#### `gameState`
Broadcast game state updates.

```typescript
socket.on('gameState', (state: GameState) => {
  // Full game state
});
```

#### `handComplete`
Notify when hand completes.

```typescript
socket.on('handComplete', (result: HandResult) => {
  // Winners, rake, bad beats
});
```

## Security Middleware

### walletAuth
- Validates wallet address from headers
- Checks user exists in database
- Attaches user to `req.user`

### requireUsername
- Ensures user has created username
- Returns 403 if username not set

### Rate Limiting
- Global: 1000 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Game actions: 10 requests per second

### Helmet
- Content Security Policy configured
- Security headers enabled

### CORS
- Configured for production security
- Allows credentials
- Restricted to FRONTEND_URL

## Mock Mode

When `ANTE_TOKEN_MINT_ADDRESS` is not set, the platform runs in **Mock Mode**:

1. **Balance Checks**: Uses `mockAnteBalance` from User model
2. **Transactions**: No real Solana transactions
3. **Developer Tools**: All `/api/dev` endpoints enabled
4. **Full Features**: All gameplay features work identically

This allows complete testing without deploying real tokens.

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment
cp env.example .env
# Edit .env with your configuration

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Logging

Uses Winston logger with:
- Console output (development)
- File logging (production)
- Error tracking
- Request logging

Log levels: `error`, `warn`, `info`, `debug`

## Error Handling

Global error handler in `app.ts`:
- Catches all unhandled errors
- Logs errors
- Returns formatted error responses
- Prevents stack traces in production

## Performance

- Database indexes on frequently queried fields
- Connection pooling for MongoDB
- Efficient game state management
- Batch operations for stats updates

## Future Enhancements

- Redis caching for game state
- WebSocket connection pooling
- Database query optimization
- Real-time metrics collection
- Prometheus integration