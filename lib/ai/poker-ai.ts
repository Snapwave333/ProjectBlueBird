import { HandEvaluation, HandRank, evaluateHand, calculatePotOdds, determineWinner, Card, GameState, Player, nextStage } from '../poker-engine.ts'
import { logger } from '../logger.ts'
import { getStrategyParams } from './strategy-store'
import { startSession, recordLoss, getStats } from './risk-manager'
import { getAggression, getCheckRaiseFreq } from './opponent-model'

export type StrengthTier = 'weak' | 'moderate' | 'strong'

type CacheKey = string
const decisionCache = new Map<CacheKey, { tier: StrengthTier; score: number }>()
const MAX_CACHE = 5000

function parseCard(s: string): Card {
  const rank = s[0] as Card['rank']
  const suit = s[1] as Card['suit']
  return { rank, suit }
}

export function scoreStrength(hole: string[], community: string[], position: number, totalPlayers: number): { score: number; tier: StrengthTier; eval?: HandEvaluation } {
  const key = `${hole.sort().join(',')}|${community.sort().join(',')}|${position}|${totalPlayers}`
  const cached = decisionCache.get(key)
  if (cached) return { score: cached.score, tier: cached.tier }

  let base = 0
  let evaln: HandEvaluation | undefined
  if (community.length >= 3) {
    evaln = evaluateHand([...hole, ...community].map(parseCard))
    base = evaln.value * 10
    const topKicker = evaln.kickers[0] || 0
    base += Math.min(10, Math.floor(topKicker / 2))
  } else {
    const [c1, c2] = hole
    const r = (s: string) => s[0]
    const suitsEqual = c1[1] === c2[1]
    const ranks = [r(c1), r(c2)].sort()
    const premium = ['A','K','Q','J']
    const highCount = ranks.filter(x => premium.includes(x)).length
    const pair = r(c1) === r(c2)
    base = 20
    if (pair) base += { 'A': 50, 'K': 45, 'Q': 40, 'J': 35, 'T': 30 }[r(c1)] || 20
    else {
      base += highCount * 10
      if (suitsEqual) base += 5
      const order = "23456789TJQKA"
      const gap = Math.abs(order.indexOf(ranks[1]) - order.indexOf(ranks[0]))
      if (gap === 0) base += 8
      else if (gap === 1) base += 6
      else if (gap === 2) base += 3
      const hiBroadway = new Set(['T','J','Q','K','A'])
      if (gap <= 1 && hiBroadway.has(ranks[0]) && hiBroadway.has(ranks[1])) {
        base += 8
      }
    }
  }

  const posFactor = Math.min(1.15, 0.85 + (position / Math.max(1, totalPlayers)) * 0.3)
  let score = Math.round(base * posFactor)
  score = Math.max(0, Math.min(100, score))

  let tier: StrengthTier = 'weak'
  if (score >= 65) tier = 'strong'
  else if (score >= 40) tier = 'moderate'

  if (decisionCache.size >= MAX_CACHE) {
    const first = decisionCache.keys().next().value
    if (first) decisionCache.delete(first)
  }
  decisionCache.set(key, { score, tier })

  logger.debug('ai-strength', { score, tier, rank: evaln ? HandRank[evaln.rank] : 'preflop', pos: position, players: totalPlayers })
  return { score, tier, eval: evaln }
}

export type Street = GameState['stage']

export type Decision = { action: 'fold' | 'check' | 'call' | 'raise' | 'bet'; amount?: number }

function computeSPR(pot: number, effectiveStack: number) {
  if (pot <= 0) return Infinity
  return Number((effectiveStack / pot).toFixed(2))
}

function classifyBoard(community: string[]) {
  if (community.length < 3) return 'unknown'
  const suits = community.map(c => c[1])
  const suitCounts = new Map<string, number>()
  for (const s of suits) suitCounts.set(s, (suitCounts.get(s) || 0) + 1)
  const flushy = Array.from(suitCounts.values()).some(v => v >= 3)
  const order = "23456789TJQKA"
  const ranks = community.map(c => c[0]).map(r => order.indexOf(r)).sort((a,b)=>a-b)
  let consecutive = 0
  for (let i=1;i<ranks.length;i++) if (ranks[i]-ranks[i-1]===1) consecutive++
  const straighty = consecutive >= 2
  if (flushy && straighty) return 'wet'
  if (flushy || straighty) return 'semi'
  return 'dry'
}

