# Pola - Generative Policy Service
## Introduction to Pola 

**Pola** is an innovative generative policy service designed to automate and streamline access control, security management, and compliance enforcement in modern, dynamic environments. By leveraging advanced policy generation techniques, Pola enables organizations to define, manage, and enforce fine-grained access policies across a diverse range of services, resources, and user groups.

With a focus on flexibility and scalability, Pola allows for the creation of complex policies that are dynamically adjusted based on real-time conditions, user attributes, resource states, and organizational requirements. The service supports a variety of policy types—including Principal Policies, Resource Policies, Group Policies, Event Policies, Derived Roles, and Service Control Policies—providing a comprehensive solution to meet both security and compliance needs.

Pola’s generative capabilities empower organizations to maintain robust security postures while simplifying policy management, reducing operational overhead, and ensuring that access control policies are consistently enforced across their entire infrastructure.

## Principal Policy

### Overview of Principal Policy

A **Principal Policy** defines permissions and access controls associated with a specific principal, such as a user, group, or role. The principal represents an entity that is subject to policy enforcement. These policies are essential for controlling which resources a principal can access and what actions they are allowed or denied to perform.

**Principal Policies** are crucial in enforcing security and access control across systems by explicitly defining rules, conditions, actions, effects, and other elements that govern how principals interact with resources.

### Components of a Principal Policy

A **Principal Policy** includes the following components:

1. **apiVersion**: Specifies the version of the API and must be set to `"api.pola.dev/v2.5"`.

2. **principalPolicy**: An object that contains:
   - **principal**: A string representing the identifier of the principal (e.g., user ID, group name, role).
   - **version**: A string that specifies the version of the policy. It must match the version pattern (`^[0-9]+(\\.[0-9]+)*$`).
   - **rules**: An array of `PrincipalRule` objects that define the following:
     - **resource**: A string that identifies the resource to which the rule applies (e.g., resource ID, file path, database name).
     - **actions**: An array of action objects (`PrincipalRule.Action`) defining:
       - **action**: A string specifying the action (e.g., `read`, `write`, `delete`).
       - **effect**: A string indicating the effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`).
       - **condition** (optional): A `Condition` object that specifies criteria under which the action is allowed or denied.
       - **output** (optional): An `Output` object to specify expressions or conditions for the rule's outcomes.
       - **notify** (optional): A `Notify` object to configure notifications triggered by the action.
   - **scope** (optional): A string representing the scope of the policy.
   - **variables** (optional): An object to define variables used within the policy.

3. **auditInfo**: An object containing:
   - **createdBy**: A string specifying who created the policy, required.
   - **createdAt** (optional): The timestamp when the policy was created.
   - **updatedBy** (optional): A string specifying who last updated the policy.
   - **updatedAt** (optional): The timestamp when the policy was last updated.

## Complex to Very Complex Principal Policy Examples

### Example 1: Multi-Level Conditional Access with Nested Conditions

This policy allows a user to read and write a resource only if they are a manager and the resource is active, with nested conditions checking for specific roles and permissions.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "MultiLevelConditionalAccessPolicy",
  "principalPolicy": {
    "principal": "user456",
    "version": "2.0",
    "rules": [
      {
        "resource": "resource789",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.role === 'manager'" },
                    { "expr": "R.status === 'active'" },
                    {
                      "any": {
                        "of": [
                          { "expr": "P.permissions.includes('read_all')" },
                          { "expr": "P.groups.includes('executive_team')" }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "action": "write",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.role === 'manager'" },
                    { "expr": "R.status === 'active'" },
                    { "expr": "P.permissions.includes('write')" }
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 2: Notify and Log Actions for Unauthorized Access Attempts

This policy denies a user from deleting any resource and sends a notification to a web service while logging the attempt.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "NotifyAndLogUnauthorizedAccessPolicy",
  "principalPolicy": {
    "principal": "user789",
    "version": "2.1",
    "rules": [
      {
        "resource": "*",
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY",
            "notify": {
              "service": "webservice",
              "serviceConfig": {
                "url": "https://notification.service/unauthorized",
                "method": "POST",
                "headers": {
                  "Authorization": "Bearer token123"
                }
              },
              "when": {
                "conditionMet": "true",
                "ruleActivated": "true"
              }
            },
            "output": {
              "expr": "Log('Unauthorized delete attempt by user789 on resource ' + R.id)"
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "securityAdmin"
  }
}'
```

### Example 3: Context-Based Dynamic Access with Variable Scopes

