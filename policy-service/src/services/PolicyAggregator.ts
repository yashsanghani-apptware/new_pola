// src/services/PolicyAggregator.ts

import { MembershipResolver } from './MembershipResolver'; // Import the MembershipResolver class
import PolicyModel, { Policy } from '../models/policy'; // Ensure the policy model is imported correctly
import mongoose, { Types } from 'mongoose';


type ObjectId = mongoose.Types.ObjectId;

/**
 * The PolicyAggregator class is responsible for aggregating and evaluating policies
 * for a given principal based on their resolved roles, groups, and direct policies.
 */
export class PolicyAggregator {
  private membershipResolver: MembershipResolver;

  /**
   * Constructor for the PolicyAggregator.
   * 
   * @param membershipResolver - An instance of MembershipResolver used to resolve groups, roles, and policies for a principal.
   */
  constructor(membershipResolver: MembershipResolver) {
    this.membershipResolver = membershipResolver;
  }

  /**
   * Aggregates all applicable policies for a principal by resolving their roles,
   * groups, and directly assigned policies.
   *
   * @param principalId - The ID of the principal for whom to aggregate policies.
   * @returns A promise that resolves to an array of Policy documents.
   */
  async aggregatePoliciesForPrincipal(principalId: ObjectId): Promise<Policy[]> {
    // Step 1: Resolve all policy IDs associated with the principal
    const policyIds = await this.membershipResolver.resolvePrincipalPolicies(principalId);

    // Step 2: Fetch and return all policy documents from the database based on the resolved policy IDs
    return PolicyModel.find({ _id: { $in: policyIds } }).exec();
  }

  /**
   * Aggregates policies for a principal and groups them by their type.
   * This can help in categorizing and applying policies based on their function.
   *
   * @param principalId - The ID of the principal for whom to aggregate and group policies.
   * @returns A promise that resolves to an object categorizing policies by type.
   */
  async aggregateAndGroupPoliciesByType(principalId: ObjectId): Promise<Record<string, Policy[]>> {
    const policies = await this.aggregatePoliciesForPrincipal(principalId);

    const groupedPolicies: Record<string, Policy[]> = {
      principalPolicies: [],
      resourcePolicies: [],
      rolePolicies: [],
      groupPolicies: [],
      derivedRoles: [],
      exportVariables: [],
    };

    // Step 3: Group policies by their type
    policies.forEach(policy => {
      if (policy.principalPolicy) groupedPolicies.principalPolicies.push(policy);
      if (policy.resourcePolicy) groupedPolicies.resourcePolicies.push(policy);
      if (policy.rolePolicy) groupedPolicies.rolePolicies.push(policy);
      if (policy.groupPolicy) groupedPolicies.groupPolicies.push(policy);
      if (policy.derivedRoles) groupedPolicies.derivedRoles.push(policy);
      if (policy.exportVariables) groupedPolicies.exportVariables.push(policy);
    });

    return groupedPolicies;
  }

