import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GameDay',
  description: 'Your ultimate portal for everything gaming.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text`}>
        <AuthProvider>
          <nav className="bg-surface p-6">
            <div className="container mx-auto flex justify-around items-center">
              <Link href="/" className="text-primary text-3xl font-bold">GameDay</Link>
              <div className="space-x-8">
                <Link href="/tournaments" className="text-text hover:text-primary transition-colors">Tournaments</Link>
                <Link href="/merch" className="text-text hover:text-primary transition-colors">Merch</Link>
                <Link href="/profile" className="text-text hover:text-primary transition-colors">Profile</Link>
                <Link href="/login" className="text-text hover:text-primary transition-colors">Login</Link>
                <Link href="/signup" className="text-text hover:text-primary transition-colors">Sign Up</Link>
              </div>
            </div>
          </nav>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