This policy allows or denies actions based on dynamically evaluated conditions using context variables and global settings.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DynamicAccessPolicyWithContext",
  "principalPolicy": {
    "principal": "user999",
    "version": "2.2",
    "rules": [
      {
        "resource": "resource999",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.location === V.allowedLocation" },
                    { "expr": "R.type === V.resourceType" }
                  ]
                }
              }
            }
          },
          {
            "action": "edit",
            "effect": "EFFECT_DENY",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.clearanceLevel < V.requiredClearance" }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    "variables": {
      "import": ["globalVars"],
      "local": {
        "allowedLocation": "USA",
        "resourceType": "classified",
        "requiredClearance": "5"
      }
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 4: Multi-Action Policy with Different Effects and Advanced Notifications

This policy allows a user to create resources but denies updates and triggers notifications for certain actions.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "MultiActionAdvancedNotificationPolicy",
  "principalPolicy": {
    "principal": "user101",
    "version": "2.3",
    "rules": [
      {
        "resource": "resource123",
        "actions": [
          {
            "action": "create",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "update",
            "effect": "EFFECT_DENY",
            "notify": {
              "service": "queue",
              "serviceConfig": {
                "queueName": "update-deny-alerts"
              },
              "when": {
                "conditionMet": "R.status !== 'editable'",
                "ruleActivated": "true"
              }
            }
          },
          {
            "action": "delete",
            "effect": "EFFECT_DENY",
            "notify": {
              "service": "webservice",
              "serviceConfig": {
                "url": "https://notification.service/delete-deny",
                "method": "POST"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 5: Hierarchical Role-Based Access Control with Nested Conditions

This policy allows access to multiple resources based on hierarchical roles with complex nested conditions.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "HierarchicalRBACWithNestedConditions",
  "principalPolicy": {
    "principal": "role_team_lead",
    "version": "2.4",
    "rules": [
      {
        "resource": "resource_team_docs",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT

_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.role === 'team_lead'" },
                    {
                      "any": {
                        "of": [
                          { "expr": "R.securityLevel === 'confidential'" },
                          { "expr": "P.clearance.includes('team_lead_clearance')" }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "action": "write",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.role === 'team_lead'" },
                    { "expr": "P.groups.includes('engineering')" }
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

## Resource Policy

### Overview of Resource Policy

A **Resource Policy** defines the access control rules that apply to specific resources within a system. Unlike a **Principal Policy**, which is attached to a user, group, or role, a **Resource Policy** is directly attached to a resource and specifies the actions that can or cannot be performed on that resource, regardless of the principal trying to perform the action.

**Resource Policies** are crucial for maintaining security and regulatory compliance, as they allow precise control over how resources are accessed, modified, or managed.

### Components of a Resource Policy

A **Resource Policy** includes the following components:

1. **apiVersion**: Specifies the version of the API and must be set to `"api.pola.dev/v2.5"`.

2. **resourcePolicy**: An object that contains:
   - **resource**: A string representing the identifier of the resource (e.g., resource ID, file path, database name).
   - **version**: A string specifying the version of the policy. It must match the version pattern (`^[0-9]+(\\.[0-9]+)*$`).
   - **rules**: An array of `ResourceRule` objects that define the following:
     - **actions**: An array of action strings (e.g., `read`, `write`, `delete`), required.
     - **effect**: A string indicating the effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`), required.
     - **condition** (optional): A `Condition` object that specifies criteria under which the action is allowed or denied.
     - **derivedRoles** (optional): An array of role names that define derived roles allowed to perform the action.
     - **notify** (optional): A `Notify` object to configure notifications triggered by the action.
     - **output** (optional): An `Output` object to specify expressions or conditions for the rule's outcomes.

3. **auditInfo**: An object containing:
   - **createdBy**: A string specifying who created the policy, required.
   - **createdAt** (optional): The timestamp when the policy was created.
   - **updatedBy** (optional): A string specifying who last updated the policy.
   - **updatedAt** (optional): The timestamp when the policy was last updated.

## Complex to Very Complex Resource Policy Examples

### Example 1: Conditional Access with Multiple Nested Conditions

This policy allows reading and writing of a resource only if the resource status is active, the requesting user's role is manager, and the user is part of a specific group.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ConditionalAccessWithNestedConditions",
  "resourcePolicy": {
    "resource": "resource001",
    "version": "2.0",
    "rules": [
      {
        "actions": ["read", "write"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.status === 'active'" },
                { "expr": "P.role === 'manager'" },
                {
                  "any": {
                    "of": [
                      { "expr": "P.groups.includes('core_team')" },
                      { "expr": "P.permissions.includes('resource_edit')" }
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 2: Deny Access with Notifications on Unauthorized Actions

This policy denies any delete actions on a resource and sends a notification to a web service and a queue for alert management.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DenyDeleteWithNotifications",
  "resourcePolicy": {
    "resource": "resource002",
    "version": "2.1",
    "rules": [
      {
        "actions": ["delete"],
        "effect": "EFFECT_DENY",
        "notify": {
          "service": "webservice",
          "serviceConfig": {
            "url": "https://alert.service/unauthorized-delete",
            "method": "POST",
            "headers": {
              "Authorization": "Bearer tokenXYZ"
            }
          },
          "when": {
            "conditionMet": "true",
            "ruleActivated": "true"
          }
        },
        "output": {
          "expr": "Log('Unauthorized delete attempt on resource002')"
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "securityAdmin"
  }
}'
```

### Example 3: Role-Based Access Control with Advanced Conditions

This policy allows specific actions for derived roles with advanced conditions based on resource type and attributes.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "RoleBasedAccessWithAdvancedConditions",
  "resourcePolicy": {
    "resource": "resource003",
    "version": "2.2",
    "rules": [
      {
        "actions": ["edit"],
        "effect": "EFFECT_ALLOW",
        "derivedRoles": ["role_data_admin", "role_supervisor"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.type === 'confidential'" },
                { "expr": "P.clearanceLevel >= 5" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 4: Complex Policy for Data Governance with Dynamic Variables

This policy allows or denies actions on data resources based on dynamic variables, such as data sensitivity level and user's location.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DataGovernanceWithDynamicVariables",
  "resourcePolicy": {
    "resource": "resource004",
    "version": "2.3",
    "rules": [
      {
        "actions": ["read"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.sensitivityLevel === V.allowedSensitivity" },
                { "expr": "P.location === V.allowedLocation" }
              ]
            }
          }
        }
      },
      {
        "actions": ["delete"],
        "effect": "EFFECT_DENY",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.sensitivityLevel > V.maxAllowedSensitivity" }
              ]
            }
          }
        }
      }
    ],
    "variables": {
      "import": ["dataGovernanceGlobals"],
      "local": {
        "allowedSensitivity": "medium",
        "allowedLocation": "USA",
        "maxAllowedSensitivity": "high"
      }
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 5: Hierarchical Resource Access Control with Derived Roles and Notifications

This policy provides hierarchical access control to resources based on derived roles, with notifications for certain actions.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "HierarchicalResourceAccessControl",
  "resourcePolicy": {
    "resource": "resource005",
    "version": "2.4",
    "rules": [
      {
        "actions": ["read", "write"],
        "effect": "EFFECT_ALLOW",
        "derivedRoles": ["role_manager", "role_team_lead"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.role in ['manager', 'team_lead']" },
                { "expr": "R.category === 'financial'" }
              ]
            }
          }
        }
      },
      {
        "actions": ["delete"],
        "effect": "EFFECT_DENY",
        "notify": {
          "service": "pubsub",
          "serviceConfig": {
            "topic": "resource-delete-alerts"
          },
          "when": {
            "conditionMet": "true",
            "ruleActivated": "true"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```
## Group Policy

### Overview of Group Policy

A **Group Policy** is a set of access control rules that apply to a specific group within a system. Group policies are attached to a group entity, such as a team, department, or user collection, and specify what actions the group's members are permitted or denied to perform on various resources. These policies are useful for managing access at a group level, ensuring that all members of the group adhere to a consistent set of permissions.

**Group Policies** help organizations enforce uniform access controls across groups, streamline permissions management, and simplify compliance with internal and external regulations.

### Components of a Group Policy

A **Group Policy** includes the following components:

1. **apiVersion**: Specifies the version of the API and must be set to `"api.pola.dev/v2.5"`.

2. **groupPolicy**: An object that contains:
   - **group**: A string representing the identifier of the group (e.g., group name or ID).
   - **version**: A string specifying the version of the policy. It must match the version pattern (`^[0-9]+(\\.[0-9]+)*$`).
   - **rules**: An array of `GroupRule` objects that define the following:
     - **resource**: A string representing the identifier of the resource to which the rule applies.
     - **actions**: An array of `GroupRule.Action` objects defining:
       - **action**: A string specifying the action (e.g., `read`, `write`, `delete`), required.
       - **effect**: A string indicating the effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`), required.
       - **condition** (optional): A `Condition` object that specifies criteria under which the action is allowed or denied.
       - **notify** (optional): A `Notify` object to configure notifications triggered by the action.
       - **output** (optional): An `Output` object to specify expressions or conditions for the rule's outcomes.

3. **auditInfo**: An object containing:
   - **createdBy**: A string specifying who created the policy, required.
   - **createdAt** (optional): The timestamp when the policy was created.
   - **updatedBy** (optional): A string specifying who last updated the policy.
   - **updatedAt** (optional): The timestamp when the policy was last updated.

## Complex to Very Complex Group Policy Examples

### Example 1: Multi-Action Group Policy with Conditional Access

This policy allows a group to read and write a resource only if the resource status is active and the group's members have a specific role.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "MultiActionGroupPolicyWithConditionalAccess",
  "groupPolicy": {
    "group": "group_engineers",
    "version": "2.0",
    "rules": [
      {
        "resource": "resource1001",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "R.status === 'active'" },
                    { "expr": "P.role === 'engineer'" }
                  ]
                }
              }
            }
          },
          {
            "action": "write",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "R.status === 'active'" },
                    { "expr": "P.permissions.includes('write_access')" }
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 2: Deny Access with Real-Time Notifications for Unauthorized Actions

This policy denies all delete actions performed by group members on any resource and triggers notifications for unauthorized attempts.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DenyDeleteWithRealTimeNotifications",
  "groupPolicy": {
    "group": "group_marketing",
    "version": "2.1",
    "rules": [
      {
        "resource": "*",
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY",
            "notify": {
              "service": "pubsub",
              "serviceConfig": {
                "topic": "unauthorized-delete-attempts"
              },
              "when": {
                "conditionMet": "true",
                "ruleActivated": "true"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "securityAdmin"
  }
}'
```

### Example 3: Conditional Access for Multiple Resources with Complex Logic

This policy allows a group to read or modify multiple resources only if the resource type matches and the user is part of an authorized project.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ConditionalAccessForMultipleResources",
  "groupPolicy": {
    "group": "group_project_managers",
    "version": "2.2",
    "rules": [
      {
        "resource": "resource1002",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "R.type === 'project'" },
                    { "expr": "P.projectId === R.projectId" }
                  ]
                }
              }
            }
          },
          {
            "action": "modify",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.role === 'project_manager'" },
                    { "expr": "R.accessLevel <= 3" }
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 4: Hierarchical Group Access Control with Advanced Notifications

This policy defines a hierarchical group access control mechanism where group members can only perform actions if they belong to a specified sub-group, with notifications for certain activities.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "HierarchicalGroupAccessControlWithNotifications",
  "groupPolicy": {
    "group": "group_operations",
    "version": "2.3",
    "rules": [
      {
        "resource": "resource1003",
        "actions": [
          {
            "action": "approve",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.subGroup === 'ops_team'" },
                    { "expr": "R.level === 'high'" }
                  ]
                }
              }
            }
          },
          {
            "action": "reject",
            "effect": "EFFECT_ALLOW",
            "notify": {
              "service": "webservice",
              "serviceConfig": {
                "url": "https://alerts.service/rejections",
                "method": "POST"
              },
              "when": {
                "conditionMet": "P.role === 'supervisor'",
                "ruleActivated": "true"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 5: Dynamic Access Control with Derived Roles and Conditional Expressions

This policy allows or denies actions for group members based on derived roles and dynamic conditions.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DynamicAccessControlWithDerivedRoles",
  "groupPolicy": {
    "group": "group_support",
    "version": "2.4",
    "rules": [
      {
        "resource": "resource1004",
        "actions": [
          {
            "action": "resolve",
            "effect": "EFFECT_ALLOW",
            "derivedRoles": ["role_support_lead", "role_senior_support"],
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.certification.includes('support_expert')" },
                    { "expr": "P.experienceYears >= 3" }
                  ]
                }
              }
            }
          },
          {
            "action": "close",
            "effect": "EFFECT_DENY",
            "notify": {
              "service": "queue",
              "serviceConfig": {
                "queueName": "close-deny-alerts"
              },
              "when": {
                "conditionMet": "true",
                "ruleActivated": "true

"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```
## Role Policy

### Overview of Role Policy

A **Role Policy** defines the access control rules and permissions associated with a specific role within a system. A role represents a collection of permissions that can be assigned to users or groups. **Role Policies** help in managing access to resources by defining what actions a role can perform and under what conditions.

**Role Policies** are essential for enforcing role-based access control (RBAC), ensuring that only authorized roles have access to specific resources, and simplifying the management of permissions by grouping them into roles.

### Components of a Role Policy

A **Role Policy** includes the following components:

1. **apiVersion**: Specifies the version of the API and must be set to `"api.pola.dev/v2.5"`.

2. **rolePolicy**: An object that contains:
   - **role**: A string representing the identifier of the role (e.g., role name or ID).
   - **version**: A string specifying the version of the policy. It must match the version pattern (`^[0-9]+(\\.[0-9]+)*$`).
   - **rules**: An array of `RoleRule` objects that define the following:
     - **resource**: A string representing the identifier of the resource to which the rule applies.
     - **actions**: An array of `RoleRule.Action` objects defining:
       - **action**: A string specifying the action (e.g., `read`, `write`, `delete`), required.
       - **effect**: A string indicating the effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`), required.
       - **condition** (optional): A `Condition` object that specifies criteria under which the action is allowed or denied.
       - **notify** (optional): A `Notify` object to configure notifications triggered by the action.
       - **output** (optional): An `Output` object to specify expressions or conditions for the rule's outcomes.

3. **auditInfo**: An object containing:
   - **createdBy**: A string specifying who created the policy, required.
   - **createdAt** (optional): The timestamp when the policy was created.
   - **updatedBy** (optional): A string specifying who last updated the policy.
   - **updatedAt** (optional): The timestamp when the policy was last updated.

## Complex to Very Complex Role Policy Examples

### Example 1: Multi-Action Role Policy with Conditional Access

This policy allows a role to read and write a resource only if the resource status is active and the user's location matches a specified value.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "MultiActionRolePolicyWithConditionalAccess",
  "rolePolicy": {
    "role": "role_developer",
    "version": "2.0",
    "rules": [
      {
        "resource": "resource2001",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "R.status === 'active'" },
                    { "expr": "P.location === 'USA'" }
                  ]
                }
              }
            }
          },
          {
            "action": "write",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "R.status === 'active'" },
                    { "expr": "P.permissions.includes('edit_permission')" }
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 2: Deny Access with Notifications for Unauthorized Attempts

This policy denies all delete actions by members of a role and sends notifications to a web service when such attempts occur.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DenyDeleteWithUnauthorizedAttemptNotifications",
  "rolePolicy": {
    "role": "role_content_editor",
    "version": "2.1",
    "rules": [
      {
        "resource": "*",
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY",
            "notify": {
              "service": "webservice",
              "serviceConfig": {
                "url": "https://alert.service/unauthorized-delete",
                "method": "POST",
                "headers": {
                  "Authorization": "Bearer tokenXYZ"
                }
              },
              "when": {
                "conditionMet": "true",
                "ruleActivated": "true"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "securityAdmin"
  }
}'
```

### Example 3: Role-Based Access with Dynamic Conditions

This policy allows actions for a role based on dynamic conditions, such as the user's department and the resource's classification.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "RoleBasedAccessWithDynamicConditions",
  "rolePolicy": {
    "role": "role_financial_analyst",
    "version": "2.2",
    "rules": [
      {
        "resource": "resource2002",
        "actions": [
          {
            "action": "analyze",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.department === 'finance'" },
                    { "expr": "R.classification === 'confidential'" }
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "financeAdmin"
  }
}'
```

### Example 4: Advanced Role Policy for Resource Management with Notifications

This policy allows or denies actions based on the role's permissions and sends notifications for specific actions.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "AdvancedResourceManagementWithNotifications",
  "rolePolicy": {
    "role": "role_resource_manager",
    "version": "2.3",
    "rules": [
      {
        "resource": "resource2003",
        "actions": [
          {
            "action": "allocate",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "release",
            "effect": "EFFECT_DENY",
            "notify": {
              "service": "queue",
              "serviceConfig": {
                "queueName": "release-deny-alerts"
              },
              "when": {
                "conditionMet": "R.critical === true",
                "ruleActivated": "true"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "resourceAdmin"
  }
}'
```

### Example 5: Complex Role-Based Policy with Hierarchical Role Conditions

This policy allows access to resources based on hierarchical roles with nested conditions and specific role attributes.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "HierarchicalRoleBasedAccessControl",
  "rolePolicy": {
    "role": "role_team_leader",
    "version": "2.4",
    "rules": [
      {
        "resource": "resource_team_documents",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.role === 'team_leader'" },
                    {
                      "any": {
                        "of": [
                          { "expr": "R.securityLevel === 'confidential'" },
                          { "expr": "P.clearance.includes('team_leader_access')" }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "action": "approve",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.role === 'team_leader'" },
                    { "expr": "P.groups.includes('management')" }
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```
## Event Policy

### Overview of Event Policy

An **Event Policy** defines actions that should be taken in response to specific events occurring on a resource or within a system. Event policies are used to automate responses to events such as access attempts, modifications, security breaches, or data changes. These policies allow organizations to enforce security protocols, compliance requirements, and operational workflows by triggering notifications, logging activities, or executing approvals or reviews.

**Event Policies** are essential for managing real-time responses to various conditions and events, ensuring that systems remain secure, compliant, and efficient.

### Components of an Event Policy

An **Event Policy** includes the following components:

1. **apiVersion**: Specifies the version of the API and must be set to `"api.pola.dev/v2.5"`.

2. **eventPolicy**: An object that contains:
   - **event**: A string representing the identifier of the event (e.g., `access_attempt`, `modification_attempt`), required.
   - **resource**: A string representing the identifier of the resource to which the event applies, required.
   - **version**: A string specifying the version of the policy. It must match the version pattern (`^[0-9]+(\\.[0-9]+)*$`).
   - **rules**: An array of `EventRule` objects that define the following:
     - **conditions**: A `Condition` object that specifies criteria under which the event triggers an action, required.
     - **actions**: An array of `EventRule.Action` objects defining:
       - **action**: A string specifying the action (e.g., `NOTIFY`, `LOG`, `ALERT`, `APPROVE`, `REVIEW`), required.
       - **effect**: A string indicating the effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`), required.
       - **notify** (optional): A `Notify` object to configure notifications triggered by the action.
       - **output** (optional): An `Output` object to specify expressions or conditions for the rule's outcomes.

3. **auditInfo**: An object containing:
   - **createdBy**: A string specifying who created the policy, required.
   - **createdAt** (optional): The timestamp when the policy was created.
   - **updatedBy** (optional): A string specifying who last updated the policy.
   - **updatedAt** (optional): The timestamp when the policy was last updated.

## Complex to Very Complex Event Policy Examples

### Example 1: Multi-Level Conditional Alerts for Security Events

This policy triggers alerts when a security breach event occurs, but only if the resource's security level is high and the user's role does not match the authorized roles.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "MultiLevelConditionalAlertsForSecurityEvents",
  "eventPolicy": {
    "event": "security_breach",
    "resource": "resource_security_zone_1",
    "version": "3.0",
    "rules": [
      {
        "conditions": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.securityLevel === 'high'" },
                { "expr": "P.role !== 'authorized_personnel'" }
              ]
            }
          }
        },
        "actions": [
          {
            "action": "ALERT",
            "effect": "EFFECT_ALLOW",
            "notify": {
              "service": "webservice",
              "serviceConfig": {
                "url": "https://alert.service/security",
                "method": "POST",
                "headers": {
                  "Authorization": "Bearer tokenABC"
                }
              },
              "when": {
                "conditionMet": "true",
                "ruleActivated": "true"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "securityAdmin"
  }
}'
```

### Example 2: Conditional Approval Workflow for Data Modification

This policy triggers an approval workflow when a modification attempt is made on a critical resource, but only if the change is classified as a major update.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ConditionalApprovalWorkflowForDataModification",
  "eventPolicy": {
    "event": "modification_attempt",
    "resource": "resource_critical_data",
    "version": "3.1",
    "rules": [
      {
        "conditions": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.dataType === 'financial'" },
                { "expr": "R.changeClassification === 'major'" }
              ]
            }
          }
        },
        "actions": [
          {
            "action": "APPROVE",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 3: Multi-Action Policy for Unauthorized Access Attempts

This policy logs and notifies on unauthorized access attempts to a resource, with different notifications for specific roles.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "MultiActionPolicyForUnauthorizedAccessAttempts",
  "eventPolicy": {
    "event": "access_attempt",
    "resource": "resource_secure_file",
    "version": "3.2",
    "rules": [
      {
        "conditions": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.role !== 'admin'" },
                { "expr": "P.clearanceLevel < 4" }
              ]
            }
          }
        },
        "actions": [
          {
            "action": "LOG",
            "effect": "EFFECT_ALLOW",
            "output": {
              "expr": "Log('Unauthorized access attempt by ' + P.userId)"
            }
          },
          {
            "action": "NOTIFY",
            "effect": "EFFECT_ALLOW",
            "notify": {
              "service": "pubsub",
              "serviceConfig": {
                "topic": "security-notifications"
              },
              "when": {
                "conditionMet": "true",
                "ruleActivated": "true"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "securityAdmin"
  }
}'
```

### Example 4: Automated Review for Sensitive Data Access Requests

This policy triggers an automated review process for access requests to sensitive data, ensuring compliance checks are performed before granting access.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "AutomatedReviewForSensitiveDataAccessRequests",
  "eventPolicy": {
    "event": "access_request",
    "resource": "resource_sensitive_data",
    "version": "3.3",
    "rules": [
      {
        "conditions": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.dataClassification === 'sensitive'" },
                { "expr": "P.role !== 'compliance_officer'" }
              ]
            }
          }
        },
        "actions": [
          {
            "action": "REVIEW",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "complianceAdmin"
  }
}'
```

### Example 5: Dynamic Notification Strategy for Resource State Changes

This policy dynamically adjusts the notification strategy based on the resource's state and the event type.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DynamicNotificationStrategyForResourceStateChanges",
  "eventPolicy": {
    "event": "resource_state_change",
    "resource": "resource_dynamic_monitor",
    "version": "3.4",
    "rules": [
      {
        "conditions": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.state in ['critical', 'warning']" }
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
                "url": "https://monitoring.service/alerts",
                "method": "POST",
                "headers": {
                  "Authorization": "Bearer dynamicToken"
                }
              },
              "when": {
                "conditionMet": "R.state === 'critical'",
                "ruleActivated": "true"
              }
            }
          },
          {
            "action": "LOG",
            "effect": "EFFECT_ALLOW",
            "output": {
              "expr": "Log('Resource state changed to ' + R.state)"
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
   

 "createdBy": "monitoringAdmin"
  }
}'
```

## Service Control Policy

### Overview of Service Control Policy

A **Service Control Policy (SCP)** defines the maximum permissions for entities (users, groups, roles, or resources) within an organization or a specific service environment. SCPs are typically used in hierarchical structures such as organizations or business units to control access to various services and resources. SCPs help ensure that no entity exceeds the defined permission boundaries, providing an extra layer of security and compliance.

**Service Control Policies** are essential for implementing a strong security posture by limiting actions across entire services or resources, ensuring that access is always within organizationally approved limits.

### Components of a Service Control Policy

A **Service Control Policy** includes the following components:

1. **apiVersion**: Specifies the version of the API and must be set to `"api.pola.dev/v2.5"`.

2. **serviceControlPolicy**: An object that contains:
   - **maxPermissions**: An array of strings representing the maximum permissions allowed (e.g., `read`, `write`, `delete`), required.
   - **version**: A string specifying the version of the policy. It must match the version pattern (`^[0-9]+(\\.[0-9]+)*$`).
   - **boundEntities**: An object defining the entities to which this policy applies:
     - **users**: An array of strings representing user identifiers.
     - **groups**: An array of strings representing group identifiers.
     - **roles**: An array of strings representing role identifiers.
     - **resources**: An array of strings representing resource identifiers.
  
3. **auditInfo**: An object containing:
   - **createdBy**: A string specifying who created the policy, required.
   - **createdAt** (optional): The timestamp when the policy was created.
   - **updatedBy** (optional): A string specifying who last updated the policy.
   - **updatedAt** (optional): The timestamp when the policy was last updated.

## Complex to Very Complex Service Control Policy Examples

### Example 1: Restrict Maximum Permissions for All Users in a Development Environment

This policy restricts all users in a development environment to only have read and list permissions.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "RestrictMaxPermissionsForDevEnvironment",
  "serviceControlPolicy": {
    "maxPermissions": ["read", "list"],
    "version": "3.0",
    "boundEntities": {
      "users": ["user001", "user002", "user003"],
      "groups": ["dev_group"],
      "roles": ["developer"],
      "resources": ["resource_dev_env"]
    }
  },
  "auditInfo": {
    "createdBy": "devAdmin"
  }
}'
```

### Example 2: Limit Access to Specific Actions for Finance Group

This policy limits the finance group to view and update permissions only on financial resources, preventing them from performing any other actions.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "LimitFinanceGroupAccessToSpecificActions",
  "serviceControlPolicy": {
    "maxPermissions": ["view", "update"],
    "version": "3.1",
    "boundEntities": {
      "users": [],
      "groups": ["finance_team"],
      "roles": [],
      "resources": ["resource_financial_records"]
    }
  },
  "auditInfo": {
    "createdBy": "financeAdmin"
  }
}'
```

### Example 3: Enforce Minimal Permissions for Guest Users Across All Services

This policy enforces minimal permissions for guest users across all services, allowing them only to list resources.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "EnforceMinimalPermissionsForGuestUsers",
  "serviceControlPolicy": {
    "maxPermissions": ["list"],
    "version": "3.2",
    "boundEntities": {
      "users": ["guest_user001", "guest_user002"],
      "groups": ["guest_group"],
      "roles": ["guest_role"],
      "resources": ["*"]
    }
  },
  "auditInfo": {
    "createdBy": "securityAdmin"
  }
}'
```

### Example 4: Restrict Role-Based Permissions for Critical Resources

This policy restricts role-based permissions, allowing only specific actions on critical resources by senior roles.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "RestrictRoleBasedPermissionsForCriticalResources",
  "serviceControlPolicy": {
    "maxPermissions": ["read", "approve"],
    "version": "3.3",
    "boundEntities": {
      "users": [],
      "groups": [],
      "roles": ["senior_manager", "auditor"],
      "resources": ["resource_critical_logs", "resource_confidential_reports"]
    }
  },
  "auditInfo": {
    "createdBy": "complianceOfficer"
  }
}'
```

### Example 5: Enforce No Actions on Deprecated Resources

This policy enforces no actions (deny all) on deprecated resources, ensuring they remain inaccessible.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "EnforceNoActionsOnDeprecatedResources",
  "serviceControlPolicy": {
    "maxPermissions": [],
    "version": "3.4",
    "boundEntities": {
      "users": [],
      "groups": [],
      "roles": [],
      "resources": ["resource_deprecated_001", "resource_deprecated_002"]
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

## Derived Roles

### Overview of Derived Roles

**Derived Roles** are specialized roles that are dynamically generated based on existing roles and specific conditions. These roles are not statically assigned but are computed at runtime based on the conditions defined in the policy. Derived roles help to achieve fine-grained access control by creating context-specific roles that only apply when certain conditions are met.

**Derived Roles** are particularly useful in scenarios where access control requirements are complex and need to be adjusted dynamically based on user attributes, resource states, or other contextual information.

### Components of Derived Roles

A **Derived Role** policy includes the following components:

1. **apiVersion**: Specifies the version of the API and must be set to `"api.pola.dev/v2.5"`.

2. **derivedRoles**: An object that contains:
   - **name**: A string representing the name of the derived role set, required.
   - **definitions**: An array of `RoleDef` objects, required, that define the following:
     - **name**: A string representing the role name, required.
     - **parentRoles**: An array of strings representing parent roles from which this role is derived, required.
     - **condition** (optional): A `Condition` object that specifies criteria under which the derived role is applied.
  
3. **auditInfo**: An object containing:
   - **createdBy**: A string specifying who created the policy, required.
   - **createdAt** (optional): The timestamp when the policy was created.
   - **updatedBy** (optional): A string specifying who last updated the policy.
   - **updatedAt** (optional): The timestamp when the policy was last updated.

## Complex to Very Complex Derived Roles Examples

### Example 1: Derived Role Based on Project and Department Membership

This policy defines a derived role for "project_manager" that applies only if the user is part of the "project_team" and belongs to the "engineering" department.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DerivedRoleBasedOnProjectAndDepartment",
  "derivedRoles": {
    "name": "projectManagementRoles",
    "definitions": [
      {
        "name": "project_manager",
        "parentRoles": ["manager"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.groups.includes('project_team')" },
                { "expr": "P.department === 'engineering'" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 2: Context-Sensitive Derived Roles for Multi-Factor Authentication

This policy defines a derived role "mfa_user" that applies only if the user has successfully completed multi-factor authentication and their device is trusted.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ContextSensitiveDerivedRolesForMFA",
  "derivedRoles": {
    "name": "mfaRoles",
    "definitions": [
      {
        "name": "mfa_user",
        "parentRoles": ["authenticated_user"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.mfaStatus === 'completed'" },
                { "expr": "P.deviceTrust === 'trusted'" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "securityAdmin"
  }
}'
```

### Example 3: Hierarchical Derived Roles with Multi-Level Conditions

This policy creates hierarchical derived roles for senior and executive managers, with conditions based on the user's level and specific attributes.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "HierarchicalDerivedRolesWithMultiLevelConditions",
  "derivedRoles": {
    "name": "managementRoles",
    "definitions": [
      {
        "name": "senior_manager",
        "parentRoles": ["manager"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.role === 'manager'" },
                { "expr": "P.level === 'senior'" }
              ]
            }
          }
        }
      },
      {
        "name": "executive_manager",
        "parentRoles": ["senior_manager"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.role === 'manager'" },
                { "expr": "P.level === 'executive'" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 4: Derived Roles Based on Dynamic User Attributes

This policy defines a derived role for "data_analyst" that applies only if the user holds a specific certification and is assigned to a particular project.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DynamicUserAttributeBasedDerivedRoles",
  "derivedRoles": {
    "name": "analysisRoles",
    "definitions": [
      {
        "name": "data_analyst",
        "parentRoles": ["analyst"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.certification.includes('data_science')" },
                { "expr": "P.projects.includes('AI_project')" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 5: Derived Roles with Nested Conditions and Real-Time Updates

This policy defines a role "incident_responder" that applies if the user is a member of the "security_team" and the system is in a high-alert state, with nested conditions checking for specific roles and response times.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DerivedRolesWithNestedConditionsAndRealTimeUpdates",
  "derivedRoles": {
    "name": "incidentResponseRoles",
    "definitions": [
      {
        "name": "incident_responder",
        "parentRoles": ["security_staff"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.groups.includes('security_team')" },
                { "expr": "System.alertState === 'high'" },
                {
                  "any": {
                    "of": [
                      { "expr": "P.role === 'team_lead'" },
                      { "expr": "P.responseTime <= 5" }
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "securityAdmin"
  }
}'
```
## Export Variables

### Overview of Export Variables

**Export Variables** are used to define and export a set of variables that can be utilized across various policies within the system. These variables are often used to dynamically adjust policy behavior based on the current context or specific conditions. Exporting variables allows for centralized management of variable definitions, making it easier to maintain and update policy logic across multiple policies or services.

**Export Variables** are essential in scenarios where consistent values or settings need to be applied across different policies, such as configuration settings, thresholds, operational parameters, or business rules.

### Components of Export Variables

An **Export Variables** policy includes the following components:

1. **apiVersion**: Specifies the version of the API and must be set to `"api.pola.dev/v2.5"`.

2. **exportVariables**: An object that contains:
   - **name**: A string representing the name of the exported variable set, required.
   - **definitions**: An object where each key is the variable name and the value is the variable definition (a string), required.

3. **auditInfo**: An object containing:
   - **createdBy**: A string specifying who created the policy, required.
   - **createdAt** (optional): The timestamp when the policy was created.
   - **updatedBy** (optional): A string specifying who last updated the policy.
   - **updatedAt** (optional): The timestamp when the policy was last updated.

## Complex to Very Complex Export Variables Examples

### Example 1: Export Variables for Dynamic Security Settings

This policy defines export variables for dynamic security settings such as session timeouts, max login attempts, and allowed IP ranges for different environments.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DynamicSecuritySettings",
  "exportVariables": {
    "name": "securitySettings",
    "definitions": {
      "maxLoginAttempts": "5",
      "sessionTimeout": "30m",
      "allowedIPRange": "192.168.1.0/24,10.0.0.0/8"
    }
  },
  "auditInfo": {
    "createdBy": "securityAdmin"
  }
}'
```

### Example 2: Export Variables for Access Control Based on Time and Location

This policy exports variables that define access control parameters such as allowed access hours, restricted regions, and required clearances.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "AccessControlBasedOnTimeAndLocation",
  "exportVariables": {
    "name": "accessControlParams",
    "definitions": {
      "allowedAccessHours": "09:00-18:00",
      "restrictedRegions": "CN,RU,IR",
      "requiredClearanceLevel": "4"
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

### Example 3: Export Variables for Workflow Automation and Process Control

This policy exports variables used in workflow automation for approval thresholds, escalation contacts, and retry limits.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "WorkflowAutomationAndProcessControl",
  "exportVariables": {
    "name": "workflowParams",
    "definitions": {
      "approvalThreshold": "3",
      "escalationContact": "operations_manager",
      "retryLimit": "5"
    }
  },
  "auditInfo": {
    "createdBy": "workflowAdmin"
  }
}'
```

### Example 4: Export Variables for Compliance and Regulatory Requirements

This policy exports variables related to compliance and regulatory requirements, such as data retention periods, audit log formats, and encryption standards.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ComplianceAndRegulatoryRequirements",
  "exportVariables": {
    "name": "complianceSettings",
    "definitions": {
      "dataRetentionPeriod": "7y",
      "auditLogFormat": "JSON",
      "encryptionStandard": "AES-256"
    }
  },
  "auditInfo": {
    "createdBy": "complianceOfficer"
  }
}'
```

### Example 5: Export Variables for Custom Application Configuration

This policy defines export variables for custom application configuration, such as theme settings, notification preferences, and language options.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "CustomApplicationConfiguration",
  "exportVariables": {
    "name": "appConfig",
    "definitions": {
      "theme": "dark",
      "language": "en-US",
      "notificationFrequency": "daily",
      "maxDashboardWidgets": "10"
    }
  },
  "auditInfo": {
    "createdBy": "appAdmin"
  }
}'
```
