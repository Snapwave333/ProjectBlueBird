"use client";
import React, { useState } from 'react'
import { getStrategyParams, updateStrategyParams } from '@/lib/ai/strategy-store'

export function StrategyAdmin() {
  const p = getStrategyParams()
  const [low, setLow] = useState(p.spr.low)
  const [high, setHigh] = useState(p.spr.high)
  const [maxLoss, setMaxLoss] = useState(p.risk.maxLoss)
  function apply() { updateStrategyParams({ spr: { ...p.spr, low, high }, risk: { maxLoss } } as any) }
  return (
    <div className="fixed top-24 right-6 bg-black/60 border border-white/10 rounded-xl p-3 z-50">
      <div className="text-white text-sm font-bold mb-2">Strategy Admin</div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-zinc-400 text-xs">SPR Low</span>
        <input type="number" value={low} onChange={e=>setLow(Number(e.target.value))} className="w-16 bg-zinc-900 text-white border border-zinc-800 rounded px-2 py-1" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-zinc-400 text-xs">SPR High</span>
        <input type="number" value={high} onChange={e=>setHigh(Number(e.target.value))} className="w-16 bg-zinc-900 text-white border border-zinc-800 rounded px-2 py-1" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-zinc-400 text-xs">Max Loss</span>
        <input type="number" value={maxLoss} onChange={e=>setMaxLoss(Number(e.target.value))} className="w-24 bg-zinc-900 text-white border border-zinc-800 rounded px-2 py-1" />
      </div>
      <button onClick={apply} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded">Apply</button>
    </div>
  )
}
