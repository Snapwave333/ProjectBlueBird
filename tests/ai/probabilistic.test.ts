import assert from 'node:assert'
import { createDeck, evaluateHand, Card } from '@/lib/poker-engine'

function parse(s: string): Card { return { rank: s[0] as any, suit: s[1] as any } }

{
  const flop = ['Ah','Kh','7d'].map(parse)
  const hero = ['Qh','Jh'].map(parse)
  const deck = createDeck().filter(c => ![...flop, ...hero].some(d => d.rank === c.rank && d.suit === c.suit))
  let wins = 0
  for (let i=0;i<Math.min(40, deck.length-2);i++) {
    const turn = deck[i]
    const river = deck[i+1]
    const ev = evaluateHand([...hero, ...flop, turn, river])
    if (ev.rank >= 5) wins++
  }
  assert(wins >= 5)
}

console.log('probabilistic tests passed')
