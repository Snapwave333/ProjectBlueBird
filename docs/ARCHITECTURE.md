# Architecture

## Overview

ANTE Poker Platform is a monorepo containing backend services, multiple web frontends, shared types/utilities, PHP modules, and deployment tooling. The platform is built as a Solana-based decentralized poker ecosystem powered by the $ANTE token.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│   MongoDB       │
│   (Next.js)     │     │   (Express)     │     │   Database      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                        │
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Solana Wallet  │     │   Socket.IO     │     │   Solana RPC    │
│   Adapter       │     │   (Real-time)   │     │   (Helius)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Key Components

### Backend (`./backend`)

**Technology Stack:**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Real-time**: Socket.IO
- **Blockchain**: Solana Web3.js
- **Game Engine**: @idealic/poker-engine

**Core Structure:**
```
backend/
├── app.ts                 # Main Express application entry point
├── controllers/          # Request handlers
│   ├── authController.ts
│   ├── gameController.ts
│   ├── tournamentController.ts
│   ├── merchController.ts
│   ├── userController.ts
│   ├── walletController.ts
│   └── devController.ts
├── models/               # MongoDB schemas
│   ├── User.ts
│   ├── Tournament.ts
│   ├── Product.ts
│   ├── Table.ts
│   ├── StreamSession.ts
│   ├── Wallet.ts
│   ├── KYCVerification.ts
│   ├── AMLCheck.ts
│   ├── DeviceFingerprint.ts
│   ├── PaymentIntent.ts
│   ├── SecurityAlert.ts
│   ├── EcosystemStats.ts
│   └── BadBeat.ts
├── routes/              # API route definitions
│   ├── auth.ts
│   ├── games.ts
│   ├── tournaments.ts
│   ├── merch.ts
│   ├── users.ts
│   ├── wallet.ts
│   ├── streaming.ts
│   ├── tables.ts
│   ├── payments.ts (deprecated)
│   └── dev.ts
├── services/           # Business logic services
│   ├── SolanaService.ts
│   ├── WalletService.ts
│   ├── BotService.ts
│   ├── HandEvaluator.ts
│   ├── PokerEngine.ts
│   ├── StreamingService.ts
│   ├── ComplianceService.ts
│   ├── AntiCheatService.ts
│   ├── PaymentService.ts (deprecated)
│   └── DiscordBot.ts
├── middleware/         # Express middleware
│   ├── walletAuth.ts
│   ├── errorHandler.ts
│   └── validator.ts
├── src/                # Core game logic
│   ├── GameController.ts
│   └── services/
│       └── GameManager.ts
└── utils/              # Utility functions
    └── logger.ts
```

### Frontends

#### Texas Hold'em Demo (`./texas-holdem-demo`)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React + Tailwind CSS
- **Wallet**: Solana Wallet Adapter
- **Real-time**: Socket.IO Client

#### Landing Page (`./landing-page`)
- **Framework**: Vite
- **Styling**: Tailwind CSS
- **Purpose**: Marketing and information

#### Modern UI (`./modern-ui`)
- **Framework**: Vite
- **Styling**: Tailwind CSS
- **Purpose**: UI experiments and prototypes

### Shared (`./shared`)
- TypeScript types and interfaces
- Validators (Zod schemas)
- Constants and configuration

### PHP Modules (`./php`)
Legacy PHP modules for specific integrations (if needed).

### Deployment Tooling
- **Docker**: `./infrastructure/docker`
- **Kubernetes**: `./infrastructure/kubernetes`
- **Wasmer**: `./wasmer-deploy`, `./wasmer-mcp-server`

## Data Flow

### HTTP API Flow
1. Client sends HTTP request to Express server
2. Request passes through middleware (auth, validation, rate limiting)
3. Route handler calls appropriate controller
4. Controller uses services for business logic
5. Services interact with MongoDB via Mongoose models
6. Response sent back to client

**Routes**: Mounted under `/api/*` and `/health`

### Real-time Flow (Socket.IO)
1. Client connects to Socket.IO server
2. Client joins game room: `table:${tableId}`
3. Server manages game state via GameController
4. Game actions broadcast to all players in room
5. State persisted to MongoDB periodically

**Rooms**: Keyed by `table:${tableId}`

### Persistence Layer
- **MongoDB**: Primary database for all persistent data
- **Mongoose**: ODM for schema definition and validation
- **Models**: User, Tournament, Product, Table, StreamSession, etc.
- **State Snapshots**: Table state persisted periodically

### Game Engine
- **In-memory Engine**: One PokerEngine instance per tableId
- **Lazy Creation**: Engine created on first socket connection
- **State Management**: GameController wraps @idealic/poker-engine
- **Game Manager**: Centralized service managing all active games