  /**
   * Filters policies by specific conditions, such as whether they are disabled
   * or belong to a certain scope or version.
   *
   * @param policies - The array of policies to filter.
   * @param filterCriteria - Criteria used to filter the policies.
   * @returns A filtered array of policies.
   */
  public filterPolicies(policies: Policy[], filterCriteria: Partial<Policy>): Policy[] {
    return policies.filter(policy => {
      let match = true;

      if (filterCriteria.disabled !== undefined) {
        match = match && policy.disabled === filterCriteria.disabled;
      }
      if (filterCriteria.apiVersion) {
        match = match && policy.apiVersion === filterCriteria.apiVersion;
      }
      // Add more filter criteria as needed

      return match;
    });
  }
/**
   * Aggregates all policies applicable to a given principal (user).
   *
   * @param principalId - The ID of the principal (user) to aggregate policies for.
   * @returns A list of aggregated policies.
   */
  async aggregatePolicies(principalId: mongoose.Types.ObjectId): Promise<any[]> {
    const policies = [];

    console.log(`Starting policy aggregation for principalId: ${principalId}`);

    // Resolve groups for the principal
    const groups = await this.membershipResolver.resolvePrincipalGroups(principalId);
    console.log(`Resolved groups for principalId ${principalId}:`, groups);

    // Resolve roles for the principal
    const roles = await this.membershipResolver.resolvePrincipalRoles(principalId);
    console.log(`Resolved roles for principalId ${principalId}:`, roles);

    // Resolve policies for the principal and expand the ObjectId to the full policy
    const principalPoliciesIds = await this.membershipResolver.resolvePrincipalPolicies(principalId);
    console.log(`Resolved principal policies for principalId ${principalId}:`, principalPoliciesIds);

    if (principalPoliciesIds.length > 0) {
        console.log(`Fetching full principal policies from database`);
        const principalPolicies = await PolicyModel.find({ _id: { $in: principalPoliciesIds } });
        console.log(`Adding ${principalPolicies.length} principal policies to aggregation`);
        policies.push(...principalPolicies);
    } else {
        console.log(`No principal policies found for principalId ${principalId}`);
    }

    // Resolve policies associated with groups
    for (const groupId of groups) {
        console.log(`Looking up policies for groupId: ${groupId}`);
        const groupPolicies = await PolicyModel.find({ 'groupPolicy.group': groupId });
        if (groupPolicies.length > 0) {
            console.log(`Adding ${groupPolicies.length} group policies for groupId ${groupId} to aggregation`);
            policies.push(...groupPolicies);
        } else {
            console.log(`No group policies found for groupId ${groupId}`);
        }
    }

    // Resolve policies associated with roles
    for (const role of roles) {
        console.log(`Looking up policies for roleId: ${role._id}`);
        const rolePolicies = await PolicyModel.find({ 'rolePolicy.role': role._id });
        if (rolePolicies.length > 0) {
            console.log(`Adding ${rolePolicies.length} role policies for roleId ${role._id} to aggregation`);
            policies.push(...rolePolicies);
        } else {
            console.log(`No role policies found for roleId ${role._id}`);
        }
    }

    console.log(`Completed policy aggregation for principalId ${principalId}. Total policies found: ${policies.length}`);
    return policies;
  }


  /**
   * Aggregates policies for a principal and applies a filtering function to them.
   *
   * @param principalId - The ID of the principal for whom to aggregate and filter policies.
   * @param filterCriteria - Criteria used to filter the aggregated policies.
   * @returns A promise that resolves to a filtered array of Policy documents.
   */
  async aggregateAndFilterPolicies(principalId: ObjectId, filterCriteria: Partial<Policy>): Promise<Policy[]> {
    const policies = await this.aggregatePoliciesForPrincipal(principalId);
    return this.filterPolicies(policies, filterCriteria);
  }
// Method to aggregate policies by principal and resource ARI

    public async aggregateResourcePolicies(principalId: Types.ObjectId, resourceARI: string): Promise<any[]> {
        // Step 1: Collect Principal Policies
        const principalPolicies = await PolicyModel.find({
            'principalPolicy.principal': principalId,
        }).lean();

        // Step 2: Collect Group Policies
        const groupPolicies = await PolicyModel.find({
            'groupPolicy.group': { $in: await this.membershipResolver.resolveGroupsForPrincipal(principalId) },
        }).lean();

        // Step 3: Collect Role Policies
        const rolePolicies = await PolicyModel.find({
            'rolePolicy.role': { $in: await this.membershipResolver.resolveRolesForPrincipal(principalId) },
        }).lean();

        // Step 4: Collect Derived Role Policies
        const derivedRolePolicies = await PolicyModel.find({
            'derivedRoles.definitions.name': { $in: await this.membershipResolver.resolveRolesForPrincipal(principalId) },
        }).lean();

        // Step 5: Collect Resource Policies
        const resourcePolicies = await PolicyModel.find({
            'resourcePolicy.resource': { $regex: new RegExp(`^${resourceARI.replace('*', '.*')}$`) },
        }).lean();

        // Aggregate all relevant policies
        const aggregatedPolicies = [
            ...principalPolicies,
            ...groupPolicies,
            ...rolePolicies,
            ...derivedRolePolicies,
            ...resourcePolicies,
        ];

        console.log('Aggregated Policies:', aggregatedPolicies);
        return aggregatedPolicies;
    }
}


