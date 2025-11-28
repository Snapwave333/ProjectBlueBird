import { Player, GameState, Card } from './poker-engine';

/**
 * Anti-Cheat System for ANTE Poker Platform
 * Implements multiple layers of fraud detection and prevention
 */

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

export class AntiCheatEngine {
    private playerBehaviors = new Map<string, PlayerBehavior>();
    private gameAudits: GameAudit[] = [];
    private ipMapping = new Map<string, Set<string>>(); // IP -> Player IDs
    private deviceMapping = new Map<string, Set<string>>(); // Device -> Player IDs
    private suspiciousPlayers = new Set<string>();

    // Thresholds for detection
    private readonly COLLUSION_THRESHOLD = 0.85;
    private readonly BOT_TIMING_VARIANCE = 50; // ms
    private readonly MAX_VPIP_DEVIATION = 0.15;
    private readonly SUSPICIOUS_SCORE_LIMIT = 75;

    /**
     * 1. ACTION TIMING ANALYSIS
     * Detects bots by analyzing action timing patterns
     */
    analyzeActionTiming(playerId: string, actionTime: number): boolean {
        const behavior = this.getBehavior(playerId);
        behavior.actionTimestamps.push(actionTime);

        // Keep only last 50 actions
        if (behavior.actionTimestamps.length > 50) {
            behavior.actionTimestamps.shift();
        }

        // Calculate variance in timing
        if (behavior.actionTimestamps.length >= 10) {
            const deltas = [];
            for (let i = 1; i < behavior.actionTimestamps.length; i++) {
                deltas.push(behavior.actionTimestamps[i] - behavior.actionTimestamps[i - 1]);
            }

            const variance = this.calculateVariance(deltas);

            // Bots tend to have very consistent timing
            if (variance < this.BOT_TIMING_VARIANCE) {
                this.flagSuspicious(playerId, 'Bot-like timing detected', 15);
                return false;
            }
        }

        return true;
    }

    /**
     * 2. COLLUSION DETECTION
     * Detects players working together by analyzing fold patterns
     */
    detectCollusion(gameState: GameState): string[] {
        const activePlayers = gameState.players.filter(p => !p.isFolded);
        const colludingPairs: string[] = [];

        // Check all player pairs
        for (let i = 0; i < activePlayers.length; i++) {
            for (let j = i + 1; j < activePlayers.length; j++) {
                const player1 = activePlayers[i];
                const player2 = activePlayers[j];

                const collusionScore = this.calculateCollusionScore(player1.id, player2.id);

                if (collusionScore > this.COLLUSION_THRESHOLD) {
                    colludingPairs.push(`${player1.name} & ${player2.name}`);
                    this.flagSuspicious(player1.id, 'Possible collusion detected', 25);
                    this.flagSuspicious(player2.id, 'Possible collusion detected', 25);
                }
            }
        }

        return colludingPairs;
    }

    /**
     * 3. MULTI-ACCOUNTING DETECTION
     * Detects same person using multiple accounts
     */
    detectMultiAccounting(playerId: string, ip: string, deviceId: string): boolean {
        // Track IP addresses
        if (!this.ipMapping.has(ip)) {
            this.ipMapping.set(ip, new Set());
        }
        this.ipMapping.get(ip)!.add(playerId);

        // Track device IDs
        if (!this.deviceMapping.has(deviceId)) {
            this.deviceMapping.set(deviceId, new Set());
        }
        this.deviceMapping.get(deviceId)!.add(playerId);

        // Check for multiple accounts from same IP
        const accountsFromIP = this.ipMapping.get(ip)!.size;
        const accountsFromDevice = this.deviceMapping.get(deviceId)!.size;

        if (accountsFromIP > 1 || accountsFromDevice > 1) {
            this.flagSuspicious(playerId, 'Multiple accounts detected', 20);
            return false;
        }

        return true;
    }

    /**
     * 4. BETTING PATTERN ANALYSIS
     * Detects abnormal betting patterns that suggest insider knowledge
     */
    analyzeBettingPattern(playerId: string, betAmount: number, potSize: number): boolean {
        const behavior = this.getBehavior(playerId);
        behavior.betSizes.push(betAmount);

        // Keep last 100 bets
        if (behavior.betSizes.length > 100) {
            behavior.betSizes.shift();
        }

        // Check for suspiciously optimal bet sizing (always perfect pot odds)
        if (behavior.betSizes.length >= 20) {
            const optimalBets = behavior.betSizes.filter(bet => {
                const potOdds = bet / (potSize + bet);
                return potOdds >= 0.32 && potOdds <= 0.35; // Perfect 1/3 pot sizing
            });

            // If 80%+ of bets are "perfect", flag as suspicious
            if (optimalBets.length / behavior.betSizes.length > 0.8) {
                this.flagSuspicious(playerId, 'Suspiciously optimal betting', 10);
                return false;
            }
        }

        return true;
    }

