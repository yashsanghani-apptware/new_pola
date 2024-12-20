import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user';
import bcrypt from 'bcryptjs';
import Redis from 'ioredis';

// Check if REDIS_URL is defined and throw an error if not
if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is not defined');
}

// Initialize Redis client using the REDIS_URL from environment variables
const redis = new Redis(process.env.REDIS_URL as string);

class AuthService {
  /**
   * Authenticates a user by their username and password.
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves to a JWT token if authentication is successful.
   * @throws An error if the credentials are invalid.
   */
  static async login(username: string, password: string): Promise<{token: string, user_details: IUser}> {
    // Find the user by username
    const user: IUser | null = await User.findOne({ username });
    if (!user) throw new Error('Invalid credentials');

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    // Generate a JWT token with the user's ID and username, and set an expiration time of 1 hour
    const token = jwt.sign({ userId: user._id, username: user.username, role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '12h' });
    
    let user_details = user;
    user_details.password = "null"
    
    // Store the token in Redis with an expiration time of 1 hour (3600 seconds)
    await redis.set(`token:${token}`, JSON.stringify(user), 'EX', 43200);

    return {token, user_details };
  }

  /**
   * Refreshes an existing JWT token.
   * @param token - The existing JWT token.
   * @returns A promise that resolves to a new JWT token if the existing token is valid.
   * @throws An error if the existing token has expired.
   */
  static async refreshToken(token: string): Promise<string> {
    // Retrieve the user data associated with the provided token from Redis
    const userData = await redis.get(`token:${token}`);
    if (!userData) throw new Error('Token expired');

    // Parse the user data from the Redis response
    const user = JSON.parse(userData);

    // Generate a new JWT token with the user's ID and username, and set an expiration time of 1 hour
    const newToken = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '12h' });
    
    // Store the new token in Redis with an expiration time of 1 hour (3600 seconds)
    await redis.set(`token:${newToken}`, JSON.stringify(user), 'EX', 43200);

    return newToken;
  }
}

export default AuthService;

