
# Agsiri Policy Evaluation Algorithm Step-By-Step Explained

## 1. **Function Overview:**
   - **evaluatePolicy:** This is the main function that evaluates policies to determine whether a user can perform a specific action on a resource.
   - **evaluateConditions:** This helper function evaluates the conditions within a policy rule.
   - **evaluateExpression:** This helper function evaluates individual expressions within the scope of the provided data.

## 2. **Step-by-Step Breakdown of `evaluatePolicy`:**

1. **Extract Request Data:**
   - The function begins by extracting the `user`, `resource`, `context`, and `action` from the incoming request (`req.body`).
   - Example Scenario:
     - **User:** { role: "admin", department: "IT" }
     - **Resource:** { type: "document", department: "IT", visibility: "internal" }
     - **Context:** { currentTime: "2024-08-19T12:00:00Z" }
     - **Action:** "edit"

2. **Retrieve All Policies:**
   - The function retrieves all policies associated with the organization identified by `req.params.orgId`.
   - Example Policy:
     ```yaml
     name: "Admin Edit Policy"
     description: "Admins can edit documents within their department."
     resourcePolicy:
       resource: "*"
       version: "1.0"
       rules:
         - actions: ["edit"]
           effect: "EFFECT_ALLOW"
           condition:
             match:
               all:
                 - expr: "user.role === 'admin'"
                 - expr: "user.department === resource.department"
     auditInfo:
       createdBy: "system"
     version: "1.0"
     ```

3. **Initialize Evaluation Context:**
   - The function initializes an `initialScope` object that combines user attributes, resource attributes, and context into a single object that will be used to evaluate expressions.
   - Example `initialScope`:
     ```json
     {
       "user": { "role": "admin", "department": "IT" },
       "resource": { "type": "document", "department": "IT", "visibility": "internal" },
       "context": { "currentTime": "2024-08-19T12:00:00Z" }
     }
     ```

4. **Iterate Through Policies:**
   - The function iterates through each policy to evaluate it against the provided action, user, and resource.

5. **Evaluate Local Variables:**
   - For each policy, it checks if there are any local variables defined. If so, it evaluates these expressions within the current scope and adds the results to the local scope.
   - Example:
     ```yaml
     variables:
       local:
         isInternalUser: "user.department === resource.department"
     ```
   - After evaluation, `localScope` might include:
     ```json
     { "isInternalUser": true }
     ```

6. **Evaluate Each Rule in the Policy:**
   - The function then evaluates each rule within the policy. It checks if the rule's actions include the requested action (e.g., "edit").
   - If the action matches, it evaluates the rule's conditions using `evaluateConditions`.

7. **Evaluate Conditions:**
   - `evaluateConditions` evaluates all conditions (`all`, `any`, `none`) defined within the rule. It checks whether the conditions are met based on the current scope.
   - Example Conditions:
     ```yaml
     condition:
       match:
         all:
           - expr: "user.role === 'admin'"
           - expr: "user.department === resource.department"
     ```

8. **Determine the Result:**
   - Based on the evaluation, the function determines whether the action should be allowed or denied.
   - If the conditions are met and the rule's effect is "ALLOW," the function returns a response indicating that the action is allowed.
   - If the conditions are met and the rule's effect is "DENY," the function returns a response indicating that the action is denied.
   - If no rule explicitly allows the action, the function defaults to denying the action.

## 3. **Step-by-Step Breakdown of `evaluateConditions`:**

1. **Initialize Variables:**
   - `result` is initialized to `true`, meaning all conditions must be met unless one fails.
   - `details` is an array that will store the results of each evaluated condition.

2. **Evaluate 'all' Conditions:**
   - The function evaluates each condition in the `all` array. All conditions in this array must be true for the result to remain true.
   - Example:
     ```yaml
     - expr: "user.role === 'admin'"
     - expr: "user.department === resource.department"
     ```

3. **Evaluate 'any' Conditions:**
   - If there are `any` conditions, the function evaluates them. At least one condition must be true for the result to remain true.
   - Example:
     ```yaml
     - expr: "resource.visibility === 'public'"
     ```

4. **Evaluate 'none' Conditions:**
   - If there are `none` conditions, the function evaluates them. None of these conditions must be true for the result to remain true.
   - Example:
     ```yaml
     - expr: "user.role === 'guest'"
     ```

5. **Return the Result:**
   - The function returns the overall result of the condition evaluations along with detailed results for each condition.

## 4. **Step-by-Step Breakdown of `evaluateExpression`:**

1. **Evaluate the Expression:**
   - The function dynamically evaluates the expression string within the context of the provided scope.
   - Example Expression:
     ```typescript
     expr: "user.role === 'admin'"
     ```

2. **Handle Errors:**
   - If the expression is not a valid string or if there is an error during evaluation, the function returns `false`.

## Example Test Scenario:

- **Scenario:**
  - **User:** { role: "admin", department: "IT" }
  - **Resource:** { type: "document", department: "IT", visibility: "internal" }
  - **Context:** { currentTime: "2024-08-19T12:00:00Z" }
  - **Action:** "edit"

- **Policy:** 
  ```yaml
  name: "Admin Edit Policy"
  description: "Admins can edit documents within their department."
  resourcePolicy:
    resource: "*"
    version: "1.0"
    rules:
      - actions: ["edit"]
        effect: "EFFECT_ALLOW"
        condition:
          match:
            all:
              - expr: "user.role === 'admin'"
              - expr: "user.department === resource.department"
  auditInfo:
    createdBy: "system"
  version: "1.0"
  ```

- **Expected Outcome:**
  - The conditions in the policy are met (`user.role === 'admin'` and `user.department === resource.department`).
  - The action "edit" is allowed, and the function returns a response indicating that the action is allowed.

