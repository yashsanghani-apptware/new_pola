import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import PolicyService from '../services/PolicyService';

const JWT_SECRET = process.env.JWT_SECRET || 'agsiri2023'; // The shared secret used to verify JWT tokens

// Define a custom type for the Request to include the user property
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

/**
 * Middleware to check if the user is authenticated using JWT from an external service.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export const isAuthenticatedOld = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the shared secret or public key
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string; role: string };
    req.user = { id: decoded.userId, role: decoded.role }; // Attach necessary properties to req.user
    next();
  } catch (error: any) {
    console.error('Error verifying token:', error.message, error);
    return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the shared secret or public key
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string; role: string };
    req.user = { id: decoded.userId, role: decoded.role }; // Attach necessary properties to req.user
    next();
  } catch (error: any) {
    console.error('Error verifying token:', error.message, error);
    return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};

/**
 * Middleware to check if the user is authorized to perform a specific action based on policy evaluation.
 * @param action - The action to evaluate (e.g., 'dataroom.create').
 * @returns Middleware function that checks the user's authorization.
 */
export const authorizeAction = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve the principal (user ID) from the decoded token
      const {id, role} = req.user as {id: string, role: string};
      // req.user = req.user || {id: '', role: ''};
  
      const principalId = id; // Assuming userDetails object is set in req by isAuthenticated middleware
      const principalRole = role; // Retrieve the user role
      const token = req.headers.authorization?.split(' ')[1]; // Bearer token
      const ipAddress = req.ip; // Get client's IP address

      if (!principalId || !principalRole || !token) {
        return res.status(401).json({ message: 'Unauthorized. User or token missing.' });
      }

      // Use the resource ARI defined in the configuration
      const resourceARI = config.resourceARI;

      // Prepare the payload for the Policy Service request
      const policyPayload = {
        principal: {
          id: principalId,
          attributes: {
            role: principalRole,
          },
        },
        resource: {
          id: resourceARI,
          attributes: {
            // Add any additional resource attributes if required
          },
        },
        action: action,
      };

      // Send a POST request to the Policy Service for policy evaluation
      // const response = await axios.post(`${config.policyServiceUrl}/v1/policies/evaluate`, policyPayload, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      //Call internal function for authorization
      const isAllowed = await PolicyService.evaluatePolicy(policyPayload.principal, policyPayload.resource, policyPayload.action);
      // Debug statement to log the response from the server
      console.debug('Received response from Policy Service:', isAllowed);
    
      if (isAllowed) {
        // If the policy result is 'allowed', proceed to the next middleware or route handler
        next();
      } else {
        // If the policy result is not 'allowed', return a 403 Forbidden response
        return res.status(403).json({ message: 'Forbidden. You do not have permission to perform this action.' });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Handle axios-specific errors
        if (error.response) {
          // Server responded with a status code other than 2xx
          console.error('Policy Service error response:', {
            status: error.response.status,
            data: error.response.data,
          });
          return res.status(error.response.status).json({
            message: 'Error from Policy Service',
            details: error.response.data,
          });
        } else if (error.request) {
          // No response received from the server
          console.error('No response received from Policy Service:', error.request);
          return res.status(500).json({ message: 'No response received from Policy Service' });
        } else {
          // Error setting up the request
          console.error('Error setting up request to Policy Service:', error.message);
          return res.status(500).json({ message: 'Error setting up request to Policy Service' });
        }
      } else {
        // Handle other types of errors (not axios-related)
        console.error('Error during policy evaluation:', error.message);
        return res.status(500).json({ message: 'Internal server error during policy evaluation.' });
      }
    }
  };
};
