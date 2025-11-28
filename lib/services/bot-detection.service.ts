/**
 * Bot Detection Service
 * Analyzes player behavior to detect automated play
 */

import { logger } from './logger';
import { PlayerBehavior } from './types';

// Constants
const BOT_TIMING_VARIANCE_THRESHOLD = 50; // ms
const MIN_ACTIONS_FOR_ANALYSIS = 10;
const MAX_ACTION_HISTORY = 50;

export class BotDetectionService {
    /**
     * Analyzes action timing patterns to detect bots
     */
    analyzeActionTiming(behavior: PlayerBehavior, actionTime: number): {
        isBot: boolean;
        confidence: number;
        reason?: string;
    } {
        behavior.actionTimestamps.push(actionTime);

        // Keep only last N actions
        if (behavior.actionTimestamps.length > MAX_ACTION_HISTORY) {
            behavior.actionTimestamps.shift();
        }

        // Need minimum data points
        if (behavior.actionTimestamps.length < MIN_ACTIONS_FOR_ANALYSIS) {
            return { isBot: false, confidence: 0 };
        }

        // Calculate time deltas between actions
        const deltas: number[] = [];
        for (let i = 1; i < behavior.actionTimestamps.length; i++) {
            deltas.push(behavior.actionTimestamps[i] - behavior.actionTimestamps[i - 1]);
        }

        const variance = this.calculateVariance(deltas);
        const mean = this.calculateMean(deltas);

        // Bots have suspiciously consistent timing
        if (variance < BOT_TIMING_VARIANCE_THRESHOLD) {
            const confidence = 1 - (variance / BOT_TIMING_VARIANCE_THRESHOLD);

            logger.antiCheat('bot-timing-detected', behavior.playerId, 'Consistent timing pattern', confidence * 100);

            return {
                isBot: true,
                confidence,
                reason: `Timing variance (${variance.toFixed(2)}ms) below threshold`
            };
        }

        // Check for exactly timed intervals (bot signature)
        const roundedDeltas = deltas.map(d => Math.round(d / 100) * 100);
        const uniqueIntervals = new Set(roundedDeltas);

        if (uniqueIntervals.size === 1) {
            logger.antiCheat('bot-exact-timing', behavior.playerId, 'Exact timing intervals detected', 90);

            return {
                isBot: true,
                confidence: 0.9,
                reason: 'All actions at exact intervals'
            };
        }

        return { isBot: false, confidence: 0 };
    }

    /**
     * Checks for instant actions (human-impossible speed)
     */
    checkActionSpeed(timeSinceLastAction: number): {
        instantAction: boolean;
        reason?: string;
    } {
        const MIN_HUMAN_REACTION_TIME = 200; // ms

        if (timeSinceLastAction < MIN_HUMAN_REACTION_TIME) {
            return {
                instantAction: true,
                reason: `Action in ${timeSinceLastAction}ms (< ${MIN_HUMAN_REACTION_TIME}ms threshold)`
            };
        }

        return { instantAction: false };
    }

    private calculateVariance(values: number[]): number {
        if (values.length === 0) return 0;

        const mean = this.calculateMean(values);
        const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
        return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    }

    private calculateMean(values: number[]): number {
        if (values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }
}
