# **Pola Policy Definition User Guide**

This guide provides a comprehensive overview of how to define and assign policies for various resource types in Pola using the `ResourcePolicy` schema. It includes examples to illustrate the different ways you can create and apply policies for resources in your system.

## **Defining Resource Type and Resource Name in Policies**

To assign policies to specific resource types, such as `Service::Agsiri:DataRoom`, you use the `resource` field within the `ResourcePolicy` schema. The `resource` field allows you to specify both the type and name of the resource to which the policy applies.

### **Resource Type Naming Convention**

The `resource` field can use a structured naming convention that reflects both the service and resource type. For example, `Service::Agsiri:DataRoom` follows a hierarchical naming structure:

- **Service**: The top-level domain (e.g., `Service`).
- **Agsiri**: A specific service or namespace within that domain (e.g., `Agsiri`).
- **DataRoom**: The actual type or class of the resource within the service.

### **Assigning Policies to a Resource Type**

You can assign policies in two main ways:

1. **General Policies for All Resources of a Given Type**:
   - Use a wildcard or generic pattern in the `resource` field to create a policy that applies to any resource matching the specified type.
   - Example: `"Service::Agsiri:DataRoom/*"` applies to all `DataRoom` resources under the `Agsiri` service.

2. **Specific Policies for a Particular Resource Instance**:
   - Specify the full resource type and name explicitly to create a policy that applies only to a specific resource.
   - Example: `"Service::Agsiri:DataRoom/ProjectAlpha"` applies to the `ProjectAlpha` resource under the `DataRoom` type.

## **Examples of Assigning Policies to Resource Types**

### **Example 1: General Policy for All DataRooms**

This example defines a policy that applies to all resources of type `DataRoom` under the `Agsiri` service. The policy allows "read," "write," and "delete" actions for users with the roles `DataRoomAdmin` or `DataRoomUser`.

```json
{
  "apiVersion": "api.pola.dev/v2.6",
  "resourcePolicy": {
    "resource": "Service::Agsiri:DataRoom/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read", "write", "delete"],
        "effect": "EFFECT_ALLOW",
        "roles": ["DataRoomAdmin", "DataRoomUser"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {
                  "expr": "user.role === 'DataRoomAdmin' || user.role === 'DataRoomUser'"
                }
              ]
            }
          }
        },
        "notify": {
          "service": "webservice",
          "serviceConfig": {
            "url": "https://notification-service.example.com/notify",
            "method": "POST",
            "headers": {
              "Content-Type": "application/json"
            }
          },
          "when": {
            "ruleActivated": "notify on DataRoom access"
          }
        }
      }
    ],
    "scope": "global",
    "variables": {
      "import": ["globalVariables"],
      "local": {
        "resourceType": "DataRoom"
      }
    }
  }
}
```

- **`resource`**: `"Service::Agsiri:DataRoom/*"` indicates the policy applies to all resources of type `DataRoom` under the `Agsiri` service.
- **`rules`**:
  - Allows (`EFFECT_ALLOW`) "read," "write," and "delete" actions for users with roles `DataRoomAdmin` or `DataRoomUser`.
  - The condition checks if the user's role matches one of the allowed roles.
  - A notification is sent to a web service when the rule is activated.

### **Example 2: Policy for a Specific Resource Instance**

This example assigns a policy to a specific `DataRoom` resource named `ProjectAlpha`. The policy allows "read" and "write" actions only for users with the roles `ProjectManager` or `TeamMember`.

```json
{
  "apiVersion": "api.pola.dev/v2.6",
  "resourcePolicy": {
    "resource": "Service::Agsiri:DataRoom/ProjectAlpha",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read", "write"],
        "effect": "EFFECT_ALLOW",
        "roles": ["ProjectManager", "TeamMember"],
        "condition": {
          "match": {
            "any": {
              "of": [
                {
                  "expr": "user.role === 'ProjectManager'"
                },
                {
                  "expr": "user.role === 'TeamMember'"
                }
              ]
            }
          }
        },
        "notify": {
          "service": "pubsub",
          "serviceConfig": {
            "topic": "project-events",
            "messageGroupId": "ProjectAlphaNotifications"
          },
          "when": {
            "conditionMet": "log and notify on access to ProjectAlpha DataRoom"
          }
        }
      }
    ],
    "scope": "regional",
    "variables": {
      "local": {
        "projectID": "Alpha123"
      }
    }
  }
}
```

