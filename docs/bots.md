# Bots & Lobbies

Version: 1.0.0
Last Updated: 2025-11-27

Lobby Store:
- Detects empty lobbies, spawns bots up to `NEXT_PUBLIC_BOT_MAX_PER_LOBBY`
- Scales down bots as humans join at `NEXT_PUBLIC_BOT_LEAVE_THRESHOLD`
- Ticks bots every 2s and notifies subscribers

Bot Service:
- Maintains bot list
- Timed action loop; integrated with AI module for decisions

UI:
- `components/GameLobby.tsx` displays bot counts and icons
- `components/PokerTable.tsx` renders bots as players and executes actions

References:
- Lobby: `lib/stores/lobby-store.ts:1–87`
- Bots: `lib/services/bot.service.ts:1–40`
- UI: `components/GameLobby.tsx:1–82`, `components/PokerTable.tsx:1–140`
