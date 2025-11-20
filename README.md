# 🃏 ANTE Poker Platform

**A Solana-based decentralized poker ecosystem powered by the $ANTE token.**

ANTE Poker is a full-stack Web3 poker platform that combines traditional poker gameplay with blockchain technology. Players connect their Solana wallets (Phantom), use $ANTE tokens for buy-ins, and participate in cash games, tournaments, and community events.

## ✨ Features

### 🎮 Core Gameplay
- **Real-time Multiplayer Poker**: Texas Hold'em with up to 9 players
- **Cash Games**: User-generated tables with custom blinds and buy-ins
- **Tournaments**: Monthly tournaments with prize pools
- **Bot Opponents**: AI players for solo testing and practice
- **Game Lobby**: Browse and join available cash games

### 💰 Tokenomics & Rewards
- **$ANTE Token**: Solana SPL token for all in-game transactions
- **Rake System**: 2% rake automatically collected from every pot
- **Monthly Rewards**: Top 3 players receive payouts from rake pool
- **Bad Beat Jackpot**: Qualifying bad beats (Aces full of Kings or better) logged
- **Leaderboard**: Track hands won, hands played, and total winnings

### 🛒 Ecosystem Features
- **Merch Store**: Purchase exclusive ANTE gear with $ANTE tokens
- **User-Generated Games**: Host your own cash games (minimum balance required)
- **Wallet Integration**: Seamless Solana wallet connection (Phantom, Solflare, etc.)
- **Mock Mode**: Full-featured development mode for testing without real tokens

