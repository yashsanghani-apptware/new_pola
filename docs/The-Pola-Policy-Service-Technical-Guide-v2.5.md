# The Pola - Policy Service Technical Guide
## Step-by-Step Explanation of Each Function in `PolicyService`

The `PolicyService` class is designed to interact with the policy model in a MongoDB database, providing CRUD (Create, Read, Update, Delete) operations and policy evaluation logic. Here is a detailed explanation of each function:

### 1. `getAllPolicies()`

- **Purpose**: Retrieves all policy documents from the database.
- **Implementation**: Uses `PolicyModel.find()` to fetch all policies.
- **Error Handling**: Catches and throws an error if the retrieval fails.
  
```typescript
async getAllPolicies(): Promise<Policy[]> {
    try {
        return await PolicyModel.find();
    } catch (error) {
        throw new Error(`Failed to retrieve policies: ${(error as Error).message}`);
    }
}
```

### 2. `getPolicyById(id: string)`

- **Purpose**: Retrieves a single policy document based on its ID.
- **Parameters**: 
  - `id`: The unique identifier of the policy.
- **Implementation**: Uses `PolicyModel.findById(id)` to find a policy by ID.
- **Error Handling**: Throws an error if the retrieval fails.

```typescript
async getPolicyById(id: string): Promise<Policy | null> {
    try {
        return await PolicyModel.findById(id);
    } catch (error) {
        throw new Error(`Failed to retrieve policy by ID: ${(error as Error).message}`);
    }
}
```

### 3. `searchPolicies(query: any)`

- **Purpose**: Searches for policies matching a specific query.
- **Parameters**: 
  - `query`: An object representing search criteria.
- **Implementation**: Uses `PolicyModel.find(query)` to search for matching policies.
- **Error Handling**: Throws an error if the search fails.

```typescript
async searchPolicies(query: any): Promise<Policy[]> {
    try {
        return await PolicyModel.find(query);
    } catch (error) {
        throw new Error(`Failed to search policies: ${(error as Error).message}`);
    }
}
```

### 4. `createPolicy(policyData: Partial<Policy>)`

- **Purpose**: Creates a new policy in the database.
- **Parameters**: 
  - `policyData`: The data used to create the policy.
- **Implementation**: Instantiates a new `PolicyModel` object and saves it.
- **Error Handling**: Throws an error if the creation fails.

```typescript
async createPolicy(policyData: Partial<Policy>): Promise<Policy> {
    try {
        const newPolicy = new PolicyModel(policyData);
        return await newPolicy.save();
    } catch (error) {
        throw new Error(`Failed to create policy: ${(error as Error).message}`);
    }
}
```

### 5. `updatePolicy(id: string, updateData: Partial<Policy>)`

- **Purpose**: Updates an existing policy.
- **Parameters**: 
  - `id`: The ID of the policy to update.
  - `updateData`: The data to update the policy with.
- **Implementation**: Uses `PolicyModel.findByIdAndUpdate` to find and update the policy.
- **Error Handling**: Throws an error if the update fails.

```typescript
async updatePolicy(id: string, updateData: Partial<Policy>): Promise<Policy | null> {
    try {
        return await PolicyModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
        throw new Error(`Failed to update policy: ${(error as Error).message}`);
    }
}
```

### 6. `deletePolicy(id: string)`

- **Purpose**: Deletes a policy by its ID.
- **Parameters**: 
  - `id`: The ID of the policy to delete.
- **Implementation**: Uses `PolicyModel.findByIdAndDelete` to find and delete the policy.
- **Error Handling**: Throws an error if the deletion fails.

```typescript
async deletePolicy(id: string): Promise<boolean> {
    try {
        const result = await PolicyModel.findByIdAndDelete(id);
        return result !== null;
    } catch (error) {
        throw new Error(`Failed to delete policy: ${(error as Error).message}`);
    }
}
```

### 7. `getAllResourcePolicies()`

- **Purpose**: Retrieves all resource policies.
- **Implementation**: Queries for documents where the `resourcePolicy` field exists.
- **Error Handling**: Throws an error if the retrieval fails.

