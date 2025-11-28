type SessionStats = { loss: number; terminated: boolean }

const sessions = new Map<string, SessionStats>()

export function startSession(id: string) {
  if (!sessions.has(id)) sessions.set(id, { loss: 0, terminated: false })
}

export function recordLoss(id: string, amount: number, maxLoss: number) {
  const s = sessions.get(id) || { loss: 0, terminated: false }
  s.loss += Math.max(0, amount)
  if (s.loss >= maxLoss) s.terminated = true
  sessions.set(id, s)
  return s
}

export function getStats(id: string) {
  return sessions.get(id) || { loss: 0, terminated: false }
}
