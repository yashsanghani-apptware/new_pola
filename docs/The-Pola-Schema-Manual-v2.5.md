
# Pola Schema v2.5 Guide

The **Pola Schema** provides a comprehensive structure for defining various types of policies in the Pola Generative Policy Service. It supports dynamic and flexible access control, role management, event-based automation, and more. Each policy type has its specific requirements and building blocks, which are described in detail in this guide.

## Overview of the Pola Schema

The Pola Schema includes the following policy types:

1. **Principal Policies**: Define permissions for specific users, groups, or roles.
2. **Resource Policies**: Attach access control rules directly to specific resources.
3. **Group Policies**: Manage access control for a specific group of users.
4. **Event Policies**: Automate actions in response to specific events.
5. **Derived Roles**: Dynamically generate roles based on existing roles and specific conditions.
6. **Export Variables**: Define reusable variables across multiple policies.
7. **Service Control Policies (SCPs)**: Define maximum permissions for entities within an organization or environment.
8. **Role Policies**: Define permissions associated with specific roles.

## Key Building Blocks of the Pola Schema

Before we dive into each policy type, it's important to understand the foundational elements used to construct them.

1. **Conditions** (`pola.policy.v2.5.Condition`): Define criteria under which specific actions are allowed or denied. Conditions can be simple expressions or more complex logical constructs.
   - **match**: Specifies a logical condition using operators like `all`, `any`, `none`, or `expr`.
   - **script**: A custom script used for evaluating complex conditions.

2. **Match** (`pola.policy.v2.5.Match`): Used to define how multiple conditions should be evaluated.
   - **all**: All conditions must be met.
   - **any**: At least one condition must be met.
   - **none**: None of the conditions should be met.
   - **expr**: A simple boolean expression that must be true.

3. **Actions** (`pola.policy.v2.5.Action`): Specify the actions (`read`, `write`, `delete`, etc.) that are permitted or denied.
   - **action**: The specific action to be performed.
   - **effect**: The effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`).
   - **condition**: Optional condition under which the action is allowed or denied.
   - **notify**: Optional configuration for notifications when actions are triggered.
   - **output**: Optional configuration for logging or output expressions.

4. **Effects**: Define whether an action is allowed (`EFFECT_ALLOW`) or denied (`EFFECT_DENY`).

5. **Notify** (`pola.policy.v2.5.Notify`): Configures notifications that are triggered when certain actions occur.
   - **service**: Type of notification service (e.g., `webservice`, `pubsub`, `queue`).
   - **serviceConfig**: Configuration details for the chosen notification service.

6. **Output** (`pola.policy.v2.5.Output`): Defines expressions or conditions for logging and reporting the outcomes of actions.

7. **Metadata** (`pola.policy.v2.5.Metadata`): Provides additional information about the policy for tracking and auditing.
   - **annotations**: Key-value pairs for custom metadata.
   - **hash**: Unique identifier or checksum for the policy.
   - **sourceAttributes**: Attributes from the source system that are relevant to the policy.
   - **sourceFile**: File name from which the policy is loaded.
   - **storeIdentifier**: Unique identifier for storing the policy.

8. **Schemas** (`pola.policy.v2.5.Schemas`): Define the structure for validating principals and resources.
   - **principalSchema**: Schema for validating principal attributes.
   - **resourceSchema**: Schema for validating resource attributes.

## Detailed Explanation of Each Policy Type with Examples

Let's go through each policy type, explaining its purpose, components, and providing examples compliant with the JSON schema.

### 1. Principal Policy

**Principal Policies** define permissions for specific principals (such as users, groups, or roles).

**Schema Fields:**
- **principal**: Identifier for the principal (e.g., user ID, group name).
- **version**: Version of the policy.
- **rules**: Array of rules defining:
  - **resource**: The resource on which the rule is applied.
  - **actions**: Array of action objects specifying:
    - **action**: The action to be performed (e.g., `read`, `write`).
    - **effect**: The effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`).
    - **condition** (optional): Criteria for the action's application.
    - **notify** (optional): Notification configuration for the action.
    - **output** (optional): Logging or output configuration.
- **scope**: Optional scope defining the boundary within which the policy is applied.
- **variables**: Optional variables used within the policy.
- **metadata**: Optional metadata for auditing.
- **schemas**: Optional schemas for validation.
- **auditInfo**: Metadata about the policy's creation and updates.