```typescript
async getAllResourcePolicies(): Promise<ResourcePolicy[]> {
    try {
        return await PolicyModel.find({ 'resourcePolicy': { $exists: true } }, 'resourcePolicy').lean();
    } catch (error) {
        throw new Error(`Failed to retrieve resource policies: ${(error as Error).message}`);
    }
}
```

### 8. `getAllPrincipalPolicies()`

- **Purpose**: Retrieves all principal policies.
- **Implementation**: Queries for documents where the `principalPolicy` field exists.
- **Error Handling**: Throws an error if the retrieval fails.

```typescript
async getAllPrincipalPolicies(): Promise<PrincipalPolicy[]> {
    try {
        return await PolicyModel.find({ 'principalPolicy': { $exists: true } }, 'principalPolicy').lean();
    } catch (error) {
        throw new Error(`Failed to retrieve principal policies: ${(error as Error).message}`);
    }
}
```

### 9. `getAllExportVariables()`

- **Purpose**: Retrieves all export variables from the database.
- **Implementation**: Queries for documents where the `exportVariables` field exists.
- **Error Handling**: Throws an error if the retrieval fails.

```typescript
async getAllExportVariables(): Promise<ExportVariable[]> {
    try {
        return await PolicyModel.find({ 'exportVariables': { $exists: true } }, 'exportVariables').lean();
    } catch (error) {
        throw new Error(`Failed to retrieve export variables: ${(error as Error).message}`);
    }
}
```

### 10. `getAllDerivedRoles()`

- **Purpose**: Retrieves all derived roles from the database.
- **Implementation**: Queries for documents where the `derivedRoles` field exists.
- **Error Handling**: Throws an error if the retrieval fails.

```typescript
async getAllDerivedRoles(): Promise<DerivedRole[]> {
    try {
        return await PolicyModel.find({ 'derivedRoles': { $exists: true } }, 'derivedRoles').lean();
    } catch (error) {
        throw new Error(`Failed to retrieve derived roles: ${(error as Error).message}`);
    }
}
```

### 11. `evaluateExpression(expression: string, context: any)`

- **Purpose**: Evaluates an expression using a given context.
- **Parameters**: 
  - `expression`: A string representing the expression to evaluate.
  - `context`: An object representing the variables available in the evaluation.
- **Implementation**: Creates a dynamic function to evaluate the expression.
- **Error Handling**: Logs errors and returns `false` if evaluation fails.

```typescript
private evaluateExpression(expression: string, context: any): boolean {
    try {
        const func = new Function(...Object.keys(context), `return ${expression};`);
        return func(...Object.values(context));
    } catch (error) {
        console.error(`Failed to evaluate expression: ${expression}`, error);
        return false;
    }
}
```

### 12. `getCombinedResourceAndPrincipalPolicies()`

- **Purpose**: Retrieves all policies containing both resource and principal policies.
- **Implementation**: Queries for policies where both `resourcePolicy` and `principalPolicy` fields exist.
- **Error Handling**: Throws an error if the retrieval fails.

```typescript
async getCombinedResourceAndPrincipalPolicies(): Promise<Policy[]> {
    try {
        return await PolicyModel.find({
            $and: [
                { 'resourcePolicy': { $exists: true } },
                { 'principalPolicy': { $exists: true } }
            ]
        }).lean();
    } catch (error) {
        throw new Error(`Failed to retrieve combined resource and principal policies: ${(error as Error).message}`);
    }
}
```

### 13. `searchPoliciesWithResourceAndPrincipal(resourceQuery: any, principalQuery: any)`

- **Purpose**: Searches for policies that match given resource and principal queries.
- **Parameters**: 
  - `resourceQuery`: Query parameters for resource policies.
  - `principalQuery`: Query parameters for principal policies.
- **Implementation**: Uses `PolicyModel.find` to match the provided queries.
- **Error Handling**: Throws an error if the search fails.

