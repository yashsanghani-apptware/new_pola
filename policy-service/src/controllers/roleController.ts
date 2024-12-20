import { Request, Response } from 'express';
import { Role }  from '../models/role';
import { User } from '../models/user';
import PolicyModel from '../models/policy';
import { handleError } from '../middleware/errorHandler';

/**
 * RoleController handles the CRUD operations for Role documents in MongoDB.
 */
export class RoleController {

  /**
   * Create a new role
   * @param req - Express request object
   * @param res - Express response object
   */
  // Method to create a new role with proper user and policy validation
  public async createRole(req: Request, res: Response): Promise<void> {
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

      const role = new Role(req.body);
      await role.save();

      res.status(201).json(role);
    } catch (error) {
      handleError(res, error);
    }
  }
  /**
   * Get all roles
   * @param req - Express request object
   * @param res - Express response object
   */
  public async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await Role.find();
      res.status(200).json(roles);
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Get role by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  public async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
      } else {
        res.status(200).json(role);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Update role by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  public async updateRoleById(req: Request, res: Response): Promise<void> {
    try {
      const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
      } else {
        res.status(200).json(role);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Delete role by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  public async deleteRoleById(req: Request, res: Response): Promise<void> {
    try {
      const role = await Role.findByIdAndDelete(req.params.id);
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
      } else {
        res.status(200).json({ message: 'Role deleted successfully' });
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Search roles by text
   * @param req - Express request object
   * @param res - Express response object
   */
  public async searchRoles(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q;
      const roles = await Role.find({ $text: { $search: query as string } });
      res.status(200).json(roles);
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  /**
   * Add policies to a role
   * @param req - Express request object
   * @param res - Express response object
   */
  public async addPoliciesToRole(req: Request, res: Response): Promise<void> {
    try {
      const roleId = req.params.id;
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

      const updatedRole = await Role.findByIdAndUpdate(
        roleId,
        { $addToSet: { policies: { $each: policies } } },
        { new: true }
      );

      if (!updatedRole) {
        res.status(404).json({ message: 'Role not found' });
      } else {
        res.status(200).json(updatedRole);
      }
    } catch (error: unknown) {
      handleError(res, error);
    }
  }
}