## Authentication & Authorization

### Wallet-Based Authentication
1. User connects Solana wallet (Phantom, Solflare, etc.)
2. Wallet address becomes user identity
3. User creates username (stored in database)
4. All authenticated requests include `x-wallet-address` header
5. Wallet signature verification for sensitive operations

**No passwords, no emails** - just Web3 wallet connection.

## Security and Compliance

### Security Features
- **Helmet**: Content Security Policy and security headers
- **Rate Limiting**: Global and per-endpoint rate limits
- **CORS**: Configured for production security
- **Input Validation**: Zod schemas for all inputs
- **Error Handling**: Comprehensive error handling without stack traces in production

### Compliance Features
- **KYC Verification**: Threshold-based KYC checks
- **AML Screening**: Transaction monitoring and screening
- **Device Fingerprinting**: Multi-account detection
- **Security Alerts**: Automated alert generation
- **Withdrawal Limits**: Configurable limits based on KYC status

### Rate Limiting
- **Global**: 100 requests per 15 minutes per IP
- **Strict**: 5 requests per minute for sensitive endpoints
- **Game Actions**: Per-user rate limiting

## Mock Mode vs Real Mode

### Mock Mode (Phase 2: Off-chain MVP)
- **Trigger**: `ANTE_TOKEN_MINT_ADDRESS` not set or `MOCK_SOLANA=true`
- **Balances**: Uses `mockAnteBalance` from User model
- **Transactions**: No real Solana transactions
- **Features**: Full feature set available
- **Developer Tools**: All `/api/dev` endpoints enabled

### Real Mode (Phase 3: On-chain Integration)
- **Trigger**: `ANTE_TOKEN_MINT_ADDRESS` set and `MOCK_SOLANA=false`
- **Balances**: Real on-chain balance checks via Solana RPC
- **Transactions**: Real Solana token transfers
- **Features**: Full feature set with real tokens
- **Developer Tools**: Disabled in production

## Engine Integration

### Game Controller
- Wraps `@idealic/poker-engine`
- Manages game state and player actions
- Handles rake collection (2%)
- Detects bad beats
- Tracks player statistics

### Game Manager
- Centralized service for all active games
- Map of `tableId` → `GameController`
- Creates and removes games
- Manages tournament tables

## Real-time Communication

### Socket.IO Events

**Client → Server:**
- `join_game`: Join a game table
- `playerAction`: Perform game action

**Server → Client:**
- `gameState`: Game state updates
- `handComplete`: Hand completion notification

### Room Management
- Each game table has its own Socket.IO room
- Room name: `table:${tableId}`
- All players in room receive state updates
- Automatic cleanup on game end

## Database Schema

### Core Models
- **User**: Wallet address, username, stats, mock balance
- **Tournament**: Tournament details, players, status
- **Product**: Merch store products
- **Table**: Game state snapshots
- **EcosystemStats**: Rake collection, bad beat count
- **BadBeat**: Bad beat logs

### Compliance Models
- **KYCVerification**: KYC verification records
- **AMLCheck**: AML check records
- **DeviceFingerprint**: Device fingerprinting data
- **SecurityAlert**: Security alerts

### Additional Models
- **StreamSession**: Live streaming sessions
- **Wallet**: Wallet balance cache
- **PaymentIntent**: Payment records (deprecated)

## Deployment Architecture

### Development
- Local MongoDB instance
- Backend on `localhost:3001`
- Frontend on `localhost:3000`
- Mock mode enabled

### Production
- MongoDB Atlas or self-hosted MongoDB
- Backend deployed to cloud (AWS, GCP, Azure)
- Frontend deployed to Vercel/Netlify or static hosting
- Real mode with Solana mainnet integration
- Docker containers or Kubernetes pods

### Infrastructure
- **Docker**: Container definitions in `./infrastructure/docker`
- **Kubernetes**: Manifests in `./infrastructure/kubernetes`
- **Wasmer**: Deployment configs in `./wasmer-deploy`

## Monitoring & Logging

### Logging
- Winston logger with multiple log levels
- Console output in development
- File logging in production
- Error tracking and request logging

### Health Checks
- `GET /health`: Basic health check
- `GET /health/solana`: Solana connection check

## Future Enhancements

### Planned Features
- Redis caching for game state
- WebSocket connection pooling
- Database query optimization
- Real-time metrics collection
- Prometheus integration
- Advanced analytics dashboard

### Phase 3: On-chain Integration
- Real Solana token integration
- On-chain escrow contracts
- Transaction verification
- On-chain payout processing

---

**Last Updated**: January 2025