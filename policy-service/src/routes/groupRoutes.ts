import { Router } from 'express';
import { GroupController } from '../controllers/groupController';

// Instantiate the GroupController
const groupController = new GroupController();

// Create a new router instance
const router = Router();

// Define routes for the group-related operations
router.post('/', groupController.createGroup.bind(groupController)); // Create a new group
router.get('/', groupController.getAllGroups.bind(groupController)); // Get all groups
router.get('/:id', groupController.getGroupById.bind(groupController)); // Get a group by ID
router.put('/:id', groupController.updateGroupById.bind(groupController)); // Update a group by ID
router.delete('/:id', groupController.deleteGroupById.bind(groupController)); // Delete a group by ID
// Route to add users to a group
router.post('/:id/users', (req, res) => groupController.addUsersToGroup(req, res));

// Route to remove a user from a group
router.post('/:id/users/remove', (req, res) => groupController.removeUserFromGroup(req, res));

router.post('/:id/policies', groupController.addPoliciesToGroup.bind(groupController)); // Add policies to a group
router.get('/search', groupController.searchGroups.bind(groupController)); // Search for groups

// Export the router instance
export default router;

