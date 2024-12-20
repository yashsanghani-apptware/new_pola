// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

class AuthController {
  /**
   * Handles user login.
   * @param req - The request object, containing username and password.
   * @param res - The response object, used to send the JWT token if login is successful.
   * @param next - The next middleware function in the stack.
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      // Authenticate the user and generate a JWT token
      const token = await AuthService.login(username, password);
      // Send the JWT token in the response
      res.status(200).json( token );
    } catch (error) {
      // Pass any errors to the error-handling middleware
      next(error);
    }
  }

  /**
   * Handles token refresh.
   * @param req - The request object, containing the existing JWT token.
   * @param res - The response object, used to send the new JWT token if the refresh is successful.
   * @param next - The next middleware function in the stack.
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      // Refresh the JWT token
      const newToken = await AuthService.refreshToken(token);
      // Send the new JWT token in the response
      res.status(200).json({ token: newToken });
    } catch (error) {
      // Pass any errors to the error-handling middleware
      next(error);
    }
  }
}

export default AuthController;


