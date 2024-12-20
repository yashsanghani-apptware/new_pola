import { Router } from 'express';
import { BlacklistController } from '../controllers/blacklistController';

const router = Router();
const blacklistController = new BlacklistController();

// POST /v1/blacklists - Create a new blacklist entry
router.post('/', (req, res) => blacklistController.createBlacklist(req, res));

// GET /v1/blacklists - Get all blacklist entries
router.get('/', (req, res) => blacklistController.listBlacklists(req, res));

// GET /v1/blacklists/:id - Get a blacklist entry by ID
router.get('/:id', (req, res) => blacklistController.getBlacklist(req, res));

// PUT /v1/blacklists/:id - Update a blacklist entry by ID
router.put('/:id', (req, res) => blacklistController.updateBlacklist(req, res));

// DELETE /v1/blacklists/:id - Delete a blacklist entry by ID
router.delete('/:id', (req, res) => blacklistController.deleteBlacklist(req, res));

export default router;

