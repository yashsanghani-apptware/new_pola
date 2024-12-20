### Updated Pola Schema with Integration of `eventPolicy`

The updated Pola Schema now includes the `eventPolicy` type, which is integrated alongside the existing policy types. Below is the full schema with the new `eventPolicy` structure.

```json
{
  "$id": "https://api.pola.dev/v1.3.3/agsiri/policy/v1/policy.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "pola.policy.v1.Condition": {
      "allOf": [
        {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "match": {
              "$ref": "#/definitions/pola.policy.v1.Match"
            },
            "script": {
              "type": "string"
            }
          }
        },
        {
          "oneOf": [
            {
              "type": "object",
              "required": [
                "match"
              ]
            },
            {
              "type": "object",
              "required": [
                "script"
              ]
            }
          ]
        }
      ]
    },
    "pola.policy.v1.DerivedRoles": {
      "type": "object",
      "required": [
        "name",
        "definitions"
      ],
      "additionalProperties": false,
      "properties": {
        "definitions": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/pola.policy.v1.RoleDef"
          },
          "minItems": 1
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "pattern": "^[\\-\\.0-9A-Z_a-z]+$"
        },
        "variables": {
          "$ref": "#/definitions/pola.policy.v1.Variables"
        }
      }
    },
    "pola.policy.v1.ExportVariables": {
      "type": "object",
      "required": [
        "name"
      ],
      "additionalProperties": false,
      "properties": {
        "definitions": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "pattern": "^[\\-\\.0-9A-Z_a-z]+$"
        }
      }
    },
    "pola.policy.v1.Match": {
      "allOf": [
        {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "all": {
              "$ref": "#/definitions/pola.policy.v1.Match.ExprList"
            },
            "any": {
              "$ref": "#/definitions/pola.policy.v1.Match.ExprList"
            },
            "expr": {
              "type": "string"
            },
            "none": {
              "$ref": "#/definitions/pola.policy.v1.Match.ExprList"
            }
          }
        },
        {
          "oneOf": [
            {
              "type": "object",
              "required": [
                "all"
              ]
            },
            {
              "type": "object",
              "required": [
                "any"
              ]
            },
            {
              "type": "object",
              "required": [
                "none"
              ]
            },
            {
              "type": "object",
              "required": [
                "expr"
              ]
            }
          ]
        }
      ]
    },
    "pola.policy.v1.Match.ExprList": {
      "type": "object",
      "required": [
        "of"
      ],
      "additionalProperties": false,
      "properties": {
        "of": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/pola.policy.v1.Match"
          },
          "minItems": 1
        }
      }
    },
    "pola.policy.v1.Metadata": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "annotations": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        },
        "hash": {
          "oneOf": [
            {
              "type": "integer",
              "minimum": 0
            },
            {
              "type": "string",
              "pattern": "^(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?$"
            }
          ]
        },
        "sourceAttributes": {
          "$ref": "#/definitions/pola.policy.v1.SourceAttributes"
        },
        "sourceFile": {
          "type": "string"
        },
        "storeIdentifier": {
          "type": "string"
        }
      }
    },
    "pola.policy.v1.Output": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "expr": {
          "type": "string"
        },
        "when": {
          "$ref": "#/definitions/pola.policy.v1.Output.When"
        }
      }
    },
    "pola.policy.v1.Output.When": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "conditionNotMet": {
          "type": "string"
        },
        "ruleActivated": {
          "type": "string"
        }
      }
    },
    "pola.policy.v1.Notify": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "service": {
          "type": "string",
          "enum": ["webservice", "pubsub", "queue"]
        },
        "serviceConfig": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "format": "uri"
            },
            "method": {
              "type": "string",
              "enum": ["POST", "PUT"]
            },
            "headers": {
              "type": "object",
              "additionalProperties": {
                "type": "string"
              }
            },
            "topic": {
              "type": "string"
            },
            "queueName": {
              "type": "string"
            },
            "messageGroupId": {
              "type": "string"
            }
          },
          "oneOf": [
            {
              "required": ["url", "method"]
            },
            {
              "required": ["topic"]
            },
            {
              "required": ["queueName"]
            }
          ]
        },
        "payloadSchema": {
          "$ref": "#/definitions/pola.policy.v1.Schemas.Schema"
        },
        "when": {
          "$ref": "#/definitions/pola.policy.v1.Notify.When"
        }
      }
    },
    "pola.policy.v1.Notify.When": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "conditionMet": {
          "type": "string"
        },
        "ruleActivated": {
          "type": "string"
        }
      }
    },
    "pola.policy.v1.PrincipalPolicy": {
      "type": "object",
      "required": [
        "principal",
        "version"
      ],
      "additionalProperties": false,
      "properties": {
        "principal": {
          "type": "string",
          "minLength": 1
        },
        "rules": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/pola.policy.v1.PrincipalRule"
          }
        },
        "scope": {
          "type": "string",
          "pattern": "^([0-9A-Za-z][\\-0-9A-Z_a-z]*(\\.[\\-0-9A-Z_a-z]*)*)*$"
        },
        "variables": {
          "$ref": "#/definitions/pola.policy.v1.Variables"
        },
        "version": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)*$"
        }
      }
    },
    "pola.policy.v1.PrincipalRule": {
      "type": "object",
      "required": [
        "resource",
        "actions"
      ],
      "additionalProperties": false,
      "properties": {
        "actions": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/pola.policy.v1.PrincipalRule.Action"
          },
          "minItems": 1
        },
        "resource": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "pola.policy.v1.PrincipalRule.Action": {
      "type": "object",
      "required": [
        "action",
        "effect"
      ],
      "additionalProperties": false,
      "properties": {
        "action": {
          "type": "string",
          "minLength": 1
        },
        "condition": {
          "$ref": "#/definitions/pola.policy.v1.Condition"
        },
        "effect": {
          "type": "string",
          "enum": [
            "EFFECT_ALLOW",
            "EFFECT_DENY"
          ]
        },
        "name": {
          "type": "string",
          "pattern": "^([A-Za-z][\\-\\.0-9@-Z_a-z]*)*$"
        },
        "output": {
          "$ref": "#/definitions/pola.policy.v1.Output"
        },
        "notify": {
          "$ref": "#/

definitions/pola.policy.v1.Notify"
        }
      }
    },
    "pola.policy.v1.ResourcePolicy": {
      "type": "object",
      "required": [
        "resource",
        "version"
      ],
      "additionalProperties": false,
      "properties": {
        "importDerivedRoles": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^[\\-\\.0-9A-Z_a-z]+$"
          },
          "uniqueItems": true
        },
        "resource": {
          "type": "string",
          "minLength": 1
        },
        "rules": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/pola.policy.v1.ResourceRule"
          }
        },
        "schemas": {
          "$ref": "#/definitions/pola.policy.v1.Schemas"
        },
        "scope": {
          "type": "string",
          "pattern": "^([0-9A-Za-z][\\-0-9A-Z_a-z]*(\\.[\\-0-9A-Z_a-z]*)*)*$"
        },
        "variables": {
          "$ref": "#/definitions/pola.policy.v1.Variables"
        },
        "version": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)*$"
        }
      }
    },
    "pola.policy.v1.ResourceRule": {
      "type": "object",
      "required": [
        "actions",
        "effect"
      ],
      "additionalProperties": false,
      "properties": {
        "actions": {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1
          },
          "minItems": 1,
          "uniqueItems": true
        },
        "condition": {
          "$ref": "#/definitions/pola.policy.v1.Condition"
        },
        "derivedRoles": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^[\\-\\.0-9A-Z_a-z]+$"
          },
          "uniqueItems": true
        },
        "effect": {
          "type": "string",
          "enum": [
            "EFFECT_ALLOW",
            "EFFECT_DENY"
          ]
        },
        "name": {
          "type": "string",
          "pattern": "^([A-Za-z][\\-\\.0-9@-Z_a-z]*)*$"
        },
        "output": {
          "$ref": "#/definitions/pola.policy.v1.Output"
        },
        "notify": {
          "$ref": "#/definitions/pola.policy.v1.Notify"
        },
        "roles": {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1
          },
          "uniqueItems": true
        }
      }
    },
    "pola.policy.v1.RolePolicy": {
      "type": "object",
      "required": [
        "role",
        "version"
      ],
      "additionalProperties": false,
      "properties": {
        "role": {
          "type": "string",
          "minLength": 1
        },
        "rules": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/pola.policy.v1.RoleRule"
          }
        },
        "scope": {
          "type": "string",
          "pattern": "^([0-9A-Za-z][\\-0-9A-Z_a-z]*(\\.[\\-0-9A-Z_a-z]*)*)*$"
        },
        "variables": {
          "$ref": "#/definitions/pola.policy.v1.Variables"
        },
        "version": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)*$"
        }
      }
    },
    "pola.policy.v1.RoleRule": {
      "type": "object",
      "required": [
        "resource",
        "actions"
      ],
      "additionalProperties": false,
      "properties": {
        "actions": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/pola.policy.v1.RoleRule.Action"
          },
          "minItems": 1
        },
        "resource": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "pola.policy.v1.RoleRule.Action": {
      "type": "object",
      "required": [
        "action",
        "effect"
      ],
      "additionalProperties": false,
      "properties": {
        "action": {
          "type": "string",
          "minLength": 1
        },
        "condition": {
          "$ref": "#/definitions/pola.policy.v1.Condition"
        },
        "effect": {
          "type": "string",
          "enum": [
            "EFFECT_ALLOW",
            "EFFECT_DENY"
          ]
        },
        "name": {
          "type": "string",
          "pattern": "^([A-Za-z][\\-\\.0-9@-Z_a-z]*)*$"
        },
        "output": {
          "$ref": "#/definitions/pola.policy.v1.Output"
        },
        "notify": {
          "$ref": "#/definitions/pola.policy.v1.Notify"
        }
      }
    },
    "pola.policy.v1.GroupPolicy": {
      "type": "object",
      "required": [
        "group",
        "version"
      ],
      "additionalProperties": false,
      "properties": {
        "group": {
          "type": "string",
          "minLength": 1
        },
        "rules": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/pola.policy.v1.GroupRule"
          }
        },
        "scope": {
          "type": "string",
          "pattern": "^([0-9A-Za-z][\\-0-9A-Z_a-z]*(\\.[\\-0-9A-Z_a-z]*)*)*$"
        },
        "variables": {
          "$ref": "#/definitions/pola.policy.v1.Variables"
        },
        "version": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)*$"
        }
      }
    },
    "pola.policy.v1.GroupRule": {
      "type": "object",
      "required": [
        "resource",
        "actions"
      ],
      "additionalProperties": false,
      "properties": {
        "actions": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/pola.policy.v1.GroupRule.Action"
          },
          "minItems": 1
        },
        "resource": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "pola.policy.v1.GroupRule.Action": {
      "type": "object",
      "required": [
        "action",
        "effect"
      ],
      "additionalProperties": false,
      "properties": {
        "action": {
          "type": "string",
          "minLength": 1
        },
        "condition": {
          "$ref": "#/definitions/pola.policy.v1.Condition"
        },
        "effect": {
          "type": "string",
          "enum": [
            "EFFECT_ALLOW",
            "EFFECT_DENY"
          ]
        },
        "name": {
          "type": "string",
          "pattern": "^([A-Za-z][\\-\\.0-9@-Z_a-z]*)*$"
        },
        "output": {
          "$ref": "#/definitions/pola.policy.v1.Output"
        },
        "notify": {
          "$ref": "#/definitions/pola.policy.v1.Notify"
        }
      }
    },
    "pola.policy.v1.RoleDef": {
      "type": "object",
      "required": [
        "name",
        "parentRoles"
      ],
      "additionalProperties": false,
      "properties": {
        "condition": {
          "$ref": "#/definitions/pola.policy.v1.Condition"
        },
        "name": {
          "type": "string",
          "pattern": "^[\\-\\.0-9A-Z_a-z]+$"
        },
        "parentRoles": {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1
          },
          "minItems": 1,
          "uniqueItems": true
        }
      }
    },
    "pola.policy.v1.Schemas": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "principalSchema": {
          "$ref": "#/definitions/pola.policy.v1.Schemas.Schema"
        },
        "resourceSchema": {
          "$ref": "#/definitions/pola.policy.v1.Schemas.Schema"
        }
      }
    },
    "pola.policy.v1.Schemas.IgnoreWhen": {
      "type": "object",
      "required": [
        "actions"
      ],
      "additionalProperties": false,
      "properties": {
        "actions": {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1
          },
          "minItems": 1,
          "uniqueItems": true


        }
      }
    },
    "pola.policy.v1.Schemas.Schema": {
      "type": "object",
      "required": [
        "ref"
      ],
      "additionalProperties": false,
      "properties": {
        "ignoreWhen": {
          "$ref": "#/definitions/pola.policy.v1.Schemas.IgnoreWhen"
        },
        "ref": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "pola.policy.v1.SourceAttributes": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "attributes": {
          "type": "object",
          "additionalProperties": false 
        }
      }
    },
    "pola.policy.v1.Variables": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "import": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^[\\-\\.0-9A-Z_a-z]+$"
          },
          "uniqueItems": true
        },
        "local": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    },
    "pola.policy.v1.AuditInfo": {
      "type": "object",
      "required": ["createdBy"],
      "additionalProperties": false,
      "properties": {
        "createdBy": {
          "type": "string"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        },
        "updatedBy": {
          "type": "string"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "pola.policy.v1.EventPolicy": {
      "type": "object",
      "required": [
        "event",
        "version"
      ],
      "additionalProperties": false,
      "properties": {
        "event": {
          "type": "string",
          "minLength": 1
        },
        "actions": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1
        },
        "conditions": {
          "$ref": "#/definitions/pola.policy.v1.Condition"
        },
        "version": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)*$"
        }
      }
    }
  },
  "allOf": [
    {
      "type": "object",
      "required": [
        "apiVersion"
      ],
      "additionalProperties": false,
      "properties": {
        "$schema": {
          "type": "string"
        },
        "apiVersion": {
          "type": "string",
          "const": "api.pola.dev/v1"
        },
        "derivedRoles": {
          "$ref": "#/definitions/pola.policy.v1.DerivedRoles"
        },
        "description": {
          "type": "string"
        },
        "name": {
          "type": "string",
          "pattern": "^[\\-\\.0-9A-Z_a-z]+$"
        },
        "disabled": {
          "type": "boolean"
        },
        "exportVariables": {
          "$ref": "#/definitions/pola.policy.v1.ExportVariables"
        },
        "metadata": {
          "$ref": "#/definitions/pola.policy.v1.Metadata"
        },
        "principalPolicy": {
          "$ref": "#/definitions/pola.policy.v1.PrincipalPolicy"
        },
        "resourcePolicy": {
          "$ref": "#/definitions/pola.policy.v1.ResourcePolicy"
        },
        "rolePolicy": {
          "$ref": "#/definitions/pola.policy.v1.RolePolicy"
        },
        "groupPolicy": {
          "$ref": "#/definitions/pola.policy.v1.GroupPolicy"
        },
        "eventPolicy": {
          "$ref": "#/definitions/pola.policy.v1.EventPolicy"
        },
        "auditInfo": {
          "$ref": "#/definitions/pola.policy.v1.AuditInfo"
        },
        "variables": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    },
    {
      "oneOf": [
        {
          "type": "object",
          "required": [
            "resourcePolicy"
          ]
        },
        {
          "type": "object",
          "required": [
            "principalPolicy"
          ]
        },
        {
          "type": "object",
          "required": [
            "rolePolicy"
          ]
        },
        {
          "type": "object",
          "required": [
            "groupPolicy"
          ]
        },
        {
          "type": "object",
          "required": [
            "derivedRoles"
          ]
        },
        {
          "type": "object",
          "required": [
            "exportVariables"
          ]
        },
        {
          "type": "object",
          "required": [
            "eventPolicy"
          ]
        }
      ]
    }
  ]
}
```

