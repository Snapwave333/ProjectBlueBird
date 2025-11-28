import { BOT_DIFFICULTY } from '@/lib/config/bots'

type Bot = { id: string, lobbyId: string, level: 'easy'|'medium'|'hard', lastActionAt: number }

const bots: Bot[] = []

function rand(min: number, max: number) { return Math.floor(Math.random()*(max-min+1))+min }
export function delayFor(level: Bot['level']) {
  if (level === 'easy') return rand(1200, 2400)
  if (level === 'hard') return rand(400, 900)
  return rand(800, 1600)
}

export function startBots(lobbyId: string, count: number) {
  for (let i=0;i<count;i++) {
    bots.push({ id: `${lobbyId}-bot-${Date.now()}-${i}`, lobbyId, level: BOT_DIFFICULTY, lastActionAt: Date.now() })
  }
}

export function stopBots(lobbyId: string, count: number) {
  let removed = 0
  for (let i=bots.length-1;i>=0 && removed<count;i--) {
    if (bots[i].lobbyId === lobbyId) { bots.splice(i,1); removed++ }
  }
}

export function tickBots() {
  const now = Date.now()
  for (const b of bots) {
    const wait = delayFor(b.level)
    if (now - b.lastActionAt >= wait) {
      b.lastActionAt = now
    }
  }
}

export function countBots(lobbyId: string) {
  return bots.filter(b => b.lobbyId === lobbyId).length
}
