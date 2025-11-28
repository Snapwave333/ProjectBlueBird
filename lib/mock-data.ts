export const MOCK_TOURNAMENTS = [
    {
        id: '1',
        name: "Sunday Million High Roller",
        prizePool: 1000000,
        buyIn: 5000,
        startTime: "Sunday, 18:00 UTC",
        registered: 142,
        status: "Registering",
        image: "/tournament-1.jpg"
    },
    {
        id: '2',
        name: "Daily Deepstack",
        prizePool: 50000,
        buyIn: 100,
        startTime: "Today, 20:00 UTC",
        registered: 856,
        status: "Late Reg",
        image: "/tournament-2.jpg"
    },
    {
        id: '3',
        name: "Turbo Bounty Hunter",
        prizePool: 25000,
        buyIn: 50,
        startTime: "Starting in 15m",
        registered: 320,
        status: "Registering",
        image: "/tournament-3.jpg"
    }
];

export const MOCK_LEADERBOARD = [
    { rank: 1, username: "PokerKing_SOL", earnings: 450200, avatar: "👑", winRate: "62%" },
    { rank: 2, username: "DiamondHands", earnings: 320500, avatar: "💎", winRate: "58%" },
    { rank: 3, username: "BluffMaster99", earnings: 280000, avatar: "🃏", winRate: "55%" },
    { rank: 4, username: "CryptoShark", earnings: 210000, avatar: "🦈", winRate: "54%" },
    { rank: 5, username: "MoonBoi", earnings: 180000, avatar: "🚀", winRate: "51%" },
];

export const MOCK_USER_STATS = {
    username: "PlayerOne",
    walletAddress: "8x...3f9a",
    totalEarnings: 12500,
    handsPlayed: 1420,
    bestHand: "Royal Flush",
    tournamentsWon: 2,
    recentActivity: [
        { id: 1, type: "Cash Game", result: "+$450", date: "2h ago" },
        { id: 2, type: "Tournament", result: "-$100", date: "1d ago" },
        { id: 3, type: "Cash Game", result: "+$1,200", date: "2d ago" },
    ]
};