### Detailed Developer Guide on Pola Schema with Use Examples

#### Introduction

The Pola Schema defines a comprehensive policy framework that supports a wide range of security and management policies within a system. With the integration of `eventPolicy`, the framework is now capable of handling event-driven scenarios, allowing actions to be triggered based on specific events, which can be conditioned and customized according to the needs of the organization.

This guide provides a detailed overview of the Pola Schema, including practical examples to help developers understand and implement policies effectively.

#### Key Components of the Schema

1. **Policy Types:**
   - **Principal Policy:** Defines permissions for specific principals (e.g., users, roles, or groups).
   - **Resource Policy:** Specifies the rules for accessing resources within the system.
   - **Role Policy:** Manages permissions at the role level.
   - **Group Policy:** Applies rules to groups of users or other entities.
   - **Derived Roles:** Allows for dynamic role creation based on conditions.
   - **Export Variables:** Exports variables for use in other policies or external systems.
   - **Event Policy:** Introduced to manage actions triggered by specific events within the system.

2. **Common Attributes:**
   - **apiVersion:** Specifies the version of the policy API.
   - **metadata:** Contains additional metadata like annotations, hashes, and source information.
   - **auditInfo:** Tracks the creation and modification of the policy.
   - **variables:** Local or imported variables that are used within the policy.