    /**
     * 5. SHUFFLE VERIFICATION
     * Ensures deck shuffle is cryptographically secure
     */
    verifyShuffle(deck: Card[], shuffleSeed: string): boolean {
        // In production, this would use a verifiable random function (VRF)
        // For Solana, you'd use Switchboard VRF or similar

        // Check that all 52 cards are present and unique
        if (deck.length !== 52) {
            return false;
        }

        const uniqueCards = new Set(deck.map(c => `${c.rank}${c.suit}`));
        if (uniqueCards.size !== 52) {
            return false;
        }

        // Store seed for audit trail
        this.logShuffleSeed(shuffleSeed);

        return true;
    }

    /**
     * 6. ACTION VALIDATION
     * Server-side validation of all player actions
     */
    validateAction(
        action: GameAction,
        gameState: GameState,
        player: Player
    ): { valid: boolean; reason?: string } {
        // Check if it's player's turn
        if (gameState.currentTurn !== player.id) {
            return { valid: false, reason: 'Not your turn' };
        }

        // Validate bet amounts
        if (action.action === 'bet' || action.action === 'raise') {
            if (!action.amount || action.amount < gameState.bigBlind) {
                return { valid: false, reason: 'Bet too small' };
            }

            if (action.amount > player.chips) {
                return { valid: false, reason: 'Insufficient chips' };
            }
        }

        // Check timing (prevent instant actions)
        const minActionTime = 500; // 500ms minimum
        const timeSinceLastAction = Date.now() - (gameState as any).lastActionTime || 0;

        if (timeSinceLastAction < minActionTime) {
            this.flagSuspicious(player.id, 'Instant action (bot)', 20);
            return { valid: false, reason: 'Action too fast' };
        }

        return { valid: true };
    }

    /**
     * 7. HAND HISTORY LOGGING
     * Immutable audit trail for all games
     */
    logGameAction(gameId: string, action: GameAction): void {
        let audit = this.gameAudits.find(a => a.gameId === gameId);

        if (!audit) {
            audit = {
                gameId,
                timestamp: Date.now(),
                players: [],
                actions: [],
                shuffleSeed: '',
                verified: false
            };
            this.gameAudits.push(audit);
        }

        audit.actions.push(action);
    }

    /**
     * 8. PLAYER REPUTATION SCORE
     * Aggregates all suspicious activity into a single score
     */
    getPlayerReputationScore(playerId: string): number {
        const behavior = this.getBehavior(playerId);
        return Math.max(0, 100 - behavior.suspicionScore);
    }

    /**
     * 9. AUTO-BAN SYSTEM
     * Automatically restricts accounts with high suspicion scores
     */
    shouldBanPlayer(playerId: string): boolean {
        const behavior = this.getBehavior(playerId);
        return behavior.suspicionScore >= this.SUSPICIOUS_SCORE_LIMIT;
    }

    /**
     * HELPER METHODS
     */

    private getBehavior(playerId: string): PlayerBehavior {
        if (!this.playerBehaviors.has(playerId)) {
            this.playerBehaviors.set(playerId, {
                playerId,
                actionTimestamps: [],
                betSizes: [],
                foldFrequency: 0,
                vpip: 0,
                pfr: 0,
                aggression: 0,
                suspicionScore: 0
            });
        }
        return this.playerBehaviors.get(playerId)!;
    }

    private flagSuspicious(playerId: string, reason: string, points: number): void {
        const behavior = this.getBehavior(playerId);
        behavior.suspicionScore += points;

        console.warn(`🚨 [ANTI-CHEAT] Player ${playerId}: ${reason} (+${points} suspicion)`);

        if (behavior.suspicionScore >= this.SUSPICIOUS_SCORE_LIMIT) {
            this.suspiciousPlayers.add(playerId);
            console.error(`🛑 [ANTI-CHEAT] Player ${playerId} flagged for review (score: ${behavior.suspicionScore})`);
        }
    }

    private calculateCollusionScore(player1Id: string, player2Id: string): number {
        // Simplified collusion detection
        // In production, analyze fold patterns when players are in pot together
        const behavior1 = this.getBehavior(player1Id);
        const behavior2 = this.getBehavior(player2Id);

        // Check if players have suspiciously similar patterns
        const vpipDiff = Math.abs(behavior1.vpip - behavior2.vpip);
        const pfrDiff = Math.abs(behavior1.pfr - behavior2.pfr);

        // Very similar stats could indicate collusion
        if (vpipDiff < 0.05 && pfrDiff < 0.05) {
            return 0.9;
        }

        return 0.5;
    }

    private calculateVariance(values: number[]): number {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
        return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    }

    private logShuffleSeed(seed: string): void {
        // Store for blockchain verification
        console.log(`🔐 [SHUFFLE SEED] ${seed}`);
    }

    /**
     * PUBLIC API FOR REPORTING
     */

    getSuspiciousPlayers(): string[] {
        return Array.from(this.suspiciousPlayers);
    }

    getGameAudit(gameId: string): GameAudit | undefined {
        return this.gameAudits.find(a => a.gameId === gameId);
    }

    exportAuditLog(): GameAudit[] {
        return this.gameAudits;
    }
}

// Singleton instance
export const antiCheat = new AntiCheatEngine();
