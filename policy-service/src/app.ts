import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { i18next, initI18n } from "./utils/i18n";
import setLocale from './middleware/i18n.middleware';

// Import the policy routes and user routes to handle API requests
import policyRoutes from './routes/policyRoutes';
import userRoutes from './routes/userRoutes';
import factRoutes from './routes/factRoutes';
import blacklistRoutes from './routes/blacklistRoutes';
import resourceRoutes from './routes/resourceRoutes';
import roleRoutes from './routes/roleRoutes';
import groupRoutes from './routes/groupRoutes';
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';
import healthRoutes from './routes/healthRoutes';

// Import the error handling middleware
import { handleError } from './middleware/errorHandler';
import cors  from "cors";

// Create an instance of an Express application
const app = express();

// Allow all origins or specify allowed origins
app.use(cors({
    origin: '*',  // You can replace this with '*'
  }));

// Use express.json() to parse incoming JSON requests
app.use(express.json());

initI18n().then(() => {
  app.use(setLocale); // Use the setLocale middleware
});

// Middleware to handle raw text bodies if needed (e.g., for YAML)
app.use(bodyParser.text({ type: 'application/x-yaml' }));

// Register the policy and user routes
app.use('/v1/policies', policyRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/facts', factRoutes);
app.use('/v1/blacklists', blacklistRoutes);
app.use('/v1/resources', resourceRoutes);
app.use('/v1/events', eventRoutes);
app.use('/v1/roles', roleRoutes);
app.use('/v1/groups', groupRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/health', healthRoutes);

// Generic error handling middleware
// This will catch any errors that occur in the routes and send a proper response
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    handleError(res, err);
});

// Export the Express application instance
export default app;