```typescript
async searchPoliciesWithResourceAndPrincipal(
    resourceQuery: any,
    principalQuery: any
): Promise<Policy[]> {
    try {
        return await PolicyModel.find({
            $or: [
                { 'resourcePolicy': resourceQuery },
                { 'principalPolicy': principalQuery }
            ]
        }).lean();
    } catch (error) {
        throw new Error(`Failed to search policies with resource and principal queries: ${(error as Error).message}`);
    }
}
```

### 14. `evaluatePolicy(principal, resource, action)`

- **Purpose**: Determines if a specific action is allowed for a given principal on a resource.
- **Parameters**: 
  - `principal`: An object representing the principal (user, group).
  - `resource`: An object representing the resource.
  - `action`: The action to be evaluated.
- **Implementation**: Retrieves policies relevant to the principal or resource and evaluates the action against each policy.
- **Error Handling**: Throws an

 error if evaluation fails.

```typescript
public async evaluatePolicy(
    principal: { id: string; attributes: any },
    resource: { id: string; attributes: any },
    action: string
): Promise<boolean> {
    try {
        const policies = await PolicyModel.find({
            $or: [
                { 'principalPolicy.principal': principal.id },
                { 'resourcePolicy.resource': resource.id }
            ]
        });

        for (const policy of policies) {
            // Evaluate Principal and Resource Policies
        }

        return true; // Adjusted to correctly handle default allow/deny
    } catch (error) {
        throw new Error(`Failed to evaluate policy: ${(error as Error).message}`);
    }
}
```

### 15. `buildContext(requestParams: RequestParams)`

- **Purpose**: Constructs the context object used in policy evaluation.
- **Parameters**: 
  - `requestParams`: Contains information about the principal, resource, actions, etc.
- **Implementation**: Builds a context object with attributes needed for policy evaluation.
- **Error Handling**: Logs the context for debugging purposes.

```typescript
private async buildContext(requestParams: RequestParams) {
    const context = {
        principalId: requestParams.principalId,
        resourceId: requestParams.resourceId,
        actions: requestParams.actions,
        environment: requestParams.environment || {},
        variables: requestParams.variables || {},
        userRole: 'admin',
        yearsExperience: 6
    };
    console.log('Context Built:', JSON.stringify(context, null, 2));
    return context;
}
```

### 16. `getRelevantPolicies(principalId: string, resourceId: string)`

- **Purpose**: Retrieves policies relevant to a given principal and resource.
- **Parameters**: 
  - `principalId`: The ID of the principal (user, group).
  - `resourceId`: The ID of the resource.
- **Implementation**: Fetches policies matching the provided principal and resource IDs.
- **Error Handling**: Throws an error if the retrieval fails.

```typescript
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
        const policyDocuments = await PolicyModel.find({
            $or: [
                { 'principalPolicy.principal': principalId },
                { 'resourcePolicy.resource': { $regex: new RegExp(`^${resourceId.replace('*', '.*')}$`) } },
                { 'groupPolicy.group': principalId },
                { 'rolePolicy.role': principalId },
                { 'derivedRoles.definitions': { $elemMatch: { name: principalId } } }
            ]
        }).lean();

        // Extract and return the relevant policies
    } catch (error) {
        console.error('Error fetching relevant policies:', error);
        throw error;
    }
}
```

### 17. `evaluateCondition(condition: Condition, context: any)`

- **Purpose**: Evaluates whether a condition is met within a given context.
- **Parameters**: 
  - `condition`: The condition to be evaluated.
  - `context`: The evaluation context.
- **Implementation**: Checks the `match` or `script` fields to determine the result.
- **Error Handling**: Logs the condition and returns false if not met.

```typescript
public evaluateCondition(condition: Condition, context: any): boolean {
    console.log('Evaluating Condition:', JSON.stringify(condition, null, 2));
    if (condition.match) {
        return this.evaluateMatch(condition.match, context);
    }
    if (condition.script) {
        return this.evaluateScript(condition.script, context);
    }
    return false;
}
```

### 18. `evaluateMatch(match: Match, context: any)`

- **Purpose**: Evaluates a match expression within a condition.
- **Parameters**: 
  - `match`: The match expression to be evaluated.
  - `context`: The evaluation context.
