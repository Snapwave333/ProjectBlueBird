export type BotDifficulty = 'easy' | 'medium' | 'hard'

export const BOT_ENABLED = process.env.NEXT_PUBLIC_BOTS_ENABLED === 'true'
export const BOT_MAX_PER_LOBBY = Number(process.env.NEXT_PUBLIC_BOT_MAX_PER_LOBBY || '3')
export const BOT_JOIN_THRESHOLD = Number(process.env.NEXT_PUBLIC_BOT_JOIN_THRESHOLD || '0')
export const BOT_LEAVE_THRESHOLD = Number(process.env.NEXT_PUBLIC_BOT_LEAVE_THRESHOLD || '2')
export const BOT_DIFFICULTY: BotDifficulty = (process.env.NEXT_PUBLIC_BOT_DIFFICULTY as BotDifficulty) || 'medium'