### 🏆 Monthly Ecosystem Cycle
1. **Play**: Users play cash games and tournaments
2. **Collect Rake**: 2% rake automatically deducted from pots
3. **Reward Top Players**: Monthly distribution to top 3 players by hands won
4. **Reset Pool**: Rake pool resets and cycle begins again

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)
- Solana wallet (Phantom recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ANTE_Project_PR

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../texas-holdem-demo
npm install

# Set up environment variables
cp backend/env.example backend/.env
cp texas-holdem-demo/env.example texas-holdem-demo/.env.local

# Edit .env files with your configuration
```

### Running Locally

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd texas-holdem-demo
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- Socket.IO (real-time communication)
- Solana Web3.js (blockchain integration)

**Frontend:**
- Next.js 14
- React
- Solana Wallet Adapter
- Tailwind CSS
- Socket.IO Client

**Game Engine:**
- `@idealic/poker-engine` (wrapped by custom GameController)

### Project Structure

```
ANTE_Project_PR/
├── backend/                 # Express API server
│   ├── controllers/         # Request handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── src/                # Core game logic
├── texas-holdem-demo/      # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/     # React components
│   │   └── lib/           # Utilities & API client
├── shared/                 # Shared TypeScript types
└── docs/                  # Project documentation
```

## 📚 Documentation

- **[Project Plan](docs/ANTE_Project_Plan.md)**: Complete PRD and roadmap
- **[API Reference](docs/API.md)**: All API endpoints
- **[Backend Guide](docs/BACKEND.md)**: Backend architecture and setup
- **[Frontend Guide](docs/FRONTEND.md)**: Frontend development guide
- **[Development Guide](docs/DEVELOPMENT.md)**: Development setup and workflows
- **[Deployment Guide](docs/DEPLOYMENT.md)**: Production deployment instructions
- **[Rust MCP Setup](docs/RUST_MCP_SETUP.md)**: Rust development with MCP server

## 🤖 MCP Servers (Model Context Protocol)

This project includes MCP servers for AI-assisted development:

- **stage-mcp-server**: Manages Stage canvas editor operations
- **wasmer-mcp-server**: Handles Wasmer.io deployment operations
- **rust-mcp-server**: Enables Rust development with cargo commands

See [Rust MCP Setup Guide](docs/RUST_MCP_SETUP.md) for configuration instructions.

## 🔐 Authentication

ANTE Poker uses **Solana wallet-based authentication**:

1. User connects wallet (Phantom, Solflare, etc.)
2. Wallet address becomes user identity
3. User creates username (stored in database)
4. All actions authenticated via wallet signature

**No passwords, no emails** - just Web3 wallet connection.

## 💵 Mock Mode (Development)

The platform includes a full-featured **Mock Mode** for development and testing:

- **Per-user mock balances**: Each user has their own `mockAnteBalance` in the database
- **Debug faucet**: Get 1,000 mock $ANTE anytime via `/dev/mock-airdrop`
- **Bot players**: AI opponents for solo testing
- **Dev game setup**: Create games with custom settings and bot counts
- **Ecosystem simulation**: Rake collection, bad beat logging, and rewards distribution all work in mock mode

Mock mode automatically activates when `ANTE_TOKEN_MINT_ADDRESS` is not set in environment variables.

## 🎯 Current Status

### ✅ Completed (Phase 2: Off-chain MVP)

- ✅ Solana wallet authentication
- ✅ User identity system (wallet address + username)
- ✅ Cash game hosting and joining
- ✅ Game lobby with real-time updates
- ✅ Tournament system (registration, auto-start, eliminations, payouts)
- ✅ Rake collection (2% from every pot)
- ✅ Bad beat logging
- ✅ Leaderboard and stats tracking
- ✅ Monthly rewards distribution
- ✅ Merch store (mock balance integration)
- ✅ Bot AI players
- ✅ Mock mode with per-user balances
- ✅ Developer tools and debug panel

### 🚧 In Progress / Planned

- ⚠️ Real Solana token integration (Phase 3)
- ⚠️ On-chain escrow contracts
- ⚠️ Transaction verification
- ⚠️ Email notifications
- ⚠️ Telegram/Discord bot integration (Discord bot service exists, needs configuration)
- ⚠️ NFT redeemable merch
- ⚠️ Advanced analytics dashboard
- ⚠️ Redis caching layer
- ⚠️ Comprehensive automated testing

## 🧪 Testing

### Development Mode

1. **Connect Wallet**: Use Phantom wallet set to Devnet
2. **Get Mock Balance**: Use debug faucet in `/dev` panel
3. **Host Game**: Create a cash game from `/host` page
4. **Join Games**: Browse lobby and join available games
5. **Play**: Full poker gameplay with bot opponents

### Dev Tools

Access the developer panel at `/dev`:
- Create dev games with bots
- Seed test tournaments
- Seed mock products
- Run monthly payouts
- View ecosystem stats

## 📊 API Endpoints

### Authentication
- `POST /api/auth/connect` - Connect wallet and create/authenticate user
- `GET /api/users/me` - Get current user profile

### Games
- `POST /api/games/host` - Host a new cash game
- `GET /api/games/lobby` - Get available games
- `POST /api/games/:id/join` - Join a game
- `POST /api/games/:id/action` - Perform game action

### Tournaments
- `GET /api/tournaments` - List all tournaments
- `POST /api/tournaments/:id/register` - Register for tournament

### Leaderboard
- `GET /api/users` - Get leaderboard (sorted by handsWon)

### Merch Store
- `GET /api/merch` - List products
- `POST /api/merch/buy/:id` - Purchase product

### Developer Tools (Development Only)
- `POST /api/dev/mock-airdrop` - Get mock $ANTE
- `POST /api/dev/create-game` - Create dev game with bots
- `POST /api/dev/seed-tournament` - Create test tournament
- `POST /api/dev/seed-merch` - Create mock products
- `POST /api/dev/run-payout` - Run monthly rewards distribution
- `GET /api/dev/ecosystem-stats` - Get ecosystem statistics

### Wallet & Streaming
- `GET /api/wallet/balance` - Get $ANTE token balance
- `POST /api/wallet/verify-buy-in` - Verify buy-in transaction
- `GET /api/wallet/hosting-eligibility` - Check hosting eligibility
- `GET /api/stream/games/:gameId` - Get streaming status
- `POST /api/stream/games/:gameId/start` - Start streaming
- `POST /api/stream/games/:gameId/stop` - Stop streaming

### Health Checks
- `GET /health` - Basic health check
- `GET /health/solana` - Solana connection health check

See [API.md](docs/API.md) for complete API documentation.

## 🔒 Security

- **Wallet Signature Verification**: All authenticated requests verify Solana signatures
- **Rate Limiting**: API endpoints protected with rate limits
- **Input Validation**: All inputs validated and sanitized
- **CORS**: Configured for production security
- **Helmet**: Security headers middleware
- **Error Handling**: Comprehensive error handling and logging

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: See `docs/` folder
- **Issues**: Report bugs via GitHub Issues
- **Discord**: [Join our community](https://discord.gg/ante-poker)

---

**Built with ❤️ for the Solana ecosystem**