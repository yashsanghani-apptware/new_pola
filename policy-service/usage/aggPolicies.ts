import mongoose, { Types } from 'mongoose';
import  PolicyModel  from '../src/models/policy';
import { Action, ResourceRule, PrincipalPolicy,
        GroupPolicy, RolePolicy,PrincipalRule,
        GroupRule, RoleRule
 } from '../src/models/types';
import  DerivedRoleModel  from '../src/models/derivedRole';
import { Policy } from '../src/models/policy';

import { MembershipResolver } from '../services/MembershipResolver';

type PrincipalAttributes = any; // Replace with actual PrincipalAttributes type
type PolicyEvaluationResult = 'ALLOW' | 'DENY';

interface AggregatedPolicyResult {
  actions: Set<string>;
  effect: 'ALLOW' | 'DENY' | 'UNDETERMINED';
  applicablePolicies: Policy[];
}

/**
 * Aggregates all relevant policies for a given principal and resource.
 * This function combines direct principal policies, group policies, role policies,
 * derived role policies, and resource policies into a unified set of policies
 * that dictate the principal's access to the resource.
 *
 * @param principalId - The ID of the principal (user) for whom policies are being aggregated.
 * @param resourceARI - The Agsiri Resource Identifier (ARI) of the resource in question.
 * @returns A promise that resolves to an aggregated set of policies.
 */
async function aggregatePoliciesForPrincipalAndResource(
  principalId: string,
  resourceARI: string
): Promise<AggregatedPolicyResult> {
  // Initialize the context
  console.log(`Aggregating policies for Principal: ${principalId}, Resource: ${resourceARI}`);

  const principalPolicies = await getDirectPrincipalPolicies(principalId);
  const groupPolicies = await getGroupPolicies(principalId);
  const rolePolicies = await getRolePolicies(principalId);
  const derivedRolePolicies = await getDerivedRolePolicies(principalId);
  const resourcePolicies = await getResourcePolicies(resourceARI);

  // Combine all collected policies
  const allPolicies = [
    ...principalPolicies,
    ...groupPolicies,
    ...rolePolicies,
    ...derivedRolePolicies,
    ...resourcePolicies,
  ];

  // Aggregate policies (e.g., handle conflicts)
  const aggregatedPolicies = aggregatePolicies(allPolicies);
  return aggregatedPolicies;
}

/**
 * Fetches policies that are directly associated with the specified principal.
 * These are the policies that explicitly reference the principal by their ID.
 *
 * @param principalId - The ID of the principal (user).
 * @returns A promise that resolves to a list of policies directly associated with the principal.
 */
async function getDirectPrincipalPolicies(principalId: string): Promise<Policy[]> {
  console.log(`Fetching direct policies for Principal: ${principalId}`);
  const policies = await PolicyModel.find({ 'principalPolicy.principal': principalId }).lean();
  return policies;
}

/**
 * Fetches policies associated with the groups that the principal is a member of.
 * These policies extend the principal's permissions based on their group memberships.
 *
 * @param principalId - The ID of the principal (user).
 * @returns A promise that resolves to a list of group policies applicable to the principal.
 */
async function getGroupPolicies(principalId: string): Promise<Policy[]> {
  console.log(`Fetching group policies for Principal: ${principalId}`);
  const groupIds = await resolveGroupsForPrincipal(principalId);
  const policies = await PolicyModel.find({ 'groupPolicy.group': { $in: groupIds.map(id => id.toString()) } }).lean();
  return policies;
}

/**
 * Fetches policies associated with the roles assigned to the principal.
 * These policies define the principal's capabilities based on their role assignments.
 *
 * @param principalId - The ID of the principal (user).
 * @returns A promise that resolves to a list of role policies applicable to the principal.
 */
async function getRolePolicies(principalId: string): Promise<Policy[]> {
  console.log(`Fetching role policies for Principal: ${principalId}`);
  const roleIds = await resolveRolesForPrincipal(principalId);
  const policies = await PolicyModel.find({ 'rolePolicy.role': { $in: roleIds.map(id => id.toString()) } }).lean();
  return policies;
}

/**
 * Fetches policies associated with derived roles that apply to the principal.
 * Derived roles are dynamically assigned based on specific conditions and principal attributes.
 *
 * @param principalId - The ID of the principal (user).
 * @returns A promise that resolves to a list of derived role policies applicable to the principal.
 */
async function getDerivedRolePolicies(principalId: string): Promise<Policy[]> {
  console.log(`Fetching derived role policies for Principal: ${principalId}`);
  const derivedRoleNames = await resolveDerivedRolesForPrincipal(principalId);
  const policies = await PolicyModel.find({ 'derivedRolePolicy.role': { $in: derivedRoleNames } }).lean();
  return policies;
}

/**
 * Fetches policies associated with the specified resource ARI.
 * These policies directly control what actions can be performed on the resource.
 *
 * @param resourceARI - The Agsiri Resource Identifier (ARI) of the resource.
 * @returns A promise that resolves to a list of resource policies applicable to the resource.
 */
async function getResourcePolicies(resourceARI: string): Promise<Policy[]> {
  console.log(`Fetching resource policies for Resource ARI: ${resourceARI}`);
  const policies = await PolicyModel.find({
    'resourcePolicy.resource': { $regex: new RegExp(`^${resourceARI.replace('*', '.*')}$`) }
  }).lean();
  return policies;
}

/**
 * Aggregates all collected policies into a unified set, handling any conflicts
 * (e.g., EFFECT_DENY overriding EFFECT_ALLOW) and combining them to form a final policy set.
 *
 * @param policies - The list of policies to aggregate.
 * @returns The aggregated policy result, combining all relevant policies.
 */
