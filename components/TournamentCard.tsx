'use client';

import { Calendar, Users, DollarSign, Trophy } from 'lucide-react';

interface TournamentProps {
    name: string;
    prizePool: number;
    buyIn: number;
    startTime: string;
    registered: number;
    status: string;
    image: string;
}

export const TournamentCard = ({ tournament }: { tournament: TournamentProps }) => {
    return (
        <div className="group relative bg-surface/50 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
            <div className="h-48 bg-zinc-800 relative overflow-hidden">
                {/* Placeholder for image - using gradient for now */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy size={64} className="text-white/10 group-hover:text-white/20 transition-colors" />
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10">
                    {tournament.status}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">{tournament.name}</h3>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <DollarSign size={16} className="text-green-500" />
                            <span>Prize Pool</span>
                        </div>
                        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            ${tournament.prizePool.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Calendar size={16} className="text-blue-500" />
                            <span>Start Time</span>
                        </div>
                        <span className="text-white font-medium">{tournament.startTime}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Users size={16} className="text-purple-500" />
                            <span>Registered</span>
                        </div>
                        <span className="text-white font-medium">{tournament.registered}</span>
                    </div>
                </div>

                <button className="w-full mt-6 py-3 bg-white/5 hover:bg-purple-600 border border-white/10 hover:border-purple-500 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                    Register for ${tournament.buyIn}
                </button>
            </div>
        </div>
    );
};
