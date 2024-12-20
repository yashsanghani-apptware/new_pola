// src/routes/auth.routes.ts

import { Router } from 'express';
import AuthController from '../controllers/authController';

// Create a new router instance
const router = Router();

/**
 * @route POST /auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @param {string} username - The username of the user
 * @param {string} password - The password of the user
 * @returns {string} token - The JWT token for authenticated user
 */
router.post('/login', AuthController.login);

/**
 * @route POST /auth/refresh-token
 * @desc Refresh the JWT token
 * @access Public
 * @param {string} token - The existing JWT token
 * @returns {string} token - The new JWT token
 */
router.post('/refresh-token', AuthController.refreshToken);

export default router;