function aggregatePolicies(policies: Policy[]): AggregatedPolicyResult {
  console.log('Aggregating policies...');
  const aggregatedPolicies: AggregatedPolicyResult = {
      actions: new Set<string>(),
      effect: 'UNDETERMINED',
      applicablePolicies: [],
  };

  let policyEffect: 'ALLOW' | 'DENY' | 'UNDETERMINED' = 'UNDETERMINED';

  for (const policy of policies) {
      let rules: any[] = [];

      if (policy.principalPolicy) {
          rules = policy.principalPolicy.rules;
      } else if (policy.groupPolicy) {
          rules = policy.groupPolicy.rules;
      } else if (policy.rolePolicy) {
          rules = policy.rolePolicy.rules;
      } else if (policy.resourcePolicy) {
          rules = policy.resourcePolicy.rules;
      }

      for (const rule of rules) {
          for (const action of rule.actions) {
              if (action.effect === 'EFFECT_DENY') {
                  aggregatedPolicies.actions.add(action.action);
                  policyEffect = 'DENY';
              } else if (action.effect === 'EFFECT_ALLOW' && policyEffect !== 'DENY') {
                  aggregatedPolicies.actions.add(action.action);
                  policyEffect = 'ALLOW';
              }
          }
      }

      aggregatedPolicies.applicablePolicies.push(policy);
  }

  aggregatedPolicies.effect = policyEffect;
  return aggregatedPolicies;
}


/**
 * Evaluates the aggregated policies to determine whether a specific action
 * is allowed or denied for the principal on the resource.
 *
 * @param aggregatedPolicies - The aggregated policies to evaluate.
 * @param action - The action (e.g., "edit") to evaluate.
 * @returns The result of the policy evaluation (ALLOW or DENY).
 */
async function evaluateAggregatedPolicies(aggregatedPolicies: AggregatedPolicyResult, action: string): Promise<PolicyEvaluationResult> {
  console.log('Evaluating aggregated policies...');
  // Iterate over aggregated policies to check if action is allowed or denied
  return 'ALLOW'; // Replace with actual evaluation logic
}

/**
 * Resolves the group memberships for the principal, returning a list of group IDs
 * that the principal is a member of.
 *
 * @param principalId - The ID of the principal (user).
 * @returns A promise that resolves to a list of group IDs.
 */
async function resolveGroupsForPrincipal(principalId: string): Promise<Types.ObjectId[]> {
  console.log(`Resolving groups for Principal: ${principalId}`);
  const membershipResolver = new MembershipResolver();
  return await membershipResolver.resolveGroupsForPrincipal(new Types.ObjectId(principalId));
}

/**
 * Resolves the roles assigned to the principal, returning a list of role IDs
 * that the principal has been assigned.
 *
 * @param principalId - The ID of the principal (user).
 * @returns A promise that resolves to a list of role IDs.
 */
async function resolveRolesForPrincipal(principalId: string): Promise<Types.ObjectId[]> {
  console.log(`Resolving roles for Principal: ${principalId}`);
  const membershipResolver = new MembershipResolver();
  return await membershipResolver.resolveRolesForPrincipal(new Types.ObjectId(principalId));
}

/**
 * Resolves the derived roles for the principal by evaluating specific conditions
 * against the principal's attributes. Returns a list of derived role names that apply to the principal.
 *
 * @param principalId - The ID of the principal (user).
 * @returns A promise that resolves to a list of derived role names.
 */
async function resolveDerivedRolesForPrincipal(principalId: string): Promise<string[]> {
  console.log(`Resolving derived roles for Principal: ${principalId}`);
  const principalAttributes = await resolvePrincipalAttributes(principalId);
  const derivedRoles = await DerivedRoleModel.find({
    'definitions.condition.match.expr': { $exists: true, $ne: null },
  }).lean();

  return derivedRoles
    .filter((role) => evaluateCondition(role.definitions[0].condition, principalAttributes))
    .map((role) => role.name);
}

/**
 * Utility function to evaluate whether a condition is met based on the principal's attributes.
 *
 * @param condition - The condition to evaluate.
 * @param attributes - The attributes of the principal to evaluate against.
 * @returns A boolean indicating whether the condition is met.
 */
function evaluateCondition(condition: any, attributes: PrincipalAttributes): boolean {
  // Example condition evaluation logic
  // Replace with actual condition evaluation code
  return true;
}

/**
 * Fetches or computes the attributes for the principal that are used in evaluating conditions.
 *
 * @param principalId - The ID of the principal (user).
 * @returns A promise that resolves to the principal's attributes.
 */
async function resolvePrincipalAttributes(principalId: string): Promise<PrincipalAttributes> {
  console.log(`Resolving attributes for Principal: ${principalId}`);
  // Implement logic to retrieve and return the principal's attributes
  return {};
}

async function main() {
  await mongoose.connect('mongodb://localhost:27017/PolicyDB');
  const principalId = '66ca8112dbfced0547d9bdfa'; // Example principal ID
  const resourceARI = 'ari:agsiri:dataroom:us:448912311299-1:dataroom/cabinetx/*'; // Example ARI

  const aggregatedPolicies = await aggregatePoliciesForPrincipalAndResource(principalId, resourceARI);
  console.log('Aggregated Policies:', JSON.stringify(aggregatedPolicies, null, 2));

  const evaluationResult = await evaluateAggregatedPolicies(aggregatedPolicies, 'edit');
  console.log('Evaluation Result:', evaluationResult);

  await mongoose.disconnect();
}

main().catch(err => console.error('Error:', err));