function impliedOddsBonus(hole: string[], community: string[], street: Street) {
  const params = getStrategyParams()
  const [a, b] = hole
  const suited = a[1] === b[1]
  const ranks = [a[0], b[0]]
  const connectors = Math.abs("23456789TJQKA".indexOf(ranks[0]) - "23456789TJQKA".indexOf(ranks[1])) <= 1
  let bonus = 0
  if (suited && connectors) bonus += params.impliedOdds.suitedConnectorBonus
  if (ranks[0] === ranks[1]) bonus += params.impliedOdds.setMiningBonus
  if (community.length >= 3) {
    const s = community.join('')
    const flushDraw = community.filter(c => c[1] === a[1]).length >= 2
    const straightHints = /A|K|Q|J|T/.test(s)
    if (flushDraw) bonus += params.impliedOdds.flushDrawBonus
    if (straightHints) bonus += params.impliedOdds.straightDrawBonus
    const cls = classifyBoard(community)
    if (cls === 'wet') bonus += 0.05
    if (cls === 'dry') bonus -= 0.02
  }
  return bonus
}

export function decideBetting({ pot, betToCall, bankroll, tier, street, nPlayers, effectiveStack, sessionId, prevAction, opponentId }:
  { pot: number; betToCall: number; bankroll: number; tier: StrengthTier; street: Street; nPlayers?: number; effectiveStack?: number; sessionId?: string; prevAction?: { playerId: string; action: Decision['action'] }; opponentId?: string }): Decision {
  if (sessionId) startSession(sessionId)
  const risk = sessionId ? getStats(sessionId) : { loss: 0, terminated: false }
  if (risk.terminated) return { action: 'fold' }

  const spr = computeSPR(pot, effectiveStack ?? bankroll)
  const potOdds = calculatePotOdds(pot, betToCall)
  const params = getStrategyParams()
  const basePct = street === 'showdown' ? 0 : params.betSizing[street][tier]
  let pct = basePct
  if (spr <= params.spr.low) pct += 0.1
  else if (spr >= params.spr.high) pct -= 0.1
  if ((nPlayers ?? 2) > 2) pct -= 0.1
  pct = Math.max(0, Math.min(0.95, pct))

  const amount = Math.min(bankroll, Math.floor(pot * pct))
  const oppAgg = opponentId ? getAggression(opponentId) : 0.2
  const shouldCr = prevAction && (prevAction.action === 'bet' || prevAction.action === 'raise') && oppAgg > 0.5 && spr <= 6
  if (tier === 'weak') {
    if (betToCall === 0) return { action: 'check' }
    return potOdds > 0.25 ? { action: 'fold' } : { action: 'call', amount: Math.min(betToCall, bankroll) }
  }
  if (tier === 'moderate') {
    if (betToCall === 0) return amount > 0 ? { action: 'bet', amount } : { action: 'check' }
    if (shouldCr) return { action: 'raise', amount: Math.max(Math.min(Math.floor(pot * 0.6), bankroll), betToCall * 3) }
    if (potOdds < 0.3) return { action: 'raise', amount: Math.max(Math.min(betToCall * 3, bankroll), amount) }
    return { action: 'call', amount: Math.min(betToCall, bankroll) }
  }
  if (betToCall === 0) return amount > 0 ? { action: 'bet', amount } : { action: 'check' }
  return { action: 'raise', amount: Math.max(Math.min(Math.floor(pot * 0.75), bankroll), betToCall * 3) }
}

export function progressStreet(stage: Street): Street {
  return nextStage(stage)
}

export function resolveShowdown(players: { id: string; cards: string[] }[], community: string[]) {
  const enginePlayers: Player[] = players.map(p => ({ id: p.id, name: p.id, chips: 0, cards: p.cards.map(parseCard), isFolded: false, bet: 0, isDealer: false, isTurn: false }))
  const winners = determineWinner(enginePlayers, community.map(parseCard))
  return winners.map(w => w.id)
}
