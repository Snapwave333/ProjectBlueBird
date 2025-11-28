import { BOT_ENABLED, BOT_MAX_PER_LOBBY, BOT_JOIN_THRESHOLD, BOT_LEAVE_THRESHOLD } from '@/lib/config/bots'
import { startBots, stopBots, tickBots } from '@/lib/services/bot.service'

export type Lobby = {
  id: string
  name: string
  players: number
  maxPlayers: number
  minBuyIn: number
  blinds: string
  type: 'Cash Game' | 'Tournament'
  bots: number
}

let lobbies: Lobby[] = [
  { id: 'A', name: 'High Rollers', players: 0, maxPlayers: 9, minBuyIn: 1000, blinds: '10/20', type: 'Cash Game', bots: 0 },
  { id: 'B', name: 'Casual Friday', players: 0, maxPlayers: 9, minBuyIn: 100, blinds: '1/2', type: 'Cash Game', bots: 0 },
  { id: 'C', name: "Beginner's Luck", players: 0, maxPlayers: 9, minBuyIn: 50, blinds: '0.5/1', type: 'Cash Game', bots: 0 },
]

type Sub = (next: Lobby[]) => void
const subs: Set<Sub> = new Set()

function notify() {
  const snapshot = [...lobbies]
  subs.forEach(s => s(snapshot))
}

export function subscribe(fn: Sub) {
  subs.add(fn)
  fn([...lobbies])
  return () => { subs.delete(fn) }
}

export function getLobbies() {
  return [...lobbies]
}

export function joinHuman(lobbyId: string) {
  const l = lobbies.find(x => x.id === lobbyId)
  if (!l) return
  l.players = Math.min(l.players + 1, l.maxPlayers)
  if (BOT_ENABLED && l.players >= BOT_LEAVE_THRESHOLD && l.bots > 0) {
    const toRemove = Math.min(l.players, l.bots)
    l.bots = Math.max(0, l.bots - toRemove)
    stopBots(lobbyId, toRemove)
  }
  notify()
}

export function leaveHuman(lobbyId: string) {
  const l = lobbies.find(x => x.id === lobbyId)
  if (!l) return
  l.players = Math.max(0, l.players - 1)
  notify()
}

export function tick() {
  if (!BOT_ENABLED) return
  for (const l of lobbies) {
    const empty = l.players === 0
    if (empty && l.bots === 0 && BOT_JOIN_THRESHOLD === 0) {
      const spawn = Math.min(BOT_MAX_PER_LOBBY, l.maxPlayers)
      l.bots = spawn
      startBots(l.id, spawn)
    }
    if (l.players > 0 && l.bots > 0) {
      const scaleDown = Math.min(l.players, l.bots)
      l.bots = Math.max(0, l.bots - scaleDown)
      stopBots(l.id, scaleDown)
    }
  }
  tickBots()
  notify()
}

let ticking = false
export function ensureTicker() {
  if (ticking) return
  ticking = true
  const loop = () => {
    tick()
    setTimeout(loop, 2000)
  }
  loop()
}
