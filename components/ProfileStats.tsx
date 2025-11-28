'use client';

import { Wallet, Clock, Trophy, TrendingUp } from 'lucide-react';

interface UserStats {
    username: string;
    walletAddress: string;
    totalEarnings: number;
    handsPlayed: number;
    bestHand: string;
    tournamentsWon: number;
    recentActivity: { id: number; type: string; result: string; date: string }[];
}

export const ProfileStats = ({ stats }: { stats: UserStats }) => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-surface/50 border border-white/5 rounded-2xl p-8 mb-8 flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl shadow-glow">
                    😎
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">{stats.username}</h1>
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/10">
                        <Wallet size={16} className="text-purple-400" />
                        <span className="font-mono text-zinc-400">{stats.walletAddress}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface/50 border border-white/5 p-6 rounded-xl text-center hover:border-purple-500/50 transition-colors">
                    <div className="text-zinc-400 text-sm font-bold uppercase mb-2">Total Earnings</div>
                    <div className="text-3xl font-black text-green-400">${stats.totalEarnings.toLocaleString()}</div>
                </div>
                <div className="bg-surface/50 border border-white/5 p-6 rounded-xl text-center hover:border-purple-500/50 transition-colors">
                    <div className="text-zinc-400 text-sm font-bold uppercase mb-2">Hands Played</div>
                    <div className="text-3xl font-black text-white">{stats.handsPlayed}</div>
                </div>
                <div className="bg-surface/50 border border-white/5 p-6 rounded-xl text-center hover:border-purple-500/50 transition-colors">
                    <div className="text-zinc-400 text-sm font-bold uppercase mb-2">Best Hand</div>
                    <div className="text-3xl font-black text-purple-400">{stats.bestHand}</div>
                </div>
                <div className="bg-surface/50 border border-white/5 p-6 rounded-xl text-center hover:border-purple-500/50 transition-colors">
                    <div className="text-zinc-400 text-sm font-bold uppercase mb-2">Tournaments Won</div>
                    <div className="text-3xl font-black text-yellow-400">{stats.tournamentsWon}</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-surface/50 border border-white/5 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Clock className="text-zinc-400" />
                    Recent Activity
                </h3>
                <div className="space-y-4">
                    {stats.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${activity.type === 'Tournament' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                    {activity.type === 'Tournament' ? <Trophy size={20} /> : <TrendingUp size={20} />}
                                </div>
                                <span className="font-bold text-white">{activity.type}</span>
                            </div>
                            <div className="text-right">
                                <div className={`font-mono font-bold ${activity.result.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                    {activity.result}
                                </div>
                                <div className="text-xs text-zinc-500">{activity.date}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
