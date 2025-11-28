'use client';

import Link from 'next/link';
import { Users, DollarSign, Play, Trophy, Bot } from 'lucide-react';
import { subscribe, ensureTicker, Lobby } from '@/lib/stores/lobby-store'
import { useEffect, useState } from 'react'

export const GameLobby = () => {
    const [games, setGames] = useState<Lobby[]>([])
    useEffect(() => {
        const unsub = subscribe(setGames)
        ensureTicker()
        return () => unsub()
    }, [])
    return (
        <div className="p-6 max-w-7xl mx-auto mt-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-5xl font-black text-white mb-2 tracking-tight">Lobby</h1>
                    <p className="text-zinc-400 text-lg">Join a table and start winning $ANTE.</p>
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all shadow-glow hover:scale-105 flex items-center gap-2">
                    <Trophy size={20} />
                    Create Table
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {games.map((game, idx) => (
                    <div
                        key={game.id}
                        className="group relative bg-surface/50 border border-white/5 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/20 overflow-hidden"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs font-bold text-purple-400 mb-2 border border-white/5">
                                        {game.type}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all">
                                        {game.name}
                                    </h3>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                    <DollarSign className="text-zinc-400 group-hover:text-purple-400" size={24} />
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Buy-in</span>
                                    <span className="text-white font-mono font-bold">${game.minBuyIn}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Blinds</span>
                                    <span className="text-white font-mono font-bold">${game.blinds}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Players</span>
                                    <span className="flex items-center gap-1 text-white font-bold">
                                        <Users size={14} className="text-zinc-500" />
                                        {game.players}/{game.maxPlayers}
                                    </span>
                                </div>
                                {game.bots > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Bots</span>
                                    <span className="flex items-center gap-1 text-purple-400 font-bold">
                                      <Bot size={14} />
                                      {game.bots}
                                    </span>
                                  </div>
                                )}

                                {/* Progress bar for players */}
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        style={{ width: `${(game.players / game.maxPlayers) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <Link
                                href={`/game/${game.id}`}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group-hover:bg-purple-600 group-hover:border-purple-500 group-hover:shadow-glow"
                            >
                                <Play size={18} />
                                Join Table
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
