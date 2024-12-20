# Pola Membership Service Design Notes

## Membership Service Alogirthms and Detailed Design

### **Membership Service Design Specification**

#### **Overview**

The **Membership Service** is responsible for managing user memberships, roles, groups, and policies within an organization. It serves as a central point for aggregating policies, initializing contexts, and computing permitted actions based on user attributes, group memberships, and associated roles. This document provides a detailed design specification, including the core algorithms for policy aggregation, context initialization, and permitted action computation.

#### **Objectives**

1. **Policy Aggregation**: Collect all policies associated with a user, including those directly assigned to the user, their groups, and roles.
2. **Context Initialization**: Set up a contextual environment for a user that includes relevant groups, roles, and policies, enabling dynamic permission evaluation.
3. **Compute Permitted Actions**: Determine the actions a user is allowed to perform based on aggregated policies and current context.

---

### **Detailed Components and Algorithms**

#### **1. Policy Aggregation**

Policy aggregation involves collecting all relevant policies that apply to a user. This includes:
- Direct policies assigned to the user.
- Policies inherited through group memberships.
- Policies associated with roles assigned to the user.

**Algorithm for Policy Aggregation:**

1. **Initialize an empty list `aggregatedPolicies`.**
2. **Retrieve direct user policies:**
   - Fetch policies directly linked to the user.
   - Append these policies to `aggregatedPolicies`.
3. **Aggregate group policies:**
   - Retrieve all groups to which the user belongs.
   - For each group, fetch the policies linked to that group.
   - Append these policies to `aggregatedPolicies`.
4. **Aggregate role policies:**
   - Retrieve all roles assigned to the user.
   - For each role, fetch the policies linked to that role.
   - Append these policies to `aggregatedPolicies`.
5. **Return `aggregatedPolicies`** containing all applicable policies.

**Pseudocode:**
```python
def aggregatePolicies(user):
    aggregatedPolicies = []

    # Step 1: Retrieve direct user policies
    userPolicies = getUserPolicies(user)
    aggregatedPolicies.extend(userPolicies)

    # Step 2: Retrieve and aggregate group policies
    groups = getUserGroups(user)
    for group in groups:
        groupPolicies = getGroupPolicies(group)
        aggregatedPolicies.extend(groupPolicies)

    # Step 3: Retrieve and aggregate role policies
    roles = getUserRoles(user)
    for role in roles:
        rolePolicies = getRolePolicies(role)
        aggregatedPolicies.extend(rolePolicies)

    return aggregatedPolicies
```

#### **2. Context Initialization**

Context initialization sets up the user’s environment by loading all relevant attributes (user, groups, roles, policies) to enable efficient permission checks.

**Algorithm for Context Initialization:**

1. **Initialize Context Object:**
   - Create a context object that will store user attributes, group memberships, roles, and policies.
2. **Load User Attributes:**
   - Fetch user details (e.g., name, email, attributes) and add to the context object.
3. **Load Group Memberships:**
   - Fetch all groups the user belongs to and add them to the context object.
4. **Load Roles:**
   - Fetch all roles assigned to the user and add them to the context object.
5. **Aggregate Policies:**
   - Call the `aggregatePolicies` function to fetch all applicable policies for the user.
   - Add the aggregated policies to the context object.
6. **Store Context Object:**
   - Store the context object in a cache or session for efficient future access.

**Pseudocode:**
```python
def initializeContext(user):
    context = {}

    # Step 1: Load user attributes
    context['user'] = getUserAttributes(user)

    # Step 2: Load group memberships
    context['groups'] = getUserGroups(user)

    # Step 3: Load roles
    context['roles'] = getUserRoles(user)

    # Step 4: Aggregate and load policies
    context['policies'] = aggregatePolicies(user)

    # Step 5: Store context in cache/session
    storeContextInCache(user, context)

    return context
```

#### **3. Computing Permitted Actions**

Computing permitted actions involves evaluating the aggregated policies in the user's context to determine which actions the user is allowed to perform.

**Algorithm for Computing Permitted Actions:**

1. **Initialize an empty set `permittedActions`.**
2. **Retrieve the User Context:**
   - Load the user's context from the cache or session.
   - Extract the aggregated policies from the context.
