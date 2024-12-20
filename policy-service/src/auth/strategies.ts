// src/auth/strategies.ts

import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as ClientPasswordStrategy } from 'passport-oauth2-client-password';
import * as Tokens from './tokens';
import * as Users from './users';
import * as Clients from './clients';

/**
 * Bearer strategy for token authentication.
 */
const bearerStrategy = new BearerStrategy((accessToken: string, done: Function) => {
    Tokens.getToken(accessToken).then(token => {
        if (token) {
            Users.getUser(token.user).then(user => {
                if (user) {
                    return done(null, user, { scope: token.scope });
                }
                return done(null, false);
            });
        } else {
            return done(null, false);
        }
    }).catch(err => done(err, false));
});

/**
 * Client Password strategy for client authentication.
 */
const clientPasswordStrategy = new ClientPasswordStrategy((clientId: string, clientSecret: string, done: Function) => {
    Clients.getClient(clientId).then(client => {
        if (client && client.secret === clientSecret) {
            return done(null, client);
        } else {
            return done(null, false);
        }
    }).catch(err => done(err, false));
});

export { bearerStrategy, clientPasswordStrategy };

