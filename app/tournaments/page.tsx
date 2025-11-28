import { MOCK_TOURNAMENTS } from '@/lib/mock-data';
import { TournamentCard } from '@/components/TournamentCard';

export default function TournamentsPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-white mb-4">Tournaments</h1>
                    <p className="text-xl text-zinc-400">Compete for massive prize pools in our daily and weekly events.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_TOURNAMENTS.map((tournament) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                    ))}
                </div>
            </div>
        </div>
    );
}
