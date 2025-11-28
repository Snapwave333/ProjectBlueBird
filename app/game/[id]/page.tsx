import { PokerTable } from '@/components/PokerTable';

export default function GamePage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;
    return (
        <div className="min-h-[calc(100vh-80px)] bg-zinc-950">
            <PokerTable gameId={id} />
        </div>
    );
}
