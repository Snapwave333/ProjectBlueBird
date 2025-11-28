import assert from 'node:assert'
import { evaluateHand, HandRank, determineWinner } from '@/lib/poker-engine'

{
  const ev = evaluateHand([
    { rank: 'A', suit: 's' },
    { rank: '2', suit: 'd' },
    { rank: '3', suit: 'c' },
    { rank: '4', suit: 'h' },
    { rank: '5', suit: 's' },
  ])
  assert(ev.rank === HandRank.Straight)
}

{
  const a = { id: 'a', name: 'a', chips: 0, cards: [{ rank: 'A', suit: 'h' }, { rank: 'K', suit: 'd' }], isFolded: false, bet: 0, isDealer: false, isTurn: false }
  const b = { id: 'b', name: 'b', chips: 0, cards: [{ rank: 'A', suit: 'c' }, { rank: 'Q', suit: 's' }], isFolded: false, bet: 0, isDealer: false, isTurn: false }
  const w = determineWinner([a, b], [
    { rank: 'A', suit: 'd' },
    { rank: 'A', suit: 's' },
    { rank: '7', suit: 'c' },
    { rank: '2', suit: 'h' },
    { rank: '3', suit: 'd' },
  ])
  assert(w.some(p => p.id === 'a'))
}

{
  const a = { id: 'a', name: 'a', chips: 0, cards: [{ rank: 'K', suit: 'h' }, { rank: 'Q', suit: 'd' }], isFolded: false, bet: 0, isDealer: false, isTurn: false }
  const b = { id: 'b', name: 'b', chips: 0, cards: [{ rank: 'K', suit: 'c' }, { rank: 'Q', suit: 's' }], isFolded: false, bet: 0, isDealer: false, isTurn: false }
  const w = determineWinner([a, b], [
    { rank: 'A', suit: 'd' },
    { rank: 'A', suit: 's' },
    { rank: 'K', suit: 'd' },
    { rank: 'Q', suit: 'h' },
    { rank: 'J', suit: 'd' },
  ])
  assert(w.length === 2)
}

console.log('engine-cases tests passed')
