import { Router } from 'express';
import { ResourceController } from '../controllers/resourceController';

// Create a new router instance
const router = Router();

// Instantiate the ResourceController
const resourceController = new ResourceController();

// Route to query resources using extensive logical and complex query support
router.post('/query', (req, res) => resourceController.queryResources(req, res));

// Route to query resources using extensive logical and complex query support
router.get('/search', (req, res) => resourceController.searchResources(req, res));

// Route to create a new resource
router.post('/', (req, res) => resourceController.createResource(req, res));

// Route to get all resources
router.get('/', (req, res) => resourceController.getAllResources(req, res));

// Route to get a resource by ID
router.get('/:id', (req, res) => resourceController.getResourceById(req, res));

// Route to update a resource by ID
router.put('/:id', (req, res) => resourceController.updateResourceById(req, res));

// Route to delete a resource by ID
router.delete('/:id', (req, res) => resourceController.deleteResourceById(req, res));

// Route to get all events associated with a specific resource
router.get('/:id/events', (req, res) => resourceController.getEvents(req, res));

// New route to aggregate events based on certain criteria
router.get('/:id/events/aggregate', (req, res) => resourceController.aggregateEvents(req, res));

// Route to update an event of a specific resource
router.get('/:id/events/:eventId', (req, res) => resourceController.getEventById(req, res));

// Route to update an event of a specific resource
router.put('/:id/events/:eventId', (req, res) => resourceController.updateEvent(req, res));

// Route to add an event to a specific resource
router.post('/:id/events', (req, res) => resourceController.addEvent(req, res));

// Route to delete an event from a specific resource
router.delete('/:id/events/:eventId', (req, res) => resourceController.deleteEvent(req, res));

// New route to search events based on criteria
router.get('/:id/events/search', (req, res) => resourceController.searchEvents(req, res));


// Route to get the list of policies bound to a resource
router.get('/:id/policies', (req, res) => resourceController.getPolicies(req, res));

// Route to get the list of eventPolicy type policies bound to a resource
router.get('/:id/event/policies', (req, res) => resourceController.getEventPolicies(req, res));

// Route to add a policy to a resource
router.post('/:id/policies', (req, res) => resourceController.addPolicy(req, res));

// Route to update a policy of a resource
router.put('/:id/policies/:policyId', (req, res) => resourceController.updatePolicy(req, res));

// Route to delete a policy from a resource
router.delete('/:id/policies/:policyId', (req, res) => resourceController.deletePolicy(req, res));

// Route to grant actions to a resource
router.post('/:id/actions/grant', (req, res) => resourceController.grantActions(req, res));

// Route to revoke actions from a resource
router.delete('/:id/actions/revoke', (req, res) => resourceController.revokeActions(req, res));

// Route to get aggregated policies for a resource
router.get('/:id/policies/aggregator', (req, res) => resourceController.getAggregatedPolicies(req, res));

export default router;