3. **Iterate Through Aggregated Policies:**
   - For each policy in the aggregated list:
     - If the policy `effect` is `EFFECT_ALLOW`:
       - Add the corresponding actions to `permittedActions`.
     - If the policy `effect` is `EFFECT_DENY`:
       - Remove the corresponding actions from `permittedActions` if they exist.
4. **Return the Final Set of `permittedActions`.**

**Pseudocode:**
```python
def computePermittedActions(user):
    permittedActions = set()

    # Step 1: Retrieve user context
    context = loadContextFromCache(user)
    policies = context['policies']

    # Step 2: Evaluate policies to determine permitted actions
    for policy in policies:
        for rule in policy['rules']:
            if rule['effect'] == 'EFFECT_ALLOW':
                permittedActions.update(rule['actions'])
            elif rule['effect'] == 'EFFECT_DENY':
                permittedActions.difference_update(rule['actions'])

    return permittedActions
```

#### **4. Example Usage Scenarios**

##### **Scenario 1: User Login and Context Setup**

1. **User Logs In:**
   - Trigger `initializeContext` to set up the user environment.
2. **Fetch Context Information:**
   - Retrieve groups, roles, and policies associated with the user.
3. **Compute Permitted Actions:**
   - Call `computePermittedActions` to determine the user's allowed operations based on current policies.

##### **Scenario 2: Policy Update and Re-evaluation**

1. **Policy Change Event:**
   - A policy linked to a user, group, or role is updated.
2. **Invalidate Cached Context:**
   - Invalidate the cached context for affected users.
3. **Reinitialize Context:**
   - Trigger `initializeContext` for the affected users to refresh their environment.
4. **Recompute Permitted Actions:**
   - Call `computePermittedActions` to update the list of actions available to the user.

#### **5. Future Enhancements**

1. **Dynamic Policy Evaluation:**
   - Introduce support for real-time policy evaluation based on dynamic conditions (e.g., time-based access, location-based rules).
2. **Policy Caching Strategies:**
   - Implement more sophisticated caching strategies to optimize performance, including cache invalidation techniques and lazy loading of context data.
3. **Audit and Logging:**
   - Enhance logging mechanisms to track policy evaluations, permitted action computations, and context initialization steps for audit and troubleshooting purposes.
4. **User-Specific Overrides:**
   - Add support for user-specific policy overrides that temporarily allow or deny actions based on ad-hoc requirements.
5. **Role Hierarchies:**
   - Implement role hierarchies to support more granular permission controls and inheritance mechanisms.

#### **6. Performance Considerations**

1. **Minimize Database Queries:**
   - Use caching to reduce the number of database queries required for policy and context retrieval.
2. **Optimize Policy Aggregation:**
   - Employ indexing and efficient data structures to quickly access and aggregate policies.
3. **Asynchronous Operations:**
   - Utilize asynchronous operations where possible to minimize the impact of I/O-bound tasks such as database fetches and network calls.

---


## MemberService Design Tenets
Building a `MemberService` class that combines the various models and services you've already implemented involves a few key steps. Let's break it down:

### **Key Objectives for MemberService:**

1. **Context Initialization:**
   - When the `MemberService` is instantiated, it should take either a username, email, or object ID as input.
   - Using this identifier, it will fetch the user data and populate a Context object. This context will include the user, related resources, environment variables, actions, policies, and any associated variables.

2. **Policy Aggregation and Conflict Resolution:**
   - Retrieve both direct and indirect policies (those attached to the user, their groups, and roles).
   - Aggregate these policies, ensuring that conflicts are resolved according to a predefined hierarchy or rules.
   - The result should be an aggregated list of policies that is accessible from the service.

3. **Accessing User Data and Permissions:**
   - Provide methods to fetch the user's permitted actions, policies, groups, roles, and resources they can interact with.

### **Step-by-Step Design:**

1. **Instantiation & Context Building:**
   - **Input**: `username`, `email`, or `user ID`.
   - **Operations**:
     - Use `UserService` to fetch the user object.
     - Fetch all groups (`GroupService`) and roles (`RoleService`) the user is associated with.
     - Use `ResourceService` to identify resources the user has access to, based on direct and indirect (group/role) memberships.
     - Combine this data to create a `Context` object that includes:
       - **User**: The user object fetched from the `UserService`.
       - **Groups**: The list of groups the user belongs to.
       - **Roles**: The list of roles assigned to the user.
       - **Resources**: Resources the user has permissions for.
       - **Actions**: Permitted actions for each resource.
       - **Policies**: Direct and inherited policies.
       - **Variables**: Any variables associated with the user or derived from policies.

