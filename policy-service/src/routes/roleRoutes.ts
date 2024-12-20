import { Router } from 'express';
import { RoleController } from '../controllers/roleController';

// Create a new router instance
const router = Router();

// Instantiate the RoleController
const roleController = new RoleController();

// Route to create a new role
router.post('/', (req, res) => roleController.createRole(req, res));

// Route to get all roles
router.get('/', (req, res) => roleController.getAllRoles(req, res));

// Route to get a role by ID
router.get('/:id', (req, res) => roleController.getRoleById(req, res));

// Route to update a role by ID
router.put('/:id', (req, res) => roleController.updateRoleById(req, res));

// Route to delete a role by ID
router.delete('/:id', (req, res) => roleController.deleteRoleById(req, res));

// Route to search roles by text query
router.get('/search', (req, res) => roleController.searchRoles(req, res));

// Route to add policies to a role
router.post('/:id/policies', (req, res) => roleController.addPoliciesToRole(req, res));

export default router;

