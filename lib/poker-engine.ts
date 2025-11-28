import { secureShuffle } from './crypto-utils';
import { GameStateError, ErrorCode } from './errors';
import { logger } from './logger';

export interface Card {
    suit: 'h' | 'd' | 'c' | 's';
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
}

export interface Player {
    id: string;
    name: string;
    chips: number;
    cards: Card[];
    isFolded: boolean;
    bet: number;
    isDealer: boolean;
    isTurn: boolean;
}

export interface GameState {
    id: string;
    pot: number;
    communityCards: Card[];
    players: Player[];
    currentTurn: string; // player id
    stage: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
    bigBlind: number;
    smallBlind: number;
    lastActionTime: number;
}

export enum HandRank {
    HighCard = 0,
    OnePair = 1,
    TwoPair = 2,
    ThreeOfAKind = 3,
    Straight = 4,
    Flush = 5,
    FullHouse = 6,
    FourOfAKind = 7,
    StraightFlush = 8,
    RoyalFlush = 9
}

export interface HandEvaluation {
    rank: HandRank;
    value: number;
    name: string;
    kickers: number[];
}

// Constants to replace magic numbers
const RANK_VALUES: Readonly<Record<string, number>> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

const DECK_SIZE = 52;
const HOLE_CARDS_PER_PLAYER = 2;
const FLOP_CARDS = 3;
const TURN_CARDS = 1;
const RIVER_CARDS = 1;
const MIN_HAND_SIZE = 5;
const MAX_HAND_SIZE = 7;

/**
 * Hand evaluation cache for performance optimization
 */
const handEvaluationCache = new Map<string, HandEvaluation>();
const CACHE_MAX_SIZE = 10000;

/**
 * Creates a shuffled deck of 52 cards using cryptographically secure RNG
 */
export function createDeck(): Card[] {
    const suits: Card['suit'][] = ['h', 'd', 'c', 's'];
    const ranks: Card['rank'][] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const deck: Card[] = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }

    // Use cryptographically secure shuffle
    return secureShuffle(deck);
}

/**
 * Generates cache key for hand evaluation
 */
function getHandCacheKey(cards: Card[]): string {
    return cards
        .map(c => `${c.rank}${c.suit}`)
        .sort()
        .join('|');
}

/**
 * Evaluates a poker hand (5-7 cards) and returns the best rank
 * Implements memoization for performance
 */
export function evaluateHand(cards: Card[]): HandEvaluation {
    // Input validation
    if (cards.length < MIN_HAND_SIZE) {
        throw new GameStateError(
            ErrorCode.ERR_INVALID_GAME_STATE,
            `Hand must have at least ${MIN_HAND_SIZE} cards`,
            { cardCount: cards.length },
            false
        );
    }

    if (cards.length > MAX_HAND_SIZE) {
        throw new GameStateError(
            ErrorCode.ERR_INVALID_GAME_STATE,
            `Hand cannot have more than ${MAX_HAND_SIZE} cards`,
            { cardCount: cards.length },
            false
        );
    }

    // Check cache
    const cacheKey = getHandCacheKey(cards);
    if (handEvaluationCache.has(cacheKey)) {
        return handEvaluationCache.get(cacheKey)!;
    }

    const rankCounts = new Map<string, number>();
    const suitCounts = new Map<string, number>();

    cards.forEach(card => {
        rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
        suitCounts.set(card.suit, (suitCounts.get(card.suit) || 0) + 1);
    });

    const isFlush = Array.from(suitCounts.values()).some(count => count >= 5);
    const sortedRanks = Array.from(rankCounts.keys()).sort((a, b) => RANK_VALUES[b] - RANK_VALUES[a]);
    const isStraight = checkStraight(sortedRanks);

    const counts = Array.from(rankCounts.values()).sort((a, b) => b - a);
    const pairs = counts.filter(c => c === 2).length;
    const threeOfKind = counts.includes(3);
    const fourOfKind = counts.includes(4);

    let result: HandEvaluation;

    // Royal Flush
    if (isFlush && isStraight && sortedRanks.includes('A') && sortedRanks.includes('K')) {
        result = { rank: HandRank.RoyalFlush, value: 10, name: 'Royal Flush', kickers: [14] };
    }
    // Straight Flush
    else if (isFlush && isStraight) {
        result = { rank: HandRank.StraightFlush, value: 9, name: 'Straight Flush', kickers: [RANK_VALUES[sortedRanks[0]]] };
    }
    // Four of a Kind
    else if (fourOfKind) {
        const quadRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 4)![0];
        result = { rank: HandRank.FourOfAKind, value: 8, name: 'Four of a Kind', kickers: [RANK_VALUES[quadRank]] };
    }
    // Full House
    else if (threeOfKind && pairs >= 1) {
        result = { rank: HandRank.FullHouse, value: 7, name: 'Full House', kickers: [] };
    }
    // Flush
    else if (isFlush) {
        result = { rank: HandRank.Flush, value: 6, name: 'Flush', kickers: sortedRanks.slice(0, 5).map(r => RANK_VALUES[r]) };
    }
    // Straight
    else if (isStraight) {
        result = { rank: HandRank.Straight, value: 5, name: 'Straight', kickers: [RANK_VALUES[sortedRanks[0]]] };
    }
    // Three of a Kind
    else if (threeOfKind) {
        const tripRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 3)![0];
        result = { rank: HandRank.ThreeOfAKind, value: 4, name: 'Three of a Kind', kickers: [RANK_VALUES[tripRank]] };
    }
    // Two Pair
    else if (pairs === 2) {
        const pairRanks = Array.from(rankCounts.entries())
            .filter(([_, count]) => count === 2)
            .map(([rank, _]) => RANK_VALUES[rank])
            .sort((a, b) => b - a);
        result = { rank: HandRank.TwoPair, value: 3, name: 'Two Pair', kickers: pairRanks };
    }
    // One Pair
    else if (pairs === 1) {
        const pairRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 2)![0];
        result = { rank: HandRank.OnePair, value: 2, name: 'One Pair', kickers: [RANK_VALUES[pairRank]] };
    }
    // High Card
    else {
        result = { rank: HandRank.HighCard, value: 1, name: 'High Card', kickers: sortedRanks.slice(0, 5).map(r => RANK_VALUES[r]) };
    }

    // Cache result
    if (handEvaluationCache.size >= CACHE_MAX_SIZE) {
        const iter = handEvaluationCache.keys().next();
        const firstKey = iter.value as string | undefined;
        if (firstKey !== undefined) {
            handEvaluationCache.delete(firstKey);
        }
    }
    handEvaluationCache.set(cacheKey, result);

    return result;
}

