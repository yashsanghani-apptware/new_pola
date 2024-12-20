// src/services/GroupService.ts

import { Group, IGroup } from '../models/group';
import PolicyModel, { Policy } from '../models/policy';
import { GroupPolicy } from '../models/types';
import { HydratedDocument } from 'mongoose';
import mongoose, { Types, Document } from 'mongoose';
export class GroupService {

  /**
   * Creates a new group.
   * 
   * @param {Partial<IGroup>} data - Partial group data used to create a new group.
   * @returns {Promise<IGroup>} - The newly created group.
   */
  async createGroup(data: Partial<IGroup>): Promise<IGroup> {
    const group = new Group(data);
    return await group.save();
  }

  /**
   * Creates a group if it doesn't exist.
   * 
   * @param groupName - The name of the group.
   * @param description - The description of the group.
   * @returns A promise that resolves to the created or existing group.
   * @throws An error if the operation fails.
   */
  async createGroupIfNotExists(groupName: string, description: string): Promise<IGroup> {
    try {
      let group = await Group.findOne({ name: groupName }).exec();
      if (!group) {
        group = new Group({ name: groupName, description });
        await group.save();
      }
      return group;
    } catch (error) {
      console.error('Error creating or fetching group:', error);
      throw error;
    }
  }

  /**
  * Retrieves a group by its ID.
  * 
  * @param {string} id - The ID of the group to retrieve.
  * @returns {Promise<IGroup | null>} - The group object if found, or null if not found.
  * @throws {Error} - Throws an error if the provided ID is invalid.
  */
  async getGroupById(id: string): Promise<IGroup | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Group ID');
    }
    return await Group.findById(id).exec();
  }

  /**
  * Updates a group by its ID.
  * 
  * @param {string} id - The ID of the group to update.
  * @param {Partial<IGroup>} data - The partial data to update the group with.
  * @returns {Promise<IGroup | null>} - The updated group object if successful, or null if the group was not found.
  * @throws {Error} - Throws an error if the provided ID is invalid.
  */
  async updateGroup(id: string, data: Partial<IGroup>): Promise<IGroup | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Group ID');
    }
    return await Group.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
  * Deletes a group by its ID.
  * 
  * @param {string} id - The ID of the group to delete.
  * @returns {Promise<IGroup | null>} - The deleted group object if successful, or null if the group was not found.
  * @throws {Error} - Throws an error if the provided ID is invalid.
  */
  async deleteGroup(id: string): Promise<IGroup | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Group ID');
    }
    return await Group.findByIdAndDelete(id).exec();
  }

  /**
  * Lists all groups.
  * 
  * @returns {Promise<IGroup[]>} - An array of all groups.
  */
  async listGroups(): Promise<IGroup[]> {
    return await Group.find().exec();
  }

  /**
  * Searches for groups by name or description.
  * 
  * @param {string} query - The search query used to match groups by name or description.
  * @returns {Promise<IGroup[]>} - An array of groups that match the search query.
  */
  async searchGroups(query: string): Promise<IGroup[]> {
    return await Group.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    }).exec();
  }

  /**
   * Grants a policy to a group for specific actions on a resource.
   * 
   * @param {string} groupId - The ID of the group to which the policy will be granted.
   * @param {string} resourceAri - The ARI of the resource to which the policy will apply.
   * @param {Array<{ action: string; effect: string; condition?: any }>} actions - An array of actions, each with an associated effect and optional condition.
   * @returns {Promise<IGroup | null>} - Returns the updated group with the newly added policy or null if the group is not found.
   * @throws {Error} - Throws an error if the group is not found or if there is an issue saving the policy.
   */
  async grantActions(groupId: string, resourceAri: string, actions: { action: string; effect: string; condition?: any }[]): Promise<IGroup | null> {
    try {
      const group = await Group.findById(groupId);
      if (!group) throw new Error('Group not found');

      // Create a new policy
      const policy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        groupPolicy: {
          group: group._id,
          version: '1.0',
          rules: [
            {
              resource: resourceAri,
              actions: actions,
            }
          ]
        },
        auditInfo: {
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
        }
      });

      await policy.save();

      if (!group.policies?.includes(policy._id as any)) {
        group.policies?.push(policy._id as any);
        await group.save();
      }

      return group;
    } catch (error) {
      console.error('Error granting policy to group:', error);
      throw error;
    }
  }

  /**
  * Revokes specific actions from a group's policy on a resource.
  * 
  * @param {string} groupId - The ID of the group from which the policy will be revoked.
  * @param {string} resourceAri - The ARI of the resource for which the policy applies.
  * @param {string[]} actionsToRemove - An array of actions to be removed from the policy.
  * @returns {Promise<IGroup | null>} - Returns the updated group after the policy has been modified or null if the group is not found.
  * @throws {Error} - Throws an error if the group or policy is not found or if there is an issue updating the policy.
  */

  async revokeActions(groupId: string, resourceAri: string, actionsToRemove: string[]): Promise<IGroup | null> {
    try {
      // Find the group and populate the policies as `Policy[]`
      const group = await Group.findById(groupId).populate<{ policies: Policy[] }>('policies');
      if (!group) throw new Error('Group not found');

      const policy = group.policies.find((policy: Policy) =>
        policy.groupPolicy?.rules?.some(rule => rule.resource === resourceAri)
      );

      if (!policy) throw new Error('Policy not found');

      let removePolicy = false;

      if (policy.groupPolicy?.rules) {
        const rule = policy.groupPolicy.rules.find(rule => rule.resource === resourceAri);
        if (rule) {
          rule.actions = rule.actions.filter(action => !actionsToRemove.includes(action.action));

          if (rule.actions.length === 0) {
            policy.groupPolicy.rules = policy.groupPolicy.rules.filter(r => r.resource !== resourceAri);
          }

          if (policy.groupPolicy.rules.length === 0) {
            removePolicy = true;
          } else {
            await policy.save();
          }
        }
      }

      if (removePolicy) {
        // Remove the policy reference from the group
        group.policies = group.policies.filter((p: Policy) => {
          const policyId = p._id as Types.ObjectId; // Cast _id to ObjectId

          // Ensure both policyId and policy._id are of type ObjectId before comparing
          if (policy._id instanceof Types.ObjectId && policyId instanceof Types.ObjectId) {
            return !policyId.equals(policy._id);
          }
          return true; // If types don't match, skip removing (safety net)
        });

        // Save the updated group before deleting the policy
        await group.save();

        // Remove the policy from the Policy collection
        await PolicyModel.findByIdAndDelete(policy._id);
      }

      // Return the updated group
      return await Group.findById(groupId).exec(); // Return the group without repopulating policies
    } catch (error) {
      console.error('Error revoking policy from group:', error);
      throw error;
    }
  }

}