This detailed explanation covers the internal workings of the `evaluatePolicy` function and how it uses policies, conditions, and expressions to determine access control decisions in the Agsiri Policy Engine.

The `ContextBuilder` class is designed to build a comprehensive context for evaluating policies in the Agsiri policy engine. This context includes user data, resource data, facts, blacklists, and resolved variables. Let's walk through the code step by step, explaining the internal workings and using examples to illustrate the process.

## 1. **Overview of `ContextBuilder`:**
   - **Purpose:** The `ContextBuilder` constructs a detailed context that includes various attributes and data points required for policy evaluation.
   - **Key Components:**
     - **User Data:** Fetched from the database based on the user ID.
     - **Resource Data:** Fetched from the database based on the resource ID.
     - **Facts:** Additional metadata associated with the user and resource.
     - **Blacklist:** Information indicating whether a user-resource pair is blacklisted.
     - **Variables:** Resolved and merged from various sources, including globals.

## 2. **Step-by-Step Breakdown of `buildContext`:**

1. **Class Initialization:**
   - The `ContextBuilder` class is initialized with an instance of `VariableManager`, which is responsible for resolving and importing variables.
   - Example:
     ```typescript
     const contextBuilder = new ContextBuilder();
     ```

2. **Building the Context:**
   - The `buildContext` method is called with identifiers for the user and resource, along with any variables and global settings.
   - Example Call:
     ```typescript
     const context = await contextBuilder.buildContext(
       { userId: "user123", resourceId: "resource456" },
       { customVar: "customValue" },
       { globalVar: "globalValue" }
     );
     ```

3. **Fetching User Data:**
   - The method fetches the user data from the database using the provided `userId`.
   - If the user is found, the data is added to the `contextData` object. If not, an empty object is used.
   - Example:
     ```json
     {
       "_id": "user123",
       "name": "John Doe",
       "attr": { "role": "admin", "department": "IT" }
     }
     ```

4. **Fetching Resource Data:**
   - Similarly, the method fetches resource data using the provided `resourceId`.
   - If the resource is found, it is added to the `contextData`. If not, an empty object is used.
   - Example:
     ```json
     {
       "_id": "resource456",
       "type": "document",
       "attr": { "department": "IT", "visibility": "internal" }
     }
     ```

5. **Loading and Merging Facts:**
   - The method loads facts related to the user and resource. Facts are additional metadata that can be dynamically added to user or resource attributes.
   - These facts are merged into the user and resource attributes in the context.
   - Example:
     ```json
     {
       "id": "user123",
       "type": "User",
       "attr": { "clearanceLevel": "high" }
     }
     ```

   - After merging, the user attributes might look like:
     ```json
     {
       "role": "admin",
       "department": "IT",
       "clearanceLevel": "high"
     }
     ```

6. **Loading Blacklist Data:**
   - The method checks if the user-resource pair is blacklisted by querying the `Blacklist` model.
   - If found, the blacklist attributes are added to the context.
   - Example:
     ```json
     {
       "userId": "user123",
       "resourceId": "resource456",
       "attr": { "blacklisted": true }
     }
     ```

7. **Resolving and Merging Variables:**
   - The method resolves any local variables using the `VariableManager`.
   - It also imports globally exported variables and merges them with the provided globals.
   - Example Variables:
     ```json
     {
       "customVar": "customValue",
       "globalVar": "globalValue",
       "isAdmin": true
     }
     ```

8. **Final Context Construction:**
   - All the data (user, resource, facts, blacklist, variables, globals) is merged to form the final runtime context.
   - This context is returned in a structured format, ready to be used for policy evaluation.
   - Example Final Context:
     ```json
     {
       "request": {},
       "runtime": {
         "user": { "role": "admin", "department": "IT", "clearanceLevel": "high" },
         "resource": { "type": "document", "department": "IT", "visibility": "internal" },
         "blacklist": { "blacklisted": true },
         "customVar": "customValue",
         "globalVar": "globalValue",
         "isAdmin": true
       },
       "variables": { "customVar": "customValue", "globalVar": "globalValue", "isAdmin": true },
       "globals": { "globalVar": "globalValue" }
     }
     ```

## 3. **Step-by-Step Breakdown of the Code Execution:**

1. **Initialization:**
   - The `ContextBuilder` is instantiated, initializing the `VariableManager`.

2. **Context Building:**
   - When `buildContext` is called, the identifiers (user ID and resource ID) are used to fetch corresponding data from the database.

3. **Merging Facts and Blacklist:**
   - Facts associated with the user and resource are merged into their attributes.
   - Blacklist information, if any, is added to the context.

4. **Resolving Variables:**
   - Local and global variables are resolved and merged into the context, ensuring that all necessary data points are available for policy evaluation.

5. **Final Context Construction:**
   - The context is finalized by merging user data, resource data, facts, blacklist data, and variables. This comprehensive context is returned and can be used by the policy evaluation engine.

## Example Scenario:

- **Scenario:**
  - **User:** `user123` (role: "admin", department: "IT")
  - **Resource:** `resource456` (type: "document", department: "IT", visibility: "internal")
  - **Facts:**
    - User: clearanceLevel: "high"
  - **Blacklist:** Blacklisted
  - **Variables:** `{ "customVar": "customValue" }`
  - **Globals:** `{ "globalVar": "globalValue" }`

- **Expected Context:**
  - The final context includes the user’s role, department, and clearance level, the resource’s type, department, and visibility, the blacklist status, and the resolved variables.

This explanation covers the internal workings of the `ContextBuilder` class and its method `buildContext`. The code systematically builds a detailed context by fetching and merging user data, resource data, facts, blacklist information, and variables, all of which are crucial for accurately evaluating policies in the Agsiri Policy Engine.
