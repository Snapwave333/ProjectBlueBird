# Minimum Documentation

This document contains the essential documentation for the ANTE Poker Platform: the README, Backend System Architecture, and Changelog.

---

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

---

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

---

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
