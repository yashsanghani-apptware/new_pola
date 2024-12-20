import { Request, Response } from 'express';
import { Group } from '../models/group';
import { User } from '../models/user';
import PolicyModel from '../models/policy';
import { handleError } from '../middleware/errorHandler';

/**
 * GroupController handles the CRUD operations for Group documents in MongoDB.
 */
export class GroupController {
    /**
     * Creates a new group in the system.
     * Validates that all provided policy IDs exist before creating the group.
     *
     * @param req - Express Request object containing the group data.
     * @param res - Express Response object for sending the response.
     */
  // Method to create a new group with proper user and policy validation
  public async createGroup(req: Request, res: Response): Promise<void> {
    try {
      const { policies, members } = req.body;

      // Validate that all policy IDs exist
      if (policies && policies.length > 0) {
        const policyDocs = await PolicyModel.find({ _id: { $in: policies } });
        if (policyDocs.length !== policies.length) {
          res.status(400).json({ message: 'One or more Policy IDs do not exist.' });
          return; // Exit the function early if validation fails
        }
      }

      // Validate that all user IDs exist
      if (members && members.length > 0) {
        const userDocs = await User.find({ _id: { $in: members } });
        if (userDocs.length !== members.length) {
          res.status(400).json({ message: 'One or more User IDs do not exist.' });
          return; // Exit the function early if validation fails
        }
      }

      const group = new Group(req.body);
      await group.save();

      res.status(201).json(group);
    } catch (error) {
      handleError(res, error);
    }
  }
    /**
     * Retrieves all groups from the system.
     *
     * @param req - Express Request object.
     * @param res - Express Response object for sending the response.
     */
    public async getAllGroups(req: Request, res: Response): Promise<void> {
        try {
            const groups = await Group.find();
            res.status(200).json(groups);
        } catch (error) {
            console.error('Error fetching groups:', error);
            handleError(res, error);
        }
    }

    /**
     * Retrieves a group by its ID.
     *
     * @param req - Express Request object containing the group ID as a route parameter.
     * @param res - Express Response object for sending the response.
     */
    public async getGroupById(req: Request, res: Response): Promise<void> {
        try {
            const group = await Group.findById(req.params.id);
            if (!group) {
                res.status(404).json({ message: 'Group not found' });
            } else {
                res.status(200).json(group);
            }
        } catch (error) {
            console.error('Error fetching group:', error);
            handleError(res, error);
        }
    }

    /**
     * Updates a group by its ID.
     *
     * @param req - Express Request object containing the group ID and update data.
     * @param res - Express Response object for sending the response.
     */
    public async updateGroupById(req: Request, res: Response): Promise<void> {
        try {
            const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!group) {
                res.status(404).json({ message: 'Group not found' });
            } else {
                res.status(200).json(group);
            }
        } catch (error) {
            console.error('Error updating group:', error);
            handleError(res, error);
        }
    }

    /**
     * Deletes a group by its ID.
     *
     * @param req - Express Request object containing the group ID.
     * @param res - Express Response object for sending the response.
     */
    public async deleteGroupById(req: Request, res: Response): Promise<void> {
        try {
            const group = await Group.findByIdAndDelete(req.params.id);
            if (!group) {
                res.status(404).json({ message: 'Group not found' });
            } else {
                res.status(200).json({ message: 'Group deleted successfully' });
            }
        } catch (error) {
            console.error('Error deleting group:', error);
            handleError(res, error);
        }
    }

    /**
     * Searches for groups based on the provided query parameters.
     *
     * @param req - Express Request object containing the search query.
     * @param res - Express Response object for sending the response.
     */
    public async searchGroups(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query;
            const groups = await Group.find(query);
            res.status(200).json(groups);
        } catch (error) {
            console.error('Error searching for groups:', error);
            handleError(res, error);
        }
    }

    /**
     * Adds policies to a group.
     * Ensures that all policy IDs exist before adding them to the group.
     *
     * @param req - Express Request object containing the group ID and policies to add.
     * @param res - Express Response object for sending the response.
     */
    public async addPoliciesToGroup(req: Request, res: Response): Promise<void> {
        try {
            const groupId = req.params.id;
            const { policies } = req.body;

            if (!policies || !Array.isArray(policies) || policies.length === 0) {
                res.status(400).json({ message: 'Policies array must be provided and cannot be empty.' });
                return;
            }

            const policyDocs = await PolicyModel.find({ _id: { $in: policies } });
            if (policyDocs.length !== policies.length) {
                res.status(400).json({ message: 'One or more Policy IDs do not exist.' });
                return;
            }

            const updatedGroup = await Group.findByIdAndUpdate(
                groupId,
                { $addToSet: { policies: { $each: policies } } },
                { new: true }
            );

            if (!updatedGroup) {
                res.status(404).json({ message: 'Group not found' });
            } else {
                res.status(200).json(updatedGroup);
            }
        } catch (error) {
            console.error('Error adding policies to group:', error);
            handleError(res, error);
        }
    }
  /**
   * Add users to a group.
   * @param req - Express Request object containing the group ID in params and user IDs in body.
   * @param res - Express Response object used to send the response.
   */
  public async addUsersToGroup(req: Request, res: Response): Promise<void> {
    try {
      const groupId = req.params.id;
      const { userIds } = req.body;

      // Validate that userIds is provided and is an array with at least one element
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ message: 'User IDs array must be provided and cannot be empty.' });
        return;
      }

      // Check if all user IDs exist in the Users collection
      const existingUsers = await User.find({ _id: { $in: userIds } });
      if (existingUsers.length !== userIds.length) {
        res.status(400).json({ message: 'One or more User IDs do not exist in the Users collection.' });
        return;
      }

      // Add user IDs to the group's members array, avoiding duplicates
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: { $each: userIds } } },
        { new: true }  // Return the updated document
      );

      // If the group is not found, return a 404 error
      if (!updatedGroup) {
        res.status(404).json({ message: 'Group not found' });
        return;
      }

      // Respond with the updated group document
      res.status(200).json(updatedGroup);
    } catch (error) {
      handleError(res, error);  // Use the centralized error handler
    }
  }

  /**
   * Remove a user from a group.
   * @param req - Express Request object containing the group ID in params and user ID in body.
   * @param res - Express Response object used to send the response.
   */
  public async removeUserFromGroup(req: Request, res: Response): Promise<void> {
    try {
      const groupId = req.params.id;
      const { userId } = req.body;

      // Validate that userId is provided
      if (!userId) {
        res.status(400).json({ message: 'User ID must be provided.' });
        return;
      }

      // Find the group by ID
      const group = await Group.findById(groupId);
      if (!group) {
        res.status(404).json({ message: 'Group not found' });
        return;
      }

      // Check if the userId is in the members list
      if (!group.members.includes(userId)) {
        res.status(400).json({ message: 'User ID is not a member of this group.' });
        return;
      }

      // Remove the user ID from the group's members array
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $pull: { members: userId } },
        { new: true }  // Return the updated document
      );

      // Respond with the updated group document
      res.status(200).json(updatedGroup);
    } catch (error) {
      handleError(res, error);  // Use the centralized error handler
    }
  }
}

