import { Resource, IResource } from '../models/resource';
import PolicyModel, { Policy } from '../models/policy';
import { ResourceRule, ExportVariable, ResourcePolicy, EventPolicy, Action } from '../models/types';
import mongoose, { Types, ObjectId } from 'mongoose';
import { Logger as logger } from '../utils/logger';
import { Type } from 'js-yaml';

/**
 * ResourceService provides methods to interact with the Resource collection in MongoDB.
 * It supports operations such as finding, listing, adding, updating, deleting, searching,
 * querying resources, and managing resource policies.
 */
export class ResourceService {
  constructor() {
    logger.setProgramName('ResourceService');
  }

  async createResource(resourceData: any): Promise<IResource | null> {
    try {
      // Check if a resource with the same ARI already exists
      const existingResource = await Resource.findOne({ ari: resourceData.ari }).exec();

      if (existingResource) {
        logger.error(`Resource with ARI ${resourceData.ari} already exists. Duplicate creation is not allowed.`);
        return null; // Return null or handle the error as per your requirement
      }

      // Proceed to create the new resource if no duplicate is found
      const newResource = new Resource(resourceData);
      await newResource.save();
      logger.info(`Resource created successfully with ARI ${newResource.ari}`);

      return newResource;
    } catch (error) {
      logger.error('Error creating resource:', error);
      return null;
    }
  }