function checkStraight(ranks: string[]): boolean {
    const values = ranks.map(r => RANK_VALUES[r]).sort((a, b) => b - a);

    // Check for standard straight
    for (let i = 0; i < values.length - 4; i++) {
        if (values[i] - values[i + 4] === 4) {
            return true;
        }
    }

    // Check for A-2-3-4-5 (wheel)
    if (ranks.includes('A') && ranks.includes('2') && ranks.includes('3') && ranks.includes('4') && ranks.includes('5')) {
        return true;
    }

    return false;
}

/**
 * Determines the winner(s) of a hand
 */
export function determineWinner(players: Player[], communityCards: Card[]): Player[] {
    const activePlayers = players.filter(p => !p.isFolded);

    if (activePlayers.length === 0) {
        throw new GameStateError(
            ErrorCode.ERR_INVALID_GAME_STATE,
            'No active players in game',
            { playerCount: players.length },
            false
        );
    }

    if (activePlayers.length === 1) {
        return activePlayers;
    }

    const evaluations = activePlayers.map(player => ({
        player,
        hand: evaluateHand([...player.cards, ...communityCards])
    }));

    // Sort by hand value, then by kickers
    evaluations.sort((a, b) => {
        if (b.hand.value !== a.hand.value) {
            return b.hand.value - a.hand.value;
        }

        // Compare kickers
        for (let i = 0; i < Math.min(a.hand.kickers.length, b.hand.kickers.length); i++) {
            if (b.hand.kickers[i] !== a.hand.kickers[i]) {
                return b.hand.kickers[i] - a.hand.kickers[i];
            }
        }

        return 0;
    });

    const bestValue = evaluations[0].hand.value;
    const bestKickers = evaluations[0].hand.kickers;

    return evaluations
        .filter(e =>
            e.hand.value === bestValue &&
            JSON.stringify(e.hand.kickers) === JSON.stringify(bestKickers)
        )
        .map(e => e.player);
}

/**
 * Deals initial cards to players with proper error handling
 */
