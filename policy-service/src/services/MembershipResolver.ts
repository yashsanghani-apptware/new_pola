// src/services/MembershipResolver.ts

import mongoose, { Types } from 'mongoose';
import { IUser, User } from '../models/user';
import { IGroup, Group } from '../models/group';
import { IRole, Role } from '../models/role';
import PolicyModel, { Policy } from '../models/policy'; 
import DerivedRoleModel from '../models/derivedRole';
import { Action, ResourcePolicy, ServiceControlPolicy, RolePolicy, GroupPolicy, PrincipalPolicy } from '../models/types';

/**
 * The MembershipResolver class provides utility methods for resolving groups, roles,
 * policies, and permitted actions associated with a specific principal (user).
 */
export class MembershipResolver {

  /**
   * Resolves all groups associated with the specified principal (user).
   * It includes direct group memberships and nested group memberships.
   *
   * @param principalId - The ID of the principal (user) for whom to resolve groups.
   * @returns A promise that resolves to an array of ObjectIds representing the groups the user belongs to.
   */
  async resolvePrincipalGroups(principalId: Types.ObjectId): Promise<Types.ObjectId[]> {
    const user = await User.findById(principalId).populate('groups').exec();
    console.log('User groups:', user?.groups);  // Log user groups
    if (!user) throw new Error('User not found');

    const groups = new Set<Types.ObjectId>();

    if (user.groups) {
      for (const groupId of user.groups) {
        await this.processGroup(groupId as Types.ObjectId, groups);
      }
    }

    return Array.from(groups);
  }

  /**
   * Recursively processes group memberships, including nested groups,
   * and adds them to the provided set of groups.
   *
   * @param groupId - The ID of the group to process.
   * @param groups - A set that accumulates all resolved group IDs.
   */
  async processGroup(groupId: Types.ObjectId, groups: Set<Types.ObjectId>): Promise<void> {
    const group = await Group.findById(groupId).exec();
    if (group) {
      groups.add(group._id as Types.ObjectId);

      for (const member of group.members) {
        if (member.ref === 'Group') {
          await this.processGroup(member.type as Types.ObjectId, groups);
        }
      }
    }
  }

  /**
   * Resolves all roles associated with the specified principal (user).
   * It includes roles directly assigned to the user and roles inherited
   * through group memberships.
   *
   * @param principalId - The ID of the principal (user) for whom to resolve roles.
   * @returns A promise that resolves to an array of ObjectIds representing the roles the user has.
   */
  async resolvePrincipalRoles(principalId: Types.ObjectId): Promise<Types.ObjectId[]> {
    const user = await User.findById(principalId).populate('groups').populate('roles').exec();
    if (!user) throw new Error('User not found');

    const roles = new Set<Types.ObjectId>();

    if (user.roles) {
      user.roles.forEach(roleId => roles.add(roleId as Types.ObjectId));
    }

    if (user.groups) {
      for (const groupId of user.groups) {
        const group = await Group.findById(groupId as Types.ObjectId).populate('roles').exec();
        if (group && group.roles) {
          group.roles.forEach(roleId => roles.add(roleId as Types.ObjectId));
        }
      }
    }

    return Array.from(roles);
  }

