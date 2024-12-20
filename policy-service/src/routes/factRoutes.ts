import { Router } from 'express';
import { FactController } from '../controllers/factController';

const router = Router();
const factController = new FactController();

// POST /v1/facts - Create a new fact
router.post('/', (req, res) => factController.createFact(req, res));

// GET /v1/facts - Get all facts
router.get('/', (req, res) => factController.listFacts(req, res));

// GET /v1/facts/:id - Get a fact by ID
router.get('/:id', (req, res) => factController.getFact(req, res));

// PUT /v1/facts/:id - Update a fact by ID
router.put('/:id', (req, res) => factController.updateFact(req, res));

// DELETE /v1/facts/:id - Delete a fact by ID
router.delete('/:id', (req, res) => factController.deleteFact(req, res));

export default router;

