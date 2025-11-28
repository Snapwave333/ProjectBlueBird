'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { User, DollarSign } from 'lucide-react';
import { BOT_DIFFICULTY } from '@/lib/config/bots'
import { countBots } from '@/lib/services/bot.service'
import { scoreStrength, decideBetting, progressStreet, resolveShowdown } from '@/lib/ai/poker-ai'
import { joinHuman, leaveHuman } from '@/lib/stores/lobby-store'
import { createDeck, dealCommunityCards, Card } from '@/lib/poker-engine'
import { recordAction } from '@/lib/ai/opponent-model'
import { getStats, recordLoss } from '@/lib/ai/risk-manager'
import { getStrategyParams } from '@/lib/ai/strategy-store'
import { StrategyAdmin } from '@/components/StrategyAdmin'

interface Player {
    id: string;
    name: string;
    chips: number;
    cards: string[];
    isTurn: boolean;
    position: number;
    isBot?: boolean;
}

export const PokerTable = ({ gameId }: { gameId: string }) => {
    const botCount = useMemo(() => countBots(gameId), [gameId])
    const initialPlayers: Player[] = useMemo(() => {
        const humans: Player[] = [
            { id: `${gameId}-human-1`, name: 'You', chips: 1000, cards: ['Ah', 'Kd'], isTurn: true, position: 0, isBot: false },
        ]
        const bots: Player[] = Array.from({ length: botCount }).map((_, i) => ({
            id: `${gameId}-bot-${i+1}`,
            name: `Bot #${i+1}`,
            chips: 800 + Math.floor(Math.random()*400),
            cards: ['Qs', 'Ts'],
            isTurn: false,
            position: (i % 2) + 1,
            isBot: true,
        }))
        return [...humans, ...bots]
    }, [botCount, gameId])
    const [players, setPlayers] = useState<Player[]>(initialPlayers);

    const [communityCards, setCommunityCards] = useState<string[]>([]);
    const [pot, setPot] = useState(150);
    const acting = useRef<NodeJS.Timeout | null>(null)
    const [stage, setStage] = useState<'preflop'|'flop'|'turn'|'river'|'showdown'>('preflop')
    const [deck, setDeck] = useState<Card[]>([])
    const [roundActions, setRoundActions] = useState(0)
    const [lastAction, setLastAction] = useState<{ playerId: string; action: 'fold'|'check'|'call'|'raise'|'bet' }|null>(null)

    function advanceTurn() {
        setPlayers(prev => {
            const idx = prev.findIndex(p => p.isTurn)
            const nextIdx = (idx + 1) % prev.length
            return prev.map((p, i) => ({ ...p, isTurn: i === nextIdx }))
        })
    }

    function performBotAction(bot: Player) {
        const idx = players.findIndex(p => p.id === bot.id)
        const pos = idx >= 0 ? idx : 0
        const { tier } = scoreStrength(bot.cards, communityCards, pos, players.length)
        const decision = decideBetting({ pot, betToCall: 0, bankroll: bot.chips, tier, street: stage, nPlayers: players.length, effectiveStack: bot.chips, sessionId: `${gameId}-${bot.id}`, prevAction: lastAction || undefined, opponentId: lastAction?.playerId })
        const amount = Math.floor(decision.amount || 0)
        if (decision.action === 'fold') {
            setPlayers(prev => prev.map(p => p.id === bot.id ? { ...p, cards: [] } : p))
        } else if (decision.action === 'bet' || decision.action === 'raise') {
            setPot(prev => prev + amount)
            setPlayers(prev => prev.map(p => p.id === bot.id ? { ...p, chips: Math.max(0, p.chips - amount) } : p))
            const maxLoss = getStrategyParams().risk.maxLoss
            recordLoss(`${gameId}-${bot.id}`, amount, maxLoss)
        }
        setLastAction({ playerId: bot.id, action: decision.action })
        recordAction(bot.id, decision.action, lastAction || undefined)
        setRoundActions(v => v + 1)
        advanceTurn()
    }

    useEffect(() => {
        joinHuman(gameId)
        const current = players.find(p => p.isTurn)
        if (!current) return
        if (current.isBot) performBotAction(current)
        return () => {
            if (acting.current) { clearTimeout(acting.current as any); acting.current = null }
            leaveHuman(gameId)
        }
    }, [players])

    useEffect(() => {
        if (deck.length === 0) {
            setDeck(createDeck())
        }
    }, [deck])

    useEffect(() => {
        if (roundActions >= players.length) {
            setRoundActions(0)
            const next = progressStreet(stage)
            setStage(next)
            if (next === 'flop' || next === 'turn' || next === 'river') {
                const res = dealCommunityCards(deck, next)
                setDeck(res.deck)
                setCommunityCards(prev => [...prev, ...res.cards.map(c => `${c.rank}${c.suit}`)])
            }
            if (next === 'showdown') {
                const winners = resolveShowdown(players.map(p => ({ id: p.id, cards: p.cards })), communityCards)
                if (winners.length > 0) {
                    const award = Math.floor(pot / winners.length)
                    setPlayers(prev => prev.map(p => winners.includes(p.id) ? { ...p, chips: p.chips + award } : p))
                }
                setPot(0)
            }
        }
    }, [roundActions, stage, deck, players, communityCards, pot])

    // Helper to render card visuals
    const renderCard = (cardCode: string) => {
        const rank = cardCode.slice(0, -1);
        const suit = cardCode.slice(-1);
        const isRed = suit === 'h' || suit === 'd';
        const suitIcon = suit === 'h' ? '♥' : suit === 'd' ? '♦' : suit === 'c' ? '♣' : '♠';

        return (
            <div className="w-10 h-14 bg-white rounded shadow-md border border-gray-200 flex flex-col items-center justify-center select-none transform hover:-translate-y-2 transition-transform duration-300">
                <span className={`text-xs font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>{rank}</span>
                <span className={`text-lg leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>{suitIcon}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] p-4">
            {/* Table Container */}
            <div className="relative w-full max-w-5xl aspect-[2/1] rounded-[100px] border-[16px] border-[#2d1b14] shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#35654d] overflow-visible">

                {/* Felt Texture & Vignette */}
                <div className="absolute inset-0 rounded-[84px] bg-[radial-gradient(circle_at_center,_#35654d_0%,_#1e3a2f_100%)] shadow-inner"></div>
                <div className="absolute inset-0 rounded-[84px] border-4 border-[#1a3329]/50"></div>

                {/* Community Cards & Pot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-10">
                    <div className="flex gap-3">
                        {communityCards.map((card, idx) => (
                            <div key={idx} className="transform transition-all hover:scale-110">
                                {renderCard(card)}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400 font-black text-2xl bg-black/40 px-6 py-2 rounded-full border border-yellow-500/30 shadow-lg backdrop-blur-sm">
                        <DollarSign size={24} className="text-yellow-500" />
                        <span>{pot}</span>
                    </div>
                </div>

                {/* Players */}
                {players.map((player) => (
                    <div
                        key={player.id}
                        className={`absolute flex flex-col items-center gap-3 transition-all duration-500 ${player.isTurn ? 'scale-110 z-20' : 'z-10 opacity-90'
                            }`}
                        style={{
                            top: player.position === 0 ? '85%' : player.position === 1 ? '35%' : '15%',
                            left: player.position === 0 ? '50%' : player.position === 1 ? '10%' : '85%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {/* Avatar */}
                        <div className={`relative w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-4 shadow-xl ${player.isTurn ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'border-zinc-600'}`}>
                            <User size={28} className="text-zinc-400" />
                            {player.isTurn && (
                                <div className="absolute -bottom-2 px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-bold rounded-full uppercase tracking-wider">
                                    Acting
                                </div>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-2 text-center min-w-[120px]">
                            <div className="font-bold text-sm text-white truncate max-w-[100px]">{player.name}{player.isBot ? ' (BOT)' : ''}</div>
                            <div className="text-green-400 text-xs font-mono font-bold flex items-center justify-center gap-1">
                                <DollarSign size={10} />
                                {player.chips}
                            </div>
                            {player.isBot && (
                              <div className="text-zinc-400 text-[10px] font-mono">
                                loss: {getStats(`${gameId}-${player.id}`).loss}
                              </div>
                            )}
                        </div>

                        {/* Cards */}
                        <div className="flex gap-1 -mt-1">
                            {player.cards.map((card, idx) => (
                                <div key={idx} className="transform origin-bottom transition-transform hover:-translate-y-2">
                                    {renderCard(card)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl z-50">
                <button className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 rounded-xl font-bold transition-all hover:scale-105 uppercase tracking-wide">Fold</button>
                <button className="px-8 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/50 text-blue-500 rounded-xl font-bold transition-all hover:scale-105 uppercase tracking-wide">Check</button>
                <button className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-green-500/20 uppercase tracking-wide">Bet 50</button>
            </div>
            <StrategyAdmin />
        </div>
    );
};
