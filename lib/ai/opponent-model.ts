type Action = 'fold' | 'check' | 'call' | 'raise' | 'bet'

type Stats = { actions: number; aggressive: number; checkRaises: number }
const stats = new Map<string, Stats>()

export function recordAction(playerId: string, action: Action, prevAction?: { playerId: string; action: Action }) {
  const s = stats.get(playerId) || { actions: 0, aggressive: 0, checkRaises: 0 }
  s.actions += 1
  if (action === 'raise' || action === 'bet') s.aggressive += 1
  if ((prevAction?.action === 'bet' || prevAction?.action === 'raise') && action === 'raise') s.checkRaises += 1
  stats.set(playerId, s)
}

export function getAggression(playerId: string): number {
  const s = stats.get(playerId) || { actions: 0, aggressive: 0, checkRaises: 0 }
  if (s.actions === 0) return 0.2
  return Number((s.aggressive / s.actions).toFixed(2))
}

export function getCheckRaiseFreq(playerId: string): number {
  const s = stats.get(playerId) || { actions: 0, aggressive: 0, checkRaises: 0 }
  if (s.actions === 0) return 0.05
  return Number((s.checkRaises / s.actions).toFixed(2))
}
