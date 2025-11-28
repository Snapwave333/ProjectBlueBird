import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AppWalletProvider } from '@/components/WalletProvider';
import { Navbar } from '@/components/Navbar';
import { TransactionHistory } from '@/components/TransactionHistory';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: 'ANTE Poker | Web3 Texas Hold\'em',
    description: 'The premier Web3 poker platform on Solana.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="font-sans antialiased selection:bg-pink-500/30">
                <div className="fixed inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20"></div>
                <AppWalletProvider>
                    <Navbar />
                    <TransactionHistory />
                    <main className="relative z-10">
                        {children}
                    </main>
                </AppWalletProvider>
            </body>
        </html>
    );
}
