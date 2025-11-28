'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    type?: 'wallet' | 'transaction' | 'game' | 'default';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    message,
    type = 'default'
}) => {
    if (!isLoading) return null;

    const messages = {
        wallet: message || 'Connecting to wallet...',
        transaction: message || 'Processing transaction...',
        game: message || 'Loading game...',
        default: message || 'Loading...'
    };

    const getGradient = () => {
        switch (type) {
            case 'wallet':
                return 'from-purple-500/20 to-pink-500/20';
            case 'transaction':
                return 'from-green-500/20 to-blue-500/20';
            case 'game':
                return 'from-yellow-500/20 to-red-500/20';
            default:
                return 'from-purple-500/20 to-blue-500/20';
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className={`relative bg-gradient-to-br ${getGradient()} p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl`}>
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-20 blur-xl animate-pulse"></div>

                {/* Content */}
                <div className="relative flex flex-col items-center gap-4">
                    {/* Spinner */}
                    <div className="relative">
                        <Loader2 size={48} className="text-white animate-spin" />
                        <div className="absolute inset-0 blur-lg bg-white/20 rounded-full animate-pulse"></div>
                    </div>

                    {/* Message */}
                    <div className="text-center">
                        <p className="text-white font-semibold text-lg">{messages[type]}</p>
                        <p className="text-zinc-400 text-sm mt-1">Please wait...</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { width: 0%; margin-left: 0%; }
                    50% { width: 75%; }
                    100% { width: 0%; margin-left: 100%; }
                }
            `}</style>
        </div>
    );
};

// Hook for managing loading states
export const useLoading = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [message, setMessage] = React.useState<string>('');
    const [type, setType] = React.useState<LoadingOverlayProps['type']>('default');

    const startLoading = (msg?: string, loadingType?: LoadingOverlayProps['type']) => {
        setMessage(msg || '');
        setType(loadingType || 'default');
        setIsLoading(true);
    };

    const stopLoading = () => {
        setIsLoading(false);
        setMessage('');
    };

    return {
        isLoading,
        message,
        type,
        startLoading,
        stopLoading,
        LoadingComponent: () => (
            <LoadingOverlay isLoading={isLoading} message={message} type={type} />
        )
    };
};
