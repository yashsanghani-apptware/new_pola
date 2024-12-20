## Principal Policy
### Overview of Principal Policy

A **Principal Policy** defines permissions and access controls associated with a specific principal, such as a user, group, or role. The principal represents an entity that is subject to policy enforcement. These policies are essential for controlling which resources a principal can access and what actions they are allowed or denied to perform.

**Principal Policies** are crucial in enforcing security and access control across systems by explicitly defining rules, conditions, actions, effects, and other elements that govern how principals interact with resources.

#### Components of a Principal Policy

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

### Principal Policy Examples

#### Example 1: Multi-Level Conditional Access with Nested Conditions

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

#### Example 2: Notify and Log Actions for Unauthorized Access Attempts

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

#### Example 3: Context-Based Dynamic Access with Variable Scopes

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

#### Example 4: Multi-Action Policy with Different Effects and Advanced Notifications

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

#### Example 5: Hierarchical Role-Based Access Control with Nested Conditions

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

### JSON Schema Overview for **Resource Policy**

From the schema, a **Resource Policy** requires the following:

- **apiVersion**: Must be `"api.pola.dev/v2.5"`
- **resourcePolicy**: An object containing:
  - **resource**: A string, required.
  - **version**: A string that matches the version pattern, required.
  - **rules**: An array of `ResourceRule` objects, defining:
    - **actions**: An array of action strings, required.
    - **effect**: A string, either `"EFFECT_ALLOW"` or `"EFFECT_DENY"`, required.
- **auditInfo**: An object containing:
  - **createdBy**: A string, required.

### cURL Examples for Creating Resource Policies

