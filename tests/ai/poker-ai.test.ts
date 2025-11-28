import assert from 'node:assert'
import { scoreStrength, decideBetting, resolveShowdown } from '../../lib/ai/poker-ai.ts'
import { evaluateHand } from '../../lib/poker-engine.ts'
import { STRATEGY_PARAMS } from '../../lib/ai/strategy-config.ts'

// Hand strength tiers
{
  const { score, tier } = scoreStrength(['Ah','Ad'], [], 6, 9)
  assert(score >= 65 && tier === 'strong')
}

{
  const { score, tier } = scoreStrength(['Th','Jd'], [], 3, 9)
  assert(score >= 40 && tier !== 'weak')
}

{
  const { score, tier } = scoreStrength(['7c','2d'], [], 1, 9)
  assert(tier === 'weak')
}

// Betting decisions
{
  const d = decideBetting({ pot: 100, betToCall: 0, bankroll: 1000, tier: 'strong', street: 'flop' })
  assert(d.action === 'bet' && (d.amount||0) > 0)
}

{
  const d = decideBetting({ pot: 100, betToCall: 20, bankroll: 200, tier: 'moderate', street: 'turn' })
  assert(['call','raise'].includes(d.action))
}

// Showdown
{
  const winners = resolveShowdown([
    { id: 'p1', cards: ['Ah','Ad'] },
    { id: 'p2', cards: ['Kh','Kd'] },
  ], ['2c','2d','2s','3h','7d'])
  assert(winners.includes('p1'))
}

console.log('poker-ai tests passed')
