'use client';

import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';

export const LandingHero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow z-0"></div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
                    <span className="text-purple-300 text-sm font-bold tracking-wide uppercase">The Future of Poker is Here</span>
                </div>

                <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter">
                    <span className="text-white">PLAY</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                        WITHOUT LIMITS
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                    Experience the first fully decentralized poker platform on Solana.
                    Instant payouts, provably fair dealing, and zero friction.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <Link href="/lobby" className="group relative px-8 py-4 bg-white text-black rounded-full font-black text-lg tracking-wide hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                        PLAY NOW
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 rounded-full bg-white blur-lg opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>
                    </Link>

                    <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 font-bold text-lg transition-colors flex items-center gap-2 backdrop-blur-sm">
                        <PlayCircle />
                        WATCH TRAILER
                    </button>
                </div>

                {/* Stats Strip */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
                    <div>
                        <div className="text-4xl font-black text-white mb-1">$2.5M+</div>
                        <div className="text-zinc-500 uppercase text-sm font-bold tracking-wider">Total Payouts</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white mb-1">50k+</div>
                        <div className="text-zinc-500 uppercase text-sm font-bold tracking-wider">Active Players</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white mb-1">0.5s</div>
                        <div className="text-zinc-500 uppercase text-sm font-bold tracking-wider">Finality</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white mb-1">100%</div>
                        <div className="text-zinc-500 uppercase text-sm font-bold tracking-wider">Decentralized</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