- **`resource`**: `"Service::Agsiri:DataRoom/ProjectAlpha"` specifies that the policy applies only to the `ProjectAlpha` resource under the `DataRoom` type.
- **`rules`**:
  - Allows (`EFFECT_ALLOW`) "read" and "write" actions for users with roles `ProjectManager` or `TeamMember`.
  - The condition checks if the user's role matches the allowed roles.
  - A notification is published to a specific topic when the rule is met.

### **Example 3: Assigning Policies by Resource Type Dynamically**

To assign policies dynamically based on the resource type, such as `Service::Agsiri:DataRoom`, you can use pattern matching or structured resource identifiers. This allows flexibility in applying policies to groups of resources or specific instances.

- **General Pattern**: Use `"Service::Agsiri:DataRoom/*"` to match all resources under the `DataRoom` type.
- **Specific Resource**: Use `"Service::Agsiri:DataRoom/ResourceName"` to match a specific resource named `ResourceName`.

## **Best Practices for Defining Resource Policies by Resource Type**

1. **Use Hierarchical Naming**: Follow a consistent naming convention such as `Service::Namespace:ResourceType/ResourceName` to clearly define policies at different levels.
2. **Leverage Wildcards**: Use `*` to create general policies that apply to all resources of a specific type.
3. **Define Specific Rules**: For sensitive or critical resources, define explicit policies that specify exact resource names to ensure precise access control.
4. **Combine Conditions and Actions**: Use the `match` object in the `Condition` to handle complex logical conditions and to apply specific rules based on roles, resource attributes, or contextual factors.
5. **Notify and Log**: Use the `Notify` object to send notifications or log events when rules are triggered, providing visibility and auditability for resource access.

## **Understanding Resource Policies in the Schema**

The `ResourcePolicy` is defined in the schema under `pola.v2.6.ResourcePolicy`. The purpose of a `ResourcePolicy` is to define policies that apply to specific resources within a system. This includes specifying which actions are allowed or denied, under what conditions, and for which resources.

### **Schema Definition for `ResourcePolicy`**

Here is a breakdown of the relevant parts of the `ResourcePolicy` definition:

- **`resource` (string):** The name of the resource to which the policy applies. Must be a non-empty string.
- **`version` (string):** Specifies the version of the policy.
- **`rules` (array of `ResourceRule` objects):** An array containing the rules associated with this resource policy. Each rule defines a set of actions, conditions, effects, and possibly derived roles.
- **`importDerivedRoles` (array of strings):** A list of derived roles that this policy imports, specified by their names.
- **`schemas` (`Schemas` object):** Defines schemas for the principal and resource.
- **`scope` (string):** Specifies the scope of the policy, with a pattern for hierarchical scoping.
- **`variables` (`Variables` object):** Specifies any variables relevant to this policy.

### **Schema Definition for `ResourceRule`**

Each `ResourceRule` specifies a set of actions that are allowed or denied, along with any conditions or roles that may further refine the rule:

- **`actions` (array of strings):** List of actions that the rule applies to.
- **`effect` (string):** Specifies whether the actions are allowed (`EFFECT_ALLOW`) or denied (`EFFECT_DENY`).
- **`condition` (`Condition` object):** An optional condition that must be met for the rule to apply.
- **`derivedRoles` (array of strings):** Specifies any derived roles relevant to this rule.
- **`roles` (array of strings):** Lists roles that this rule applies to.
- **`name` (string):** Optional name for the rule.
- **`output` (`Output` object):** Specifies any output actions that are triggered when the rule matches.
- **`notify` (`Notify` object):**

 Specifies notification actions to be triggered when the rule matches.

## **Defining Resource Policies by Resource Type and Resource Name**

To define resource policies effectively, create instances of `ResourcePolicy` for different resources based on their type (e.g., "Document", "User", "Server") and name (e.g., "FinancialReport2024", "AdminUser", "DatabaseServer01"). Each policy specifies rules relevant to the resource type and name.

### **Additional Examples of Resource Policies by Resource Type and Name**

#### **Example 4: Resource Policy for a Document Resource**