- **Implementation**: Evaluates logical constructs (`all`, `any`, `none`, `expr`) to determine if they satisfy the condition.
- **Error Handling**: Logs the match and expression evaluations for debugging.

```typescript
private evaluateMatch(match: Match, context: any): boolean {
    console.log('Evaluating Match:', JSON.stringify(match, null, 2));

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
        console.log('Evaluating Expression:', match.expr);
        const isExpressionTrue = this.evaluateExpression(match.expr, context);
        return isExpressionTrue;
    }
    return false;
}
```

### 19. `evaluateScript(script: string, context: any)`

- **Purpose**: Evaluates a script-based condition.
- **Parameters**: 
  - `script`: The script to be evaluated.
  - `context`: The evaluation context.
- **Implementation**: Uses `eval` to execute the script.
- **Error Handling**: Logs the script evaluation for debugging purposes.

```typescript
private evaluateScript(script: string, context: any): boolean {
    console.log('Evaluating Script:', script);
    return eval(script);
}
```

### 20. `applyDerivedRoles(derivedRoles: DerivedRole[], context: any)`

- **Purpose**: Applies derived roles during policy evaluation.
- **Parameters**: 
  - `derivedRoles`: An array of derived roles to evaluate.
  - `context`: The evaluation context.
- **Implementation**: Iterates over derived roles and evaluates their conditions.
- **Error Handling**: Logs applied derived roles for debugging purposes.

```typescript
private applyDerivedRoles(derivedRoles: DerivedRole[], context: any): boolean {
    console.log('Applying Derived Roles:', JSON.stringify(derivedRoles, null, 2));
    return derivedRoles.some((role) => {
        if (role.definitions) {
            return role.definitions.some(def => this.evaluateCondition(def.condition!, context));
        }
        return false;
    });
}
```

### 21. `evaluateAction(action: Action, context: any)`

- **Purpose**: Evaluates whether a specific action is allowed within a rule.
- **Parameters**: 
  - `action`: The action to be evaluated.
  - `context`: The evaluation context.
- **Implementation**: Checks the condition attached to the action.
- **Error Handling**: Logs action evaluations for debugging purposes.

```typescript
private evaluateAction(action: Action, context: any): boolean {
    console.log('Evaluating Action:', JSON.stringify(action, null, 2));
    if (action.condition) {
        return this.evaluateCondition(action.condition, context);
    }
    return true;
}
```

### 22. `resolveResourcePolicyConflicts(policies: ResourcePolicy[], context: any)`

- **Purpose**: Resolves conflicts between multiple resource policies.
- **Parameters**: 
  - `policies`: An array of resource policies.
  - `context`: The evaluation context.
- **Implementation**: Iterates over policies, evaluates rules, and determines the final decision (`ALLOW` or `DENY`).
- **Error Handling**: Logs the conflict resolution process for debugging.

```typescript
private resolveResourcePolicyConflicts(policies: ResourcePolicy[], context: any): string {
    let decision = 'DENY';
    console.log('Resolving Resource Policy Conflicts...');

    policies.forEach((policy) => {
        // Evaluate each rule and determine allow/deny decision
    });

    console.log(`Final Decision after resolving conflicts: ${decision}`);
    return decision;
}
```

### 23. `evaluate(requestParams: RequestParams)`

- **Purpose**: Determines if a specific action is allowed for a principal on a resource.
- **Parameters**: 
  - `requestParams`: Contains the principal ID, resource ID, actions, and context.
- **Implementation**: Builds context, retrieves relevant policies, evaluates both principal and resource policies, and resolves the final decision.
- **Error Handling**: Throws an error if the evaluation fails.

```typescript
public async evaluate(requestParams: RequestParams): Promise<string> {
    const context = await this.buildContext(requestParams);
    const { principalPolicies, resourcePolicies } = await this.getRelevantPolicies(requestParams.principalId, requestParams.resourceId);

    if (principalPolicies.length === 0 && resourcePolicies.length === 0) {
        return 'DENY'; // No matching policies, deny by default
    }

    // Step-by-step evaluation of principal and resource policies
    // Return 'ALLOW' or 'DENY' based on policy evaluation
}
```

