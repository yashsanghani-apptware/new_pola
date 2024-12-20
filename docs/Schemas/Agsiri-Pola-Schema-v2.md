
# Agsiri Pola Schema V2
## Overview 

The **Agsiri Pola Schema v2** represents an evolution of the Agsiri policy framework, designed to provide more flexible, powerful, and scalable tools for managing fine-grained access control in complex systems. This schema is built on the foundation established by earlier versions, enhancing it with new features and improvements to support modern enterprise needs.

### Key Features of Agsiri Pola Schema v2

- **Enhanced Conditions Framework**: The conditions framework now includes more robust support for logical operators (`all`, `any`, `none`, and `expr`), enabling the creation of more sophisticated and precise access control policies. This allows policy writers to define complex scenarios with ease, ensuring that access is only granted under specific, well-defined conditions.

- **Introduction of `Notify` Object**: One of the significant additions in v2 is the `Notify` object. This feature allows for seamless integration with various notification services such as web services, Pub/Sub systems, and queuing services like Kafka and RabbitMQ. The `Notify` object can be configured to send notifications based on the evaluation of policy conditions, providing real-time feedback and integrations with external systems.

- **Expanded Schema Definitions**: The schema definitions have been expanded to include the `Notify` object, which works similarly to the existing `Output` object but is specifically designed for handling notifications. The schema also supports defining the structure and expected payloads for notifications, leveraging the power of JSON Schemas to ensure data integrity and consistency.

- **Improved Metadata Handling**: Metadata management has been further refined, allowing for more detailed annotations and better control over the audit trail of policies. This enhancement ensures that policies are not only effective but also maintainable and auditable, meeting the stringent requirements of regulatory compliance.

- **More Granular Control Over Derived Roles and Export Variables**: The schema now offers more nuanced control over derived roles and export variables, allowing these elements to be defined and used more flexibly across policies. This addition enables more dynamic and context-aware policy enforcement, tailored to the specific needs of different organizational environments.

- **Integration with Advanced Notification Services**: The schema's ability to integrate with advanced notification services enhances the responsiveness and adaptability of the Agsiri policy framework, making it easier to build systems that can react dynamically to changes in state or context.

### Summary of Additions in Agsiri Pola Schema v2

1. **`Notify` Object**: Added to support the configuration and dispatch of notifications to various services based on policy evaluations.

2. **Logical Operators Expansion**: Enhanced condition support with logical operators and more complex expression handling.

3. **Schema Management Enhancements**: Expanded schema definitions for better control over notification payloads and metadata.

4. **Metadata and Audit Trail Improvements**: More detailed metadata handling for enhanced policy management and auditability.

5. **Integration with Notification Services**: Native support for integration with web services, Pub/Sub systems, and message queues like Kafka and RabbitMQ.

The Agsiri Pola Schema v2 is designed to offer a more comprehensive and powerful toolset for policy management, providing the flexibility and control needed to secure modern, complex environments while ensuring that policies remain transparent, auditable, and adaptable.

