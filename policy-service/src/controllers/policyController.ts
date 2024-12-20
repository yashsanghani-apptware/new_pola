import { Request, Response } from 'express';  
import PolicyService from '../services/PolicyService';  
import { handleError } from '../middleware/errorHandler';  
import yaml from 'js-yaml';

/**
 * Helper function to parse the request body. 
 * It supports both YAML and JSON formats.
 * @param req - The Express request object.
 * @returns The parsed data as a JavaScript object.
 */

// Function to parse the request body

function parseRequestBody(req: Request): any {
    try {
        if (req.is('application/x-yaml')) {
            const parsedYaml = yaml.load(req.body);
            console.log('Parsed YAML as JSON:', JSON.stringify(parsedYaml, null, 2));
            return parsedYaml;
        }
        return req.body;
    } catch (error) {
        console.error('Error parsing request body:', error);
        throw new Error('Invalid request format');
    }
}


/**
 * The PolicyController class handles requests related to policy management.
 * It includes methods for CRUD operations, policy search, and policy evaluation.
 */
export class PolicyController {

    /**
     * Retrieve all policies from the database.
     * @param req - The Express request object.
     * @param res - The Express response object.
     */
    async getAllPolicies(req: Request, res: Response): Promise<void> {
        try {
            const policies = await PolicyService.getAllPolicies();
            res.status(200).json(policies);
        } catch (error) {
            handleError(res, error);
        }
    }

    /**
     * Retrieve a specific policy by its ID.
     * @param req - The Express request object.
     * @param res - The Express response object.
     */
    async getPolicyById(req: Request, res: Response): Promise<void> {
        try {
            const policy = await PolicyService.getPolicyById(req.params.id);
            if (policy) {
                res.status(200).json(policy);
            } else {
                res.status(404).json({ message: 'Policy not found' });
            }
        } catch (error) {
            handleError(res, error);
        }
    }

    /**
     * Create a new policy.
     * The request body can be in JSON or YAML format.
     * @param req - The Express request object.
     * @param res - The Express response object.
     */
    async createPolicy(req: Request, res: Response): Promise<void> {
        try {
            // Parse the incoming request body
            const parsedData = parseRequestBody(req);
            console.log('Parsed Data:', JSON.stringify(parsedData, null, 2)); // Log the parsed data
            // Create the policy using the PolicyService
            const policy = await PolicyService.createPolicy(parsedData);
            res.status(201).json(policy);
        } catch (error) {
            console.error('Error creating policy:', error);
            handleError(res, error);
        }
    }

    /**
     * Update an existing policy by its ID.
     * The request body can be in JSON or YAML format.
     * @param req - The Express request object.
     * @param res - The Express response object.
     */
    async updatePolicy(req: Request, res: Response): Promise<void> {
        try {
            // Parse the incoming request body
            const policyData = parseRequestBody(req);
            // Update the policy using the PolicyService
            const policy = await PolicyService.updatePolicy(req.params.id, policyData);
            if (policy) {
                res.status(200).json(policy);
            } else {
                res.status(404).json({ message: 'Policy not found' });
            }
        } catch (error) {
            console.error('Error updating policy:', error);
            handleError(res, error);
        }
    }

    /**
     * Delete a policy by its ID.
     * @param req - The Express request object.
     * @param res - The Express response object.
     */
    async deletePolicy(req: Request, res: Response): Promise<void> {
        try {
            const success = await PolicyService.deletePolicy(req.params.id);
            if (success) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Policy not found' });
            }
        } catch (error) {
            console.error('Error deleting policy:', error);
            handleError(res, error);
        }
    }

    /**
     * Search for policies based on filters provided in the request body.
     * The request body can be in JSON or YAML format.
     * @param req - The Express request object.
     * @param res - The Express response object.
     */
    async searchPolicies(req: Request, res: Response): Promise<void> {
        try {
            // Parse the incoming request body
            const filters = parseRequestBody(req);
            // Search policies using the PolicyService
            const policies = await PolicyService.searchPolicies(filters);
            res.json(policies);
        } catch (error) {
            console.error('Error searching policies:', error);
            handleError(res, error);
        }
    }

    /**
     * Evaluate whether a given action by a principal on a resource is allowed.
     * The request body can be in JSON or YAML format.
     * @param req - The Express request object.
     * @param res - The Express response object.
     */
    async evaluatePolicy(req: Request, res: Response): Promise<void> {
        try {
            // Parse the incoming request body
            const { principal, resource, action } = parseRequestBody(req);
            // Evaluate the policy using the PolicyService
            const result = await PolicyService.evaluatePolicy(principal, resource, action);
            res.status(200).json({ allowed: result });
        } catch (error) {
            console.error('Error evaluating policy:', error);
            handleError(res, error);
        }
    }
}

// Export an instance of the PolicyController class
export default new PolicyController();