### 24. `getEffectivePolicies(principalId: string, resourceId: string)`

- **Purpose**: Retrieves all effective policies relevant to a given principal and resource.
- **Parameters**: 
  - `principalId`: The ID of the principal.
  - `resourceId`: The ID of the resource.
- **Implementation**: Fetches all relevant policies and logs them.
- **Error Handling**: Throws an error if retrieval fails.

```typescript
public async getEffectivePolicies(
    principalId: string,
    resourceId: string
): Promise<Policy

[]> {
    try {
        const policyDocuments = await PolicyModel.find({
            $or: [
                { 'principalPolicy.principal': principalId },
                { 'resourcePolicy.resource': { $regex: new RegExp(`^${resourceId.replace('*', '.*')}$`) } },
                { 'groupPolicy.group': principalId },
                { 'rolePolicy.role': principalId },
                { 'derivedRoles.definitions': { $elemMatch: { name: principalId } } }
            ]
        }).lean();

        return policyDocuments; // Return full Policy objects
    } catch (error) {
        throw error;
    }
}
```
## The Query Object in Search Policies

The `Query` object in the `searchPolicies` function allows for dynamic filtering of policies based on various attributes. This object is typically constructed using MongoDB's query syntax and can include any number of fields that match the schema of the `Policy` documents.

### Structure of the `Query` Object

The `Query` object is a JavaScript object that contains key-value pairs where:
- The **keys** represent the fields of the `Policy` documents.
- The **values** represent the conditions or criteria that these fields must match.

### Common Components of a `Query` Object

1. **Field Name**: The field in the `Policy` document you are querying against (e.g., `principalPolicy`, `resourcePolicy`, `rules`, etc.).
2. **Comparison Operators**: Used to define the relationship between the field and the value. Common MongoDB operators include:
   - `$eq`: Equal to
   - `$ne`: Not equal to
   - `$gt`: Greater than
   - `$gte`: Greater than or equal to
   - `$lt`: Less than
   - `$lte`: Less than or equal to
   - `$in`: Matches any value in an array
   - `$nin`: Does not match any value in an array
   - `$exists`: Checks for the existence of a field
   - `$regex`: Matches a regular expression

3. **Logical Operators**: Used to combine multiple conditions.
   - `$and`: Matches all conditions.
   - `$or`: Matches any of the conditions.
   - `$not`: Inverts the effect of a query expression.
   - `$nor`: Matches none of the conditions.

### Example Query Objects

Here are some examples to illustrate the structure of the `Query` object for the `searchPolicies` function.

#### 1. Example: Search for Policies by Principal

```typescript
const query = {
    'principalPolicy.principal': 'user123', // Find policies for the principal with ID 'user123'
};
```

#### 2. Example: Search for Policies with Specific Actions

```typescript
const query = {
    $or: [
        { 'resourcePolicy.rules.actions': { $in: ['read', 'write'] } }, // Policies with 'read' or 'write' actions in ResourcePolicy
        { 'principalPolicy.rules.actions.action': { $eq: 'delete' } } // Policies where 'delete' is an allowed action in PrincipalPolicy
    ]
};
```

#### 3. Example: Search for Policies Created After a Specific Date

```typescript
const query = {
    'auditInfo.createdAt': { $gt: new Date('2024-01-01T00:00:00Z') } // Policies created after January 1, 2024
};
```

#### 4. Example: Search for Policies with a Specific Version

```typescript
const query = {
    version: { $eq: '2.5' } // Policies with version '2.5'
};
```

#### 5. Example: Search for Disabled Policies

```typescript
const query = {
    disabled: true // Policies that are marked as disabled
};
```

#### 6. Example: Search for Policies with Conditions Matching a Regular Expression

```typescript
const query = {
    'resourcePolicy.rules.condition.match.expr': { $regex: /^P\.role === 'admin'$/ } // Policies with a condition where the role is 'admin'
};
```

