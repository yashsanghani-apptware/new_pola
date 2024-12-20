// src/auth/index.ts

import { Application, Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { bearerStrategy, clientPasswordStrategy } from './strategies';
import * as Tokens from './tokens';
import * as Users from './users';
import { hasPermission } from './permissions';

/**
 * Initialize authentication strategies and configurations.
 * @param settings - The runtime settings.
 */
export function initAuth(settings: any): void {
    passport.use(bearerStrategy);
    passport.use(clientPasswordStrategy);
}

/**
 * Middleware to ensure the client secret is provided.
 */
export function ensureClientSecret(req: Request, res: Response, next: NextFunction): void {
    if (!req.body.client_secret) {
        req.body.client_secret = 'not_available';
    }
    next();
}

/**
 * Middleware for client authentication using passport strategies.
 */
export function authenticateClient(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate('oauth2-client-password', { session: false })(req, res, next);
}

/**
 * Middleware to check for required permissions using the external PolicyService.
 * @param permission - The required permission.
 * @returns An Express middleware function.
 */
export function needsPermission(permission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as { id: string }; // Ensure the user object has the correct type and contains a user ID
        if (!user) {
            return res.status(401).end();
        }
        
        try {
            const hasPerm = await hasPermission(user.id, permission);
            if (hasPerm) {
                return next();
            }
            return res.status(403).json({ error: 'forbidden' });
        } catch (error) {
            console.error('Error in permission check middleware:', error);
            return res.status(500).json({ error: 'internal_server_error' });
        }
    };
}

/**
 * Middleware to handle token revocation.
 */
export function revoke(req: Request, res: Response, next: NextFunction): void {
    const token = req.body.token;
    Tokens.revokeToken(token).then(() => {
        res.status(200).end();
    });
}

/**
 * Middleware to handle login requests.
 */
export function login(req: Request, res: Response, next: NextFunction): void {
    // Logic for handling login
    res.json({ message: 'Login successful' });
}