2. **Policy Aggregation:**
   - **Operations**:
     - Use the `PolicyService` to retrieve policies directly associated with the user.
     - Retrieve policies associated with the user's groups and roles.
     - Aggregate these policies, resolving any conflicts:
       - **Explicit Deny**: Always takes precedence over any allow.
       - **Implicit Deny**: If no allow policy exists, the action is denied by default.
       - **Role vs. Group vs. User**: Define which level of policy takes precedence if they conflict (typically, user > role > group).
     - Store the aggregated policies within the `Context` object.

3. **Providing Methods:**
   - **`getPermittedActions()`**:
     - Return a list of actions the user is allowed to perform, based on the aggregated policies.
   - **`getPolicies()`**:
     - Return the list of aggregated policies.
   - **`getGroups()`**:
     - Return the list of groups the user is part of.
   - **`getRoles()`**:
     - Return the list of roles assigned to the user.
   - **`getResources()`**:
     - Return the list of resources the user has access to, based on their roles, groups, and direct permissions.

### **Considerations:**

- **Caching**: Depending on the frequency of operations, caching user context might be useful to avoid repeatedly fetching and aggregating data.
- **Conflict Resolution**: The rules for resolving conflicts should be well-defined and consistent across the system.
- **Performance**: Ensure that operations, especially those involving multiple database queries, are optimized.

### **Potential Implementation Outline:**

```typescript
class MemberService {
    private context: any; // Define a more specific type for context

    constructor(identifier: string) {
        this.context = this.initializeContext(identifier);
    }

    private async initializeContext(identifier: string): Promise<any> {
        // Fetch user, groups, roles, resources, and policies, and populate context
    }

    private async aggregatePolicies(): Promise<void> {
        // Retrieve and aggregate policies, resolving conflicts
    }

    public async getPermittedActions(): Promise<string[]> {
        // Extract actions from aggregated policies
    }

    public async getPolicies(): Promise<Policy[]> {
        // Return aggregated policies
    }

    public async getGroups(): Promise<Group[]> {
        // Return the user's groups
    }

    public async getRoles(): Promise<Role[]> {
        // Return the user's roles
    }

    public async getResources(): Promise<Resource[]> {
        // Return the resources the user has access to
    }
}
```

### **Next Steps:**
- Finalize the context structure, deciding on the exact data types and sources.
- Define the conflict resolution logic in detail.
- Consider the performance implications of retrieving and aggregating data.

## Context Interface
To define the `Context` interface that can be used across other services, we'll structure it based on the attributes you've mentioned:

### **Context Interface Definition**

```typescript
import { IUser } from '../models/user';
import { Policy } from '../models/policy';
import { IGroup } from '../models/group';
import { IRole } from '../models/role';

export interface Context {
  user: IUser;                          // The user object containing detailed user information
  groups: string[];                      // Array of group IDs or names the user is part of
  roles: string[];                       // Array of role IDs or names assigned to the user
  policies: Policy[];                    // Array of policies applicable to the user
  environment: Record<string, any>;      // Key-value pairs representing environmental variables
  variables: Record<string, any>;        // Key-value pairs representing custom variables associated with the user or policies
}
```

### **Explanation of the Fields:**

- **`user: IUser`**: This field holds the user object, which includes all the information about the user as defined in the `IUser` interface.
- **`groups: string[]`**: An array of strings representing the IDs or names of groups the user belongs to. This helps in managing group-level policies and permissions.
- **`roles: string[]`**: An array of strings representing the IDs or names of roles assigned to the user. Roles typically aggregate permissions and policies that apply to users in specific functions.
- **`policies: Policy[]`**: An array of policy objects. These include both direct policies assigned to the user and inherited policies from groups or roles. The `Policy` type comes from the `policy.ts` model.
- **`environment: Record<string, any>`**: A flexible structure to hold various environmental variables, such as time of access, location, or other contextual information that might affect policy evaluation.
- **`variables: Record<string, any>`**: Similar to the environment, this holds custom variables that may be used in policy evaluations or actions.

### **Usage Example:**

This `Context` interface will be used when constructing or managing the `Context` object within your `MemberService` or any other service that requires detailed user-related data.

### **Further Steps:**

