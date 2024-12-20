// src/auth/users.ts

interface User {
    username: string;
    password: string;
    permissions: string[];
    [key: string]: any;
}

let users: Record<string, User> = {};

/**
 * Authenticates a user with a username and password.
 * @param username The username of the user.
 * @param password The password of the user.
 * @returns A promise that resolves to the authenticated user or null if authentication fails.
 */
export function authenticateUser(username: string, password: string): Promise<User | null> {
    const user = users[username];
    if (user && user.password === password) {
        return Promise.resolve(user);
    }
    return Promise.resolve(null);
}

/**
 * Retrieves a user by username.
 * @param username The username of the user.
 * @returns A promise that resolves to the user or null if not found.
 */
export function getUser(username: string): Promise<User | null> {
    return Promise.resolve(users[username] || null);
}

