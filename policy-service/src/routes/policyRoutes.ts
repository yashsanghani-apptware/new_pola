// src/routes/policyRoutes.ts
import { Router } from 'express';
import PolicyController from '../controllers/policyController';
import { validatePolicyMiddleware } from '../middleware/validatePolicyMiddleware';

const router = Router();

// POST /v1/policies/evaluate - Evaluate Policies
router.post('/evaluate', PolicyController.evaluatePolicy);

// POST /v1/policies/simulate - Evaluate a policy based on a simulation request
router.post('/simulate', PolicyController.evaluatePolicy);

// POST /v1/policies/search - Search policies
router.post('/search', PolicyController.searchPolicies);

// GET /v1/policies - Retrieve all policies
router.get('/', PolicyController.getAllPolicies);

// GET /v1/policies/:id - Retrieve a single policy by its ID
router.get('/:id', PolicyController.getPolicyById);

// POST /v1/policies - Create a new policy
router.post('/', validatePolicyMiddleware, PolicyController.createPolicy);

// PUT /v1/policies/:id - Update an existing policy by its ID
router.put('/:id', PolicyController.updatePolicy);

// DELETE /v1/policies/:id - Delete a policy by its ID
router.delete('/:id', PolicyController.deletePolicy);

export default router;

