'use client';

import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-lg border border-white/10 border-b-0 border-b-white/5">
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                <Link href="/" className="group flex items-center gap-2">
                    <div className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 group-hover:animate-pulse-slow">
                        ANTE
                    </div>
                    <div className="text-sm font-medium text-zinc-400 tracking-widest uppercase mt-1">Poker</div>
                </Link>

                <div className="flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors tracking-wide uppercase">
                        Lobby
                    </Link>
                    <Link href="/tournaments" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors tracking-wide uppercase">
                        Tournaments
                    </Link>
                    <Link href="/leaderboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors tracking-wide uppercase">
                        Leaderboard
                    </Link>
                    <Link href="/profile" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors tracking-wide uppercase">
                        Profile
                    </Link>
                    <div className="transform hover:scale-105 transition-transform">
                        <WalletMultiButton style={{
                            backgroundColor: '#7c3aed',
                            backgroundImage: 'linear-gradient(to right, #7c3aed, #db2777)',
                            borderRadius: '0.75rem',
                            fontWeight: '600',
                            fontFamily: 'Outfit, sans-serif'
                        }} />
                    </div>
                </div>
            </div>
        </nav>
    );
};
