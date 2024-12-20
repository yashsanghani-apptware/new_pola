# Anatomy of the `evaluate` Function

The `evaluate` function is a core method in the `PolicyService` class responsible for determining whether a specific action is allowed for a given principal (e.g., user, group) on a resource. This function uses multiple policies (e.g., PrincipalPolicy, ResourcePolicy) to make a decision about whether to allow or deny access based on the defined rules.

## **Function Signature**

```typescript
public async evaluate(requestParams: RequestParams): Promise<string>
```

## **Inputs**

1. **`requestParams`**: An object containing parameters that define the context of the request to be evaluated. The `RequestParams` interface might look like this:
   - **`principalId`**: The ID of the principal (e.g., user, group) requesting access.
   - **`resourceId`**: The ID of the resource to which access is being requested.
   - **`actions`**: An array of actions (e.g., 'read', 'write') to be evaluated.
   - **`environment`**: Optional. Contains environmental variables or context (e.g., IP address, location).
   - **`variables`**: Optional. Any additional custom variables needed for evaluation.

## **Outputs**

- Returns a **`Promise<string>`**: Resolves to a string indicating the final decision:
  - `'ALLOW'`: The requested action is permitted based on the policies.
  - `'DENY'`: The requested action is denied based on the policies.

## **Processing Logic: Step-by-Step Explanation**

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

## **Process Flow and Function Calls**

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

# **Conclusion**

The `evaluate` function is designed to systematically assess both principal and resource policies to determine if a given action is permitted. By building a context, retrieving relevant policies, and evaluating conditions and actions step-by-step, the function ensures that all applicable rules are considered before making a final decision to `ALLOW` or `DENY` the requested action.