**Example: Conditional Access for a Specific User**

This policy allows a user to read and write to a resource only if they are a manager and the resource is active.

```json
{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "UserConditionalAccessPolicy",
  "principalPolicy": {
    "principal": "user123",
    "version": "1.0",
    "rules": [
      {
        "resource": "resource001",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.role === 'manager'" },
                    { "expr": "R.status === 'active'" }
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "createdBy": "adminUser"
    },
    "hash": "1234567890abcdef",
    "sourceFile": "policies/principalPolicy.json"
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T10:00:00Z"
  }
}
```

### 2. Resource Policy

**Resource Policies** attach access control rules directly to specific resources.

**Schema Fields:**
- **resource**: The identifier for the resource.
- **version**: Version of the policy.
- **rules**: Array of rules defining:
  - **actions**: Allowed actions on the resource.
  - **effect**: Whether actions are allowed or denied.
  - **condition** (optional): Criteria for the action's application.
  - **derivedRoles** (optional): Derived roles that can perform actions.
  - **notify** (optional): Notification configuration for the action.
  - **output** (optional): Logging or output configuration.
- **schemas**: Optional schemas for validating resources.
- **scope**: Optional scope for the policy.
- **variables**: Optional variables used within the policy.
- **metadata**: Metadata for policy tracking and auditing.
- **auditInfo**: Metadata about the policy's creation and updates.

**Example: Role-Based Access Control on a Resource**

This policy allows read access to a resource only if the user belongs to a specific role and the resource is marked as public.

```json
{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ResourceRoleBasedAccessPolicy",
  "resourcePolicy": {
    "resource": "resource002",
    "version": "1.1",
    "rules": [
      {
        "actions": ["read"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.role === 'member'" },
                { "expr": "R.visibility === 'public'" }
              ]
            }
          }
        }
      }
    ]
  },
  "metadata": {
    "annotations": {
      "createdBy": "resourceAdmin"
    },
    "hash": "abcdef1234567890",
    "sourceFile": "policies/resourcePolicy.json"
  },
  "auditInfo": {
    "createdBy": "resourceAdmin",
    "createdAt": "2024-08-28T11:00:00Z"
  }
}
```

### 3. Group Policy

**Group Policies** manage access control for a specific group of users.

**Schema Fields:**
- **group**: The identifier for the group.
- **version**: Version of the policy.
- **rules**: Array of rules defining:
  - **resource**: The resource on which the rule is applied.
  - **actions**: Array of actions allowed or denied.
  - **condition** (optional): Criteria for the action's application.
  - **notify** (optional): Notification configuration for the action.
  - **output** (optional): Logging or output configuration.
- **scope**: Optional scope for the policy.
- **variables**: Optional variables used within the policy.
- **metadata**: Metadata for policy tracking and auditing.
- **auditInfo**: Metadata about the policy's creation and updates.

**Example: Group

-Level Access Control for a Development Team**

This policy allows members of the development team to edit a resource only if the resource status is in development.

```json
{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "GroupAccessControlForDevTeam",
  "groupPolicy": {
    "group": "dev_team",
    "version": "1.0",
    "rules": [
      {
        "resource": "resource003",
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "R.status === 'in_development'" }
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "createdBy": "devAdmin"
    },
    "hash": "7890abcdef123456",
    "sourceFile": "policies/groupPolicy.json"
  },
  "auditInfo": {
    "createdBy": "devAdmin",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}
```
### 4. Event Policy

**Event Policies** automate actions in response to specific events occurring on resources. These policies are useful for implementing automated workflows, logging, notifications, or any other action triggered by an event.