  /**
   * Resolves all policies associated with the specified principal (user).
   * It includes policies directly assigned to the user, policies assigned
   * through group memberships, and policies associated with roles.
   *
   * @param principalId - The ID of the principal (user) for whom to resolve policies.
   * @returns A promise that resolves to an array of ObjectIds representing the policies the user is subject to.
   */
  async resolvePrincipalPolicies(principalId: Types.ObjectId): Promise<Types.ObjectId[]> {
    console.log(`Resolving policies for principalId: ${principalId}`);

    const user = await User.findById(principalId)
        .populate('groups')
        .populate('roles')
        .populate('policies')
        .exec();
    if (!user) throw new Error('User not found');

    const policies = new Set<Types.ObjectId>();

    // Add direct policies assigned to the user
    if (user.policies) {
        user.policies.forEach(policyId => {
            console.log(`Adding direct policy ${policyId} for user ${principalId}`);
            policies.add(policyId as Types.ObjectId);
        });
    }

    // Fetch and add policies specifically assigned to the principal
    const principalPolicies = await PolicyModel.find({ 'principalPolicy.principal': principalId }).exec();
    if (principalPolicies.length > 0) {
        principalPolicies.forEach(policy => {
            console.log(`Adding principal policy ${policy._id} for user ${principalId}`);
            policies.add(policy._id as Types.ObjectId);
        });
    } else {
        console.log(`No principal policies found for principalId ${principalId}`);
    }

    // Resolve and add policies through roles
    const roles = await this.resolvePrincipalRoles(principalId);
    for (const roleId of roles) {
        const role = await Role.findById(roleId).populate('policies').exec();
        if (role && role.policies) {
            role.policies.forEach(policyId => {
                console.log(`Adding policy ${policyId} from role ${roleId} for user ${principalId}`);
                policies.add(policyId as Types.ObjectId);
            });
        }
    }

    // Resolve and add policies through groups
    const groups = await this.resolvePrincipalGroups(principalId);
    for (const groupId of groups) {
        const group = await Group.findById(groupId).populate('policies').exec();
        if (group && group.policies) {
            group.policies.forEach(policyId => {
                console.log(`Adding policy ${policyId} from group ${groupId} for user ${principalId}`);
                policies.add(policyId as Types.ObjectId);
            });
        }
    }

    console.log(`Resolved policies for principalId ${principalId}:`, Array.from(policies));
    return Array.from(policies);
  }

