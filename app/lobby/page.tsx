import { GameLobby } from '@/components/GameLobby';

export default function LobbyPage() {
    return (
        <div className="min-h-[calc(100vh-80px)]">
            <div className="container mx-auto py-12">
                <GameLobby />
            </div>
        </div>
    );
}
