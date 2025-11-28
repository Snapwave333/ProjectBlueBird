'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { CheckCircle2, XCircle, Clock, ExternalLink, X, DollarSign } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';

export interface Transaction {
    signature: string;
    type: 'buy-in' | 'payout' | 'transfer';
    amount: number;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: number;
    blockTime?: number;
}

export const TransactionHistory = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch transaction history when wallet connects
    useEffect(() => {
        if (publicKey) {
            fetchTransactions();
        } else {
            setTransactions([]);
        }
    }, [publicKey]);

    const fetchTransactions = async () => {
        if (!publicKey) return;

        setIsLoading(true);
        try {
            // Fetch last 5 transactions for this wallet
            const signatures = await connection.getSignaturesForAddress(
                publicKey,
                { limit: 5 }
            );

            const txData: Transaction[] = signatures.map(sig => ({
                signature: sig.signature,
                type: 'transfer', // In production, parse memo to determine type
                amount: 0, // Would parse from transaction details
                status: sig.confirmationStatus === 'finalized' ? 'confirmed' :
                    sig.err ? 'failed' : 'pending',
                timestamp: (sig.blockTime || Date.now() / 1000) * 1000,
                blockTime: sig.blockTime || undefined,
            }));

            setTransactions(txData);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: Transaction['status']) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle2 size={16} className="text-green-500" />;
            case 'failed':
                return <XCircle size={16} className="text-red-500" />;
            case 'pending':
                return <Clock size={16} className="text-yellow-500 animate-spin" />;
        }
    };

    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500/10 text-green-500 border-green-500/30';
            case 'failed':
                return 'bg-red-500/10 text-red-500 border-red-500/30';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
        }
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    };

    const getExplorerUrl = (signature: string) => {
        // Use Solana Explorer (devnet)
        return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    };

    if (!publicKey) return null;

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed right-6 top-24 z-50 p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-white/20"
                aria-label="Transaction History"
            >
                <div className="relative">
                    <DollarSign size={20} className="text-white" />
                    {transactions.some(tx => tx.status === 'pending') && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    )}
                </div>
            </button>

            {/* Sidebar Panel */}
            <div
                className={`fixed right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Transaction History</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-zinc-400" />
                    </button>
                </div>

                {/* Transaction List */}
                <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-80px)]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center text-zinc-500 mt-12">
                            <DollarSign size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-sm">No transactions yet</p>
                            <p className="text-xs mt-2">Your transaction history will appear here</p>
                        </div>
                    ) : (
                        transactions.map((tx) => (
                            <div
                                key={tx.signature}
                                className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition-all group"
                            >
                                {/* Status Badge */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(tx.status)}`}>
                                        {getStatusIcon(tx.status)}
                                        <span className="capitalize">{tx.status}</span>
                                    </div>
                                    <span className="text-xs text-zinc-500">{formatTimestamp(tx.timestamp)}</span>
                                </div>

                                {/* Transaction Type */}
                                <div className="text-sm font-semibold text-white capitalize mb-1">
                                    {tx.type.replace('-', ' ')}
                                </div>

                                {/* Amount (if available) */}
                                {tx.amount > 0 && (
                                    <div className="text-lg font-bold text-green-400 mb-2">
                                        +{tx.amount} ANTE
                                    </div>
                                )}

                                {/* Signature */}
                                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                                    <span className="truncate flex-1">
                                        {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                                    </span>
                                    <a
                                        href={getExplorerUrl(tx.signature)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <ExternalLink size={14} className="text-purple-400" />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Refresh Button */}
                    {transactions.length > 0 && (
                        <button
                            onClick={fetchTransactions}
                            disabled={isLoading}
                            className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    )}
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
                ></div>
            )}
        </>
    );
};