- Implement this interface in the `MemberService` and ensure that when the service is instantiated, the `Context` object is correctly populated based on the user, their groups, roles, and policies.
- You can also extend this interface with more fields as needed, depending on the specific requirements of your policy evaluation and user management processes.

## Anatomy of MemberService
### **1. Initialization and Context Building**

**Purpose:**
When the `MemberService` is instantiated, it takes an identifier (username, email, or object ID) and uses it to fetch the user's data, their associated groups, roles, policies, and other relevant data to build the `Context` object.

**Implementation:**

```typescript
import { UserService } from './UserService';
import { GroupService } from './GroupService';
import { RoleService } from './RoleService';
import { ResourceService } from './ResourceService';
import { PolicyService } from './PolicyService';
import { Context } from '../models/context'; // Assuming we saved the Context interface in this path
import { IUser } from '../models/user';

export class MemberService {
  private context: Context;

  constructor(private identifier: string) {
    this.context = {} as Context;
    this.initializeContext(identifier);
  }

  private async initializeContext(identifier: string): Promise<void> {
    const userService = new UserService();
    const groupService = new GroupService();
    const roleService = new RoleService();
    const policyService = new PolicyService();

    // Fetch user data
    const user = await this.getUserByIdentifier(userService, identifier);
    this.context.user = user;

    // Fetch groups and roles associated with the user
    const groups = await groupService.getGroupsForUser(user._id);
    const roles = await roleService.getRolesForUser(user._id);

    this.context.groups = groups.map(group => group._id.toString());
    this.context.roles = roles.map(role => role._id.toString());

    // Fetch policies associated with the user
    const policies = await this.aggregatePolicies(user._id);
    this.context.policies = policies;

    // Initialize other parts of the context (environment, variables, etc.)
    this.context.environment = {}; // Populate with relevant environment data
    this.context.variables = {}; // Populate with any necessary variables

    // Optionally log the context for debugging
    console.log('Context Initialized:', JSON.stringify(this.context, null, 2));
  }

  private async getUserByIdentifier(userService: UserService, identifier: string): Promise<IUser> {
    let user: IUser | null = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await userService.findUserById(new mongoose.Types.ObjectId(identifier));
    } else if (identifier.includes('@')) {
      user = await userService.getUserByEmail(identifier);
    } else {
      user = await userService.getUserByName(identifier);
    }

    if (!user) {
      throw new Error(`User not found with identifier: ${identifier}`);
    }

    return user;
  }
}
```

### **2. Aggregating and Resolving Policies**

**Purpose:**
Retrieve both direct and indirect policies (through groups and roles), resolve any conflicts, and store the aggregated policies in the `Context`.

**Implementation:**

```typescript
private async aggregatePolicies(userId: string): Promise<Policy[]> {
  const policyService = new PolicyService();
  
  // Fetch all policies related to the user directly
  const userPolicies = await policyService.getPoliciesForUser(userId);

  // Fetch policies through groups and roles
  const groupPolicies = await policyService.getPoliciesForGroups(this.context.groups);
  const rolePolicies = await policyService.getPoliciesForRoles(this.context.roles);

  // Combine all policies
  const allPolicies = [...userPolicies, ...groupPolicies, ...rolePolicies];

  // Resolve conflicts (e.g., Explicit Deny > Allow)
  return this.resolvePolicyConflicts(allPolicies);
}

private resolvePolicyConflicts(policies: Policy[]): Policy[] {
  // Implement conflict resolution logic here
  // For example, give precedence to explicit denies, and merge overlapping allows.
  const resolvedPolicies: Policy[] = [];

  // Example conflict resolution logic
  policies.forEach(policy => {
    // Check if policy already exists in resolvedPolicies and resolve conflicts
    resolvedPolicies.push(policy); // Simplified, should handle conflicts
  });

  return resolvedPolicies;
}
```

### **3. Providing Utility Methods**

**Purpose:**
Provide methods to easily access the user's permitted actions, policies, groups, roles, and resources.

**Implementation:**

```typescript
public getPermittedActions(): string[] {
  const permittedActions: string[] = [];

  this.context.policies.forEach(policy => {
    policy.rules.forEach(rule => {
      if (rule.effect === 'EFFECT_ALLOW') {
        permittedActions.push(...rule.actions);
      }
    });
  });

  return permittedActions;
}

public getPolicies(): Policy[] {
  return this.context.policies;
}

public getGroups(): string[] {
  return this.context.groups;
}

public getRoles(): string[] {
  return this.context.roles;
}

public async getResources(): Promise<IResource[]> {
  const resourceService = new ResourceService();
  return await resourceService.getResourcesByPolicies(this.context.policies);
}
```