export function dealCards(deck: Card[], numPlayers: number): { playerHands: Card[][], deck: Card[] } {
    // Validation
    if (numPlayers <= 0) {
        throw new GameStateError(
            ErrorCode.ERR_INVALID_GAME_STATE,
            'Number of players must be positive',
            { numPlayers },
            false
        );
    }

    const cardsNeeded = numPlayers * HOLE_CARDS_PER_PLAYER;
    if (deck.length < cardsNeeded) {
        throw new GameStateError(
            ErrorCode.ERR_DECK_EXHAUSTED,
            'Insufficient cards in deck',
            {
                deckSize: deck.length,
                cardsNeeded,
                numPlayers
            },
            false
        );
    }

    const playerHands: Card[][] = Array(numPlayers).fill(null).map(() => []);
    const deckCopy = [...deck];

    // Deal 2 cards to each player
    for (let i = 0; i < HOLE_CARDS_PER_PLAYER; i++) {
        for (let j = 0; j < numPlayers; j++) {
            const card = deckCopy.pop();
            if (!card) {
                throw new GameStateError(
                    ErrorCode.ERR_DECK_EXHAUSTED,
                    'Deck exhausted during deal',
                    {
                        deckRemaining: deckCopy.length,
                        currentPlayer: j,
                        currentRound: i
                    },
                    false
                );
            }
            playerHands[j].push(card);
        }
    }

    logger.debug(`cards-dealt: Dealt cards to ${numPlayers} players`, {
        playersCount: numPlayers,
        cardsDealt: cardsNeeded,
        deckRemaining: deckCopy.length
    });

    return { playerHands, deck: deckCopy };
}

/**
 * Deals community cards for a stage
 */
export function dealCommunityCards(deck: Card[], stage: GameState['stage']): { cards: Card[], deck: Card[] } {
    const deckCopy = [...deck];
    let numCards = 0;

    switch (stage) {
        case 'flop':
            numCards = FLOP_CARDS;
            break;
        case 'turn':
            numCards = TURN_CARDS;
            break;
        case 'river':
            numCards = RIVER_CARDS;
            break;
        default:
            numCards = 0;
    }

    // Validate deck has enough cards
    const totalNeeded = numCards + (numCards > 0 ? 1 : 0); // +1 for burn card
    if (deckCopy.length < totalNeeded) {
        throw new GameStateError(
            ErrorCode.ERR_DECK_EXHAUSTED,
            'Insufficient cards for community cards',
            {
                deckSize: deckCopy.length,
                cardsNeeded: totalNeeded,
                stage
            },
            false
        );
    }

    // Burn one card (standard poker rules)
    if (numCards > 0) {
        const burnCard = deckCopy.pop();
        if (!burnCard) {
            throw new GameStateError(
                ErrorCode.ERR_DECK_EXHAUSTED,
                'Cannot burn card - deck empty',
                { stage },
                false
            );
        }
    }

    const cards: Card[] = [];
    for (let i = 0; i < numCards; i++) {
        const card = deckCopy.pop();
        if (!card) {
            throw new GameStateError(
                ErrorCode.ERR_DECK_EXHAUSTED,
                'Deck exhausted during community card deal',
                {
                    stage,
                    cardIndex: i,
                    expectedCards: numCards
                },
                false
            );
        }
        cards.push(card);
    }

    logger.debug(`community-cards-dealt: Dealt ${numCards} cards for ${stage}`, {
        stage,
        cardsDealt: numCards,
        deckRemaining: deckCopy.length
    });

    return { cards, deck: deckCopy };
}

/**
 * Advances the game to the next stage
 */
export function nextStage(currentStage: GameState['stage']): GameState['stage'] {
    const stages: GameState['stage'][] = ['preflop', 'flop', 'turn', 'river', 'showdown'];
    const currentIndex = stages.indexOf(currentStage);

    if (currentIndex === -1) {
        throw new GameStateError(
            ErrorCode.ERR_INVALID_STAGE,
            'Invalid game stage',
            { stage: currentStage },
            false
        );
    }

    return stages[Math.min(currentIndex + 1, stages.length - 1)];
}

/**
 * Formats a card for display (e.g., 'Ah' -> 'A♥')
 */
export const formatCard = (card: Card | string): string => {
    if (typeof card === 'string') {
        return card;
    }

    const suitSymbols: Record<string, string> = {
        'h': '♥',
        'd': '♦',
        'c': '♣',
        's': '♠'
    };

    return `${card.rank}${suitSymbols[card.suit]}`;
};

/**
 * Calculates pot odds for a player
 */
export function calculatePotOdds(potSize: number, betToCall: number): number {
    // Input validation
    if (potSize < 0 || betToCall < 0) {
        throw new GameStateError(
            ErrorCode.ERR_INVALID_BET_AMOUNT,
            'Pot size and bet must be non-negative',
            { potSize, betToCall },
            true
        );
    }

    if (betToCall === 0) {
        return 0;
    }

    if (potSize + betToCall === 0) {
        throw new GameStateError(
            ErrorCode.ERR_INVALID_GAME_STATE,
            'Cannot calculate pot odds with zero pot',
            { potSize, betToCall },
            true
        );
    }

    return betToCall / (potSize + betToCall);
}

/**
 * Clears evaluation cache (useful for testing)
 */
export function clearHandEvaluationCache(): void {
    handEvaluationCache.clear();
}