  /**
   * Resolves the permitted actions for a given principal on a specific resource.
   * 
   * @param principalId - The ID of the principal (user).
   * @param resourceAri - The ARI (Agsiri Resource Identifier) of the resource.
   * @returns A promise that resolves to a set of actions the principal is permitted to perform on the resource.
   */
  async resolvePermittedActions(principalId: mongoose.Types.ObjectId, resourceAri: string): Promise<Set<string>> {
    const permittedActions = new Set<string>();

    console.log(`Resolving permitted actions for principalId: ${principalId}, resourceAri: ${resourceAri}`);

    // 1. Resolve all policies associated with the principal
    const principalPolicies = await this.resolvePrincipalPolicies(principalId);
    const groups = await this.resolvePrincipalGroups(principalId);
    const roles = await this.resolvePrincipalRoles(principalId);

    console.log(`Resolved principal policies: ${principalPolicies}`);
    console.log(`Resolved groups: ${groups}`);
    console.log(`Resolved roles: ${roles}`);

    // 2. Check principal's direct policies
    for (const policyId of principalPolicies) {
      const policy = await PolicyModel.findById(policyId).exec();
      if (policy) {
        if (policy.principalPolicy) {
          const principalPolicy = policy.principalPolicy as PrincipalPolicy;
          principalPolicy.rules.forEach(rule => {
            if (rule.resource === resourceAri) {
              rule.actions.forEach((action: Action) => {
                if (action.effect === 'EFFECT_ALLOW') {
                  permittedActions.add(action.action);
                } else if (action.effect === 'EFFECT_DENY') {
                  permittedActions.delete(action.action);
                }
              });
            }
          });
        }
        if (policy.resourcePolicy) {
          const resourcePolicy = policy.resourcePolicy as ResourcePolicy;
          if (resourcePolicy.resource === resourceAri) {
            resourcePolicy.rules.forEach(rule => {
              rule.actions.forEach((action: string) => {
                permittedActions.add(action);
              });
            });
          }
        }
      }
    }

    // 3. Check group policies
    for (const groupId of groups) {
      const groupPolicies = await PolicyModel.find({ 'groupPolicy.group': groupId }).exec();
      for (const policy of groupPolicies) {
        if (policy.groupPolicy) {
          const groupPolicy = policy.groupPolicy as GroupPolicy;
          groupPolicy.rules.forEach(rule => {
            if (rule.resource === resourceAri) {
              rule.actions.forEach((action: Action) => {
                if (action.effect === 'EFFECT_ALLOW') {
                  permittedActions.add(action.action);
                } else if (action.effect === 'EFFECT_DENY') {
                  permittedActions.delete(action.action);
                }
              });
            }
          });
        }
      }
    }

    // 4. Check role policies
    for (const roleId of roles) {
      console.log(`Looking up policies for roleId: ${roleId}`);
      const rolePolicies = await PolicyModel.find({ 'rolePolicy.role': new mongoose.Types.ObjectId(roleId) }).exec();
      
      if (rolePolicies.length === 0) {
        console.log(`No policies found for roleId: ${roleId}`);
      }

      for (const policy of rolePolicies) {
        if (policy.rolePolicy) {
          const rolePolicy = policy.rolePolicy as RolePolicy;
          console.log(`Processing role policy for roleId ${roleId}:`, rolePolicy);
          
          rolePolicy.rules.forEach(rule => {
            console.log(`Processing rule for roleId ${roleId._id}:`, rule);
            
            if (rule.resource === resourceAri) {
              console.log(`Rule matched for resource ${resourceAri} in roleId ${roleId._id}:`, rule);
              
              rule.actions.forEach((action: Action) => {
                console.log(`Processing action: ${action.action} with effect: ${action.effect}`);
                
                if (action.effect === 'EFFECT_ALLOW') {
                  console.log(`Adding action ${action.action} to permittedActions`);
                  permittedActions.add(action.action);
                } else if (action.effect === 'EFFECT_DENY') {
                  console.log(`Removing action ${action.action} from permittedActions`);
                  permittedActions.delete(action.action);
                }
              });
            } else {
              console.log(`Rule resource ${rule.resource} did not match with ${resourceAri}`);
            }
          });
        } else {
          console.log(`Policy ${policy._id} does not contain a rolePolicy`);
        }
      }
    }


    // 5. Apply Service Control Policies (SCPs) if applicable
    const scps = await PolicyModel.find({
      $or: [
        { 'serviceControlPolicy.boundEntities.users': principalId },
        { 'serviceControlPolicy.boundEntities.groups': { $in: groups } },
        { 'serviceControlPolicy.boundEntities.roles': { $in: roles } }
      ]
    }).exec();

    if (scps.length > 0) {
      console.log(`Found ${scps.length} SCPs applicable to principalId ${principalId}`);
      scps.forEach(scp => {
        const serviceControlPolicy = scp.serviceControlPolicy as ServiceControlPolicy;
        permittedActions.forEach(action => {
          if (!serviceControlPolicy.maxPermissions.includes(action)) {
            permittedActions.delete(action);
          }
        });
      });
    } else {
      console.log(`No SCPs found for principalId ${principalId}`);
    }

    console.log(`Permitted actions for principalId ${principalId} on resource ${resourceAri}:`, permittedActions);
    return permittedActions;
  }

  // Resolves groups associated with a principal (user)
  public async resolveGroupsForPrincipal(principalId: Types.ObjectId): Promise<Types.ObjectId[]> {
      const groups = await Group.find({ members: principalId }).select('_id').lean();
      return groups.map(group => group._id as Types.ObjectId);
  }

  // Resolves roles associated with a principal (user)
  public async resolveRolesForPrincipal(principalId: Types.ObjectId): Promise<Types.ObjectId[]> {
      const roles = await Role.find({ members: principalId }).select('_id').lean();
      return roles.map(role => role._id as Types.ObjectId);
  }

  // Method to resolve derived roles for a principal
  public async resolveDerivedRolesForPrincipal(principalId: Types.ObjectId, context: any): Promise<string[]> {
    const derivedRoles = await DerivedRoleModel.find({}).lean();
    const applicableRoles: string[] = [];

    for (const derivedRole of derivedRoles) {
      for (const definition of derivedRole.definitions) {
        if (definition.condition) {
          const isConditionMet = true;

          if (isConditionMet) {
            applicableRoles.push(definition.name);
            applicableRoles.push(...definition.parentRoles);
          }
        } else {
          applicableRoles.push(definition.name);
          applicableRoles.push(...definition.parentRoles);
        }
      }
    }

    return applicableRoles;
  }
}


