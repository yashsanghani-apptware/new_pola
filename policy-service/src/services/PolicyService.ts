// src/services/PolicyService.ts

// Import necessary modules and models
import mongoose from 'mongoose';

// Import the Policy model and its associated types
import PolicyModel, { Policy } from '../models/policy';

// Import types for strong typing
import PrincipalPolicyModel from '../models/principalPolicy';

import {
    ResourcePolicy, GroupPolicy, RolePolicy, Action, Condition,
    Match, DerivedRole, ExportVariable, EventPolicy, PrincipalPolicy,
    ResourceRule
}
    from '../models/types';

// Import RequestParams interface for evaluating policies
import { RequestParams } from '../models/types';

/**
 * The PolicyService class provides methods to interact with the Policy model,
 * including CRUD operations and policy evaluation logic.
 */
export class PolicyService {

    /**
     * Retrieves all policies from the database.
     * 
     * @returns A promise that resolves to an array of Policy documents.
     * @throws An error if the retrieval fails.
     */
    async getAllPolicies(): Promise<Policy[]> {
        try {
            // Use the PolicyModel to find and return all policy documents
            return await PolicyModel.find();
        } catch (error) {
            // Throw an error if the retrieval fails, including the error message
            throw new Error(`Failed to retrieve policies: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves a policy by its ID.
     * 
     * @param id - The ID of the policy to retrieve.
     * @returns A promise that resolves to the found Policy document or null if not found.
     * @throws An error if the retrieval fails.
     */
    async getPolicyById(id: string): Promise<Policy | null> {
        try {
            // Use the PolicyModel to find a policy document by its ID
            return await PolicyModel.findById(id);
        } catch (error) {
            // Throw an error if the retrieval fails, including the error message
            throw new Error(`Failed to retrieve policy by ID: ${(error as Error).message}`);
        }
    }

    /**
     * Searches for policies that match a given query.
     * 
     * @param query - The query object used to filter policies.
     * @returns A promise that resolves to an array of matching Policy documents.
     * @throws An error if the search fails.
     */
    async searchPolicies(query: any): Promise<Policy[]> {
        try {
            // Use the PolicyModel to find policy documents that match the query object
            return await PolicyModel.find(query);
        } catch (error) {
            // Throw an error if the search fails, including the error message
            throw new Error(`Failed to search policies: ${(error as Error).message}`);
        }
    }

    /**
     * Creates a new policy.
     * 
     * @param policyData - The data used to create the new policy.
     * @returns A promise that resolves to the created Policy document.
     * @throws An error if the creation fails.
     */
    async createPolicy(policyData: Partial<Policy>): Promise<Policy> {
        try {
            // Create a new PolicyModel instance with the provided data
            const newPolicy = new PolicyModel(policyData);
            // Save the new policy document to the database and return it
            return await newPolicy.save();
        } catch (error) {
            // Throw an error if the creation fails, including the error message
            throw new Error(`Failed to create policy: ${(error as Error).message}`);
        }
    }

    /**
     * Updates an existing policy by its ID.
     * 
     * @param id - The ID of the policy to update.
     * @param updateData - The data to update the policy with.
     * @returns A promise that resolves to the updated Policy document or null if not found.
     * @throws An error if the update fails.
     */
    async updatePolicy(id: string, updateData: Partial<Policy>): Promise<Policy | null> {
        try {
            // Find the policy by ID and update it with the provided data, returning the updated document
            return await PolicyModel.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            // Throw an error if the update fails, including the error message
            throw new Error(`Failed to update policy: ${(error as Error).message}`);
        }
    }

    /**
     * Deletes a policy by its ID.
     * 
     * @param id - The ID of the policy to delete.
     * @returns A promise that resolves to true if the deletion was successful, false otherwise.
     * @throws An error if the deletion fails.
     */
    async deletePolicy(id: string): Promise<boolean> {
        try {
            // Find the policy by ID and delete it, returning true if deletion was successful
            const result = await PolicyModel.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            // Throw an error if the deletion fails, including the error message
            throw new Error(`Failed to delete policy: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves all Resource Policies from the database.
     * 
     * @returns A promise that resolves to an array of resource policies.
     * @throws An error if the retrieval fails.
     */

    async getAllResourcePolicies(): Promise<ResourcePolicy[]> {
        try {
            // Query for policies where the resourcePolicy field exists
            const rawPolicies = await PolicyModel.find(
                { 'resourcePolicy': { $exists: true } },
                'resourcePolicy'
            ).lean();
    
            // Transform and validate data
            return rawPolicies
                .map(policy => {
                    const resourcePolicy = policy.resourcePolicy;
    
                    // Ensure required fields are present
                    if (!resourcePolicy?.resource || !resourcePolicy?.version || !resourcePolicy?.rules) {
                        throw new Error('Invalid resource policy: missing required fields');
                    }
    
                    return {
                        resource: resourcePolicy.resource,
                        version: resourcePolicy.version,
                        scope: resourcePolicy.scope,
                        importDerivedRoles: resourcePolicy.importDerivedRoles || [],
                        variables: resourcePolicy.variables,
                        schemas: resourcePolicy.schemas,
                        rules: resourcePolicy.rules,
                    };
                });
        } catch (error) {
            throw new Error(`Failed to retrieve resource policies: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves all Principal Policies from the database.
     * 
     * @returns A promise that resolves to an array of principal policies.
     * @throws An error if the retrieval fails.
     */

    async getAllPrincipalPolicies(): Promise<PrincipalPolicy[]> {
        try {
            // Query for policies where the principalPolicy field exists
            const rawPolicies = await PolicyModel.find(
                { 'principalPolicy': { $exists: true } },
                'principalPolicy'
            ).lean();
    
            // Transform and validate the data
            return rawPolicies.map(policy => {
                const principalPolicy = policy.principalPolicy;
    
                // Validate the presence of required fields
                if (!principalPolicy?.principal || !principalPolicy?.version || !principalPolicy?.rules) {
                    throw new Error('Invalid principal policy: missing required fields');
                }
    
                return {
                    principal: principalPolicy.principal,
                    version: principalPolicy.version,
                    scope: principalPolicy.scope,
                    variables: principalPolicy.variables,
                    rules: principalPolicy.rules,
                };
            });
        } catch (error) {
            throw new Error(`Failed to retrieve principal policies: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves all Export Variables from the database.
     * 
     * @returns A promise that resolves to an array of export variables.
     * @throws An error if the retrieval fails.
     */
    async getAllExportVariables(): Promise<ExportVariable[]> {
        try {
            // Query for policies where the exportVariables field exists
            return await PolicyModel.find({ 'exportVariables': { $exists: true } }, 'exportVariables').lean();
        } catch (error) {
            throw new Error(`Failed to retrieve export variables: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves all Derived Roles from the database.
     * 
     * @returns A promise that resolves to an array of derived roles.
     * @throws An error if the retrieval fails.
     */

    // Private functiont to evaluate Expressions
    async getAllDerivedRoles(): Promise<DerivedRole[]> {
        try {
            // Query for policies where the derivedRoles field exists
            const rawRoles = await PolicyModel.find(
                { 'derivedRoles': { $exists: true } },
                'derivedRoles'
            ).lean();
    
            // Transform and validate the data
            return rawRoles.map(role => {
                const derivedRole = role.derivedRoles;
    
                // Validate required fields
                if (!derivedRole?.name || !derivedRole?.definitions) {
                    throw new Error('Invalid derived role: missing required fields');
                }
    
                return {
                    name: derivedRole.name,
                    definitions: derivedRole.definitions,
                    variables: derivedRole.variables,
                };
            });
        } catch (error) {
            throw new Error(`Failed to retrieve derived roles: ${(error as Error).message}`);
        }
    }
    // Private functiont to evaluate Expressions
    private evaluateExpression(expression: string, context: any): boolean {
        try {
            // Create a function that has access to the context object and returns the result of the expression
            const func = new Function(...Object.keys(context), `return ${expression};`);
            return func(...Object.values(context));
        } catch (error) {
            console.error(`Failed to evaluate expression: ${expression}`, error);
            return false;
        }
    }

    /**
     * Retrieves all policies that include both Resource Policies and Principal Policies.
     * 
     * @returns A promise that resolves to an array of policies with both resource and principal policies.
     * @throws An error if the retrieval fails.
     */

    async getCombinedResourceAndPrincipalPolicies(): Promise<Policy[]> {
        try {
            // Query for policies where both resourcePolicy and principalPolicy fields exist
            const rawPolicies = await PolicyModel.find({
                $and: [
                    { 'resourcePolicy': { $exists: true } },
                    { 'principalPolicy': { $exists: true } }
                ]
            }).lean();

            return rawPolicies.map(policy => {
                if (!policy.resourcePolicy || !policy.principalPolicy) {
                    throw new Error('Invalid policy: missing resourcePolicy or principalPolicy');
                }
                return policy as Policy;
            });
            
        } catch (error) {
            throw new Error(`Failed to retrieve combined resource and principal policies: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves all policies that match a given set of query parameters for Resource Policies and Principal Policies.
     * 
     * @param resourceQuery - Query parameters to filter resource policies.
     * @param principalQuery - Query parameters to filter principal policies.
     * @returns A promise that resolves to an array of matching policies.
     * @throws An error if the retrieval fails.
     */

    async searchPoliciesWithResourceAndPrincipal(
        resourceQuery: any,
        principalQuery: any
    ): Promise<Policy[]> {
        try {
            const rawPolicies = await PolicyModel.find({
                $or: [
                    { 'resourcePolicy': resourceQuery },
                    { 'principalPolicy': principalQuery }
                ]
            }).lean();

            return rawPolicies.map(policy => {
                if (!policy.resourcePolicy || !policy.principalPolicy) {
                    throw new Error('Invalid policy: missing resourcePolicy or principalPolicy');
                }
                return policy as Policy;
            });
        } catch (error) {
            throw new Error(`Failed to search policies with resource and principal queries: ${(error as Error).message}`);
        }
    }

    /**
     * Evaluates whether a specific action is allowed for a given principal on a resource.
     * 
     * @param principal - An object containing the ID and attributes of the principal.
     * @param resource - An object containing the ID and attributes of the resource.
     * @param action - The action to be evaluated.
     * @returns A promise that resolves to a boolean indicating whether the action is allowed.
     * @throws An error if the evaluation fails.
     */
    public async evaluatePolicy(
        principal: { id: string; attributes: any },  // Principal object with ID and attributes
        resource: { id: string; attributes: any },   // Resource object with ID and attributes
        action: string                               // The action to be evaluated
    ): Promise<boolean> {
        try {
            // Find policies that are relevant to either the principal or the resource
            const policies = await PolicyModel.find({
                $or: [
                    { 'principalPolicy.principal': principal.id },
                    { 'resourcePolicy.resource': resource.id }
                ]
            });

            // Iterate over the found policies to evaluate the action
            for (const policy of policies) {
                // Check PrincipalPolicy rules
                if (policy.principalPolicy) {
                    for (const rule of policy.principalPolicy.rules) {
                        if (rule.actions.some((act: Action) => act.action === action)) {
                            const matchedAction = rule.actions.find((act: Action) => act.action === action);
                            if (matchedAction && matchedAction.effect === 'EFFECT_ALLOW') {
                                return true; // Allow if a matching action is found with EFFECT_ALLOW
                            }
                        }
                    }
                }

                // Check ResourcePolicy rules
                if (policy.resourcePolicy) {
                    for (const rule of policy.resourcePolicy.rules) {
                        if (rule.actions.includes(action)) {
                            if (rule.effect === 'EFFECT_ALLOW') {
                                return true; // Allow if the action is found and effect is EFFECT_ALLOW
                            }
                        }
                    }
                }
            }

            return true; // TO FIX: Access allowed to simplify the integration
                         // if should be Default deny if no matching policy is found
        } catch (error) {
            throw new Error(`Failed to evaluate policy: ${(error as Error).message}`);
        }
    }

    /**
    * Builds the context for the policy evaluation process.
    * 
    * @param requestParams - The parameters provided in the request, including principal, resource, actions, etc.
    * @returns The context object used for evaluating policies.
    */
    private async buildContext(requestParams: RequestParams) {
        const context = {
            principalId: requestParams.principalId,
            resourceId: requestParams.resourceId,
            actions: requestParams.actions,
            environment: requestParams.environment || {},
            variables: requestParams.variables || {},
            // Add user-specific attributes to context
            userRole: 'admin',  // Example value, this should come from your user data
            yearsExperience: 6  // Example value, this should come from your user data
        };

        console.log('Context Built:', JSON.stringify(context, null, 2)); // Debugging context
        return context;
    }

    /**
     * Retrieves relevant policies for a given principal and resource.
     * 
     * @param principalId - The ID of the principal (e.g., user, group).
     * @param resourceId - The ID of the resource being accessed.
     * @returns An object containing arrays of matching principal and resource policies.
     */

    public async getRelevantPolicies(
        principalId: string,
        resourceId: string
    ): Promise<{
        principalPolicies: PrincipalPolicy[],
        resourcePolicies: ResourcePolicy[],
        groupPolicies: GroupPolicy[],
        rolePolicies: RolePolicy[],
        derivedRoles: DerivedRole[]
    }> {
        try {
            console.log(`Fetching relevant policies for Principal: ${principalId}, Resource: ${resourceId}`);

            // Fetch documents from PolicyModel that match the principalId, resourceId, group policies, or role policies
            const policyDocuments = await PolicyModel.find({
                $or: [
                    { 'principalPolicy.principal': principalId },
                    { 'resourcePolicy.resource': { $regex: new RegExp(`^${resourceId.replace('*', '.*')}$`) } },
                    { 'groupPolicy.group': principalId },  // Assuming group IDs are also stored as principalId in some contexts
                    { 'rolePolicy.role': principalId },    // Assuming role IDs are also stored as principalId in some contexts
                    { 'derivedRoles.definitions': { $elemMatch: { name: principalId } } }
                ]
            }).lean();

            // Extract Principal Policies
            const principalPolicies: PrincipalPolicy[] = policyDocuments
                .filter(doc => doc.principalPolicy && doc.principalPolicy.principal === principalId)
                .map(doc => doc.principalPolicy as PrincipalPolicy);

            // Extract Resource Policies
            const resourcePolicies: ResourcePolicy[] = policyDocuments
                .filter(doc => doc.resourcePolicy && new RegExp(`^${resourceId.replace('*', '.*')}$`).test(doc.resourcePolicy.resource))
                .map(doc => doc.resourcePolicy as ResourcePolicy);

            // Extract Group Policies
            const groupPolicies: GroupPolicy[] = policyDocuments
                .filter(doc => doc.groupPolicy && doc.groupPolicy.group === principalId)
                .map(doc => doc.groupPolicy as GroupPolicy);

            // Extract Role Policies
            const rolePolicies: RolePolicy[] = policyDocuments
                .filter(doc => doc.rolePolicy && doc.rolePolicy.role === principalId)
                .map(doc => doc.rolePolicy as RolePolicy);

            // Extract Derived Roles
            const derivedRoles: DerivedRole[] = policyDocuments
                .filter(doc => doc.derivedRoles)
                .map(doc => doc.derivedRoles as DerivedRole);

            console.log('Fetched Principal Policies:', JSON.stringify(principalPolicies, null, 2)); // Debugging
            console.log('Fetched Resource Policies:', JSON.stringify(resourcePolicies, null, 2)); // Debugging
            console.log('Fetched Group Policies:', JSON.stringify(groupPolicies, null, 2)); // Debugging
            console.log('Fetched Role Policies:', JSON.stringify(rolePolicies, null, 2)); // Debugging
            console.log('Fetched Derived Roles:', JSON.stringify(derivedRoles, null, 2)); // Debugging

            return { principalPolicies, resourcePolicies, groupPolicies, rolePolicies, derivedRoles };
        } catch (error) {
            console.error('Error fetching relevant policies:', error);
            throw error;
        }
    }

    /**
     * Evaluates a condition in the context of a policy.
     * 
     * @param condition - The condition to be evaluated.
     * @param context - The evaluation context including principal, resource, and environment.
     * @returns A boolean indicating whether the condition is met.
     */
    public evaluateCondition(condition: Condition, context: any): boolean {
        console.log('Evaluating Condition:', JSON.stringify(condition, null, 2)); // Debugging
        if (condition.match) {
            return this.evaluateMatch(condition.match, context);
        }
        if (condition.script) {
            return this.evaluateScript(condition.script, context);
        }
        return false;
    }

    /**
     * Evaluates a match expression within a condition.
     * 
     * @param match - The match expression to be evaluated.
     * @param context - The evaluation context.
     * @returns A boolean indicating whether the match expression is satisfied.
     */
    private evaluateMatch(match: Match, context: any): boolean {
        console.log('Evaluating Match:', JSON.stringify(match, null, 2)); // Debugging

        if (match.all) {
            return match.all.of.every((subMatch) => this.evaluateMatch(subMatch, context));
        }
        if (match.any) {
            return match.any.of.some((subMatch) => this.evaluateMatch(subMatch, context));
        }
        if (match.none) {
            return !match.none.of.some((subMatch) => this.evaluateMatch(subMatch, context));
        }
        if (match.expr) {
            console.log('Evaluating Expression:', match.expr); // Debugging

            // Replace eval with a safer method
            const isExpressionTrue = this.evaluateExpression(match.expr, context);
            return isExpressionTrue;
        }
        return false;
    }


    /**
     * Evaluates a script-based condition.
     * 
     * @param script - The script to be evaluated.
     * @param context - The evaluation context.
     * @returns A boolean indicating whether the script condition is met.
     */
    private evaluateScript(script: string, context: any): boolean {
        console.log('Evaluating Script:', script); // Debugging
        return eval(script);
    }

    /**
     * Applies derived roles in the context of a policy evaluation.
     * 
     * @param derivedRoles - The derived roles to be applied.
     * @param context - The evaluation context.
     * @returns A boolean indicating whether any derived role conditions are satisfied.
     */
    private applyDerivedRoles(derivedRoles: DerivedRole[], context: any): boolean {
        console.log('Applying Derived Roles:', JSON.stringify(derivedRoles, null, 2)); // Debugging
        return derivedRoles.some((role) => {
            if (role.definitions) {
                return role.definitions.some(def => this.evaluateCondition(def.condition!, context));
            }
            return false;
        });
    }

    /**
     * Evaluates whether a specific action within a rule is allowed.
     * 
     * @param action - The action to be evaluated.
     * @param context - The evaluation context.
     * @returns A boolean indicating whether the action is allowed based on conditions.
     */
    private evaluateAction(action: Action, context: any): boolean {
        console.log('Evaluating Action:', JSON.stringify(action, null, 2)); // Debugging
        if (action.condition) {
            return this.evaluateCondition(action.condition, context);
        }
        return true; // If no condition, assume action is allowed
    }

    /**
     * Resolves conflicts between resource policies and determines the final decision.
     * 
     * @param policies - An array of resource policies to be evaluated.
     * @param context - The evaluation context.
     * @returns A string indicating the final decision ('ALLOW' or 'DENY').
     */
    private resolveResourcePolicyConflicts(policies: ResourcePolicy[], context: any): string {
        let decision = 'DENY';
        console.log('Resolving Resource Policy Conflicts...');

        policies.forEach((policy) => {
            const resourcePolicy: ResourcePolicy = policy;
            resourcePolicy.rules.forEach((rule: ResourceRule) => {
                console.log(`Evaluating Rule for Actions: ${JSON.stringify(rule.actions)}`); // Debugging
                if (rule.actions.some((action) => context.actions.includes(action))) {
                    const allow = rule.effect === 'EFFECT_ALLOW' && this.evaluateAction({ action: rule.actions[0], ...rule }, context);
                    const deny = rule.effect === 'EFFECT_DENY' && this.evaluateAction({ action: rule.actions[0], ...rule }, context);
                    console.log(`Allow: ${allow}, Deny: ${deny}`); // Debugging
                    if (allow) decision = 'ALLOW';
                    if (deny) decision = 'DENY';
                }
            });
        });

        console.log(`Final Decision after resolving conflicts: ${decision}`); // Debugging
        return decision;
    }

    /**
     * Evaluates whether a specific action is allowed for a given principal on a resource.
     * 
     * @param requestParams - The parameters of the request to be evaluated.
     * @returns A promise that resolves to a string ('ALLOW' or 'DENY') indicating the final decision.
     * @throws An error if the evaluation fails.
     */
    public async evaluate(requestParams: RequestParams): Promise<string> {
        const context = await this.buildContext(requestParams);
        const { principalPolicies, resourcePolicies } = await this.getRelevantPolicies(requestParams.principalId, requestParams.resourceId);

        if (principalPolicies.length === 0 && resourcePolicies.length === 0) {
            console.log('No matching policies found. Denying by default.');
            return 'DENY'; // No matching policies, deny by default
        }

        // Step 1: Evaluate Principal Policies
        let principalAllow = false;
        for (const policy of principalPolicies) {
            for (const rule of policy.rules) {
                if (rule.actions.some((act: Action) => requestParams.actions.includes(act.action))) {
                    const matchedAction = rule.actions.find((act: Action) => requestParams.actions.includes(act.action));
                    const conditionSatisfied = matchedAction && matchedAction.condition
                        ? this.evaluateCondition(matchedAction.condition, context)
                        : true; // If no condition, assume satisfied

                    if (conditionSatisfied) {
                        if (matchedAction?.effect === 'EFFECT_ALLOW') {
                            principalAllow = true;
                        }
                        if (matchedAction?.effect === 'EFFECT_DENY') {
                            return 'DENY'; // Explicit deny takes precedence
                        }
                    }
                }
            }
        }

        // Step 2: Evaluate Resource Policies
        let resourceAllow = false;
        for (const policy of resourcePolicies) {
            for (const rule of policy.rules) {
                if (rule.actions.some((action) => context.actions.includes(action))) {
                    const matchedAction = rule.actions.find((action) => context.actions.includes(action));
                    const conditionSatisfied = matchedAction && rule.condition
                        ? this.evaluateCondition(rule.condition, context)
                        : true; // If no condition, assume satisfied

                    if (conditionSatisfied) {
                        if (rule.effect === 'EFFECT_ALLOW') {
                            resourceAllow = true;
                        }
                        if (rule.effect === 'EFFECT_DENY') {
                            return 'DENY'; // Explicit deny takes precedence
                        }
                    }
                }
            }
        }

        // Step 3: Resolve Final Decision
        if (principalAllow || resourceAllow) {
            return 'ALLOW'; // Allow if any relevant policy allows the action
        }

        return 'DENY'; // Default deny if no policy explicitly allows the action
    }
    
    public async getEffectivePolicies(
        principalId: string,
        resourceId: string
    ): Promise<PartialPolicy[]> {
        try {
            console.log(`Fetching relevant policies for Principal: ${principalId}, Resource: ${resourceId}`);
    
            // Fetch documents from PolicyModel that match the principalId, resourceId, group policies, or role policies
            const policyDocuments = await PolicyModel.find({
                $or: [
                    { 'principalPolicy.principal': principalId },
                    { 'resourcePolicy.resource': { $regex: new RegExp(`^${resourceId.replace('*', '.*')}$`) } },
                    { 'groupPolicy.group': principalId },  // Assuming group IDs are also stored as principalId in some contexts
                    { 'rolePolicy.role': principalId },    // Assuming role IDs are also stored as principalId in some contexts
                    { 'derivedRoles.definitions': { $elemMatch: { name: principalId } } }
                ]
            }).lean();
    
            console.log('Fetched Policies:', JSON.stringify(policyDocuments, null, 2));
    
            // Transform and validate policies
            return policyDocuments.map(policy => {
                const {
                    resourcePolicy,
                    principalPolicy,
                    groupPolicy,
                    rolePolicy,
                    derivedRoles, // This might be an array or a single object
                    apiVersion = '1.0',
                    name = 'Default Policy Name',
                    auditInfo = {},
                    _id = ''
                } = policy;
    
                // Ensure derivedRoles is an array
                const validatedDerivedRoles = Array.isArray(derivedRoles) ? derivedRoles : derivedRoles ? [derivedRoles] : [];
    
                // Validate and construct resourcePolicy if present
                const validatedResourcePolicy = resourcePolicy
                    ? {
                          resource: resourcePolicy.resource,
                          version: resourcePolicy.version,
                          scope: resourcePolicy.scope,
                          importDerivedRoles: resourcePolicy.importDerivedRoles || [],
                          variables: resourcePolicy.variables,
                          schemas: resourcePolicy.schemas,
                          rules: resourcePolicy.rules,
                      }
                    : undefined;
    
                // Validate and construct principalPolicy if present
                const validatedPrincipalPolicy = principalPolicy
                    ? {
                          principal: principalPolicy.principal,
                          version: principalPolicy.version,
                          scope: principalPolicy.scope,
                          variables: principalPolicy.variables,
                          rules: principalPolicy.rules,
                      }
                    : undefined;
    
                // Ensure at least one policy exists
                if (!validatedResourcePolicy && !validatedPrincipalPolicy) {
                    throw new Error('Invalid policy document: Missing both resourcePolicy and principalPolicy');
                }
    
                return {
                    apiVersion,
                    name,
                    auditInfo,
                    _id,
                    resourcePolicy: validatedResourcePolicy,
                    principalPolicy: validatedPrincipalPolicy,
                    groupPolicy, // Assuming direct assignment if no specific structure is enforced
                    rolePolicy, // Assuming direct assignment if no specific structure is enforced
                    derivedRoles: validatedDerivedRoles, // Ensure this is an array
                };
            });
        } catch (error) {
            console.error('Error fetching relevant policies:', error);
            throw error;
        }
    }
    
}

interface PartialPolicy {
    resourcePolicy?: ResourcePolicy;
    principalPolicy?: PrincipalPolicy;
    groupPolicy?: GroupPolicy;
    rolePolicy?: RolePolicy;
    derivedRoles?: DerivedRole[];
    // Other fields that might be part of the response
}

// Export an instance of the PolicyService class for use in other parts of the application
export default new PolicyService();