#### Example 1: Allow Access to Specific Actions on a Resource

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "AllowSpecificActionsOnResource",
  "resourcePolicy": {
    "resource": "resource123",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read", "write"],
        "effect": "EFFECT_ALLOW"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 2: Deny All Actions Except Read on a Resource

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DenyAllExceptReadOnResource",
  "resourcePolicy": {
    "resource": "resource456",
    "version": "1.1",
    "rules": [
      {
        "actions": ["delete", "update", "create"],
        "effect": "EFFECT_DENY"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 3: Conditional Allow Access Based on Resource Status

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ConditionalAllowBasedOnStatus",
  "resourcePolicy": {
    "resource": "resource789",
    "version": "1.2",
    "rules": [
      {
        "actions": ["read"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.status === 'active'" }
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

#### Example 4: Notify on Delete Action Attempt for Resource

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "NotifyOnDeleteAttempt",
  "resourcePolicy": {
    "resource": "resource101",
    "version": "1.3",
    "rules": [
      {
        "actions": ["delete"],
        "effect": "EFFECT_DENY",
        "notify": {
          "service": "queue",
          "serviceConfig": {
            "queueName": "resource-delete-alerts"
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

#### Example 5: Allow Role-Based Access to Multiple Actions

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "RoleBasedAccessToMultipleActions",
  "resourcePolicy": {
    "resource": "resource202",
    "version": "1.4",
    "rules": [
      {
        "actions": ["edit", "update"],
        "effect": "EFFECT_ALLOW",
        "derivedRoles": ["role_admin", "role_editor"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

## Role Based Policy

### JSON Schema Overview for **Role Policy**

From the schema, a **Role Policy** requires the following:

- **apiVersion**: Must be `"api.pola.dev/v2.5"`
- **rolePolicy**: An object containing:
  - **role**: A string, required.
  - **version**: A string that matches the version pattern, required.
  - **rules**: An array of `RoleRule` objects, defining:
    - **resource**: A string, required.
    - **actions**: An array of `RoleRule.Action`, defining:
      - **action**: A string, required.
      - **effect**: A string, either `"EFFECT_ALLOW"` or `"EFFECT_DENY"`, required.
- **auditInfo**: An object containing:
  - **createdBy**: A string, required.

### cURL Examples for Creating Role Policies

#### Example 1: Allow Role Admin to Read and Write a Resource

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "AllowRoleAdminToReadAndWrite",
  "rolePolicy": {
    "role": "role_admin",
    "version": "1.0",
    "rules": [
      {
        "resource": "resource001",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "write",
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

#### Example 2: Deny Role Editor from Deleting a Resource

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DenyRoleEditorFromDeleting",
  "rolePolicy": {
    "role": "role_editor",
    "version": "1.1",
    "rules": [
      {
        "resource": "resource002",
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
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

#### Example 3: Conditional Access for Role Viewer to View Active Resources Only

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ConditionalAccessForViewerRole",
  "rolePolicy": {
    "role": "role_viewer",
    "version": "1.2",
    "rules": [
      {
        "resource": "resource003",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
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
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 4: Notify on Attempted Unauthorized Access by Role Guest

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "NotifyOnUnauthorizedAccessByGuest",
  "rolePolicy": {
    "role": "role_guest",
    "version": "1.3",
    "rules": [
      {
        "resource": "resource004",
        "actions": [
          {
            "action": "modify",
            "effect": "EFFECT_DENY",
            "notify": {
              "service": "pubsub",
              "serviceConfig": {
                "topic": "unauthorized-access-alerts"
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
    "createdBy": "adminUser"
  }
}'
```

#### Example 5: Role-Based Policy Allowing Multiple Roles with Derived Conditions

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "MultiRolePolicyWithConditions",
  "rolePolicy": {
    "role": "role_support",
    "version": "1.4",
    "rules": [
      {
        "resource": "resource005",
        "actions": [
          {
            "action": "assist",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "any": {
                  "of": [
                    { "expr": "P.experienceLevel === 'senior'" },
                    { "expr": "P.certification.includes('support-certified')" }
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
## Group Based Policy
Let's move on to the next policy type: **Group Policy**.

### JSON Schema Overview for **Group Policy**

A **Group Policy** requires the following:

- **apiVersion**: Must be `"api.pola.dev/v2.5"`
- **groupPolicy**: An object containing:
  - **group**: A string, required.
  - **version**: A string that matches the version pattern, required.
  - **rules**: An array of `GroupRule` objects, defining:
    - **resource**: A string, required.
    - **actions**: An array of `GroupRule.Action`, defining:
      - **action**: A string, required.
      - **effect**: A string, either `"EFFECT_ALLOW"` or `"EFFECT_DENY"`, required.
- **auditInfo**: An object containing:
  - **createdBy**: A string, required.

### cURL Examples for Creating Group Policies

#### Example 1: Allow Group Members to Read and Write a Resource

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "AllowGroupToReadAndWriteResource",
  "groupPolicy": {
    "group": "group_members",
    "version": "1.0",
    "rules": [
      {
        "resource": "resource100",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "write",
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

#### Example 2: Deny Group Guests from Deleting a Resource

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "DenyGroupGuestsFromDeletingResource",
  "groupPolicy": {
    "group": "group_guests",
    "version": "1.1",
    "rules": [
      {
        "resource": "resource101",
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
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

#### Example 3: Conditional Allow for Group Managers to Approve Active Resources

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ConditionalAllowForGroupManagers",
  "groupPolicy": {
    "group": "group_managers",
    "version": "1.2",
    "rules": [
      {
        "resource": "resource102",
        "actions": [
          {
            "action": "approve",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
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
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 4: Notify on Unauthorized Update Attempt by Group Developers

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "NotifyOnUnauthorizedUpdateByDevelopers",
  "groupPolicy": {
    "group": "group_developers",
    "version": "1.3",
    "rules": [
      {
        "resource": "resource103",
        "actions": [
          {
            "action": "update",
            "effect": "EFFECT_DENY",
            "notify": {
              "service": "queue",
              "serviceConfig": {
                "queueName": "unauthorized-update-alerts"
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
    "createdBy": "adminUser"
  }
}'
```

#### Example 5: Allow Group Admins to Perform Multiple Actions with Derived Roles

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "AllowAdminsToPerformMultipleActions",
  "groupPolicy": {
    "group": "group_admins",
    "version": "1.4",
    "rules": [
      {
        "resource": "resource104",
        "actions": [
          {
            "action": "create",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "delete",
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
## Event Policy

Let's proceed with the next policy type: **Event Policy**.

### JSON Schema Overview for **Event Policy**

An **Event Policy** requires the following:

- **apiVersion**: Must be `"api.pola.dev/v2.5"`
- **eventPolicy**: An object containing:
  - **event**: A string, required.
  - **resource**: A string, required.
  - **version**: A string that matches the version pattern, required.
  - **rules**: An array of `EventRule` objects, defining:
    - **conditions**: A `Condition` object defining criteria for the event.
    - **actions**: An array of `EventRule.Action`, defining:
      - **action**: A string from a specific enum (`NOTIFY`, `LOG`, `ALERT`, `APPROVE`, `REVIEW`), required.
      - **effect**: A string, either `"EFFECT_ALLOW"` or `"EFFECT_DENY"`, required.
- **auditInfo**: An object containing:
  - **createdBy**: A string, required.

### cURL Examples for Creating Event Policies

#### Example 1: Log Access Events for a Resource

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "LogAccessEventsForResource",
  "eventPolicy": {
    "event": "access_attempt",
    "resource": "resource200",
    "version": "1.0",
    "rules": [
      {
        "conditions": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.status !== 'archived'" }
              ]
            }
          }
        },
        "actions": [
          {
            "action": "LOG",
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

#### Example 2: Notify on Unauthorized Modification Attempt

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "NotifyOnUnauthorizedModification",
  "eventPolicy": {
    "event": "modification_attempt",
    "resource": "resource201",
    "version": "1.1",
    "rules": [
      {
        "conditions": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.role !== 'admin'" }
              ]
            }
          }
        },
        "actions": [
          {
            "action": "NOTIFY",
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

#### Example 3: Approve Changes if All Conditions Met

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ApproveChangesIfConditionsMet",
  "eventPolicy": {
    "event": "change_request",
    "resource": "resource202",
    "version": "1.2",
    "rules": [
      {
        "conditions": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.role === 'manager'" },
                { "expr": "R.changeType === 'minor'" }
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

#### Example 4: Alert on High-Security Event Detection

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "AlertOnHighSecurityEvent",
  "eventPolicy": {
    "event": "security_breach",
    "resource": "resource203",
    "version": "1.3",
    "rules": [
      {
        "conditions": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.securityLevel === 'high'" }
              ]
            }
          }
        },
        "actions": [
          {
            "action": "ALERT",
            "effect": "EFFECT_ALLOW",
            "notify": {
              "service": "pubsub",
              "serviceConfig": {
                "topic": "security-alerts"
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
    "createdBy": "adminUser"
  }
}'
```

#### Example 5: Review All Access Requests for Sensitive Data

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ReviewAccessRequestsForSensitiveData",
  "eventPolicy": {
    "event": "access_request",
    "resource": "resource204",
    "version": "1.4",
    "rules": [
      {
        "conditions": {
          "match": {
            "all": {
              "of": [
                { "expr": "R.dataClassification === 'sensitive'" }
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
    "createdBy": "adminUser"
  }
}'
```
## Service Control Policy
Let's continue with the next policy type: **Service Control Policy**.

### JSON Schema Overview for **Service Control Policy**

A **Service Control Policy** requires the following:

- **apiVersion**: Must be `"api.pola.dev/v2.5"`
- **serviceControlPolicy**: An object containing:
  - **maxPermissions**: An array of strings, required.
  - **version**: A string that matches the version pattern, required.
  - **boundEntities**: An object defining:
    - **users**: An array of user identifiers.
    - **groups**: An array of group identifiers.
    - **roles**: An array of role identifiers.
    - **resources**: An array of resource identifiers.
- **auditInfo**: An object containing:
  - **createdBy**: A string, required.

### cURL Examples for Creating Service Control Policies

#### Example 1: Limit Permissions for Specific Users

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "LimitPermissionsForUsers",
  "serviceControlPolicy": {
    "maxPermissions": ["read", "list"],
    "version": "1.0",
    "boundEntities": {
      "users": ["user001", "user002"],
      "groups": [],
      "roles": [],
      "resources": []
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 2: Restrict Group Access to Specific Actions

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "RestrictGroupAccessToActions",
  "serviceControlPolicy": {
    "maxPermissions": ["view", "search"],
    "version": "1.1",
    "boundEntities": {
      "users": [],
      "groups": ["group123"],
      "roles": [],
      "resources": ["resource300"]
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 3: Limit Role-Based Permissions to Critical Resources

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "LimitRolePermissionsToCriticalResources",
  "serviceControlPolicy": {
    "maxPermissions": ["update", "delete"],
    "version": "1.2",
    "boundEntities": {
      "users": [],
      "groups": [],
      "roles": ["role_admin"],
      "resources": ["resource301", "resource302"]
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 4: Allow Minimal Permissions Across All Entities

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "AllowMinimalPermissionsAcrossEntities",
  "serviceControlPolicy": {
    "maxPermissions": ["read"],
    "version": "1.3",
    "boundEntities": {
      "users": ["user003"],
      "groups": ["group124"],
      "roles": ["role_user"],
      "resources": ["resource303"]
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 5: Enforce No Actions for Deprecated Resources

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "EnforceNoActionsOnDeprecatedResources",
  "serviceControlPolicy": {
    "maxPermissions": [],
    "version": "1.4",
    "boundEntities": {
      "users": [],
      "groups": [],
      "roles": [],
      "resources": ["resourceDeprecated1", "resourceDeprecated2"]
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```
## Derive Roles
Let's proceed with the next policy type: **Derived Roles**.

### JSON Schema Overview for **Derived Roles**

A **Derived Roles** policy requires the following:

- **apiVersion**: Must be `"api.pola.dev/v2.5"`
- **derivedRoles**: An object containing:
  - **name**: A string, required, that identifies the derived role set.
  - **definitions**: An array of `RoleDef` objects, required, defining:
    - **name**: A string representing the role name, required.
    - **parentRoles**: An array of strings representing parent roles, required.
    - **condition**: An optional `Condition` object to define specific conditions for this role.
- **auditInfo**: An object containing:
  - **createdBy**: A string, required.

### cURL Examples for Creating Derived Roles

#### Example 1: Define Basic Derived Role for a Support Team

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "SupportTeamDerivedRoles",
  "derivedRoles": {
    "name": "supportTeamRoles",
    "definitions": [
      {
        "name": "support_agent",
        "parentRoles": ["basic_user"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 2: Create Derived Role with Conditional Access Based on Attributes

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ConditionalDerivedRoleForManager",
  "derivedRoles": {
    "name": "conditionalRoles",
    "definitions": [
      {
        "name": "manager_access",
        "parentRoles": ["manager"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.department === 'sales'" },
                { "expr": "P.experienceYears > 5" }
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

#### Example 3: Define Multiple Derived Roles with Different Parent Roles

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "MultipleDerivedRoles",
  "derivedRoles": {
    "name": "projectRoles",
    "definitions": [
      {
        "name": "project_lead",
        "parentRoles": ["team_lead", "senior_developer"]
      },
      {
        "name": "project_contributor",
        "parentRoles": ["developer"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 4: Define Hierarchical Derived Roles with Conditions

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "HierarchicalDerivedRolesWithConditions",
  "derivedRoles": {
    "name": "hierarchicalRoles",
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

#### Example 5: Define Role-Based Access with Multiple Parent Roles and Conditions

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "RoleBasedAccessWithMultipleConditions",
  "derivedRoles": {
    "name": "customAccessRoles",
    "definitions": [
      {
        "name": "advanced_analyst",
        "parentRoles": ["analyst", "data_scientist"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.certification.includes('data_analytics')" },
                { "expr": "P.projects.includes('AI')" }
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
## Export Variables
Let's proceed with the next policy type: **Export Variables**.

### JSON Schema Overview for **Export Variables**

An **Export Variables** policy requires the following:

- **apiVersion**: Must be `"api.pola.dev/v2.5"`
- **exportVariables**: An object containing:
  - **name**: A string, required, identifying the exported variable set.
  - **definitions**: An object with additional properties where each key is a variable name and the value is a string defining the variable.
- **auditInfo**: An object containing:
  - **createdBy**: A string, required.

### cURL Examples for Creating Export Variables

#### Example 1: Export Basic Variables for Reporting

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "BasicExportVariablesForReporting",
  "exportVariables": {
    "name": "reportingVariables",
    "definitions": {
      "reportDate": "2024-08-28",
      "reportType": "quarterly",
      "reportOwner": "finance_team"
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 2: Define Export Variables for Access Control

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "AccessControlExportVariables",
  "exportVariables": {
    "name": "accessControlVariables",
    "definitions": {
      "maxLoginAttempts": "5",
      "sessionTimeout": "30m",
      "allowedIPRange": "192.168.1.0/24"
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 3: Export Variables for Workflow Automation

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "WorkflowAutomationExportVariables",
  "exportVariables": {
    "name": "workflowVariables",
    "definitions": {
      "approvalThreshold": "3",
      "autoEscalationEnabled": "true",
      "escalationContact": "ops_manager"
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 4: Export Variables for Resource Allocation

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "ResourceAllocationExportVariables",
  "exportVariables": {
    "name": "resourceAllocationVariables",
    "definitions": {
      "defaultStorageLimit": "100GB",
      "cpuAllocation": "4",
      "memoryAllocation": "16GB"
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```

#### Example 5: Define Export Variables for Custom Application Settings

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.5",
  "name": "CustomApplicationSettingsExportVariables",
  "exportVariables": {
    "name": "customAppSettings",
    "definitions": {
      "theme": "dark",
      "language": "en-US",
      "notificationFrequency": "daily"
    }
  },
  "auditInfo": {
    "createdBy": "adminUser"
  }
}'
```
