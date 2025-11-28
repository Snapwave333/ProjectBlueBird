'use client';

import { Trophy, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    username: string;
    earnings: number;
    avatar: string;
    winRate: string;
}

export const LeaderboardTable = ({ entries }: { entries: LeaderboardEntry[] }) => {
    return (
        <div className="bg-surface/50 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                        <th className="p-6 text-zinc-400 font-bold uppercase text-sm tracking-wider">Rank</th>
                        <th className="p-6 text-zinc-400 font-bold uppercase text-sm tracking-wider">Player</th>
                        <th className="p-6 text-zinc-400 font-bold uppercase text-sm tracking-wider text-right">Win Rate</th>
                        <th className="p-6 text-zinc-400 font-bold uppercase text-sm tracking-wider text-right">Total Earnings</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => (
                        <tr key={entry.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                            <td className="p-6">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-black ${entry.rank === 1 ? 'bg-yellow-500 text-black shadow-glow' :
                                        entry.rank === 2 ? 'bg-zinc-400 text-black' :
                                            entry.rank === 3 ? 'bg-amber-700 text-white' :
                                                'bg-zinc-800 text-zinc-400'
                                    }`}>
                                    {entry.rank}
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{entry.avatar}</span>
                                    <span className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">{entry.username}</span>
                                </div>
                            </td>
                            <td className="p-6 text-right">
                                <div className="flex items-center justify-end gap-2 text-green-400 font-bold">
                                    <TrendingUp size={16} />
                                    {entry.winRate}
                                </div>
                            </td>
                            <td className="p-6 text-right">
                                <span className="font-mono font-bold text-white text-xl">${entry.earnings.toLocaleString()}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
