import assert from 'node:assert'
import { progressStreet, resolveShowdown } from '@/lib/ai/poker-ai'

{
  let s: 'preflop'|'flop'|'turn'|'river'|'showdown' = 'preflop'
  s = progressStreet(s)
  assert(s === 'flop')
  s = progressStreet(s)
  assert(s === 'turn')
  s = progressStreet(s)
  assert(s === 'river')
  s = progressStreet(s)
  assert(s === 'showdown')
}

{
  const winners = resolveShowdown([
    { id: 'a', cards: ['Ah','Kh'] },
    { id: 'b', cards: ['Qh','Jh'] },
  ], ['As','Ad','Kd','7c','2h'])
  assert(winners.includes('a'))
}

console.log('flow-sim tests passed')
