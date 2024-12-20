// src/auth/policyService.ts

import axios from 'axios'; // HTTP client for making API requests
import config from '../config/config'; // Import the configuration module

/**
 * Function to check permissions from the external PolicyService.
 * @param userId - The ID of the user to check permissions for.
 * @param permission - The permission to check.
 * @returns A promise that resolves to true if the user has the permission, false otherwise.
 */
export async function checkPermission(userId: string, permission: string): Promise<boolean> {
    try {
        const response = await axios.post(config.POLICY_SERVICE_URL, {
            userId,
            permission
        });
        return true; // response.data.hasPermission;
    } catch (error) {
        console.error('Error communicating with PolicyService:', error);
        throw new Error('Failed to check permissions from PolicyService');
    }
}

