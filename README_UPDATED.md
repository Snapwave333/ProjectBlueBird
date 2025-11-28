# 🎲 **ANTE Poker Platform**

<div align="center">
  <img src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" alt="Banner GIF" width="800"/>
</div>

## Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vercel Deploy](https://img.shields.io/badge/Vercel-Deploy-success)](https://vercel.com)
[![Firebase](https://img.shields.io/badge/Firebase-Functions-orange)](https://firebase.google.com)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)

## Quick Overview

ANTE Poker is a **Web3‑enabled Texas Hold'em** platform built on **Solana** with a **Next.js** front‑end and **Firebase** back‑end. Players connect their wallets, stake $ANTE tokens, and enjoy real‑time multiplayer poker.

## Demo

![Demo Screenshot](public/screenshot.png)
*Replace the placeholder with an actual screenshot of the lobby or game table.*

## Feature Breakdown

- 🎮 Real‑time multiplayer poker (up to 9 players)
- 🏆 Tournaments & cash games
- 💰 $ANTE token integration on Solana
- 🔐 Secure authentication via Firebase & Phantom wallet
- 📜 Transaction History sidebar with live status
- 📱 Mobile‑responsive UI with glass‑morphism design
- 🛡️ Rate‑limiting & CSRF protection on all API routes
- 🧩 Anchor smart‑contract skeleton for Solana devnet

## Tech Stack

| Technology | Icon |
|------------|------|
| **Next.js** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original-wordmark.svg" width="24"/> |
| **React** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="24"/> |
| **TypeScript** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="24"/> |
| **Tailwind CSS** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" width="24"/> |
| **Firebase** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg" width="24"/> |
| **Solana (Anchor)** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/rust/rust-plain.svg" width="24"/> |

## Installation

```bash
# Clone the repo
git clone https://github.com/Snapwave333/ProjectBlueBird.git
cd ProjectBlueBird

# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env.local

# Run the dev server (Vercel will handle production builds)
npm run dev
```

## Configuration

- **Firebase**: Add your `FIREBASE_CONFIG` JSON to `.env.local`.
- **Solana**: Set `SOLANA_PROGRAM_ID` to the Anchor program ID after deployment.
- **Rate‑limit**: Adjust limits in `lib/middleware/rateLimit.ts` if needed.

## Usage

- Open `http://localhost:3000`.
- Connect your Phantom wallet.
- Create or join a lobby, then enjoy the game.
- View live transaction updates in the sidebar.

## Architecture / Internals

```mermaid
graph TD
    A[Client Browser] --> B[Next.js (SSR + API Routes)]
    B --> C[Firebase Functions]
    B --> D[Solana Anchor Program]
    C --> E[Firestore (user data)]
    D --> F[Solana Devnet]
```

## Roadmap

- [ ] Deploy Anchor program to Solana devnet
- [ ] Integrate Switchboard VRF for provable randomness
- [ ] Full production audit & bug‑bounty program
- [ ] Launch on Vercel (production) & Firebase (functions)

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome‑feature`)
3. Commit your changes (`git commit -m "Add awesome feature"`)
4. Push and open a Pull Request

## License

MIT © Snapwave333. See `LICENSE.txt` for details.

## Credits

- **Anchor** – <https://github.com/coral-xyz/anchor>
- **Tailwind CSS** – <https://tailwindcss.com/>
- **Firebase** – <https://firebase.google.com/>
- **Solana** – <https://solana.com/>

<details>
  <summary>🐣 Hidden Easter Egg</summary>
  <pre>
   _   _   _   _   _   _   _   _   _   _
  / \ / \ / \ / \ / \ / \ / \ / \ / \ / \
 ( A | N | T | E |   | P | O | K | E | R )
  \_/ \_/ \_/ \_/ \_/ \_/ \_/ \_/ \_/ \_/
  </pre>
  <p>If you read this, you gain +5 developer XP! 🎉</p>
</details>

<!-- if you’re reading this you’re officially part of the conspiracy -->
