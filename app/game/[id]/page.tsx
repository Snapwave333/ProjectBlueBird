import { PokerTable } from '@/components/PokerTable';

export default async function GamePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div className="min-h-[calc(100vh-80px)] bg-zinc-950">
            <PokerTable gameId={id} />
        </div>
    );
}