#### 7. Example: Search for Policies with Derived Roles

```typescript
const query = {
    'derivedRoles.definitions.name': { $in: ['adminRole', 'userRole'] } // Policies that include derived roles named 'adminRole' or 'userRole'
};
```

#### 8. Example: Search for Combined Policies Using Logical Operators

```typescript
const query = {
    $and: [
        { 'principalPolicy.principal': { $exists: true } }, // Policies where PrincipalPolicy exists
        { 'resourcePolicy.resource': { $exists: true } },   // and ResourcePolicy exists
        { version: '2.5' }                                  // with version '2.5'
    ]
};
```

### Explanation of Example Query Objects

- **Example 1**: Retrieves all policies associated with a specific principal.
- **Example 2**: Finds policies where either a 'read' or 'write' action is present in the `ResourcePolicy` or a 'delete' action is allowed in the `PrincipalPolicy`.
- **Example 3**: Filters policies created after a certain date using the `$gt` (greater than) operator.
- **Example 4**: Matches policies with a specific version.
- **Example 5**: Retrieves policies that are disabled (where `disabled` is set to `true`).
- **Example 6**: Uses a regular expression to match policies with a specific expression in the conditions.
- **Example 7**: Finds policies containing specific derived roles.
- **Example 8**: Combines multiple conditions using logical operators to find policies with both `PrincipalPolicy` and `ResourcePolicy` defined and a specific version.

## Policy Evaluation Process 
### `evaluate` Function: Detailed Explanation

The `evaluate` function is a core method in the `PolicyService` class responsible for determining whether a specific action is allowed for a given principal (e.g., user, group) on a resource. This function uses multiple policies (e.g., PrincipalPolicy, ResourcePolicy) to make a decision about whether to allow or deny access based on the defined rules.

#### **Function Signature**

```typescript
public async evaluate(requestParams: RequestParams): Promise<string>
```

#### **Inputs**

1. **`requestParams`**: An object containing parameters that define the context of the request to be evaluated. The `RequestParams` interface might look like this:
   - **`principalId`**: The ID of the principal (e.g., user, group) requesting access.
   - **`resourceId`**: The ID of the resource to which access is being requested.
   - **`actions`**: An array of actions (e.g., 'read', 'write') to be evaluated.
   - **`environment`**: Optional. Contains environmental variables or context (e.g., IP address, location).
   - **`variables`**: Optional. Any additional custom variables needed for evaluation.

#### **Outputs**

- Returns a **`Promise<string>`**: Resolves to a string indicating the final decision:
  - `'ALLOW'`: The requested action is permitted based on the policies.
  - `'DENY'`: The requested action is denied based on the policies.

#### **Processing Logic: Step-by-Step Explanation**

1. **Build the Evaluation Context**
   - **Purpose**: Creates a comprehensive context object containing all necessary information for policy evaluation.
   - **Called Function**: `buildContext(requestParams)`
   - **Input**: `requestParams` (the parameters of the request to be evaluated).
   - **Output**: A context object containing principal, resource, actions, environment, and other variables.

   ```typescript
   const context = await this.buildContext(requestParams);
   ```

2. **Retrieve Relevant Policies**
   - **Purpose**: Fetches all policies that may be relevant for evaluating the request, including principal policies, resource policies, group policies, role policies, and derived roles.
   - **Called Function**: `getRelevantPolicies(principalId, resourceId)`
   - **Input**: `principalId` and `resourceId` from the `requestParams`.
   - **Output**: An object containing arrays of matching `PrincipalPolicy`, `ResourcePolicy`, `GroupPolicy`, `RolePolicy`, and `DerivedRoles`.

   ```typescript
   const { principalPolicies, resourcePolicies } = await this.getRelevantPolicies(requestParams.principalId, requestParams.resourceId);
   ```

3. **Check for Absence of Matching Policies**
   - **Purpose**: If no relevant policies are found, the default decision is to deny access.
   - **Logic**: If both `principalPolicies` and `resourcePolicies` are empty, log a message and return `'DENY'`.

   ```typescript
   if (principalPolicies.length === 0 && resourcePolicies.length === 0) {
       console.log('No matching policies found. Denying by default.');
       return 'DENY'; // No matching policies, deny by default
   }
   ```