**Schema Fields:**
- **name**: Name of the event policy.
- **description**: Description of what the policy does.
- **event**: The identifier for the event that triggers this policy.
- **resource**: The identifier of the resource associated with the event.
- **version**: Version of the policy.
- **rules**: Array of event rules defining:
  - **conditions**: Conditions under which the rule is activated.
  - **actions**: Actions to be performed when the conditions are met.
    - **action**: The specific action (e.g., `NOTIFY`, `LOG`, `ALERT`).
    - **effect**: The effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`).
    - **notify** (optional): Notification configuration for the action.
    - **output** (optional): Logging or output configuration.
- **scope**: Optional scope for the policy.
- **variables**: Optional variables used within the policy.
- **metadata**: Metadata for policy tracking and auditing.
- **auditInfo**: Metadata about the policy's creation and updates.

**Example: Notify Admin on Critical Resource Access**

This policy automatically notifies an admin via a web service when a critical resource is accessed.

```json
{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "NotifyAdminOnCriticalAccess",
  "description": "Notifies admin when a critical resource is accessed",
  "eventPolicy": {
    "event": "critical_access",
    "resource": "resource004",
    "version": "1.2",
    "rules": [
      {
        "conditions": {
          "match": {
            "any": {
              "of": [
                { "expr": "P.accessLevel === 'high'" },
                { "expr": "R.sensitivity === 'critical'" }
              ]
            }
          }
        },
        "actions": [
          {
            "action": "NOTIFY",
            "effect": "EFFECT_ALLOW",
            "notify": {
              "service": "webservice",
              "serviceConfig": {
                "url": "https://admin-notify.example.com/alert",
                "method": "POST"
              }
            }
          }
        ]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "createdBy": "securityAdmin"
    },
    "hash": "112233aabbcc",
    "sourceFile": "policies/eventPolicy.json"
  },
  "auditInfo": {
    "createdBy": "securityAdmin",
    "createdAt": "2024-08-28T13:00:00Z"
  }
}
```

### 5. Derived Roles

**Derived Roles** allow for dynamic role creation based on existing roles and specific conditions. This is useful for scenarios where role assignments need to be conditional or temporary.

**Schema Fields:**
- **name**: The name of the derived role.
- **definitions**: Array of role definitions specifying:
  - **name**: The name of the role.
  - **parentRoles**: Parent roles that this role derives from.
  - **condition** (optional): Conditions under which this derived role is applicable.
- **variables**: Optional variables used within the role definition.

**Example: Create a Temporary Admin Role Based on Conditions**

This derived role assigns a temporary admin role to a user if they are part of the support team and have received an escalation.

```json
{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "TemporaryAdminRole",
  "derivedRoles": {
    "name": "temporary_admin",
    "definitions": [
      {
        "name": "temp_admin",
        "parentRoles": ["support_agent"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.team === 'support'" },
                { "expr": "R.escalation === true" }
              ]
            }
          }
        }
      }
    ],
    "variables": {
      "import": ["support_team"]
    }
  },
  "metadata": {
    "annotations": {
      "createdBy": "roleManager"
    },
    "hash": "abcdef1234",
    "sourceFile": "policies/derivedRole.json"
  },
  "auditInfo": {
    "createdBy": "roleManager",
    "createdAt": "2024-08-28T14:00:00Z"
  }
}
```

### 6. Export Variables

**Export Variables** define reusable variables that can be referenced across multiple policies. This promotes consistency and reduces redundancy in policy definitions.

**Schema Fields:**
- **name**: The name of the export variable.
- **definitions**: Key-value pairs of variables to be used in multiple policies.

**Example: Define Reusable Variables for User Location**

This example defines reusable variables to handle user location-specific policies.

```json
{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "UserLocationVariables",
  "exportVariables": {
    "name": "location_variables",
    "definitions": {
      "allowedCountries": "US,CA,UK",
      "defaultRegion": "NorthAmerica"
    }
  },
  "metadata": {
    "annotations": {
      "createdBy": "policyAdmin"
    },
    "hash": "9876fedcba",
    "sourceFile": "policies/exportVariables.json"
  },
  "auditInfo": {
    "createdBy": "policyAdmin",
    "createdAt": "2024-08-28T15:00:00Z"
  }
}
```

### 7. Service Control Policy (SCP)

**Service Control Policies (SCPs)** define maximum permissions for entities (users, groups, roles, resources) within an organization or environment.

**Schema Fields:**
- **maxPermissions**: Array of maximum permissions allowed.
- **boundEntities**: Specifies the entities (users, groups, roles, resources) to which the SCP applies.
- **version**: Version of the policy.

**Example: Limit Permissions for Developers to Read-Only on Production**

This policy limits developers to read-only access on all production resources.

```json
{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DeveloperReadOnlyAccess",
  "serviceControlPolicy": {
    "maxPermissions": ["read"],
    "boundEntities": {
      "roles": ["developer"],
      "resources": ["production"]
    },
    "version": "1.0"
  },
  "metadata": {
    "annotations": {
      "createdBy": "adminUser"
    },
    "hash": "aabbccddeeff",
    "sourceFile": "policies/serviceControlPolicy.json"
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T16:00:00Z"
  }
}
```

### 8. Role Policy

**Role Policies** define permissions associated with specific roles.

**Schema Fields:**
- **role**: The identifier of the role.
- **version**: Version of the policy.
- **rules**: Array of rules specifying:
  - **resource**: The resource on which the rule is applied.
  - **actions**: Array of actions allowed or denied.
  - **condition** (optional): Criteria for the action's application.
  - **notify** (optional): Notification configuration for the action.
  - **output** (optional): Logging or output configuration.
- **scope**: Optional scope for the policy.
- **variables**: Optional variables used within the policy.
- **metadata**: Metadata for policy tracking and auditing.
- **auditInfo**: Metadata about the policy's creation and updates.

**Example: Role Policy for Read/Write Access on Internal Resources**

This policy grants the "internal_user" role both read and write access to internal resources.

```json
{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "InternalUserAccessPolicy",
  "rolePolicy": {
    "role": "internal_user",
    "version": "1.0",
    "rules": [
      {
        "resource": "internal_resource_001",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "write",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.department === 'IT'" },
                    { "expr": "R.category === 'internal'" }
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "createdBy": "policyManager"
    },
    "hash": "001122334455",
    "sourceFile": "policies/rolePolicy.json"
  },
  "auditInfo": {
    "createdBy": "policyManager",
    "createdAt": "2024-08-28T17:00:00Z"
  }
}
```

## Detailed Explanation of Building Blocks in the Pola Schema

The Pola Schema is built on several key components that provide flexibility and functionality in defining policies. These building blocks include **Conditions**, **Match**, **Actions**, **Effects**, **Notify**, **Output**, **Metadata**, and **Schemas**. Understanding each component in detail is essential for crafting effective policies.

### 1. Conditions (`pola.policy.v2.5.Condition`)

**Conditions** specify the criteria under which certain actions are allowed or denied. They can be simple expressions or complex logical constructs that evaluate to `true` or `false`. Conditions are used in various policies to dynamically enforce access control rules.

**Components of Conditions:**
- **match**: Defines a logical condition using operators like `all`, `any`, `none`, or `expr`.
- **script**: A custom script for evaluating more complex conditions that cannot be expressed using simple logical operators.

**Example: Simple Condition for Access Based on Role**

This condition allows access only if the user has the "admin" role.

```json
{
  "match": {
    "expr": "P.role === 'admin'"
  }
}
```

**Example: Complex Condition Using `all` Operator**

This condition allows access only if the user has a "manager" role and the resource status is "active".

```json
{
  "match": {
    "all": {
      "of": [
        { "expr": "P.role === 'manager'" },
        { "expr": "R.status === 'active'" }
      ]
    }
  }
}
```

### 2. Match (`pola.policy.v2.5.Match`)

**Match** is a subcomponent used to define how multiple conditions should be evaluated. It supports various logical operators such as `all`, `any`, `none`, and `expr`.

**Components of Match:**
- **all**: All specified conditions must be met.
- **any**: At least one of the specified conditions must be met.
- **none**: None of the specified conditions should be met.
- **expr**: A simple boolean expression that must be true.

**Example: Match Using `any` Operator**

This match condition allows access if either the user is an "admin" or the resource is public.

```json
{
  "match": {
    "any": {
      "of": [
        { "expr": "P.role === 'admin'" },
        { "expr": "R.visibility === 'public'" }
      ]
    }
  }
}
```

### 3. Actions (`pola.policy.v2.5.Action`)

**Actions** specify what operations (e.g., `read`, `write`, `delete`) are permitted or denied on a resource. Actions are the core of access control policies, determining what users or roles can do with a resource.

**Components of Actions:**
- **action**: The specific operation to be performed, such as `read`, `write`, or `delete`.
- **effect**: Defines whether the action is allowed (`EFFECT_ALLOW`) or denied (`EFFECT_DENY`).
- **condition** (optional): Specifies additional conditions under which the action is allowed or denied.
- **notify** (optional): Configuration for notifications when the action is triggered.
- **output** (optional): Configuration for logging or outputting the results of the action.

**Example: Action Allowing Read Access Based on Role**

This action allows reading of a resource only if the user has the "member" role.

```json
{
  "action": "read",
  "effect": "EFFECT_ALLOW",
  "condition": {
    "match": {
      "expr": "P.role === 'member'"
    }
  }
}
```

### 4. Effects

**Effects** determine the outcome of a policy decision for a given action. There are two possible effects:
- **EFFECT_ALLOW**: The action is permitted.
- **EFFECT_DENY**: The action is denied.

Effects are used in conjunction with conditions to create flexible, conditional access control policies.

**Example: Deny Access if Not a Manager**

This effect denies write access unless the user has a "manager" role.

```json
{
  "action": "write",
  "effect": "EFFECT_DENY",
  "condition": {
    "match": {
      "expr": "P.role !== 'manager'"
    }
  }
}
```

### 5. Notify (`pola.policy.v2.5.Notify`)

**Notify** defines the configuration for sending notifications when certain actions occur. Notifications can be triggered through various services, such as web services, message queues, or pub/sub systems.

**Components of Notify:**
- **service**: Type of notification service (e.g., `webservice`, `pubsub`, `queue`).
- **serviceConfig**: Configuration details for the notification service:
  - **url**: URL of the web service endpoint.
  - **method**: HTTP method (`POST` or `PUT`) for web service notifications.
  - **headers**: Additional headers for HTTP requests.
  - **topic**: Topic for pub/sub notifications.
  - **queueName**: Queue name for message queue notifications.
  - **messageGroupId**: Message group ID for FIFO queues.
- **payloadSchema**: Schema for the payload being sent.
- **when**: Conditions specifying when the notification should be triggered.

**Example: Notify via Web Service on Resource Access**

This notify configuration sends a POST request to an external service when a critical resource is accessed.

```json
{
  "service": "webservice",
  "serviceConfig": {
    "url": "https://notify.example.com/resource-alert",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer xyz123"
    }
  },
  "when": {
    "conditionMet": "true"
  }
}
```

### 6. Output (`pola.policy.v2.5.Output`)

**Output** specifies the configuration for logging or reporting the results of actions. It can be used to define expressions or conditions under which logging occurs.

**Components of Output:**
- **expr**: Expression that defines the output.
- **when**: Specifies when the output should be generated, such as when a condition is not met or a rule is activated.

**Example: Log When Condition Not Met**

This output configuration logs a message when a certain condition is not met.

```json
{
  "expr": "Log: Access denied for user",
  "when": {
    "conditionNotMet": "true"
  }
}
```

### 7. Metadata (`pola.policy.v2.5.Metadata`)

**Metadata** provides additional information about a policy for tracking, auditing, and identification purposes.

**Components of Metadata:**
- **annotations**: Key-value pairs for custom metadata.
- **hash**: Unique identifier or checksum for the policy.
- **sourceAttributes**: Attributes from the source system relevant to the policy.
- **sourceFile**: File name from which the policy is loaded.
- **storeIdentifier**: Unique identifier for storing the policy.

**Example: Metadata for Auditing**

This metadata tracks the creation of a policy by a specific administrator.

```json
{
  "annotations": {
    "createdBy": "adminUser"
  },
  "hash": "1234567890abcdef",
  "sourceFile": "policies/accessPolicy.json"
}
```

### 8. Schemas (`pola.policy.v2.5.Schemas`)

**Schemas** define the structure for validating principals and resources, ensuring that the attributes and data associated with them meet specific criteria.

**Components of Schemas:**
- **principalSchema**: Schema for validating principal attributes.
- **resourceSchema**: Schema for validating resource attributes.
- **ignoreWhen**: Conditions under which certain actions should be ignored during schema validation.

**Example: Schema for Principal Validation**

This schema ensures that a principal (e.g., user) has the required attributes and meets the defined criteria.

```json
{
  "principalSchema": {
    "ref": "userSchema",
    "ignoreWhen": {
      "actions": ["read"]
    }
  }
}
```

## Conclusion

The Pola Schema provides a powerful, flexible framework for defining various types of policies for dynamic access control, role management, and event-based automation. Each policy type has a specific use case and is built using common components such as conditions, actions