Define a policy for a document resource named "FinancialReport2024." The policy allows only users with specific roles to view or edit the document and logs all actions.

```json
{
  "apiVersion": "api.pola.dev/v2.6",
  "resourcePolicy": {
    "resource": "Document/FinancialReport2024",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "roles": ["FinancialAnalyst", "Auditor"],
        "condition": {
          "match": {
            "expr": "user.role === 'FinancialAnalyst' || user.role === 'Auditor'"
          }
        },
        "notify": {
          "service": "webservice",
          "serviceConfig": {
            "url": "https://logging-service.example.com/log",
            "method": "POST",
            "headers": {
              "Content-Type": "application/json"
            }
          },
          "when": {
            "ruleActivated": "log access to FinancialReport2024"
          }
        }
      }
    ],
    "scope": "global",
    "variables": {
      "import": ["globalVariables"],
      "local": {
        "reportAccessLevel": "high"
      }
    }
  }
}
```

#### **Example 5: Resource Policy for a Server Resource**

Define a policy for a server resource called "DatabaseServer01." This policy allows only the "DBAdmin" role to execute certain actions and raises an alert if a critical action, like "shutdown," is attempted by any other role.

```json
{
  "apiVersion": "api.pola.dev/v2.6",
  "resourcePolicy": {
    "resource": "Server/DatabaseServer01",
    "version": "2.1",
    "rules": [
      {
        "actions": ["start", "stop", "restart"],
        "effect": "EFFECT_ALLOW",
        "roles": ["DBAdmin"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {
                  "expr": "user.role === 'DBAdmin'"
                },
                {
                  "expr": "server.status !== 'maintenance'"
                }
              ]
            }
          }
        }
      },
      {
        "actions": ["shutdown"],
        "effect": "EFFECT_DENY",
        "condition": {
          "match": {
            "none": {
              "of": [
                {
                  "expr": "user.role === 'DBAdmin'"
                }
              ]
            }
          }
        },
        "notify": {
          "service": "pubsub",
          "serviceConfig": {
            "topic": "critical-actions",
            "messageGroupId": "ServerEvents"
          },
          "when": {
            "conditionMet": "alert non-admin shutdown attempt"
          }
        }
      }
    ],
    "scope": "regional",
    "variables": {
      "local": {
        "serverLocation": "us-west"
      }
    }
  }
}
```

#### **Example 6: Resource Policy for a User Resource**

Define a policy for a specific user resource called "AdminUser." The policy restricts the "delete" action to super administrators only.

```json
{
  "apiVersion": "api.pola.dev/v2.6",
  "resourcePolicy": {
    "resource": "User/AdminUser",
    "version": "3.0",
    "rules": [
      {
        "actions": ["delete"],
        "effect": "EFFECT_DENY",
        "condition": {
          "match": {
            "none": {
              "of": [
                {
                  "expr": "user.role === 'SuperAdmin'"
                }
              ]
            }
          }
        },
        "notify": {
          "service": "queue",
          "serviceConfig": {
            "queueName": "admin-actions-queue",
            "messageGroupId": "UserManagement"
          },
          "when": {
            "conditionMet": "log unauthorized delete attempt"
          }
        }
      }
    ],
    "scope": "local",
    "variables": {
      "local": {
        "adminUserID": "1234"
      }
    }
  }
}
```

## **Key Points in Defining Resource Policies**

1. **Resource Type and Name**: Use the `resource` field in the `ResourcePolicy` to define the type and specific name of the resource. It follows the format `"ResourceType/ResourceName"`.
2. **Rules**: Each policy contains rules specifying which actions are allowed or denied (`EFFECT_ALLOW` or `EFFECT_DENY`). Rules also define conditions, roles, and notifications.
3. **Conditions**: Use the `Condition` schema to define logic that determines whether a rule applies. Conditions can use `match` objects to represent complex logical checks.
4. **Notifications**: Use the `Notify` object to define actions triggered when a rule is matched or violated, such as sending alerts, logging actions, or triggering webhooks.
5. **Variables and Scope**: Use the `variables` object to define local variables specific to the policy, while `scope` defines the policy's applicability (e.g., global, regional, local).

By following these guidelines, you can define resource policies with precise control over actions, conditions, roles, and responses to specific events, ensuring your system's security and governance requirements are met effectively.
