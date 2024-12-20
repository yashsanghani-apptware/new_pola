import { Router } from 'express';
import { ResourceController } from '../controllers/resourceController';

// Create a new router instance
const router = Router();

// Instantiate the ResourceController
const resourceController = new ResourceController();

router.get('/', (req, res) => resourceController.getEvents(req, res));

// New route to aggregate events based on certain criteria
router.get('/:id/aggregate', (req, res) => resourceController.aggregateEvents(req, res));

// Route to get an event of a specific resource
router.get('/:id', (req, res) => resourceController.getEventById(req, res));

// Route to update an event of a specific resource
router.put('/:id', (req, res) => resourceController.updateEvent(req, res));

// Route to add an event to a specific resource
router.post('/', (req, res) => resourceController.addEvent(req, res));

// Route to delete an event from a specific resource
router.delete('/:id', (req, res) => resourceController.deleteEvent(req, res));

// New route to search events based on criteria
router.get('/search', (req, res) => resourceController.searchEvents(req, res));

export default router;
