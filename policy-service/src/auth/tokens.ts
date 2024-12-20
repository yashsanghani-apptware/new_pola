// src/auth/tokens.ts

import crypto from "crypto";

let tokens: Record<string, any> = {};

/**
 * Creates a new token for a user.
 * @param user The user for whom the token is being created.
 * @param client The client requesting the token.
 * @param scope The scope of the token.
 * @returns A promise that resolves to the new token.
 */
export function createToken(user: string, client: string, scope: string[]): Promise<any> {
    const token = crypto.randomBytes(128).toString('base64');
    tokens[token] = { user, client, scope, expires: Date.now() + 3600000 };
    return Promise.resolve(tokens[token]);
}

/**
 * Retrieves a token.
 * @param token The token to retrieve.
 * @returns A promise that resolves to the token or null if not found.
 */
export function getToken(token: string): Promise<any> {
    return Promise.resolve(tokens[token] || null);
}

/**
 * Revokes a token.
 * @param token The token to revoke.
 * @returns A promise that resolves when the token is revoked.
 */
export function revokeToken(token: string): Promise<void> {
    delete tokens[token];
    return Promise.resolve();
}

