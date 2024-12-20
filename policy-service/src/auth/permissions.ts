// src/auth/permissions.ts

const readRE = /^((.+)\.)?read$/;
const writeRE = /^((.+)\.)?write$/;

/**
 * Checks if a user has the required permission.
 * @param userScope The scope of the user.
 * @param permission The required permission.
 * @returns True if the user has the permission, otherwise false.
 */
export function hasPermission(userScope: string | string[], permission: string | string[]): boolean {
    if (permission === "") {
        return true;
    }

    if (Array.isArray(permission)) {
        return permission.every(perm => hasPermission(userScope, perm));
    }

    if (Array.isArray(userScope)) {
        return userScope.some(scope => hasPermission(scope, permission));
    }

    if (userScope === "*" || userScope === permission) {
        return true;
    }

    if (userScope === "read" || userScope === "*.read") {
        return readRE.test(permission);
    } else if (userScope === "write" || userScope === "*.write") {
        return writeRE.test(permission);
    }
    return false;
}

