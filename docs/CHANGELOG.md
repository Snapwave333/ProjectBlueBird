# Changelog (Aggregator)

## Recent Highlights

### Phase 2: Off-chain MVP - Complete ✅

**User-Generated Games (Latest)**
- ✅ Host game functionality (`POST /api/games/host`)
- ✅ Game lobby with real-time updates (`GET /api/games/lobby`)
- ✅ User-hosted cash games with custom blinds and buy-ins
- ✅ Balance validation before hosting
- ✅ Frontend host game form and lobby UI

**Rewards Distribution System**
- ✅ Player stats tracking (handsPlayed, handsWon)
- ✅ Monthly payout system (50/30/20 split to top 3)
- ✅ Leaderboard with sorting and win rate calculation
- ✅ Rake pool reset after distribution
- ✅ Frontend leaderboard page and payout button

**Merch Store**
- ✅ Product model and database schema
- ✅ Product listing and purchase endpoints
- ✅ Mock balance integration for purchases
- ✅ Frontend store page with product cards
- ✅ Developer seeding tools

**Tournament System**
- ✅ Tournament model with registration and prize pools
- ✅ Auto-start cron job for tournaments
- ✅ Table creation and player seating
- ✅ Elimination tracking and ranking
- ✅ Winner-take-all prize distribution
- ✅ Frontend tournament pages and registration

**Rake & Bad Beat System**
- ✅ 2% rake collection from every pot
- ✅ EcosystemStats model for rake tracking
- ✅ Bad beat detection (Aces full of Kings or better)
- ✅ BadBeat model for logging
- ✅ Frontend rake display in game results

**Bot Players**
- ✅ BotService with rules-based AI
- ✅ Pre-flop and post-flop decision logic
- ✅ Automatic bot turn execution
- ✅ Dev game creation with configurable bot count

**Mock Mode Upgrade**
- ✅ Per-user mock balances (`mockAnteBalance`)
- ✅ Debug faucet (`POST /api/dev/mock-airdrop`)
- ✅ Balance info endpoint
- ✅ Frontend debug panel

**Solana Integration (Foundation)**
- ✅ SolanaService for blockchain interactions
- ✅ Wallet authentication middleware
- ✅ User model based on wallet address
- ✅ Mock mode for off-chain testing

**Game Engine Integration**
- ✅ GameController wrapper for @idealic/poker-engine
- ✅ Hand completion detection
- ✅ Pot distribution with rake
- ✅ Showdown evaluation
- ✅ Tournament game support

**Frontend Integration**
- ✅ Solana Wallet Adapter integration
- ✅ Wallet connection flow
- ✅ Username creation
- ✅ Game table UI with real-time updates
- ✅ Socket.IO client integration

---

## Moved Changelogs

- Root changelog: ./ROOT_CHANGELOG.md
- Landing Page: ../landing-page/CHANGELOG.md
- Modern UI: ../modern-ui/CHANGELOG.md
- Wasmer deploy: ../wasmer-deploy/CHANGELOG.md

---

## Version History

### v2.0.0 - Phase 2 Complete (Current)
- Complete off-chain MVP with all core features
- User-generated games
- Tournament system
- Rewards distribution
- Merch store
- Mock mode with per-user balances

### v1.0.0 - Initial Release
- Basic poker game functionality
- Wallet authentication
- Game engine integration
- Mock mode foundation