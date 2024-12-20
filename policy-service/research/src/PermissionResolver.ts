import mongoose, { ObjectId } from 'mongoose';
import PolicyModel from '../../src/models/policy';
import { MembershipResolver } from '../../src/services/MembershipResolver';
import { Action, ResourcePolicy, ServiceControlPolicy, RolePolicy, GroupPolicy, PrincipalPolicy } from '../../src/models/types';

export class PermissionResolver {
  private membershipResolver: MembershipResolver;

  constructor(membershipResolver: MembershipResolver) {
    this.membershipResolver = membershipResolver;
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
    const principalPolicies = await this.membershipResolver.resolvePrincipalPolicies(principalId);
    const groups = await this.membershipResolver.resolvePrincipalGroups(principalId);
    const roles = await this.membershipResolver.resolvePrincipalRoles(principalId);

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
    // for (const roleId of roles) {
    //   const rolePolicies = await PolicyModel.find({ 'rolePolicy.role': roleId }).exec();
    //   for (const policy of rolePolicies) {
    //     if (policy.rolePolicy) {
    //       const rolePolicy = policy.rolePolicy as RolePolicy;
    //       console.log(`Processing role policy for roleId ${roleId}:`, rolePolicy);
    //       rolePolicy.rules.forEach(rule => {
    //         console.log(`Processing rule for roleId ${roleId._id}:`, rule);
    //         if (rule.resource === resourceAri) {
    //           console.log(`Rule found for resource ${resourceAri}:`, rule);
    //           rule.actions.forEach((action: Action) => {
    //             console.log(`Processing action: ${action.action}`);
    //             if (action.effect === 'EFFECT_ALLOW') {
    //               permittedActions.add(action.action);
    //             } else if (action.effect === 'EFFECT_DENY') {
    //               permittedActions.delete(action.action);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
    // }

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
}