### **Summary of the Approach:**

1. **Context Initialization**: When the `MemberService` is instantiated, the constructor triggers the `initializeContext` method, which populates the `Context` object by fetching user details, groups, roles, and policies.

2. **Policy Aggregation**: This method fetches policies directly associated with the user and those inherited from groups and roles. It resolves conflicts to create a coherent policy set.

3. **Utility Methods**: These methods provide access to the user’s permitted actions, policies, groups, roles, and resources, offering an API for other services to interact with.

### **Next Steps:**

1. **Define `getPoliciesForUser`, `getPoliciesForGroups`, and `getPoliciesForRoles`** in `PolicyService` if not already defined.
2. **Implement `resolvePolicyConflicts`** logic with a clear conflict resolution strategy.
3. **Add more utility methods** as needed, based on the context's requirements.
4. **Test the `MemberService` class** to ensure it behaves as expected.

## MemberService Usage 

### **Usage Example**

```typescript
import { MemberService } from './services/MemberService';

async function exampleUsage() {
  try {
    // Instantiate the MemberService with the user's email
    const memberService = new MemberService('john.doe@example.com');

    // Wait for the context to be fully initialized
    await memberService.initializeContext();

    // Get the list of permitted actions for the user
    const permittedActions = memberService.getPermittedActions();
    console.log('Permitted Actions:', permittedActions);

    // Get the policies associated with the user
    const policies = memberService.getPolicies();
    console.log('Policies:', policies);

    // Get the groups the user belongs to
    const groups = memberService.getGroups();
    console.log('Groups:', groups);

    // Get the roles assigned to the user
    const roles = memberService.getRoles();
    console.log('Roles:', roles);

    // Get the resources that the user has access to
    const resources = await memberService.getResources();
    console.log('Resources:', resources);

    // Example: Check if a specific action is permitted on a resource
    const isReadAllowed = permittedActions.includes('read');
    console.log(`Is 'read' action allowed? ${isReadAllowed}`);

    // You can also use these methods in a more complex decision-making process
    if (isReadAllowed) {
      console.log('User is allowed to read resources.');
    } else {
      console.log('User is NOT allowed to read resources.');
    }

  } catch (error) {
    console.error('Error using MemberService:', error);
  }
}

// Run the example usage function
exampleUsage();
```

### **Explanation of the Usage Example**

1. **Instantiating the `MemberService`:** 
   - We instantiate the `MemberService` class with the identifier for the user. In this example, we're using the user's email, but you could use a username or object ID instead.

2. **Initializing the Context:**
   - We call `await memberService.initializeContext();` to ensure the context is fully initialized before performing any operations. This step fetches all necessary data (user, groups, roles, policies) and populates the context.

3. **Fetching Permitted Actions:**
   - We retrieve the list of permitted actions for the user using `getPermittedActions()`. This provides a list of actions the user is allowed to perform based on their aggregated policies.

4. **Retrieving Policies:**
   - The `getPolicies()` method returns all policies associated with the user. These could be direct or inherited through roles and groups.

5. **Retrieving Groups and Roles:**
   - We retrieve the groups and roles the user is a member of using `getGroups()` and `getRoles()`.

6. **Fetching Accessible Resources:**
   - We call `getResources()` to retrieve the resources that the user has access to based on their permissions.

7. **Decision-Making Based on Permissions:**
   - We check if a specific action (e.g., 'read') is allowed for the user by checking if it's included in the list of permitted actions.

8. **Handling Errors:**
   - Any errors that occur during these operations are caught and logged to the console.

### **Further Considerations**

- **Asynchronous Initialization:** The `initializeContext()` method is asynchronous because it involves fetching data from multiple services and the database.
  
- **Custom Logic:** Depending on the specific needs of your application, you could extend or customize the `MemberService` class to include more sophisticated logic, such as evaluating conditions or managing additional context data.

- **Real-world Scenarios:** In a real-world application, you would likely incorporate this service into larger workflows, such as enforcing permissions before allowing access to specific features or data.

This example demonstrates a basic but complete usage of the `MemberService` class, showing how to interact with a user's permissions and policies programmatically. Would you like to explore any part of this further?
