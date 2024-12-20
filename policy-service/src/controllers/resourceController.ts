import { Request, Response } from 'express';
import { Resource } from '../models/resource';
import { ResourceService } from '../services/ResourceService';
import { handleError } from '../middleware/errorHandler';
import { ResourceEvent } from '../models/event'; // Import the renamed model and interface
import { Event } from '../models/types';
import mongoose, { Types } from 'mongoose';

/**
 * ResourceController handles the CRUD operations for Resource documents in MongoDB.
 */
export class ResourceController {
  private resourceService: ResourceService;

  constructor() {
    this.resourceService = new ResourceService(); // Initialize ResourceService
  }

  /**
   * Create a new resource
   * @param req - Express request object
   * @param res - Express response object
   */

  // public async createResource(req: Request, res: Response): Promise<void> {
  //   try {
  //     const newResource = new Resource({
  //       ...req.body,
  //       events: req.body.events || [], // Initialize events if not provided
  //     });
  //     await newResource.save();
  //     res.status(201).json(newResource);
  //   } catch (error: unknown) {
  //     handleError(res, error);
  //   }
  // }


  public async createResource(req: Request, res: Response): Promise<void> {
    try {
      // Call the createResource function from ResourceService with the request body
      const createdResource = await this.resourceService.createResource({
        ...req.body,
        events: req.body.events || [], // Initialize events if not provided
      });

      if (!createdResource) {
        res.status(409).json({ message: `Resource with ARI ${req.body.ari} already exists. Duplicate creation is not allowed.` });
        return;
      }

      res.status(201).json(createdResource);
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Get all resources
   * @param req - Express request object
   * @param res - Express response object
   */
  public async getAllResources(req: Request, res: Response): Promise<void> {
    try {
      const resources = await Resource.find().exec(); // Ensure we get all fields including `events`
      res.status(200).json(resources);
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Get a resource by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  public async getResourceById(req: Request, res: Response): Promise<void> {
    try {
      const resource = await Resource.findById(req.params.id);
      if (!resource) {
        res.status(404).json({ message: 'Resource not found' });
      } else {
        res.status(200).json(resource);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Update a resource by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  public async updateResourceById(req: Request, res: Response): Promise<void> {
    try {
      const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedResource) {
        res.status(404).json({ message: 'Resource not found' });
      } else {
        res.status(200).json(updatedResource);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Delete a resource by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  public async deleteResourceById(req: Request, res: Response): Promise<void> {
    try {
      const deletedResource = await Resource.findByIdAndDelete(req.params.id);
      if (!deletedResource) {
        res.status(404).json({ message: 'Resource not found' });
      } else {
        res.status(200).json({ message: 'Resource deleted successfully' });
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }
  /**
   * Search for resources with filters, pagination, and sorting
   * @param req - Express request object
   * @param res - Express response object
   */

  public async searchResources(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', ...filters } = req.query;

      // Convert query parameters to correct types
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const sortOptions: Record<string, 1 | -1> = { [String(sort)]: order === 'desc' ? -1 : 1 };

      // Construct filters with regex for partial and case-insensitive search
      const filterObject: Record<string, any> = {};
      for (const [key, value] of Object.entries(filters)) {
        // Check if value is provided
        if (value) {
          filterObject[key] = { $regex: value, $options: 'i' }; // 'i' for case-insensitive regex
        }
      }

      // Construct the query with filtering, sorting, and pagination
      const query = Resource.find(filterObject)
        .sort(sortOptions)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

      const resources = await query.exec();
      const total = await Resource.countDocuments(filterObject);

      res.status(200).json({
        resources,
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
      });
    } catch (error: unknown) {
      handleError(res, error);
    }
  }


  /**
   * Query for resources using complex MongoDB queries
   * @param req - Express request object
   * @param res - Express response object
   */

  public async queryResources(req: Request, res: Response): Promise<void> {
    try {
      const { filter = {}, projection = {}, sort = { createdAt: -1 }, skip = 0, limit = 10 } = req.body;

      const query = Resource.find(filter, projection)
        .sort(sort)
        .skip(Number(skip))
        .limit(Number(limit));

      const resources = await query.exec();

      // Get total count for pagination metadata
      const total = await Resource.countDocuments(filter);

      res.status(200).json({
        resources,
        total,
        skip: Number(skip),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      });
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Add an event to a resource
   * @param req - Express request object
   * @param res - Express response object
   */
  public async addEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params; // Resource ID
      const eventData: Event = req.body; // Event data from the request

      // Find the resource by ID
      const resource = await Resource.findById(id).exec();
      if (!resource) {
        res.status(404).json({ message: 'Resource not found' });
        return;
      }

      // Check for existing event by a combination of unique fields
      const existingEvent = await ResourceEvent.findOne({
        resourceId: id,
        eventName: eventData.eventName,
        timestamp: eventData.timestamp
      }).exec();

      if (existingEvent) {
        res.status(400).json({ message: 'Duplicate event already exists for this resource' });
        return;
      }

      // Create and save the new event with both resourceId and ari
      const newEvent = new ResourceEvent({
        ...eventData,
        resourceId: id,
        ari: resource.ari // Add the ARI from the resource
      });
      await newEvent.save();

      res.status(201).json({ message: 'Event added successfully', event: newEvent });
    } catch (error) {
      handleError(res, error as Error); // Error handling
    }
  }
  /**
   * Get an event by its ID
   * @param req - Express request object
   * @param res - Express response object
   */
  public async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params; // Event ID

      // Find the event by its ID within the ResourceEvent collection
      const event = await ResourceEvent.findById(eventId).exec();
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }

      // Return the event details
      res.status(200).json(event);
    } catch (error) {
      handleError(res, error as Error); // Use error handling
    }
  }
  /**
   * Update an event of a resource by event ID
   * @param req - Express request object
   * @param res - Express response object
   */
  public async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const updatedEvent: Partial<Event> = req.body; // Use Partial to allow partial updates

      // Find the event by its ID
      const event = await ResourceEvent.findById(eventId).exec();
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }

      // Update the event fields with the new data
      Object.assign(event, updatedEvent);
      await event.save();

      res.status(200).json(event);
    } catch (error: unknown) {
      handleError(res, error as Error);
    }
  }
  /**
   * Delete an event from a resource by event ID
   * @param req - Express request object
   * @param res - Express response object
   */
  public async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;

      // Find and delete the event by its ID
      const event = await ResourceEvent.findByIdAndDelete(eventId).exec();
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }

      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error: unknown) {
      handleError(res, error as Error);
    }
  }
  /**
   * Get all events of a resource
   * @param req - Express request object
   * @param res - Express response object
   */
  public async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params; // Resource ID

      // Find all events associated with the resource ID
      const events = await ResourceEvent.find({ resourceId: id }).exec();
      if (!events || events.length === 0) {
        res.status(404).json({ message: 'No events found for this resource' });
        return;
      }

      res.status(200).json(events);
    } catch (error: unknown) {
      handleError(res, error as Error);
    }
  }

  /**
   * Search events with flexible criteria
   * @param req - Express request object
   * @param res - Express response object
   */
  public async searchEvents(req: Request, res: Response): Promise<void> {
    try {
      const {
        resourceId,
        eventType,
        severity,
        startDate,
        endDate,
        context,
        attr,
        sortField,
        sortOrder,
        limit,
        offset
      } = req.query;

      // Build the search criteria dynamically
      const searchCriteria: any = {};

      if (resourceId) searchCriteria.resourceId = resourceId;
      if (eventType) searchCriteria.type = eventType;
      if (severity) searchCriteria.severity = severity;
      if (startDate || endDate) {
        searchCriteria.timestamp = {};
        if (startDate) searchCriteria.timestamp.$gte = new Date(startDate as string);
        if (endDate) searchCriteria.timestamp.$lte = new Date(endDate as string);
      }
      if (context) searchCriteria.context = { $elemMatch: context }; // Flexible match for context
      if (attr) searchCriteria.attr = { $elemMatch: attr }; // Flexible match for attributes

      // Build sorting and pagination options
      const sortOptions: any = {};
      if (sortField && sortOrder) {
        sortOptions[sortField as string] = sortOrder === 'asc' ? 1 : -1;
      }

      // Perform the search with pagination and sorting
      const events = await ResourceEvent.find(searchCriteria)
        .sort(sortOptions)
        .skip(Number(offset) || 0)
        .limit(Number(limit) || 20) // Default limit
        .exec();

      res.status(200).json(events);
    } catch (error) {
      handleError(res, error as Error);
    }
  }
  /**
   * Aggregate events by type, severity, or other criteria
   * @param req - Express request object
   * @param res - Express response object
   */


  public async aggregateEvents(req: Request, res: Response): Promise<void> {
    try {
      const { id: resourceId } = req.params;
      const { groupBy } = req.query;

      if (!groupBy) {
        res.status(400).json({ message: 'Missing required query parameter: groupBy' });
        return;
      }

      // Convert resourceId to ObjectId if necessary
      const matchResourceId = mongoose.Types.ObjectId.isValid(resourceId)
        ? new mongoose.Types.ObjectId(resourceId)
        : resourceId;

      // Debugging: Log the inputs
      console.log('Resource ID:', matchResourceId);
      console.log('Group By Field:', groupBy);

      // Run the aggregation with additional debugging to see what is being matched
      const aggregationResult = await ResourceEvent.aggregate([
        { $match: { resourceId: matchResourceId } }, // Match events for the specific resource
        { $group: { _id: `$${groupBy}`, count: { $sum: 1 }, events: { $push: "$$ROOT" } } }
      ]);

      console.log('Aggregation Result:', JSON.stringify(aggregationResult, null, 2)); // Debugging output

      res.status(200).json(aggregationResult);
    } catch (error) {
      handleError(res, error as Error); // Use error handling
    }
  }


  /**
  * Get the list of policies bound to a resource
  * @param req - Express request object
  * @param res - Express response object
  */
  public async getPolicies(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resource = await Resource.findById(id).populate('policies'); // Populating the policies

      if (!resource) {
        res.status(404).json({ message: 'Resource not found' });
      } else {
        res.status(200).json(resource.policies);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }
  /**
   * Get the list of eventPolicy type policies bound to a resource
   * @param req - Express request object
   * @param res - Express response object
   */
  public async getEventPolicies(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resource = await Resource.findById(id).populate('policies');

      if (!resource) {
        res.status(404).json({ message: 'Resource not found' });
      } else {
        // Check if policies exist and filter to include only those of type 'eventPolicy'
        const eventPolicies = (resource.policies || []).filter((policy: any) => policy.eventPolicy);
        res.status(200).json(eventPolicies);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }
  /**
     * Add a new policy to a resource
     * @param req - Express request object
     * @param res - Express response object
     */
  public async addPolicy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const policyData = req.body;
      const policy = await this.resourceService.addPolicy(id, policyData);
      if (!policy) {
        res.status(404).json({ message: 'Resource or Policy not found' });
      } else {
        res.status(201).json(policy);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Update a policy of a resource
   * @param req - Express request object
   * @param res - Express response object
   */
  public async updatePolicy(req: Request, res: Response): Promise<void> {
    try {
      // Extract resource ID and policy ID from the request parameters
      const { id: resourceId, policyId } = req.params;
      const updateData = req.body;

      // Call the updatePolicy method from the resource service with resourceId, policyId, and updateData
      const updatedPolicy = await this.resourceService.updatePolicy(resourceId, policyId, updateData);

      // Check if the policy was found and updated
      if (!updatedPolicy) {
        res.status(404).json({ message: 'Policy not found or could not be updated' });
      } else {
        res.status(200).json(updatedPolicy);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }


  /**
   * Delete a policy from a resource
   * @param req - Express request object
   * @param res - Express response object
   */
  public async deletePolicy(req: Request, res: Response): Promise<void> {
    try {
      const { id, policyId } = req.params;
      const updatedResource = await this.resourceService.removePolicy(id, policyId);
      if (!updatedResource) {
        res.status(404).json({ message: 'Resource or Policy not found' });
      } else {
        res.status(200).json({ message: 'Policy removed successfully', resource: updatedResource });
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Grant actions to a resource
   * @param req - Express request object
   * @param res - Express response object
   */
  public async grantActions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const actions = req.body.actions;
      const updatedResource = await this.resourceService.grantActions(id, actions);
      if (!updatedResource) {
        res.status(404).json({ message: 'Resource not found or error granting actions' });
      } else {
        res.status(200).json(updatedResource);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Revoke actions from a resource
   * @param req - Express request object
   * @param res - Express response object
   */
  public async revokeActions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const actionsToRemove = req.body.actions;
      const updatedResource = await this.resourceService.revokeActions(id, actionsToRemove);
      if (!updatedResource) {
        res.status(404).json({ message: 'Resource not found or error revoking actions' });
      } else {
        res.status(200).json(updatedResource);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }
  // Method to get aggregated policies for a resource
  public async getAggregatedPolicies(req: Request, res: Response): Promise<void> {
    try {
      const resourceId = req.params.id;

      // Call the service method to aggregate policies
      const aggregatedPolicies = await this.resourceService.aggregatedResourcePolicies(resourceId);

      if (!aggregatedPolicies) {
        res.status(404).json({ message: 'No aggregated policies found for this resource.' });
      } else {
        res.status(200).json(aggregatedPolicies);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }
}


