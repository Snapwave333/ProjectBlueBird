'use client';
import { ProfileStats } from '@/components/ProfileStats';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { createUser, getUser, assignRole, UserRecord } from '@/lib/user-store';

export default function ProfilePage() {
    const { publicKey } = useWallet();
    const [user, setUser] = useState<UserRecord | null>(null);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!publicKey) { setUser(null); return; }
            const u = await getUser(publicKey.toBase58());
            if (u && process.env.NEXT_PUBLIC_DEVELOPER_WALLET === publicKey.toBase58() && u.role !== 'developer') {
                await assignRole(publicKey.toBase58(), 'developer');
                const updated = await getUser(publicKey.toBase58());
                setUser(updated);
                return;
            }
            setUser(u);
        };
        load();
    }, [publicKey]);

    const onCreate = async () => {
        if (!publicKey || !username.trim()) return;
        setLoading(true);
        const u = await createUser(publicKey.toBase58(), username.trim());
        setUser(u);
        setLoading(false);
    };

    return (
        <div className="min-h-screen py-12 px-6">
            {!publicKey && (
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold mb-2">Connect your wallet</h2>
                    <p className="text-zinc-400">Connect Phantom or Solflare to manage your account.</p>
                </div>
            )}
            {publicKey && !user && (
                <div className="max-w-xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Create your account</h2>
                    <div className="flex gap-3">
                        <input
                            className="flex-1 px-4 py-2 rounded bg-zinc-900 border border-zinc-800 text-white"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button
                            className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={onCreate}
                            disabled={loading}
                        >{loading ? 'Creating…' : 'Create'}</button>
                    </div>
                </div>
            )}
            {publicKey && user && (
                <ProfileStats stats={{
                    username: user.username,
                    walletAddress: user.walletAddress,
                    totalEarnings: user.totalEarnings,
                    handsPlayed: user.handsPlayed,
                    bestHand: user.bestHand || '—',
                    tournamentsWon: user.tournamentsWon || 0,
                    recentActivity: [],
                }} />
            )}
        </div>
    );
}
