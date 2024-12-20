## Tutorial: Creating Role and Group Policies in the Agsiri Policy Framework

### Overview

In the Agsiri Policy Framework, `RolePolicy` and `GroupPolicy` are essential components that allow for fine-grained access control across various entities. This tutorial will guide you through creating these policies, explaining the mandatory and optional attributes, their valid formats, and best practices for defining effective policies.

### Prerequisites

Before you start, ensure that:
- You have access to the Agsiri Policy service.
- The JSON Schema for `RolePolicy` and `GroupPolicy` is correctly integrated into your application.
- You are familiar with the basic concepts of access control, such as roles, groups, and permissions.

### 1. Understanding RolePolicy and GroupPolicy

**RolePolicy** and **GroupPolicy** allow you to define policies at the role and group levels, respectively. These policies govern what actions members of a role or group can perform on specific resources.

#### Key Concepts:
- **Role**: A set of permissions assigned to users or other entities.
- **Group**: A collection of users or other entities that share common permissions.

### 2. Mandatory and Optional Attributes

#### 2.1 RolePolicy

A `RolePolicy` specifies permissions for a particular role. The schema for `RolePolicy` includes several mandatory and optional attributes.

##### Mandatory Attributes:

- **role**: The name or identifier of the role to which the policy applies. This must be a string and is required.
  
  **Example**:
  ```json
  "role": "Admin"
  ```

- **version**: The version of the policy. This must be a string following the format `major.minor.patch`, such as `"1.0.0"`.

  **Example**:
  ```json
  "version": "1.0.0"
  ```

- **rules**: An array of rules that define what actions can be performed on specific resources by members of this role. Each rule must contain at least one action and a resource identifier.

  **Example**:
  ```json
  "rules": [
    {
      "resource": "document123",
      "actions": [
        {
          "action": "read",
          "effect": "EFFECT_ALLOW"
        },
        {
          "action": "delete",
          "effect": "EFFECT_DENY"
        }
      ]
    }
  ]
  ```

##### Optional Attributes:

- **scope**: Defines the context or boundaries where the policy is applicable. This is useful for limiting the policy's effect to specific environments or conditions.
  
  **Example**:
  ```json
  "scope": "production"
  ```

- **variables**: These are dynamic values that can be referenced within the policy. They allow for greater flexibility in defining conditions and rules.

  **Example**:
  ```json
  "variables": {
    "import": ["env_var1", "env_var2"],
    "local": { "key": "value" }
  }
  ```

- **condition**: Defines the conditions under which the policy applies. You can use logical operators (`all`, `any`, `none`) or expressions.

  **Example**:
  ```json
  "condition": {
    "match": {
      "all": {
        "of": [
          { "expr": "R.attr.status == 'active'" },
          { "expr": "P.role == 'admin'" }
        ]
      }
    }
  }
  ```

#### 2.2 GroupPolicy

A `GroupPolicy` is similar to a `RolePolicy` but applies to a group of users rather than a role. The attributes and structure are largely the same.

##### Mandatory Attributes:

- **group**: The name or identifier of the group to which the policy applies. This must be a string and is required.

  **Example**:
  ```json
  "group": "Engineering"
  ```

- **version**: The version of the policy, similar to `RolePolicy`.

  **Example**:
  ```json
  "version": "1.0.0"
  ```

- **rules**: An array of rules that define the permissions for the group.

  **Example**:
  ```json
  "rules": [
    {
      "resource": "server123",
      "actions": [
        {
          "action": "restart",
          "effect": "EFFECT_ALLOW"
        }
      ]
    }
  ]
  ```

##### Optional Attributes:

- **scope**: Defines the context or boundaries where the policy is applicable.

  **Example**:
  ```json
  "scope": "development"
  ```

- **variables**: Variables that can be used within the policy to make it more flexible.

  **Example**:
  ```json
  "variables": {
    "import": ["var1"],
    "local": { "region": "us-east-1" }
  }
  ```

- **condition**: Defines the conditions under which the policy applies.

  **Example**:
  ```json
  "condition": {
    "match": {
      "none": {
        "of": [
          { "expr": "R.attr.status == 'inactive'" }
        ]
      }
    }
  }
  ```

### 3. Creating a RolePolicy

#### Step-by-Step Guide:

1. **Define the RolePolicy JSON Object**: Create a JSON object that includes all mandatory and optional attributes.

   **Example**:
   ```json
   {
     "apiVersion": "api.agsiri.dev/v1",
     "rolePolicy": {
       "role": "Admin",
       "version": "1.0.0",
       "rules": [
         {
           "resource": "document123",
           "actions": [
             {
               "action": "read",
               "effect": "EFFECT_ALLOW"
             },
             {
               "action": "delete",
               "effect": "EFFECT_DENY"
             }
           ]
         }
       ],
       "scope": "production",
       "variables": {
         "import": ["env_var1"],
         "local": { "key": "value" }
       }
     },
     "auditInfo": {
       "createdBy": "system",
       "createdAt": "2024-08-19T13:00:00Z"
     }
   }
   ```

2. **Send the RolePolicy to the Policy Service**: Use a tool like `curl` to send the JSON object to the policy service.

   **Curl Command**:
   ```bash
   curl -X POST http://localhost:4000/v1/policies \
   -H "Content-Type: application/json" \
   -d '{
     "apiVersion": "api.agsiri.dev/v1",
     "rolePolicy": {
       "role": "Admin",
       "version": "1.0.0",
       "rules": [
         {
           "resource": "document123",
           "actions": [
             {
               "action": "read",
               "effect": "EFFECT_ALLOW"
             },
             {
               "action": "delete",
               "effect": "EFFECT_DENY"
             }
           ]
         }
       ],
       "scope": "production",
       "variables": {
         "import": ["env_var1"],
         "local": { "key": "value" }
       }
     },
     "auditInfo": {
       "createdBy": "system",
       "createdAt": "2024-08-19T13:00:00Z"
     }
   }'
   ```

3. **Verify the Policy Creation**: After sending the request, check the response to ensure that the policy was created successfully.

### 4. Creating a GroupPolicy

#### Step-by-Step Guide:

1. **Define the GroupPolicy JSON Object**: Similar to `RolePolicy`, create a JSON object for the group policy.

   **Example**:
   ```json
   {
     "apiVersion": "api.agsiri.dev/v1",
     "groupPolicy": {
       "group": "Engineering",
       "version": "1.0.0",
       "rules": [
         {
           "resource": "server123",
           "actions": [
             {
               "action": "restart",
               "effect": "EFFECT_ALLOW"
             }
           ]
         }
       ],
       "scope": "development",
       "variables": {
         "import": ["var1"],
         "local": { "region": "us-east-1" }
       }
     },
     "auditInfo": {
       "createdBy": "system",
       "createdAt": "2024-08-19T13:00:00Z"
     }
   }
   ```

2. **Send the GroupPolicy to the Policy Service**: Use `curl` or another HTTP client to send the policy to the service.

   **Curl Command**:
   ```bash
   curl -X POST http://localhost:4000/v1/policies \
   -H "Content-Type: application/json" \
   -d '{
     "apiVersion": "api.agsiri.dev/v1",
     "groupPolicy": {
       "group": "Engineering",
       "version": "1.0.0",
       "rules": [
         {
           "resource": "server123",
           "actions": [
             {
               "action": "restart",
               "effect": "EFFECT_ALLOW"
             }
           ]
         }
       ],
       "scope": "development",
       "variables": {
         "import": ["var1"],
         "local": { "region": "us-east-1" }
       }
     },
     "auditInfo": {
       "createdBy": "system",
       "createdAt":

 "2024-08-19T13:00:00Z"
     }
   }'
   ```

3. **Verify the Policy Creation**: Check the response from the policy service to confirm successful creation.

### 5. Best Practices

- **Use Meaningful Names**: Ensure that `role`, `group`, and `resource` names are descriptive and easily identifiable.
- **Versioning**: Always specify a `version` to keep track of changes and maintain compatibility.
- **Scope Limitation**: Use the `scope` attribute to limit the policy's applicability, reducing the risk of unauthorized access.
- **Condition Usage**: Leverage the `condition` attribute to create complex, context-aware policies that adapt to different environments.

### Conclusion

By following this tutorial, you should be able to create and manage `RolePolicy` and `GroupPolicy` within the Agsiri Policy Framework. Understanding the mandatory and optional attributes, along with their valid formats, is crucial for ensuring that your policies are both effective and compliant with the system's requirements.
