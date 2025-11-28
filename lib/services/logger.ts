type LogMeta = Record<string, unknown> | undefined;

function fmt(msg: string, meta?: LogMeta) {
  return meta ? `${msg} ${JSON.stringify(meta)}` : msg;
}

export const logger = {
  info(msg: string, meta?: LogMeta) {
    console.info(fmt(msg, meta));
  },
  warn(msg: string, meta?: LogMeta) {
    console.warn(fmt(msg, meta));
  },
  error(msg: string, meta?: LogMeta) {
    console.error(fmt(msg, meta));
  },
  debug(msg: string, meta?: LogMeta) {
    if (process.env.DEBUG === 'true') {
      console.debug(fmt(msg, meta));
    }
  },
  antiCheat(event: string, playerId: string, message: string, score?: number) {
    console.warn(fmt(`[anti-cheat] ${event} pid=${playerId} ${message}${score !== undefined ? ` score=${score}` : ''}`));
  }
};
