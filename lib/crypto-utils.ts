/**
 * Cryptographically Secure Utilities
 * Provides production-grade random number generation
 */

/**
 * Generates cryptographically secure random bytes
 * Uses Web Crypto API in browser, crypto module in Node.js
 */
export function getSecureRandomBytes(length: number): Uint8Array {
    if (typeof window !== 'undefined' && window.crypto) {
        // Browser environment
        const bytes = new Uint8Array(length);
        window.crypto.getRandomValues(bytes);
        return bytes;
    } else if (typeof require !== 'undefined') {
        // Node.js environment
        try {
            const crypto = require('crypto');
            return new Uint8Array(crypto.randomBytes(length));
        } catch {
            throw new Error('No secure random source available');
        }
    }

    throw new Error('No secure random source available');
}

/**
 * Generates a cryptographically secure random integer in range [0, max)
 */
export function getSecureRandomInt(max: number): number {
    if (max <= 0) {
        throw new Error('Max must be positive');
    }

    // Calculate number of bytes needed
    const bytesNeeded = Math.ceil(Math.log2(max) / 8);
    const randomBytes = getSecureRandomBytes(bytesNeeded);

    // Convert bytes to integer
    let randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
        randomValue = (randomValue << 8) + randomBytes[i];
    }

    // Ensure uniform distribution using rejection sampling
    const range = Math.pow(2, bytesNeeded * 8);
    const validRange = Math.floor(range / max) * max;

    if (randomValue >= validRange) {
        // Reject and try again for uniform distribution
        return getSecureRandomInt(max);
    }

    return randomValue % max;
}

/**
 * Fisher-Yates shuffle with cryptographically secure randomness
 */
export function secureShuffle<T>(array: T[]): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = getSecureRandomInt(i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

/**
 * Generates a cryptographically secure seed string
 */
export function generateSecureSeed(): string {
    const bytes = getSecureRandomBytes(32);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
