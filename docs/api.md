# API Reference

Version: 1.0.0
Last Updated: 2025-11-27

Engine (`lib/poker-engine.ts`):
- `createDeck(): Card[]` at lib/poker-engine.ts:76
- `evaluateHand(cards: Card[]): HandEvaluation` at lib/poker-engine.ts:105
- `determineWinner(players: Player[], communityCards: Card[]): Player[]` at lib/poker-engine.ts:232
- `dealCommunityCards(deck: Card[], stage): { cards, deck }` at lib/poker-engine.ts:343
- `nextStage(stage): stage` at lib/poker-engine.ts:419
- `calculatePotOdds(pot, betToCall): number` at lib/poker-engine.ts:456

AI (`lib/ai/poker-ai.ts`):
- `scoreStrength(hole, community, position, totalPlayers): { score, tier, eval? }` at lib/ai/poker-ai.ts:58
- `decideBetting({ pot, betToCall, bankroll, tier, street, nPlayers?, effectiveStack?, sessionId?, prevAction?, opponentId? }): Decision` at lib/ai/poker-ai.ts:84
- `progressStreet(stage): nextStage` at lib/ai/poker-ai.ts:100
- `resolveShowdown(players, community): string[]` at lib/ai/poker-ai.ts:102

Strategy (`lib/ai/strategy-store.ts`):
- `getStrategyParams()` at lib/ai/strategy-store.ts:1
- `updateStrategyParams(partial)` at lib/ai/strategy-store.ts:1

Risk (`lib/ai/risk-manager.ts`):
- `startSession(id)` at lib/ai/risk-manager.ts:1
- `recordLoss(id, amount, maxLoss)` at lib/ai/risk-manager.ts:1
- `getStats(id)` at lib/ai/risk-manager.ts:1

Opponent (`lib/ai/opponent-model.ts`):
- `recordAction(playerId, action, prevAction?)` at lib/ai/opponent-model.ts:1
- `getAggression(playerId)` at lib/ai/opponent-model.ts:1
- `getCheckRaiseFreq(playerId)` at lib/ai/opponent-model.ts:1

Bots (`lib/services/bot.service.ts`):
- `startBots(lobbyId, count)` at lib/services/bot.service.ts:1
- `stopBots(lobbyId, count)` at lib/services/bot.service.ts:1
- `tickBots()` at lib/services/bot.service.ts:1
- `countBots(lobbyId)` at lib/services/bot.service.ts:1

Lobby (`lib/stores/lobby-store.ts`):
- `subscribe(fn)` at lib/stores/lobby-store.ts:20
- `getLobbies()` at lib/stores/lobby-store.ts:24
- `joinHuman(lobbyId)` at lib/stores/lobby-store.ts:28
- `leaveHuman(lobbyId)` at lib/stores/lobby-store.ts:37
- `ensureTicker()` at lib/stores/lobby-store.ts:57
