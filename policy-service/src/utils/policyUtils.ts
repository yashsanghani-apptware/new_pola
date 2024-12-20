// src/utils/policyUtils.ts
import PolicyModel, { Policy } from '../models/policy';

// Define the type for the request parameters
export interface RequestParams {
  principalId: string;
  resourceId: string;
  actions: string[];
}

// Function to Fetch Potentially Relevant Policies
export async function fetchRelevantPolicies(principalId: string, resourceId: string): Promise<Policy[]> {
  return await PolicyModel.find({
    $or: [
      { 'principalPolicy.principal': principalId },
      { 'resourcePolicy.resource': { $regex: resourceId.split('/')[0], $options: 'i' } }
    ]
  });
}

// Main Function to Run the Query and Evaluate Policies
export async function runQuery(requestParams: RequestParams) {
  const { principalId, resourceId, actions } = requestParams;

  // Fetch potentially relevant policies
  const allPolicies = await fetchRelevantPolicies(principalId, resourceId);

  console.log('All Fetched Policies:', JSON.stringify(allPolicies, null, 2));

  // Filter the policies based on custom logic and action matching using the utility function
  const matchingPolicies = filterPolicies(allPolicies, resourceId, actions);

  console.log('Matching Policies:', JSON.stringify(matchingPolicies, null, 2));
}


// Function to Match Resource with Policy Resource (Exact, Wildcard, and Pattern Matching)
export function matchResource(policyResource: string, resourceId: string): boolean {
  // Handle exact match
  if (policyResource === resourceId) {
    return true;
  }

  // Handle wildcard match (e.g., 'abc*')
  if (policyResource.includes('*')) {
    const regex = new RegExp('^' + policyResource.replace(/\*/g, '.*') + '$', 'i');
    return regex.test(resourceId);
  }

  // Handle pattern match (e.g., 'abc*', 'xyz*')
  if (policyResource.endsWith('*')) {
    const prefix = policyResource.slice(0, -1);
    return resourceId.startsWith(prefix);
  }

  // If no match found, return false
  return false;
}

// Function to Filter Policies Based on Matching Logic and Actions
export function filterPolicies(policies: Policy[], resourceId: string, actions: string[]): Policy[] {
  return policies.filter(policy => {
    if (policy.resourcePolicy) {
      return matchResource(policy.resourcePolicy.resource, resourceId) &&
        policy.resourcePolicy.rules.some(rule =>
          actions.some(action => rule.actions.includes(action)) && rule.effect === 'EFFECT_ALLOW'
        );
    }
    return false;
  });
}


