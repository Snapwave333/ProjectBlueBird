import { MOCK_LEADERBOARD } from '@/lib/mock-data';
import { LeaderboardTable } from '@/components/LeaderboardTable';

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-white mb-4">Global Rankings</h1>
                    <p className="text-xl text-zinc-400">The top performing players on the ANTE platform.</p>
                </div>

                <LeaderboardTable entries={MOCK_LEADERBOARD} />
            </div>
        </div>
    );
}
