# Strategy & AI

Version: 1.0.0
Last Updated: 2025-11-27

Strength Tiers:
- weak: < 40
- moderate: 40–64
- strong: ≥ 65

Position Awareness:
- Score scaled by position fraction of total players

Betting Logic:
- Street-aware sizing using `getStrategyParams().betSizing`
- SPR bands adjust sizing (+/− 10%)
- Multiway dampening reduces sizing in N-player pots
- Check-raise trigger when previous action bet/raise, opponent aggression > 0.5, SPR ≤ 6

Implied Odds:
- Bonuses for suited connectors, pairs (set mining), flush/straight draws
- Board class (`dry | semi | wet`) modulates implied odds

Risk Management:
- Session max loss enforced via `getStrategyParams().risk.maxLoss`
- Loss tracked on bot bets/raises

References:
- AI: `lib/ai/poker-ai.ts:37–75, 84–112`
- Risk: `lib/ai/risk-manager.ts:1–20`
- Opponent: `lib/ai/opponent-model.ts:1–25`
- Strategy store: `lib/ai/strategy-store.ts:1–10`