  /**
   * Finds a resource by its unique ID.
   * 
   * @param resourceId - The ID of the resource to be found.
   * @returns A promise that resolves to the found resource or null if not found.
   * @throws An error if the operation fails.
   */
  async findResourceById(resourceId: string): Promise<IResource | null> {
    try {
      // Find the resource by its ID using Mongoose's findById method
      return await Resource.findById(resourceId);
    } catch (error) {
      logger.error('Error finding resource by ID:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Lists all resources in the collection.
   * 
   * @returns A promise that resolves to an array of all resources.
   * @throws An error if the operation fails.
   */
  async listAllResources(): Promise<IResource[]> {
    try {
      // Retrieve all resources using Mongoose's find method
      return await Resource.find({});
    } catch (error) {
      logger.error('Error listing resources:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Retrieves a resource by its ARI (Agsiri Resource Identifier).
   * 
   * @param ari - The ARI of the resource to be found.
   * @returns A promise that resolves to the found resource or null if not found.
   * @throws An error if the operation fails.
   */
  async getResourceByARI(ari: string): Promise<IResource | null> {
    try {
      // Find the resource by its ARI using Mongoose's findOne method
      return await Resource.findOne({ ari });
    } catch (error) {
      logger.error('Error finding resource by ARI:', error);
      throw error;
    }
  }

  /**
   * Retrieves a resource by its name.
   * 
   * @param name - The name of the resource to be found.
   * @returns A promise that resolves to the found resource or null if not found.
   * @throws An error if the operation fails.
   */
  async getResourceByName(name: string): Promise<IResource | null> {
    try {
      // Find the resource by its name using Mongoose's findOne method
      return await Resource.findOne({ name });
    } catch (error) {
      logger.error('Error finding resource by name:', error);
      throw error;
    }
  }
  /**
   * Adds a new resource to the collection.
   * 
   * @param resource - The resource to be added, following the IResource interface.
   * @returns A promise that resolves to the newly created resource.
   * @throws An error if the operation fails.
   */
  async addResource(resource: IResource): Promise<IResource> {
    try {
      // Create and save a new resource using Mongoose's create method
      return await Resource.create(resource);
    } catch (error) {
      logger.error('Error adding resource:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Updates an existing resource by its ID with the provided update data.
   * 
   * @param resourceId - The ID of the resource to be updated.
   * @param updateData - The data to update the resource with.
   * @returns A promise that resolves to the updated resource, or null if not found.
   * @throws An error if the operation fails.
   */
  async updateResource(resourceId: string, updateData: Partial<IResource>): Promise<IResource | null> {
    try {
      // Find and update the resource by its ID, returning the new document
      return await Resource.findByIdAndUpdate(resourceId, updateData, { new: true });
    } catch (error) {
      logger.error('Error updating resource:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Deletes a resource by its ID.
   * 
   * @param resourceId - The ID of the resource to be deleted.
   * @returns A promise that resolves to void.
   * @throws An error if the operation fails.
   */
  async deleteResource(resourceId: string): Promise<void> {
    try {
      // Find and delete the resource by its ID
      await Resource.findByIdAndDelete(resourceId);
    } catch (error) {
      logger.error('Error deleting resource:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Searches for resources based on a provided query.
   * 
   * @param query - The query object used to search for matching resources.
   * @returns A promise that resolves to an array of matching resources.
   * @throws An error if the operation fails.
   */
  async searchResources(query: any): Promise<IResource[]> {
    try {
      // Search for resources that match the query criteria
      return await Resource.find(query);
    } catch (error) {
      logger.error('Error searching resources:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Queries the resources with additional options like sorting, skipping, and limiting.
   * 
   * @param filter - The filter object used to query for resources.
   * @param sort - An optional sort object to determine the order of the results.
   * @param skip - An optional number of documents to skip in the result set.
   * @param limit - An optional maximum number of documents to return.
   * @returns A promise that resolves to an array of matching resources.
   * @throws An error if the operation fails.
   */
  async queryResources(filter: any, sort: any = {}, skip: number = 0, limit: number = 10): Promise<IResource[]> {
    try {
      // Query the resources with the provided filter, sort, skip, and limit options
      return await Resource.find(filter).sort(sort).skip(skip).limit(limit);
    } catch (error) {
      logger.error('Error querying resources:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Counts the number of resources that match a provided query.
   * 
   * @param query - The query object used to count matching resources.
   * @returns A promise that resolves to the number of matching entries.
   * @throws An error if the operation fails.
   */
  async countResources(query: any): Promise<number> {
    try {
      // Count the number of documents that match the query criteria
      return await Resource.countDocuments(query);
    } catch (error) {
      logger.error('Error counting resources:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }
  /**
     * Grants a policy to a resource for specific actions.
     * 
     * @param resourceId - The ID of the resource to which the policy will be granted.
     * @param actions - An array of actions, each with an associated effect and optional condition.
     * @returns A promise that resolves to the updated resource with the newly added policy or null if the resource is not found.
     * @throws An error if the resource is not found or if there is an issue saving the policy.
     */

  async grantActions(
    resourceId: string,
    actions: { action: string; effect: string; condition?: any }[]
  ): Promise<IResource | null> {
    try {
      const resource = await Resource.findById(resourceId);
      if (!resource) {
        logger.error('Resource not found');
        return null;
      }

      // Check if there is an existing policy for the resource
      const existingResourcePolicy = await PolicyModel.findOne({
        'resourcePolicy.resource': resource.ari,
      }).exec();

      if (existingResourcePolicy && existingResourcePolicy.resourcePolicy) {
        let updatedRules = [...existingResourcePolicy.resourcePolicy.rules];

        // Iterate over the new actions
        actions.forEach((newAction) => {
          // Find a matching rule with the same effect and condition
          const matchedRuleIndex = updatedRules.findIndex(
            (rule: ResourceRule) =>
              rule.effect === newAction.effect &&
              JSON.stringify(rule.condition) === JSON.stringify(newAction.condition)
          );

          if (matchedRuleIndex !== -1) {
            // If a matching rule is found, add the action to it if not already present
            const matchedRule = updatedRules[matchedRuleIndex];
            if (!matchedRule.actions.includes(newAction.action)) {
              matchedRule.actions.push(newAction.action);
            }
          } else {
            // If no matching rule, create a new rule for this action
            updatedRules.push({
              actions: [newAction.action],
              effect: newAction.effect as 'EFFECT_ALLOW' | 'EFFECT_DENY',
              condition: newAction.condition,
            });
          }
        });

        // Forcefully update the policy rules in the database
        await PolicyModel.updateOne(
          { _id: existingResourcePolicy._id },
          { $set: { 'resourcePolicy.rules': updatedRules } }
        );

        logger.info('Successfully updated existing policy:', existingResourcePolicy._id);
      } else {
        // Create a new policy if no existing policy is found
        const policy = new PolicyModel({
          apiVersion: 'api.pola.dev/v1',
          resourcePolicy: {
            resource: resource.ari,
            version: '1.0',
            rules: actions.map((action) => ({
              actions: [action.action],
              effect: action.effect as 'EFFECT_ALLOW' | 'EFFECT_DENY',
              condition: action.condition,
            })),
          },
          auditInfo: {
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
          },
        });

        await policy.save();

        // Link the new policy to the resource
        if (!resource.policies?.includes(policy._id as any)) {
          resource.policies?.push(policy._id as any);
          await resource.save();
        }

        logger.info('Successfully created new policy:', policy._id);
      }

      return resource;
    } catch (error) {
      logger.error('Error granting policy to resource:', error);
      return null;
    }
  }

  /**
     * Revokes specific actions from a resource's policy.
     * 
     * @param resourceId - The ID of the resource from which the policy will be revoked.
     * @param actionsToRemove - An array of actions to be removed from the policy.
     * @returns A promise that resolves to the updated resource after the policy has been modified, or null if the resource is not found.
     * @throws An error if the resource or policy is not found or if there is an issue updating the policy.
     */
  async revokeActions(resourceId: string, actionsToRemove: string[]): Promise<IResource | null> {
    try {

      // Check if actionsToRemove is defined and is an array
      if (!actionsToRemove || !Array.isArray(actionsToRemove)) {
        logger.error('Invalid or undefined actionsToRemove provided.');
        return null; // Gracefully exit if actionsToRemove is not provided correctly
      }
      // Find the resource by ID
      const resource = await Resource.findById(resourceId).exec();
      if (!resource) {
        logger.error('Resource not found');
        return null;
      }

      console.log('Resource ARI:', resource.ari.toString());
      console.log('Associated Policy IDs:', `{$resource.policies}`);

      if (!resource.policies || resource.policies.length === 0) {
        logger.info('No policies associated with this resource');
        return null;
      }

      // Retrieve all policies using the policy IDs from the resource
      const policies = await PolicyModel.find({ _id: { $in: resource.policies } }).exec();

      // Ensure policies are logged in a readable format
      console.log('Fetched Policies:', JSON.stringify(policies, null, 2));

      // Filter only 'resourcePolicy' policies for further processing
      const resourcePolicies = policies.filter(
        (policy) => policy.resourcePolicy && policy.resourcePolicy.resource === resource.ari
      );

      // Ensure filtered policies are logged in a readable format
      console.log('Filtered Resource Policies:', JSON.stringify(resourcePolicies, null, 2));

      if (resourcePolicies.length === 0) {
        logger.error('No resource policies found for the given actions and resource ARI');
        return null;
      }
      // Find the policy to revoke based on the resource ARI and actions
      const matchedPolicy = resourcePolicies.find((policy) => {
        if (!policy.resourcePolicy || !policy.resourcePolicy.rules) {
          logger.warn('Policy or rules are undefined. Skipping...');
          return false;
        }
        return policy.resourcePolicy.rules.some((rule: ResourceRule) => {
          if (!rule.actions || !Array.isArray(rule.actions)) {
            logger.warn('Rule actions are undefined or not an array. Skipping...');
            return false;
          }
          return rule.actions.some((action: any) => {
            // Use a type guard to ensure we are accessing the correct type
            if (typeof action === 'object' && action !== null && 'action' in action) {
              const result = actionsToRemove.includes(action.action);
              logger.info(`Checking action "${action.action}" against actions to remove: ${result}`);
              return result;
            }
            return false;
          });
        });
      });

      if (!matchedPolicy) {
        logger.error('Policy not found for the given actions and resource ARI');
        return null;
      }

      logger.info('Found Policy to Revoke:', matchedPolicy._id);

      let removePolicy = false;

      // Process the policy rules and actions
      if (matchedPolicy.resourcePolicy) {
        const rule = matchedPolicy.resourcePolicy.rules.find((rule: ResourceRule) =>
          rule.actions?.some((action: any) => {
            // Ensure action is correctly typed
            return typeof action === 'object' && action !== null && 'action' in action && actionsToRemove.includes(action.action);
          })
        );

        if (rule) {
          // Remove the specified actions from the rule
          logger.info('Removing actions from rule:', JSON.stringify(rule.actions, null, 2));
          rule.actions = rule.actions.filter((action: any) => {
            // Type guard to ensure correct typing
            return typeof action === 'object' && action !== null && 'action' in action && !actionsToRemove.includes(action.action);
          });
          logger.info('Updated rule actions after removal:', JSON.stringify(rule.actions, null, 2));

          // If the rule no longer has any actions, remove the rule itself
          if (rule.actions.length === 0) {
            matchedPolicy.resourcePolicy.rules = matchedPolicy.resourcePolicy.rules.filter((r: ResourceRule) => r !== rule);
            logger.info('Removed empty rule. Remaining rules:', JSON.stringify(matchedPolicy.resourcePolicy.rules, null, 2));
          }

          // If there are no remaining rules, mark the policy for removal
          if (matchedPolicy.resourcePolicy.rules.length === 0) {
            removePolicy = true;
            logger.info('All rules removed; marking policy for deletion');
          } else {
            // Save the policy if there are still valid rules
            await matchedPolicy.save();
            logger.info('Updated policy saved:', matchedPolicy._id);
          }
        }
      }

      if (removePolicy) {
        // Remove the policy reference from the resource
        resource.policies = resource.policies.filter((p: Types.ObjectId) => p.equals(matchedPolicy._id as Types.ObjectId));
        logger.info('Removed policy from resource. Remaining policies:', JSON.stringify(resource.policies, null, 2));

        // Force an update to the resource to remove the policy reference
        await Resource.findByIdAndUpdate(resource._id, { policies: resource.policies }, { new: true });

        // Ensure the policy is removed from the database
        const deleteResult = await PolicyModel.findByIdAndDelete(matchedPolicy._id);
        if (!deleteResult) {
          logger.error('Failed to delete policy from the database');
          return null;
        }
        logger.info('Policy successfully deleted from the database:', matchedPolicy._id);
      }
      // Verify the changes by re-fetching the resource
      const updatedResource = await Resource.findById(resourceId).exec();
      return updatedResource;
    } catch (error) {
      logger.error('Error revoking actions:', error);
      return null;
    }
  }

  /**
     * Adds a new policy to a resource.
     *
     * @param resourceId - The ID of the resource to which the policy will be added.
     * @param policyData - The policy data to be added.
     * @returns A promise that resolves to the updated resource with the new policy or null if the resource is not found.
     */

  
  async addPolicy(resourceId: string, policyData: Partial<Policy>): Promise<Policy | null> {
    try {
      // Step 1: Fetch the target resource
      const resource = await Resource.findById(resourceId);
      if (!resource) {
        logger.error(`Resource not found: ${resourceId}`);
        return null;
      }
  
      // Step 2: Validate that only one applicable policy type is provided
      const policyTypes = ['resourcePolicy', 'eventPolicy', 'exportVariables'];
      const providedPolicyTypes = policyTypes.filter((type) => policyData[type as keyof Policy]);
  
      if (providedPolicyTypes.length !== 1) {
        logger.error('Invalid policy data: Only one applicable policy type must be provided.');
        return null;
      }
  
      const policyType = providedPolicyTypes[0]; // Determine the policy type to be added
  
      // Step 3: Create a new policy model instance with the provided data
      const newPolicy = new PolicyModel({
        apiVersion: policyData.apiVersion,
        [policyType]: policyData[policyType as keyof Policy], // Dynamically set the correct policy type
        auditInfo: {
          createdBy: policyData.auditInfo?.createdBy || 'admin',
          createdAt: policyData.auditInfo?.createdAt || new Date(),
          updatedBy: policyData.auditInfo?.updatedBy,
          updatedAt: policyData.auditInfo?.updatedAt || new Date(),
        },
        disabled: policyData.disabled ?? false,
      });
  
      // Step 4: Save the new policy
      await newPolicy.save();
  
      // Step 5: Associate the policy with the resource
      resource.policies = resource.policies ?? [];
      if (!resource.policies.includes(newPolicy._id as Types.ObjectId)) {
        resource.policies.push(newPolicy._id as Types.ObjectId);
        await resource.save();
      }
  
      logger.info(`Policy successfully added to the resource. Policy Type: ${policyType}`);
      return newPolicy;
    } catch (error) {
      logger.error('Error adding policy to resource:', error);
      return null;
    }
  }
  
  private async mergeOrUpdateResourcePolicyX(
    existingPolicy: Policy,
    policyData: Partial<Policy>
  ): Promise<void> {
    // Ensure we have valid input data
    if (!policyData.resourcePolicy || !policyData.resourcePolicy.rules) return;
  
    const newRules = policyData.resourcePolicy.rules;
  
    // Log the initial state of the existing policy
    console.log('Before update: Existing Policy:', JSON.stringify(existingPolicy, null, 2));
    console.log('New Policy Data to be merged:', JSON.stringify(policyData, null, 2));
  
    // Iterate over new rules to merge or update them
    for (const newRule of newRules) {
      const existingRuleIndex = existingPolicy.resourcePolicy!.rules.findIndex(
        (rule) =>
          rule.effect === newRule.effect &&
          JSON.stringify(rule.condition) === JSON.stringify(newRule.condition)
      );
  
      if (existingRuleIndex !== -1) {
        // Log the matching rule found for merging
        console.log(`Matching rule found at index ${existingRuleIndex}. Merging actions...`);
  
        // If an existing rule matches, merge actions
        const existingActions = existingPolicy.resourcePolicy!.rules[
          existingRuleIndex
        ].actions;
  
        console.log('Existing actions before merge:', existingActions);
        console.log('New actions to merge:', newRule.actions);
  
        // Add new actions only if they do not already exist
        existingPolicy.resourcePolicy!.rules[existingRuleIndex].actions = [
          ...new Set([...existingActions, ...newRule.actions]),
        ];
  
        // Log the merged result
        console.log('Merged actions:', existingPolicy.resourcePolicy!.rules[existingRuleIndex].actions);
      } else {
        // Log when a new rule is being added
        console.log('No matching rule found. Adding new rule:', JSON.stringify(newRule, null, 2));
  
        // If no matching rule is found, add the new rule
        existingPolicy.resourcePolicy!.rules.push(newRule);
      }
    }
  
    // Log the final state of the updated policy
    console.log('After update: Updated Policy:', JSON.stringify(existingPolicy, null, 2));
  
    // Save the updated policy
    await existingPolicy.save();
  }
  private async mergeOrUpdateResourcePolicyXX(
    existingPolicy: Policy,
    policyData: Partial<Policy>
  ): Promise<void> {
    if (!policyData.resourcePolicy || !policyData.resourcePolicy.rules) return;
  
    // Extract the new rules to be added or merged
    const newRules = policyData.resourcePolicy.rules;
  
    // Merge or update the rules in the existing policy
    const existingRules = existingPolicy.resourcePolicy!.rules;
  
    // Merge new rules into existing rules
    newRules.forEach((newRule) => {
      const existingRuleIndex = existingRules.findIndex(
        (rule) => rule.effect === newRule.effect && JSON.stringify(rule.condition) === JSON.stringify(newRule.condition)
      );
  
      if (existingRuleIndex !== -1) {
        // Merge actions if the rule already exists
        existingRules[existingRuleIndex].actions = Array.from(
          new Set([...existingRules[existingRuleIndex].actions, ...newRule.actions])
        );
      } else {
        // Add the new rule if it does not exist
        existingRules.push(newRule);
      }
    });
  
    // Explicitly mark fields as modified
    existingPolicy.markModified('resourcePolicy.rules');
  
    // Save the updated policy back to the database
    await existingPolicy.save();
    console.log('After update: Updated Policy:', JSON.stringify(existingPolicy, null, 2));
  }

  // Update the method to accept Partial<Policy>
private async mergeOrUpdateResourcePolicy(
  existingPolicy: Policy,
  policyData: Partial<Policy>
): Promise<void> {
  // Extract the resource policy data from the provided policyData
  const resourcePolicyData: Partial<ResourcePolicy> | undefined = policyData.resourcePolicy;

  // Check if resourcePolicyData is defined
  if (!resourcePolicyData || !resourcePolicyData.rules) {
    logger.error('Invalid resource policy data provided for merging or updating.');
    return;
  }

  // Extract rules from the existing resource policy
  const existingRules = existingPolicy.resourcePolicy!.rules || [];

  // Merge or update actions within the existing rules
  resourcePolicyData.rules.forEach((newRule) => {
    const existingRuleIndex = existingRules.findIndex(
      (rule) => rule.effect === newRule.effect && JSON.stringify(rule.condition) === JSON.stringify(newRule.condition)
    );

    if (existingRuleIndex !== -1) {
      // Rule already exists, merge actions
      const existingActions = new Set(existingRules[existingRuleIndex].actions);
      newRule.actions.forEach((action) => existingActions.add(action));
      existingRules[existingRuleIndex].actions = Array.from(existingActions);
    } else {
      // Rule does not exist, add as new
      existingRules.push(newRule);
    }
  });

  existingPolicy.resourcePolicy!.rules = existingRules;

  // Mark the modified field
  existingPolicy.markModified('resourcePolicy.rules');
  await existingPolicy.save();
}


  // Helper function to create a new resource policy
  private async createNewResourcePolicy(resource: IResource, policyData: Partial<Policy>): Promise<void> {
    const newPolicy = new PolicyModel({
      apiVersion: 'api.pola.dev/v1',
      resourcePolicy: {
        ...policyData.resourcePolicy,
        resource: resource.ari,
      },
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      },
    });

    await newPolicy.save();

    if (!resource.policies) {
      resource.policies = [];
    }

    if (!resource.policies.includes(newPolicy._id as Types.ObjectId)) {
      resource.policies.push(newPolicy._id as Types.ObjectId);
      await resource.save();
    }
  }

  // Helper function to merge or update an existing event policy
  private async mergeOrUpdateEventPolicy(existingPolicy: Policy, policyData: Partial<Policy>): Promise<void> {
    const newRules = policyData.eventPolicy!.rules;

    // Use $addToSet to avoid duplicate rules in the existing policy
    await PolicyModel.updateOne(
      { _id: existingPolicy._id },
      {
        $addToSet: {
          'eventPolicy.rules': { $each: newRules }
        }
      }
    );
  }

  // Helper function to create a new event policy
  private async createNewEventPolicy(resource: IResource, policyData: Partial<Policy>): Promise<void> {
    const newPolicy = new PolicyModel({
      apiVersion: 'api.pola.dev/v1',
      eventPolicy: {
        ...policyData.eventPolicy,
        resource: resource.ari,
      },
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      },
    });

    await newPolicy.save();

    if (!resource.policies) {
      resource.policies = [];
    }

    if (!resource.policies.includes(newPolicy._id as Types.ObjectId)) {
      resource.policies.push(newPolicy._id as Types.ObjectId);
      await resource.save();
    }
  }

  // Helper function to merge or update an existing export variable
  private async mergeOrUpdateExportVariable(existingPolicy: Policy, policyData: Partial<Policy>): Promise<void> {
    const newVariables = policyData.exportVariables!.definitions;

    // Use $set to update the export variables
    await PolicyModel.updateOne(
      { _id: existingPolicy._id },
      {
        $set: {
          'exportVariables.definitions': newVariables
        }
      }
    );
  }

  // Helper function to create a new export variable policy
  private async createNewExportVariable(resource: IResource, policyData: Partial<Policy>): Promise<void> {
    const newPolicy = new PolicyModel({
      apiVersion: 'api.pola.dev/v2.5',
      exportVariables: {
        ...policyData.exportVariables,
        resource: resource.ari,
      },
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      },
    });

    await newPolicy.save();

    if (!resource.policies) {
      resource.policies = [];
    }

    if (!resource.policies.includes(newPolicy._id as Types.ObjectId)) {
      resource.policies.push(newPolicy._id as Types.ObjectId);
      await resource.save();
    }
  }

  /**
   * Updates an existing policy linked to a resource.
   *
   * @param policyId - The ID of the policy to be updated.
   * @param updateData - The data to update the policy with.
   * @returns A promise that resolves to the updated policy or null if the policy is not found.
   */
  async updatePolicyV0(resourceId: string, policyData: Partial<Policy>): Promise<Policy | null> {
    try {
      // Step 1: Fetch the target resource
      const resource = await Resource.findById(resourceId);
      if (!resource) {
        logger.error(`Resource not found: ${resourceId}`);
        return null;
      }
  
      let existingPolicy: Policy | null = null;
  
      if (policyData.resourcePolicy) {
        // Fetch the existing resource policy
        existingPolicy = await PolicyModel.findOne({
          'resourcePolicy.resource': resource.ari,
        });
  
        if (existingPolicy) {
          // Merge or update the existing resource policy
          console.log('After update: Updated Policy:', JSON.stringify(existingPolicy, null, 2));
          await this.mergeOrUpdateResourcePolicy(existingPolicy, policyData);
          return existingPolicy;  // Ensure we return the updated policy
        } else {
          logger.error('Resource policy not found for update.');
          return null;
        }
      } else if (policyData.eventPolicy) {
        // Handle event policy updates similarly
        existingPolicy = await PolicyModel.findOne({
          'eventPolicy.resource': resource.ari,
          'eventPolicy.event': policyData.eventPolicy.event,
        });
  
        if (existingPolicy) {
          await this.mergeOrUpdateEventPolicy(existingPolicy, policyData.eventPolicy);
          return existingPolicy;
        } else {
          logger.error('Event policy not found for update.');
          return null;
        }
      } else if (policyData.exportVariables) {
        // Handle export variables updates similarly
        existingPolicy = await PolicyModel.findOne({
          'exportVariables.name': policyData.exportVariables.name,
        });
  
        if (existingPolicy) {
          await this.mergeOrUpdateExportVariable(existingPolicy, policyData.exportVariables);
          return existingPolicy;
        } else {
          logger.error('Export variable policy not found for update.');
          return null;
        }
      } else {
        logger.error('Unsupported policy type or missing policy data');
        return null;
      }
    } catch (error) {
      logger.error('Error updating policy for resource:', error);
      return null;
    }
  }

  async updatePolicy(
    resourceId: string,
    policyId: string,
    policyData: Partial<Policy>
  ): Promise<Policy | null> {
    try {
      // Fetch the target resource
      const resource = await Resource.findById(resourceId);
      if (!resource) {
        logger.error(`Resource not found: ${resourceId}`);
        return null;
      }
  
      // Fetch the existing policy by ID
      const existingPolicy = await PolicyModel.findById(policyId);
      if (!existingPolicy) {
        logger.error(`Policy not found: ${policyId}`);
        return null;
      }
  
      // Verify that the policy is associated with the resource
      const policyBelongsToResource = resource.policies?.some((p) =>
        p.equals(existingPolicy._id as Types.ObjectId)
      );
  
      const policyResourceMatches =
        (existingPolicy.resourcePolicy && existingPolicy.resourcePolicy.resource === resource.ari) ||
        (existingPolicy.eventPolicy && existingPolicy.eventPolicy.resource === resource.ari) ||
        (existingPolicy.exportVariables && existingPolicy.exportVariables.name);
  
      if (!policyBelongsToResource || !policyResourceMatches) {
        logger.error(`Policy ${policyId} does not belong to resource ${resource.ari}`);
        return null;
      }
  
      // Update the policy fields based on the input policyData
      if (policyData.resourcePolicy) {
        existingPolicy.resourcePolicy!.rules = policyData.resourcePolicy.rules || existingPolicy.resourcePolicy!.rules;
        existingPolicy.resourcePolicy!.version = policyData.resourcePolicy.version || existingPolicy.resourcePolicy!.version;
        existingPolicy.markModified('resourcePolicy.rules');
        existingPolicy.markModified('resourcePolicy.version'); // Explicitly mark 'version' as modified
      } else if (policyData.eventPolicy) {
        if (policyData.eventPolicy.rules) {
          existingPolicy.eventPolicy!.rules = policyData.eventPolicy.rules;
          existingPolicy.markModified('eventPolicy.rules');
        }
        if (policyData.eventPolicy.event) {
          existingPolicy.eventPolicy!.event = policyData.eventPolicy.event;
          existingPolicy.markModified('eventPolicy.event');
        }
        if (policyData.eventPolicy.scope) {
          existingPolicy.eventPolicy!.scope = policyData.eventPolicy.scope;
          existingPolicy.markModified('eventPolicy.scope');
        }
        if (policyData.eventPolicy.version) {
          existingPolicy.eventPolicy!.version = policyData.eventPolicy.version;
          existingPolicy.markModified('eventPolicy.version'); // Explicitly mark 'version' as modified
        }
      } else if (policyData.exportVariables) {
        existingPolicy.exportVariables!.definitions = {
          ...existingPolicy.exportVariables!.definitions,
          ...policyData.exportVariables.definitions,
        };
        existingPolicy.markModified('exportVariables'); // Explicitly mark as modified
      }
  
      // Update the audit information
      existingPolicy.auditInfo.updatedBy = "admin"; 
      existingPolicy.auditInfo.updatedAt = new Date(); 
      existingPolicy.markModified('auditInfo'); // Explicitly mark as modified
  
      // Save the updated policy
      await existingPolicy.save();
      logger.info(`Policy ${policyId} successfully updated for resource ${resource.ari}`);
  
      return existingPolicy;
    } catch (error) {
      logger.error('Error updating policy:', error);
      return null;
    }
  }
  
  /**
   * Removes a policy from a resource and deletes the policy if no other resources are linked to it.
   *
   * @param resourceId - The ID of the resource from which the policy will be removed.
   * @param policyId - The ID of the policy to be removed.
   * @returns A promise that resolves to the updated resource or null if the resource or policy is not found.
   */
  async removePolicy(resourceId: string, policyId: string): Promise<boolean> {
    try {
      // Fetch the target resource
      const resource = await Resource.findById(resourceId);
      if (!resource) {
        logger.error(`Resource not found: ${resourceId}`);
        return false;
      }
  
      // Ensure 'resource.policies' is initialized
      resource.policies = resource.policies ?? [];
  
      // Check if the policy exists in the resource's policy list
      const policyIndex = resource.policies.findIndex((p) => p.equals(policyId));
      if (policyIndex === -1) {
        logger.error(`Policy ${policyId} not associated with resource ${resourceId}`);
        return false;
      }
  
      // Remove the policy reference from the resource's policy list
      resource.policies.splice(policyIndex, 1);
      resource.markModified('policies'); // Mark 'policies' as modified
  
      // Save the updated resource
      await resource.save();
  
      // Remove the policy from the Policy collection
      const policyDeletionResult = await PolicyModel.findByIdAndDelete(policyId);
      if (!policyDeletionResult) {
        logger.error(`Failed to delete policy ${policyId}`);
        return false;
      }
  
      logger.info(`Policy ${policyId} successfully deleted from resource ${resourceId}`);
      return true;
    } catch (error) {
      logger.error('Error deleting policy:', error);
      return false;
    }
  }
  async aggregatedResourcePolicies(resourceId: string): Promise<ResourcePolicy | null> {
    try {
        // Step 1: Fetch the resource by its ID
        const resource = await Resource.findById(resourceId);
        if (!resource) {
            logger.error(`Resource not found: ${resourceId}`);
            return null;
        }

        // Step 2: Fetch all policies associated with the resource
        const policies = await PolicyModel.find({
            _id: { $in: resource.policies }, // Get policies by their IDs
        });

        // Step 3: Filter out the resource policies
        const resourcePolicies = policies.filter((policy) => policy.resourcePolicy);

        if (resourcePolicies.length === 0) {
            logger.info(`No resource policies found for resource: ${resourceId}`);
            return null;
        }

        // Step 4: Initialize the aggregated policy
        const aggregatedPolicy: ResourcePolicy = {
            resource: resource.ari,
            version: 'aggregated-1.0',
            rules: [],
        };

        // Step 5: Merge rules from all resource policies into one aggregated policy
        resourcePolicies.forEach((policy) => {
            const rules = policy.resourcePolicy!.rules;

            rules.forEach((rule) => {
                // Apply conflict resolution strategy while merging rules
                this.mergeRules(aggregatedPolicy.rules, rule);
            });
        });

        // Step 6: Return the aggregated policy
        return aggregatedPolicy;
    } catch (error) {
        logger.error('Error aggregating resource policies:', error);
        return null;
    }
}
private mergeRules(aggregatedRules: ResourceRule[], newRule: ResourceRule): void {
  // Look for a conflicting rule in the aggregated rules
  const existingRuleIndex = aggregatedRules.findIndex(
      (rule) =>
          rule.effect === newRule.effect &&
          JSON.stringify(rule.condition) === JSON.stringify(newRule.condition)
  );

  if (existingRuleIndex === -1) {
      // No conflict found, directly add the new rule
      aggregatedRules.push(newRule);
  } else {
      // Conflict found, merge actions
      const existingRule = aggregatedRules[existingRuleIndex];

      // Combine unique actions from both rules
      const mergedActions = Array.from(new Set([...existingRule.actions, ...newRule.actions]));
      existingRule.actions = mergedActions;
  }
}


}