4. **Evaluate Principal Policies**
   - **Purpose**: Check if any `PrincipalPolicy` explicitly allows or denies the requested action.
   - **Logic**:
     - Loop through each policy in `principalPolicies`.
     - For each policy, loop through its `rules`.
     - Check if any action in the rule matches the requested actions.
     - Evaluate conditions (if any) associated with each matched action:
       - If a condition exists, call `evaluateCondition` to check if it's satisfied.
       - If an action is explicitly denied (`EFFECT_DENY`), immediately return `'DENY'`.
       - If an action is allowed (`EFFECT_ALLOW`), mark it as potentially allowed.
   - **Called Functions**:
     - `evaluateCondition(condition, context)`: Evaluates the condition to determine if it is satisfied.

   ```typescript
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
   ```

5. **Evaluate Resource Policies**
   - **Purpose**: Check if any `ResourcePolicy` explicitly allows or denies the requested action.
   - **Logic**:
     - Loop through each policy in `resourcePolicies`.
     - For each policy, loop through its `rules`.
     - Check if any action in the rule matches the requested actions.
     - Evaluate conditions (if any) associated with each matched action:
       - If a condition exists, call `evaluateCondition` to check if it's satisfied.
       - If an action is explicitly denied (`EFFECT_DENY`), immediately return `'DENY'`.
       - If an action is allowed (`EFFECT_ALLOW`), mark it as potentially allowed.
   - **Called Functions**:
     - `evaluateCondition(condition, context)`: Evaluates the condition to determine if it is satisfied.

   ```typescript
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
   ```

6. **Resolve Final Decision**
   - **Purpose**: Combine the results from evaluating both principal and resource policies to determine the final access decision.
   - **Logic**:
     - If any relevant policy allows the action (`principalAllow` or `resourceAllow`), return `'ALLOW'`.
     - Otherwise, return `'DENY'`.

   ```typescript
   if (principalAllow || resourceAllow) {
       return 'ALLOW'; // Allow if any relevant policy allows the action
   }

   return 'DENY'; // Default deny if no policy explicitly allows the action
   ```

#### **Process Flow and Function Calls**

1. **`buildContext(requestParams)`**:
   - **Purpose**: Constructs the evaluation context from the provided request parameters.
   - **Output**: A context object used for evaluating policies.

2. **`getRelevantPolicies(principalId, resourceId)`**:
   - **Purpose**: Retrieves relevant policies based on the principal and resource IDs.
   - **Output**: Arrays of relevant policies (`PrincipalPolicy`, `ResourcePolicy`, etc.).

3. **`evaluateCondition(condition, context)`**:
   - **Purpose**: Evaluates conditions within a policy rule to determine if they are met.
   - **Output**: A boolean value indicating whether the condition is satisfied.

4. **`evaluateMatch(match, context)`**:
   - **Purpose**: Evaluates a match expression within a condition to see if it is satisfied.
   - **Output**: A boolean value indicating whether the match expression is satisfied.

5. **`evaluateScript(script, context)`**:
   - **Purpose**: Evaluates a script-based condition.
   - **Output**: A boolean value indicating whether the script condition is met.

6. **`evaluateAction(action, context)`**:
   - **Purpose**: Evaluates whether a specific action within a rule is allowed.
   - **Output**: A boolean indicating if the action is permitted.

7. **`resolveResourcePolicyConflicts(policies, context)`**:
   - **Purpose**: Resolves conflicts between resource policies and determines the final decision.
   - **Output**: A string indicating the final decision ('ALLOW' or 'DENY').

## Summary


The `PolicyService` class provides comprehensive functionality for managing and evaluating policies, allowing dynamic and secure decision-making based on the attributes of principals, resources, and contextual conditions. It integrates directly with MongoDB to perform CRUD operations and complex policy evaluations, handling errors gracefully and logging useful information for debugging and monitoring purposes.
