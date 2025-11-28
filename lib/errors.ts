/**
 * Error Code System for ANTE Poker Platform
 * Provides structured error handling with correlation IDs
 */

export enum ErrorCode {
    // Game State Errors (1000-1999)
    ERR_DECK_EXHAUSTED = 'ERR_DECK_EXHAUSTED',
    ERR_INVALID_GAME_STATE = 'ERR_INVALID_GAME_STATE',
    ERR_INVALID_STAGE = 'ERR_INVALID_STAGE',
    ERR_DUPLICATE_CARDS = 'ERR_DUPLICATE_CARDS',

    // Validation Errors (2000-2999)
    ERR_INVALID_TURN = 'ERR_INVALID_TURN',
    ERR_BET_TOO_SMALL = 'ERR_BET_TOO_SMALL',
    ERR_BET_TOO_LARGE = 'ERR_BET_TOO_LARGE',
    ERR_INSUFFICIENT_CHIPS = 'ERR_INSUFFICIENT_CHIPS',
    ERR_ACTION_TOO_FAST = 'ERR_ACTION_TOO_FAST',
    ERR_INVALID_ACTION = 'ERR_INVALID_ACTION',
    ERR_INVALID_BET_AMOUNT = 'ERR_INVALID_BET_AMOUNT',

    // Security Errors (3000-3999)
    ERR_BOT_DETECTED = 'ERR_BOT_DETECTED',
    ERR_COLLUSION_DETECTED = 'ERR_COLLUSION_DETECTED',
    ERR_MULTI_ACCOUNT = 'ERR_MULTI_ACCOUNT',
    ERR_SUSPICIOUS_BETTING = 'ERR_SUSPICIOUS_BETTING',
    ERR_RATE_LIMITED = 'ERR_RATE_LIMITED',
    ERR_INVALID_SIGNATURE = 'ERR_INVALID_SIGNATURE',

    // Server Errors (5000-5999)
    ERR_SERVER_ERROR = 'ERR_SERVER_ERROR',
    ERR_DATABASE_ERROR = 'ERR_DATABASE_ERROR',
    ERR_RPC_ERROR = 'ERR_RPC_ERROR',
}

export interface GameError {
    code: ErrorCode;
    message: string;
    timestamp: number;
    correlationId: string;
    metadata?: Record<string, any>;
    recoverable: boolean;
}

export class GameStateError extends Error {
    public readonly code: ErrorCode;
    public readonly correlationId: string;
    public readonly timestamp: number;
    public readonly metadata: Record<string, any>;
    public readonly recoverable: boolean;

    constructor(
        code: ErrorCode,
        message: string,
        metadata: Record<string, any> = {},
        recoverable: boolean = false
    ) {
        super(message);
        this.name = 'GameStateError';
        this.code = code;
        this.correlationId = generateCorrelationId();
        this.timestamp = Date.now();
        this.metadata = metadata;
        this.recoverable = recoverable;

        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GameStateError);
        }
    }

    toJSON(): GameError {
        return {
            code: this.code,
            message: this.message,
            timestamp: this.timestamp,
            correlationId: this.correlationId,
            metadata: this.metadata,
            recoverable: this.recoverable,
        };
    }
}

/**
 * Generates a unique correlation ID for error tracking
 */
function generateCorrelationId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomStr}`;
}

/**
 * Error handler that logs to appropriate service based on environment
 */
export function handleGameError(error: GameStateError): void {
    // In production, send to error tracking service (e.g., Sentry, DataDog)
    if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with error tracking service
        // Sentry.captureException(error);
    } else {
        console.error('[GameError]', {
            code: error.code,
            message: error.message,
            correlationId: error.correlationId,
            metadata: error.metadata,
        });
    }
}

/**
 * Validation result with structured error
 */
export interface ValidationResult<T = void> {
    valid: boolean;
    data?: T;
    error?: GameError;
}