```json
{
  "$id": "https://api.agsiri.dev/v1.3.2/agsiri/policy/v1/policy.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "agsiri.policy.v1.Condition": {
      "allOf": [
        {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "match": {
              "$ref": "#/definitions/agsiri.policy.v1.Match"
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
    "agsiri.policy.v1.DerivedRoles": {
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
            "$ref": "#/definitions/agsiri.policy.v1.RoleDef"
          },
          "minItems": 1
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "pattern": "^[\\-\\.0-9A-Z_a-z]+$"
        },
        "variables": {
          "$ref": "#/definitions/agsiri.policy.v1.Variables"
        }
      }
    },
    "agsiri.policy.v1.ExportVariables": {
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
    "agsiri.policy.v1.Match": {
      "allOf": [
        {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "all": {
              "$ref": "#/definitions/agsiri.policy.v1.Match.ExprList"
            },
            "any": {
              "$ref": "#/definitions/agsiri.policy.v1.Match.ExprList"
            },
            "expr": {
              "type": "string"
            },
            "none": {
              "$ref": "#/definitions/agsiri.policy.v1.Match.ExprList"
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
    "agsiri.policy.v1.Match.ExprList": {
      "type": "object",
      "required": [
        "of"
      ],
      "additionalProperties": false,
      "properties": {
        "of": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/agsiri.policy.v1.Match"
          },
          "minItems": 1
        }
      }
    },
    "agsiri.policy.v1.Metadata": {
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
          "$ref": "#/definitions/agsiri.policy.v1.SourceAttributes"
        },
        "sourceFile": {
          "type": "string"
        },
        "storeIdentifer": {
          "type": "string"
        },
        "storeIdentifier": {
          "type": "string"
        }
      }
    },
    "agsiri.policy.v1.Output": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "expr": {
          "type": "string"
        },
        "when": {
          "$ref": "#/definitions/agsiri.policy.v1.Output.When"
        }
      }
    },
    "agsiri.policy.v1.Output.When": {
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
    "agsiri.policy.v1.Notify": {
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
          "$ref": "#/definitions/agsiri.policy.v1.Schemas.Schema"
        },
        "when": {
          "$ref": "#/definitions/agsiri.policy.v1.Notify.When"
        }
      }
    },
    "agsiri.policy.v1.Notify.When": {
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
    "agsiri.policy.v1.PrincipalPolicy": {
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
            "$ref": "#/definitions/agsiri.policy.v1.PrincipalRule"
          }
        },
        "scope": {
          "type": "string",
          "pattern": "^([0-9A-Za-z][\\-0-9A-Z_a-z]*(\\.[\\-0-9A-Z_a-z]*)*)*$"
        },
        "variables": {
          "$ref": "#/definitions/agsiri.policy.v1.Variables"
        },
        "version": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)*$"
        }
      }
    },
    "agsiri.policy.v1.PrincipalRule": {
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
            "$ref": "#/definitions/agsiri.policy.v1.PrincipalRule.Action"
          },
          "minItems": 1
        },
        "resource": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "agsiri.policy.v1.PrincipalRule.Action": {
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
          "$ref": "#/definitions/agsiri.policy.v1.Condition"
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
          "$ref": "#/definitions/agsiri.policy.v1.Output"
        },
        "notify": {
          "$ref": "#/

definitions/agsiri.policy.v1.Notify"
        }
      }
    },
    "agsiri.policy.v1.ResourcePolicy": {
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
            "$ref": "#/definitions/agsiri.policy.v1.ResourceRule"
          }
        },
        "schemas": {
          "$ref": "#/definitions/agsiri.policy.v1.Schemas"
        },
        "scope": {
          "type": "string",
          "pattern": "^([0-9A-Za-z][\\-0-9A-Z_a-z]*(\\.[\\-0-9A-Z_a-z]*)*)*$"
        },
        "variables": {
          "$ref": "#/definitions/agsiri.policy.v1.Variables"
        },
        "version": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)*$"
        }
      }
    },
    "agsiri.policy.v1.ResourceRule": {
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
          "$ref": "#/definitions/agsiri.policy.v1.Condition"
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
          "$ref": "#/definitions/agsiri.policy.v1.Output"
        },
        "notify": {
          "$ref": "#/definitions/agsiri.policy.v1.Notify"
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
    "agsiri.policy.v1.RoleDef": {
      "type": "object",
      "required": [
        "name",
        "parentRoles"
      ],
      "additionalProperties": false,
      "properties": {
        "condition": {
          "$ref": "#/definitions/agsiri.policy.v1.Condition"
        },
        "name": {
          "type": "string",
          "pattern": "^[\\-\\.0-9A-Z_a_z]+$"
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
    "agsiri.policy.v1.Schemas": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "principalSchema": {
          "$ref": "#/definitions/agsiri.policy.v1.Schemas.Schema"
        },
        "resourceSchema": {
          "$ref": "#/definitions/agsiri.policy.v1.Schemas.Schema"
        }
      }
    },
    "agsiri.policy.v1.Schemas.IgnoreWhen": {
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
    "agsiri.policy.v1.Schemas.Schema": {
      "type": "object",
      "required": [
        "ref"
      ],
      "additionalProperties": false,
      "properties": {
        "ignoreWhen": {
          "$ref": "#/definitions/agsiri.policy.v1.Schemas.IgnoreWhen"
        },
        "ref": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "agsiri.policy.v1.SourceAttributes": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "attributes": {
          "type": "object",
          "additionalProperties": false 
        }
      }
    },
    "agsiri.policy.v1.Variables": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "import": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^[\\-\\.0-9A-Z_a_z]+$"
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
    "agsiri.policy.v1.AuditInfo": {
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
          "const": "api.agsiri.dev/v1"
        },
        "derivedRoles": {
          "$ref": "#/definitions/agsiri.policy.v1.DerivedRoles"
        },
        "description": {
          "type": "string"
        },
        "name": {
          "type": "string",
          "pattern": "^[\\-\\.0-9A-Z_a_z]+$"
        },
        "disabled": {
          "type": "boolean"
        },
        "exportVariables": {
          "$ref": "#/definitions/agsiri.policy.v1.ExportVariables"
        },
        "metadata": {
          "$ref": "#/definitions/agsiri.policy.v1.Metadata"
        },
        "principalPolicy": {
          "$ref": "#/definitions/agsiri.policy.v1.PrincipalPolicy"
        },
        "resourcePolicy": {
          "$ref": "#/definitions/agsiri.policy.v1.ResourcePolicy"
        },
        "auditInfo": {
          "$ref": "#/definitions/agsiri.policy.v1.AuditInfo"
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
            "derivedRoles"
          ]
        },
        {
          "type": "object",
          "required": [
            "exportVariables"
          ]
        }
      ]
    }
  ]
}
```

### Explanation of the Updates

1. **`agsiri.policy.v1.Notify` Definition**:
   - Added a new `Notify` object definition with properties for `service`, `serviceConfig`, `payloadSchema`, and `when`. This definition allows notifications to be configured similarly to outputs but tailored for different types of notification services.

2. **`agsiri.policy.v1.PrincipalRule.Action` and `agsiri.policy.v1.ResourceRule`**:
   - Added the `notify` property to the `PrincipalRule.Action` and `ResourceRule` objects, allowing notifications to be configured within actions and rules.

3. **`agsiri.policy.v1.Notify.When` Definition**:
   - Defined conditions under which notifications should be sent, such as when a condition is met (`conditionMet`) or when a rule is activated (`ruleActivated`).

This updated schema now supports the `Notify` feature, enabling the sending of notifications based on policy conditions across various services, such as web services, Pub/Sub systems, and message queues.
