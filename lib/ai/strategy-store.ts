import { STRATEGY_PARAMS } from './strategy-config'

type Params = typeof STRATEGY_PARAMS
let current: Params = JSON.parse(JSON.stringify(STRATEGY_PARAMS))

export function getStrategyParams(): Params { return current }
export function updateStrategyParams(partial: Partial<Params>) {
  current = { ...current, ...partial, betSizing: { ...current.betSizing, ...(partial as any).betSizing } }
}
