# 🃏 ANTE Poker Platform - Blueprint

## Overview

ANTE Poker is a full-stack Web3 poker platform that combines traditional poker gameplay with blockchain technology. It is built on the Solana blockchain and powered by the native $ANTE token. Players can connect their Solana wallets (e.g., Phantom) to use $ANTE tokens for buy-ins, and participate in cash games, tournaments, and community events.

## Features

### Core Gameplay
- **Real-time Multiplayer Poker**: Texas Hold'em with up to 9 players per table.
- **Cash Games**: User-generated tables with customizable blinds and buy-ins.
- **Tournaments**: Scheduled monthly tournaments with prize pools.
- **Bot Opponents**: AI-powered players for solo practice and testing.
- **Game Lobby**: A central hub to browse and join available cash games.

### Blockchain & Wallet Integration
- **Wallet Connection**: Securely connect Solana wallets like Phantom.
- **$ANTE Token**: All in-game transactions, including buy-ins and payouts, are handled using the native $ANTE token.

### Community & Social
- **Discord Integration**: A Discord bot for tournament announcements, leaderboard updates, and community notifications.
- **User Profiles**: Players can set a username linked to their wallet address.

## System Architecture

The backend is composed of several microservices to handle different aspects of the game and platform.

- **Authentication Service (`/api/auth`)**: Manages wallet connections and user authentication.
- **Game Service (`/api/games`)**: Handles game creation, lobby management, and real-time gameplay actions.
- **Anti-Cheat Service**: Detects and prevents cheating, collusion, and botting through pattern detection and device fingerprinting.
- **Hand Evaluator**: A utility service to evaluate poker hands and determine their rank.
- **Discord Bot**: Integrates with Discord to provide real-time updates to the community.

### Deprecated Services
- **PaymentService**: A legacy service for fiat payments that has been deprecated in favor of the $ANTE token.

## API Routes

### Authentication (`/api/auth`)
- `POST /connect`: Connect a wallet and authenticate the user.
- `PUT /username`: Update a user's username (requires authentication).

### Games (`/api/games`)
- `GET /`: Retrieve a list of all games.
- `GET /lobby`: Get a list of available games for the lobby.
- `POST /host`: Host a new cash game.
- `GET /:id`: Get detailed information about a specific game.
- `POST /:id/join`: Join a specific game.
- `POST /:id/action`: Perform a game action (e.g., bet, check, fold).

## Development Plan

1.  **Environment Setup**: Configure the Next.js environment and install necessary dependencies.
2.  **Firebase Integration**: Set up Firebase for backend services like authentication and database.
3.  **Frontend Development**: Build the user interface for the lobby, game tables, and user profiles.
4.  **Backend Development**: Implement the API routes and microservices.
5.  **Smart Contract Integration**: Connect the platform to the Solana smart contracts for handling $ANTE token transactions.