#### Event Policy: The New Addition

The `eventPolicy` type is designed to handle event-driven actions within the Pola system. This policy type allows you to define specific events that, when triggered, can execute actions under certain conditions. It is highly flexible and can be used for a variety of scenarios, from simple notifications to complex workflows.

##### Event Policy Schema

The `eventPolicy` is defined with the following key attributes:
- **event:** The event that triggers the policy.
- **actions:** A list of actions to be taken when the event occurs.
- **conditions:** Optional conditions that must be met for the actions to be executed.
- **version:** The version of the event policy.

#### Practical Use Cases and Examples

##### Example 1: Simple Principal Policy

This example defines a basic principal policy for a user named "JohnDoe" who is allowed to read a resource only if the user is within a certain time window.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "principalPolicy": {
    "principal": "user:JohnDoe",
    "version": "1.0",
    "rules": [
      {
        "resource": "resource:documents",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "P.time >= '09:00' && P.time <= '17:00'"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

##### Example 2: Resource Policy with Derived Roles

In this example, a resource policy is defined with derived roles that allow only managers to delete a resource.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "resourcePolicy": {
    "resource": "resource:project-files",
    "version": "2.0",
    "rules": [
      {
        "actions": ["delete"],
        "effect": "EFFECT_ALLOW",
        "derivedRoles": ["manager"]
      }
    ]
  },
  "derivedRoles": {
    "name": "manager",
    "definitions": [
      {
        "name": "SeniorManager",
        "parentRoles": ["Manager"],
        "condition": {
          "match": {
            "expr": "P.experience > 5"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

##### Example 3: Event Policy with Conditions

This example demonstrates how an event policy is set up to trigger a notification when a file is uploaded to a specific directory.

```json
{
  "apiVersion": "api.pola.dev

/v1",
  "eventPolicy": {
    "event": "file:uploaded",
    "version": "1.1",
    "actions": ["notify_admin"],
    "conditions": {
      "match": {
        "expr": "R.directory == '/secure/uploads'"
      }
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

In this example, the `eventPolicy` triggers the `notify_admin` action only when a file is uploaded to the `/secure/uploads` directory.

#### Advanced Use Case: Combining Multiple Policies

Pola allows you to combine different policy types to create complex security frameworks. Below is an advanced example that integrates principal, resource, and event policies.

##### Scenario: Secure File Management System

- **Principal Policy:** Only users with the "editor" role can edit files.
- **Resource Policy:** Files in the "secure" directory can only be accessed by managers.
- **Event Policy:** Notify admins if an unauthorized attempt is made to delete a file.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "principalPolicy": {
    "principal": "role:editor",
    "version": "1.0",
    "rules": [
      {
        "resource": "resource:files",
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "resourcePolicy": {
    "resource": "resource:secure-files",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read", "write"],
        "effect": "EFFECT_ALLOW",
        "roles": ["manager"]
      }
    ]
  },
  "eventPolicy": {
    "event": "file:delete_attempt",
    "version": "1.0",
    "actions": ["notify_admin"],
    "conditions": {
      "match": {
        "expr": "P.user_role != 'manager'"
      }
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

### Conclusion

The Pola Schema, now extended with `eventPolicy`, offers a versatile and powerful framework for managing security, permissions, and events within a system. By leveraging the flexibility of JSON schema and the precision of conditions and actions, developers can create robust policies that cover a wide range of scenarios.

Whether you are managing simple user permissions or orchestrating complex event-driven workflows, the Pola Schema provides the tools and structure necessary to implement and enforce your organization's policies effectively.

This guide, with its practical examples, should serve as a comprehensive reference for developers working with Pola policies.
