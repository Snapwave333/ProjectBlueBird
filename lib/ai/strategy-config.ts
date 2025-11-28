export const STRATEGY_PARAMS = {
  spr: {
    low: 3,
    medium: 6,
    high: 10,
  },
  betSizing: {
    preflop: { weak: 0, moderate: 0.33, strong: 0.6 },
    flop: { weak: 0, moderate: 0.5, strong: 0.75 },
    turn: { weak: 0, moderate: 0.6, strong: 0.8 },
    river: { weak: 0, moderate: 0.7, strong: 0.9 },
    showdown: { weak: 0, moderate: 0, strong: 0 },
  },
  impliedOdds: {
    suitedConnectorBonus: 0.06,
    setMiningBonus: 0.08,
    flushDrawBonus: 0.1,
    straightDrawBonus: 0.07,
  },
  risk: {
    maxLoss: Number(process.env.NEXT_PUBLIC_AI_MAX_SESSION_LOSS || '5000'),
  },
}
