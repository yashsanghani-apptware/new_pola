// src/services/RoleService.ts
import { Role, IRole } from '../models/role';
import PolicyModel, { Policy } from '../models/policy';
import { RolePolicy } from '../models/types';
import mongoose, { Types } from 'mongoose';
import { Logger } from '../utils/logger';

export class RoleService {
  /**
   * Creates a new role.
   * 
   * @param {Partial<IRole>} data - Partial data object used to create a new role.
   * @returns {Promise<IRole>} - A promise that resolves to the newly created role.
   */
  async createRole(data: Partial<IRole>): Promise<IRole> {
    const role = new Role(data);
    return await role.save();
  }
  /**
   * Creates a role if it doesn't exist.
   * 
   * @param roleName - The name of the role.
   * @param description - The description of the role.
   * @returns A promise that resolves to the created or existing role.
   * @throws An error if the operation fails.
   */
  async createRoleIfNotExists(roleName: string, description: string): Promise<IRole> {
    try {
      let role = await Role.findOne({ name: roleName }).exec();
      if (!role) {
        role = new Role({ name: roleName, description });
        await role.save();
      }
      return role;
    } catch (error) {
      console.error('Error creating or fetching role:', error);
      throw error;
    }
  }

  /**
   * Retrieves a role by its ID.
   * 
   * @param {string} id - The ID of the role to retrieve.
   * @returns {Promise<IRole | null>} - A promise that resolves to the role if found, or null if not found.
   * @throws {Error} - Throws an error if the provided ID is not a valid ObjectId.
   */
  async getRoleById(id: string): Promise<IRole | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Role ID');
    }
    return await Role.findById(id).exec();
  }

  /**
   * Updates a role by its ID with the provided data.
   * 
   * @param {string} id - The ID of the role to update.
   * @param {Partial<IRole>} data - Partial data object used to update the role.
   * @returns {Promise<IRole | null>} - A promise that resolves to the updated role if successful, or null if not found.
   * @throws {Error} - Throws an error if the provided ID is not a valid ObjectId.
   */
  async updateRole(id: string, data: Partial<IRole>): Promise<IRole | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Role ID');
    }
    return await Role.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Deletes a role by its ID.
   * 
   * @param {string} id - The ID of the role to delete.
   * @returns {Promise<IRole | null>} - A promise that resolves to the deleted role if successful, or null if not found.
   * @throws {Error} - Throws an error if the provided ID is not a valid ObjectId.
   */
  async deleteRole(id: string): Promise<IRole | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Role ID');
    }
    return await Role.findByIdAndDelete(id).exec();
  }

  /**
   * Lists all roles.
   * 
   * @returns {Promise<IRole[]>} - A promise that resolves to an array of all roles.
   */
  async listRoles(): Promise<IRole[]> {
    return await Role.find().exec();
  }

  /**
   * Searches for roles by name or description.
   * 
   * @param {string} query - The search query to match against role names and descriptions.
   * @returns {Promise<IRole[]>} - A promise that resolves to an array of roles matching the query.
   */
  async searchRoles(query: string): Promise<IRole[]> {
    return await Role.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    }).exec();
  }

  /**
   * Grants a policy to a role for specific actions on a resource.
   * 
   * @param {string} roleId - The ID of the role to which the policy will be granted.
   * @param {string} resourceAri - The ARI of the resource to which the policy will apply.
   * @param {Array<{ action: string; effect: string; condition?: any }>} actions - An array of actions, each with an associated effect and optional condition.
   * @returns {Promise<IRole | null>} - Returns the updated role with the newly added policy or null if the role is not found.
   * @throws {Error} - Throws an error if the role is not found or if there is an issue saving the policy.
   */
  async grant(roleId: string, resourceAri: string, actions: { action: string; effect: string; condition?: any }[]): Promise<IRole | null> {
    try {
      const role = await Role.findById(roleId);
      if (!role) throw new Error('Role not found');

      // Create a new policy
      const policy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        rolePolicy: {
          role: role._id,
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

      if (!role.policies?.includes(policy._id as any)) {
        role.policies?.push(policy._id as any);
        await role.save();
      }

      return role;
    } catch (error) {
      console.error('Error granting policy to role:', error);
      throw error;
    }
  }

  /**
   * Revokes specific actions from a role's policy on a resource.
   * 
   * @param {string} roleId - The ID of the role from which the policy will be revoked.
   * @param {string} resourceAri - The ARI of the resource for which the policy applies.
   * @param {string[]} actionsToRemove - An array of actions to be removed from the policy.
   * @returns {Promise<IRole | null>} - Returns the updated role after the policy has been modified or null if the role is not found.
   * @throws {Error} - Throws an error if the role or policy is not found or if there is an issue updating the policy.
   */
  async revoke(roleId: string, resourceAri: string, actionsToRemove: string[]): Promise<IRole | null> {
    try {
      // Find the role and populate the policies as `Policy[]`
      const role = await Role.findById(roleId).populate<{ policies: Policy[] }>('policies');
      if (!role) throw new Error('Role not found');

      const policy = role.policies.find((policy: Policy) =>
        policy.rolePolicy?.rules?.some(rule => rule.resource === resourceAri)
      );

      if (!policy) throw new Error('Policy not found');

      let removePolicy = false;

      if (policy.rolePolicy?.rules) {
        const rule = policy.rolePolicy.rules.find(rule => rule.resource === resourceAri);
        if (rule) {
          rule.actions = rule.actions.filter(action => !actionsToRemove.includes(action.action));

          if (rule.actions.length === 0) {
            policy.rolePolicy.rules = policy.rolePolicy.rules.filter(r => r.resource !== resourceAri);
          }

          if (policy.rolePolicy.rules.length === 0) {
            removePolicy = true;
          } else {
            await policy.save();
          }
        }
      }

      if (removePolicy) {
        // Remove the policy reference from the role
        role.policies = role.policies.filter((p: Policy) => {
          const policyId = p._id as Types.ObjectId; // Cast _id to ObjectId

          // Ensure both policyId and policy._id are of type ObjectId before comparing
          if (policy._id instanceof Types.ObjectId && policyId instanceof Types.ObjectId) {
            return !policyId.equals(policy._id);
          }
          return true; // If types don't match, skip removing (safety net)
        });

        // Save the updated role before deleting the policy
        await role.save();

        // Remove the policy from the Policy collection
        await PolicyModel.findByIdAndDelete(policy._id);
      }

      // Return the updated role
      return await Role.findById(roleId).exec(); // Return the role without repopulating policies
    } catch (error) {
      console.error('Error revoking policy from role:', error);
      throw error;
    }
  }
}

