/**
 * Shared types for anti-cheat system
 */

import { GameState, Player, Card } from '../poker-engine';

export interface PlayerBehavior {
    playerId: string;
    actionTimestamps: number[];
    betSizes: number[];
    foldFrequency: number;
    vpip: number; // Voluntarily Put money In Pot
    pfr: number; // Pre-Flop Raise
    aggression: number;
    suspicionScore: number;
}

export interface GameAudit {
    gameId: string;
    timestamp: number;
    players: string[];
    actions: GameAction[];
    shuffleSeed: string;
    verified: boolean;
}

export interface GameAction {
    playerId: string;
    action: 'fold' | 'check' | 'call' | 'raise' | 'bet';
    amount?: number;
    timestamp: number;
    ip?: string;
    deviceId?: string;
}

export type { GameState, Player, Card };
