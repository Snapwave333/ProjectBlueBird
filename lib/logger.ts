/**
 * Secure Logger for ANTE Poker Platform
 * Prevents information disclosure via console logging
 */

import crypto from 'crypto';

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    CRITICAL = 'critical',
}

export enum LogVisibility {
    PUBLIC = 'public',      // Safe to show in browser console
    INTERNAL = 'internal',  // Server logs only
    SENSITIVE = 'sensitive', // Encrypted storage only
}

interface LogEntry {
    level: LogLevel;
    visibility: LogVisibility;
    event: string;
    message?: string;
    metadata?: Record<string, any>;
    timestamp: number;
    correlationId?: string;
}

class SecureLogger {
    private readonly isProduction: boolean;
    private logBuffer: LogEntry[] = [];
    private readonly MAX_BUFFER_SIZE = 1000;

    constructor() {
        this.isProduction = process.env.NODE_ENV === 'production';
    }

    /**
     * Hash sensitive data before logging
     */
    private hashSensitiveData(data: string): string {
        return crypto
            .createHash('sha256')
            .update(data)
            .digest('hex')
            .substring(0, 12);
    }

    /**
     * Sanitize metadata to remove sensitive information
     */
    private sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
        const sanitized: Record<string, any> = {};

        for (const [key, value] of Object.entries(metadata)) {
            if (key.toLowerCase().includes('password') ||
                key.toLowerCase().includes('secret') ||
                key.toLowerCase().includes('key') ||
                key.toLowerCase().includes('seed')) {
                sanitized[key] = '[REDACTED]';
            } else if (key.toLowerCase().includes('playerid') ||
                key.toLowerCase().includes('userid')) {
                sanitized[key] = this.hashSensitiveData(String(value));
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitizeMetadata(value);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    /**
     * Core logging method
     */
    private log(
        level: LogLevel,
        visibility: LogVisibility,
        event: string,
        message?: string,
        metadata?: Record<string, any>
    ): void {
        const entry: LogEntry = {
            level,
            visibility,
            event,
            message,
            metadata: metadata ? this.sanitizeMetadata(metadata) : undefined,
            timestamp: Date.now(),
        };

        // Buffer management
        this.logBuffer.push(entry);
        if (this.logBuffer.length > this.MAX_BUFFER_SIZE) {
            this.logBuffer.shift();
        }

        // Only log PUBLIC entries to console in production
        if (this.isProduction && visibility !== LogVisibility.PUBLIC) {
            // Send to external logging service (e.g., DataDog, CloudWatch)
            this.sendToExternalService(entry);
            return;
        }

        // Development logging
        if (!this.isProduction) {
            const logMethod = this.getConsoleMethod(level);
            const prefix = `[${level.toUpperCase()}][${event}]`;

            if (metadata) {
                logMethod(prefix, message || '', metadata);
            } else {
                logMethod(prefix, message || '');
            }
        }
    }

    private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
        switch (level) {
            case LogLevel.DEBUG:
                return console.debug;
            case LogLevel.INFO:
                return console.info;
            case LogLevel.WARN:
                return console.warn;
            case LogLevel.ERROR:
            case LogLevel.CRITICAL:
                return console.error;
            default:
                return console.log;
        }
    }

    private sendToExternalService(entry: LogEntry): void {
        // TODO: Integrate with external logging service
        // Example: DataDog, Sentry, CloudWatch, etc.
        // This ensures sensitive logs never appear in browser console
    }

    /**
     * Public API
     */

    debug(event: string, message?: string, metadata?: Record<string, any>): void {
        this.log(LogLevel.DEBUG, LogVisibility.INTERNAL, event, message, metadata);
    }

    info(event: string, message?: string, metadata?: Record<string, any>): void {
        this.log(LogLevel.INFO, LogVisibility.PUBLIC, event, message, metadata);
    }

    warn(event: string, message?: string, metadata?: Record<string, any>, visibility: LogVisibility = LogVisibility.INTERNAL): void {
        this.log(LogLevel.WARN, visibility, event, message, metadata);
    }

    error(event: string, message?: string, metadata?: Record<string, any>, visibility: LogVisibility = LogVisibility.INTERNAL): void {
        this.log(LogLevel.ERROR, visibility, event, message, metadata);
    }

    critical(event: string, message?: string, metadata?: Record<string, any>): void {
        this.log(LogLevel.CRITICAL, LogVisibility.SENSITIVE, event, message, metadata);
    }

    /**
     * Anti-cheat specific logging (always INTERNAL)
     */
    antiCheat(event: string, playerId: string, reason: string, score: number): void {
        this.log(
            LogLevel.WARN,
            LogVisibility.INTERNAL,
            'anti-cheat-detection',
            reason,
            {
                playerId: this.hashSensitiveData(playerId),
                event,
                score,
            }
        );
    }

    /**
     * Shuffle seed logging (SENSITIVE - never to console)
     */
    shuffleSeed(gameId: string, seed: string): void {
        this.log(
            LogLevel.INFO,
            LogVisibility.SENSITIVE,
            'shuffle-seed-generated',
            undefined,
            {
                gameId,
                seedHash: this.hashSensitiveData(seed),
            }
        );
    }

    /**
     * Export logs for audit (sanitized)
     */
    exportLogs(): LogEntry[] {
        return [...this.logBuffer];
    }

    /**
     * Clear log buffer
     */
    clearLogs(): void {
        this.logBuffer = [];
    }
}

// Singleton instance
export const logger = new SecureLogger();
