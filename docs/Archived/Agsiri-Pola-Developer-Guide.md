# Agsiri Policy Developers Manual

This manual is a comprehensive guide for policy developers working with the Agsiri platform. It covers the various components and interfaces required to define, validate, and evaluate policies, including Principal and Resource Policies, Derived Roles, Export Variables, Conditions, Outputs, Schemas, Metadata, Rules, Actions, and more. By following the step-by-step explanations and examples provided, developers will gain a deep understanding of how to build robust and effective policies that meet their specific requirements.

---

## 1. Introduction to Agsiri Policies

Agsiri policies are designed to control access to resources based on a wide range of criteria. These policies are composed of several key components, each of which plays a specific role in determining whether access should be allowed or denied. The two primary types of policies are:

- **Principal Policies**: These policies define access rules for specific principals (e.g., users, groups).
- **Resource Policies**: These policies define access rules for specific resources (e.g., files, databases).

Additionally, policies can include Derived Roles, Export Variables, Conditions, Outputs, and Schemas, all of which are crucial for creating flexible and powerful access control mechanisms.

---

## 2. Principal Policies

### 2.1 Defining Principal Policies

A Principal Policy specifies rules that apply to a particular principal, such as a user or a group of users. Each Principal Policy is identified by a unique `principal` field and can contain multiple rules that define which actions the principal is allowed to perform on specified resources.

### Example: Basic Principal Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "john_doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "document:12345",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "edit",
            "effect": "EFFECT_DENY"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Principal**: Specifies the user `john_doe`.
- **Rules**: Defines that `john_doe` is allowed to `view` the document but is denied the `edit` action.
- **Audit Info**: Required metadata for tracking the creation of the policy.

### 2.2 Variables in Principal Policies

Principal Policies can utilize both local and imported variables to make the rules more flexible and reusable.

### Example: Using Variables

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "john_doe",
    "version": "1.0",
    "variables": {
      "local": {
        "is_weekend": "now().getDayOfWeek() > 5"
      }
    },
    "rules": [
      {
        "resource": "document:12345",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "V.is_weekend"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Local Variables**: The variable `is_weekend` is defined to check if the current day is a weekend.
- **Condition**: The `view` action is only allowed if the request is made on a weekend.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

## 3. Resource Policies

### 3.1 Defining Resource Policies

Resource Policies control access to specific resources and are identified by the `resource` field. These policies can contain multiple rules that determine what actions can be performed on the resource and under what conditions.

### Example: Basic Resource Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "project:alpha",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["manager"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Resource**: Specifies the resource `project:alpha`.
- **Rules**: Grants `view` and `edit` actions to users with the `manager` role.
- **Audit Info**: Required metadata for tracking the creation of the policy.

### 3.2 Advanced Resource Policies with Conditions

Conditions in Resource Policies allow for more granular control by specifying when a rule should apply based on attributes of the resource or the principal.

### Example: Resource Policy with Conditions

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "project:alpha",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["manager"],
        "condition": {
          "match": {
            "expr": "R.attr.confidential == false"
          }
        }
      },
      {
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["manager"],
        "condition": {
          "match": {
            "expr": "R.attr.locked == true"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Condition for View**: The `view` action is only allowed if the `confidential` attribute of the resource is `false`.
- **Condition for Edit**: The `edit` action is denied if the `locked` attribute of the resource is `true`.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

## 4. Derived Roles

Derived Roles are a powerful feature that allows you to define roles dynamically based on conditions or existing roles. This enables more flexible role assignments that adapt to the current context.

### 4.1 Defining Derived Roles

A Derived Role is defined by specifying a name and the roles from which it is derived, along with any conditions that must be met.

### Example: Defining a Derived Role

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "project_manager",
    "definitions": [
      {
        "name": "manager",
        "parentRoles": ["senior_employee"],
        "condition": {
          "match": {
            "expr": "P.attr.department == 'management'"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Derived Role**: The `project_manager` role is derived from the `senior_employee` role, but only if the principal’s department is `management`.
- **Audit Info**: Required metadata for tracking the creation of the policy.

### 4.2 Using Derived Roles in Policies

Once defined, Derived Roles can be used in both Principal and Resource Policies to grant or deny actions based on the dynamic role assignment.

### Example: Using Derived Roles

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "project:alpha",
    "version": "1.0",
    "importDerivedRoles": ["project_manager"],
    "rules": [
      {
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["project_manager"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Importing Derived Roles**: The `project_manager` role is imported and used to allow the `edit` action on the resource.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

## 5. Export Variables

Export Variables enable you to define variables in a central location and reuse them across multiple policies. This reduces duplication and makes it easier to manage and update policies.

### 5.1 Defining Export Variables

Export Variables are defined in a separate policy file and can include any number of key-value pairs.

### Example: Def

ining Export Variables

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "exportVariables": {
    "name": "common_variables",
    "definitions": {
      "is_weekend": "now().getDayOfWeek() > 5",
      "admin_email": "\"admin@example.com\""
    }
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Export Variables**: The variable `is_weekend` checks if the current day is a weekend, and `admin_email` stores the administrator’s email address.
- **Audit Info**: Required metadata for tracking the creation of the policy.

### 5.2 Importing and Using Export Variables

Once defined, these variables can be imported and used in any policy.

### Example: Using Export Variables

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "john_doe",
    "version": "1.0",
    "variables": {
      "import": ["common_variables"]
    },
    "rules": [
      {
        "resource": "document:12345",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "V.is_weekend"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Importing Variables**: The `is_weekend` variable is imported from `common_variables` and used to determine if the `view` action should be allowed.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

## 6. Outputs

Outputs in Agsiri policies are expressions evaluated when a policy rule is either fully or partially activated. These outputs can be used to provide feedback, trigger actions, or integrate with external systems.

### 6.1 Defining Outputs

Outputs are defined within a policy rule and specify what should happen when the rule is activated or when the condition is not met.

### Example: Defining Outputs

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "system_access",
    "version": "1.0",
    "rules": [
      {
        "name": "working-hours-only",
        "actions": [
          {
            "action": "*",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["*"],
        "condition": {
          "match": {
            "expr": "now().getHours() > 18 || now().getHours() < 8"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "{\"principal\": P.id, \"message\": \"Access denied outside working hours\"}",
            "conditionNotMet": "{\"principal\": P.id, \"message\": \"Access granted during working hours\"}"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Outputs**: If the rule is activated (i.e., access is denied outside working hours), the output provides a message indicating the reason. If the condition is not met (i.e., access is granted during working hours), a different message is provided.
- **Audit Info**: Required metadata for tracking the creation of the policy.

### 6.2 Advanced Output Use Cases

Outputs can also be used to trigger external systems, such as incident management tools or monitoring services.

### Example: Triggering an Incident Management System

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "system_access",
    "version": "1.0",
    "rules": [
      {
        "name": "security-breach",
        "actions": [
          {
            "action": "login",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["*"],
        "condition": {
          "match": {
            "expr": "P.attr.ip_address == '192.168.0.1'"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "triggerIncidentManagementWebhook(P.id, R.id, now())"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Webhook Trigger**: When the rule detects a login attempt from a suspicious IP address, it triggers a webhook to notify an incident management system.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

## 7. Schemas

Schemas in Agsiri policies are used to enforce structure and data validation on the principal and resource attributes. By defining schemas, you can ensure that the data passed in API requests conforms to the expected format.

### 7.1 Defining Schemas

Schemas are defined using the JSON Schema standard and can be referenced in Resource Policies.

### Example: Defining a Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "first_name": { "type": "string" },
    "last_name": { "type": "string" },
    "email": { "type": "string", "format": "email" }
  },
  "required": ["first_name", "last_name", "email"]
}
```

**Explanation:**
- **Schema Definition**: This schema requires that the `first_name`, `last_name`, and `email` fields are present and that the `email` field is a valid email address.

### 7.2 Using Schemas in Policies

To use a schema in a policy, reference it in the `schemas` block of the Resource Policy.

### Example: Using a Schema

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "user_profile",
    "version": "1.0",
    "schemas": {
      "principalSchema": {
        "ref": "agsiri:///schemas/principal.json"
      },
      "resourceSchema": {
        "ref": "agsiri:///schemas/resource.json"
      }
    },
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Schema Reference**: The policy references the `principal.json` and `resource.json` schemas to validate the corresponding data in API requests.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

## 8. Metadata

Metadata in Agsiri policies is used to provide additional context or information about the policy, such as annotations, source files, or identifiers.

### 8.1 Defining Metadata

Metadata can be included in any policy and can store various types of information.

### Example: Defining Metadata

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "metadata": {
    "annotations": {
      "description": "Policy for managing user profile access"
    },
    "sourceFile": "user_profile_policy.json"
  },
  "resourcePolicy": {
    "resource": "user_profile",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**
- **Annotations**: The `description` annotation provides a brief summary of the policy’s purpose.
- **Source File**: The `sourceFile` field indicates where the policy definition is stored.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

## 9. Rules, Actions, and Conditions: A Comprehensive Guide

In the Agsiri policy framework, rules, actions, and conditions are the fundamental components that form the backbone of access control. They work together to determine what actions can be performed on resources, under what circumstances those actions are permissible, and who has the authority to execute them. These elements provide the logic that governs the security and operational posture of your applications, ensuring that resources are protected according to organizational policies.

This section will delve into the details of rules, actions, and conditions, providing clear explanations, detailed examples, and practical scenarios that illustrate how these components can be used effectively to create robust and adaptable policies.

---

### 9.1 Defining Rules

A rule in an Agsiri policy is a directive that specifies what actions can be performed on a resource and under what conditions those actions

 are allowed or denied. Rules are the primary building blocks of both Principal and Resource Policies, encapsulating the logic that determines access control.

#### Key Components of a Rule:
- **Actions**: The specific operations being controlled, such as `view`, `edit`, `delete`, etc.
- **Effect**: The outcome of the rule, either allowing (`EFFECT_ALLOW`) or denying (`EFFECT_DENY`) the specified actions.
- **Roles/Derived Roles**: The roles that must be present for the rule to apply. These can include both static roles (predefined) and dynamic derived roles (computed based on certain conditions).
- **Condition**: The criteria that must be met for the rule to take effect. Conditions can range from simple checks to complex, nested logical expressions.
- **Output**: Optional expressions that can be evaluated to provide feedback or trigger additional actions when the rule is activated or when a condition is not met.

### Understanding the Elements of a Rule

1. **Actions**:
   - Actions represent the operations a user or system attempts to perform on a resource. They are defined as strings and can either be listed individually or grouped using wildcards to cover multiple actions.
   - Wildcards (`*`) are particularly useful for broad rules that apply universally to all actions, simplifying the management of policies where multiple actions need to be controlled in the same way.

   **Example of Specific Actions**:
   ```json
   {
     "actions": [
       {
         "action": "view"
       },
       {
         "action": "edit"
       },
       {
         "action": "share"
       }
     ]
   }
   ```
   **Example Using Wildcards**:
   ```json
   {
     "actions": [
       {
         "action": "*"
       }
     ]
   }
   ```
   In this case, the rule applies to all possible actions on the resource.

2. **Effect**:
   - The effect of a rule specifies whether the defined actions are allowed or denied. The effect can be set to `EFFECT_ALLOW` or `EFFECT_DENY`.
   - If a rule's conditions are met, the effect determines the access outcome. Deny effects typically take precedence over allow effects in scenarios where multiple rules apply to the same action.

   **Example of an Allow Effect**:
   ```json
   {
     "effect": "EFFECT_ALLOW"
   }
   ```
   **Example of a Deny Effect**:
   ```json
   {
     "effect": "EFFECT_DENY"
   }
   ```
   In cases where security is paramount, deny rules can be used to enforce strict access controls by explicitly prohibiting certain actions.

3. **Roles/Derived Roles**:
   - Roles and derived roles define the user groups or classifications that the rule applies to. Static roles are predefined in the system, while derived roles are dynamically computed based on specific conditions or attributes.
   - Derived roles enable the creation of dynamic access controls that adjust based on real-time data, such as a user's department or the sensitivity level of a resource.

   **Example of a Role**:
   ```json
   {
     "roles": ["manager"]
   }
   ```
   **Example of a Derived Role**:
   ```json
   {
     "derivedRoles": ["confidential_viewer"]
   }
   ```
   Derived roles can be especially powerful in environments where access controls need to be adaptable to changing conditions.

4. **Condition**:
   - Conditions are logical expressions that determine whether a rule should apply based on the attributes of the principal (user), resource, or other contextual data.
   - Conditions are defined using the `match` object, which can contain expressions and logical operators such as `all`, `any`, and `none`. This allows for the creation of fine-grained, context-sensitive policies that adapt to specific scenarios.

   **Example of a Simple Condition**:
   ```json
   {
     "condition": {
       "match": {
         "expr": "P.attr.role == 'admin'"
       }
     }
   }
   ```
   **Example of Multiple Conditions with Logical AND**:
   ```json
   {
     "condition": {
       "match": {
         "all": {
           "of": [
             { "expr": "P.attr.role == 'manager'" },
             { "expr": "R.attr.status == 'active'" }
           ]
         }
       }
     }
   }
   ```
   Conditions allow rules to be applied only when certain criteria are met, providing flexibility in how access controls are enforced.

5. **Output**:
   - Output expressions are optional components that can be used to generate custom feedback or trigger additional actions when a rule is activated or when a condition is not met.
   - Outputs are particularly useful for providing detailed information to users or integrating with external systems, such as logging services or incident management platforms.

   **Example of a Custom Output**:
   ```json
   {
     "output": {
       "when": {
         "ruleActivated": "Access denied: Login only allowed from headquarters.",
         "conditionNotMet": "Access allowed: No location restrictions."
       }
     }
   }
   ```
   Outputs enhance the functionality of rules by enabling communication with other systems or providing clear feedback to users.

### Practical Examples

#### Example 1: Allowing a Specific Action

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "document:report",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["employee"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation**:
- **Actions**: The rule permits the `view` action on the `document:report` resource.
- **Effect**: The rule allows this action for users with the `employee` role.
- **Audit Info**: Required metadata for tracking the creation of the policy.

#### Example 2: Denying an Action

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "document:report",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["intern"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation**:
- **Actions**: The rule denies the `delete` action on the `document:report` resource.
- **Effect**: The rule ensures that users with the `intern` role cannot delete the document.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

### 9.2 Exploring Actions

Actions are the operations that a user or system attempts to perform on a resource. In Agsiri policies, actions can range from basic operations like viewing or editing a document to more complex actions such as approving a transaction or accessing specific system components.

#### Defining Specific Actions

When defining actions, you can specify individual operations that the policy will control. This allows for precise control over what can be done to a resource.

**Example of Specific Actions**:
```json
{
  "actions": [
    {
      "action": "view"
    },
    {
      "action": "edit"
    },
    {
      "action": "share"
    }
  ]
}
```

In this example, the rule applies specifically to the `view`, `edit`, and `share` actions, ensuring that only these operations are controlled by the policy.

#### Using Wildcards for Actions

In scenarios where you want to apply a rule universally across all actions, you can use wildcards to simplify the policy definition.

**Example Using Wildcards**:
```json
{
  "actions": [
    {
      "action": "*"
    }
  ]
}
```

The wildcard `*` indicates that the rule applies to all possible actions on the resource, making it particularly useful in broad scenarios where every action should be either allowed or denied.

#### Role-Specific Actions in Principal Policies

Principal policies allow for the definition of overrides that apply to specific users. For instance, a developer might have wildcard access to their development records but restricted access to production data.

**Example**:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "daffy_duck",
    "version": "1.0",
    "scope": "acme.corp",
    "variables": {
      "import": ["apatr_common_variables"],
      "local": {
        "is_dev_record": "request.resource.attr.dev_record == true"
      }
    },
    "rules": [
      {
        "resource": "leave_request",
        "actions": [
          {
            "action": "*",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "V.is_dev_record"
              }
            },
            "output": {
              "when": {
                "ruleActivated": "\"wildcard_override:\".concat(request.principal.id)",
                "conditionNotMet": "\"wildcard_condition_not_met:\".concat(request.principal.id)"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt":

 "2024-08-19T12:34:56Z"
  }
}
```

**Explanation**:
- **Wildcard Action**: The `action: "*"` allows `daffy_duck` to perform any action on the `leave_request` resource, provided the condition `V.is_dev_record` is true.
- **Output**: Depending on whether the rule is activated, different outputs are generated, which can be used for logging or triggering other processes.
- **Audit Info**: Required metadata for tracking the creation of the policy.

#### Combining Multiple Actions in Resource Policies

Resource policies control actions across various resources. In some cases, multiple actions can be defined together to accommodate different user roles and scenarios.

**Example**:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "album:object",
    "version": "1.0",
    "scope": "acme.corp",
    "importDerivedRoles": ["apatr_common_roles"],
    "variables": {
      "import": ["apatr_common_variables"],
      "local": {
        "is_corporate_network": "P.attr.ip_address.inIPAddrRange('10.20.0.0/16')"
      }
    },
    "rules": [
      {
        "actions": [
          {
            "action": "*",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "derivedRoles": ["owner"]
      },
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["user"],
        "condition": {
          "match": {
            "expr": "R.attr.public == true"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "\"view_allowed:\".concat(request.principal.id)",
            "conditionNotMet": "\"view_not_allowed:\".concat(request.principal.id)"
          }
        }
      },
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "delete",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["abuse_moderator"],
        "condition": {
          "match": {
            "expr": "V.is_corporate_network"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation**:
- **Universal Allowance**: The first rule uses `["*"]` to allow all actions for users with the `owner` derived role.
- **Specific Action**: The second rule allows the `view` action for `user` roles when the resource is public.
- **Combined Actions**: The third rule permits both `view` and `delete` actions for `abuse_moderator` roles if the request originates from the corporate network.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

### 9.3 Complex Action Scenarios

In complex environments, different actions may need to be controlled in various ways, depending on the resource, user role, and context. Agsiri allows combining multiple actions with different effects and conditions to address a wide range of scenarios.

#### Combining Allow and Deny Actions

In some cases, you may need to allow certain actions while denying others within the same policy context. This is particularly useful for managing complex workflows where different roles require different levels of access.

**Example**:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "document:financial_report",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["manager"]
      },
      {
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["manager"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation**:
- **Multiple Actions**: The first rule allows `view` and `edit` actions for users with the `manager` role.
- **Deny Action**: The second rule denies the `delete` action for the same role, illustrating how you can allow certain actions while restricting others within the same policy context.
- **Audit Info**: Required metadata for tracking the creation of the policy.

#### Conditional Actions Based on Resource Attributes

Sometimes, the actions allowed or denied depend on specific attributes of the resource. This approach enables dynamic policy enforcement based on the state of the resource.

**Example**:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "document:contract",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "approve",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["legal"],
        "condition": {
          "match": {
            "expr": "R.attr.status == 'pending_approval'"
          }
        }
      },
      {
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["legal"],
        "condition": {
          "match": {
            "expr": "R.attr.status == 'final'"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation**:
- **Conditional Approval**: The `approve` action is allowed when the contract status is `pending_approval`.
- **Conditional Denial**: The `edit` action is denied if the contract status is `final`, showing how conditions can dynamically alter the allowed actions based on resource states.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

### 9.4 Using Roles and Derived Roles

Roles define the groups or classifications of users subject to the policy rules. Roles can be static (predefined in the system) or dynamic (derived roles), which are computed based on specific conditions or attributes.

#### Derived Roles for Dynamic Access Control

Derived roles allow you to create policies that adjust based on real-time data, such as the user's department or the resource's sensitivity level.

**Example**:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "document:confidential_report",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "derivedRoles": ["confidential_viewer"],
        "condition": {
          "match": {
            "expr": "P.attr.department == 'legal'"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation**:
- **Derived Role**: The `confidential_viewer` derived role is applied dynamically based on the condition that the user's department is `legal`.
- **Outcome**: Only users from the legal department are allowed to view the confidential report, ensuring that sensitive information is protected.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

### 9.5 Output Expressions for Feedback and Integration

Output expressions in Agsiri policies allow for generating custom feedback messages or triggering additional actions when a rule is activated or when a condition is not met. This feature is particularly useful for providing detailed information to users or integrating with external systems.

#### Custom Output for Denied Access

When access is denied, providing clear feedback to the user is important for transparency and user experience. Output expressions can help in delivering such messages.

**Example**:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "system:login",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "login",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["*"],
        "condition": {
          "match": {
            "expr": "P.attr.location != 'headquarters'"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "Access denied: Login only allowed from headquarters.",
            "conditionNotMet": "Access allowed: No location restrictions."
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation**:
- **Custom Output**: If the user tries to log in from a location other than the headquarters, the system provides a specific denial message.
- **Integration

 Potential**: Such output expressions can be used to trigger alerts or notify other systems, such as incident management platforms, about unauthorized access attempts.
- **Audit Info**: Required metadata for tracking the creation of the policy.

#### Time-Based Access Control with Output Feedback

In scenarios where access is controlled based on time, output expressions can provide clear feedback to the user about why access is allowed or denied.

**Example**:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "system:dashboard",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "*",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["*"],
        "condition": {
          "match": {
            "expr": "now().getHours() < 9 || now().getHours() > 17"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "System access denied: Outside working hours.",
            "conditionNotMet": "System access allowed: Within working hours."
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation**:
- **Condition**: The rule checks whether the current time falls outside standard working hours (9 AM to 5 PM).
- **Output**: Depending on whether the rule is activated, different messages are generated to inform the user of the access restriction or permission.
- **Audit Info**: Required metadata for tracking the creation of the policy.

---

## 10. Condition, Match, and Expressions

Conditions are the core mechanism in Agsiri policies that allow you to evaluate specific criteria to determine whether an action should be allowed or denied. They provide a way to implement fine-grained access control by evaluating attributes of the principal, resource, and other contextual data at runtime. Conditions are composed of `match` objects, which define the logical structure of the condition, and expressions, which are the actual criteria being evaluated.

In this section, we will explore how to define conditions, use the `match` object, and write expressions, ranging from simple to complex examples.

---

## 10.1 Overview of Conditions

A condition in Agsiri is a logical statement that evaluates to either `true` or `false`. Depending on this evaluation, the policy can decide whether to allow or deny a specific action. Conditions are typically used within rules to enforce constraints based on various factors, such as the time of day, user roles, resource attributes, or environmental variables.

### Example: Basic Condition Structure

```json
{
  "condition": {
    "match": {
      "expr": "P.attr.role == 'admin'"
    }
  }
}
```

**Explanation:**
- **Condition**: The condition checks whether the principal's role is `admin`.
- **Match Object**: The `match` object contains an `expr` field, which holds the expression to be evaluated.

---

## 10.2 The Match Object

The `match` object is the container for logical expressions in a condition. It supports several logical operators that allow you to combine multiple expressions or nest them to create complex conditions.

### Match Object Structure

The `match` object can be structured using the following logical operators:
- **`expr`**: A single expression that evaluates to `true` or `false`.
- **`all`**: A list of expressions, all of which must evaluate to `true` (logical AND).
- **`any`**: A list of expressions, at least one of which must evaluate to `true` (logical OR).
- **`none`**: A list of expressions, all of which must evaluate to `false` (logical NOT).

---

## 10.3 Simple Expressions

Expressions are the building blocks of conditions. They are written using the Pola Expressions syntax and evaluate specific criteria based on the attributes of the principal, resource, or other contextual data.

### Example 1: Simple Role Check

```json
{
  "condition": {
    "match": {
      "expr": "P.attr.role == 'manager'"
    }
  }
}
```

**Explanation:**
- **Expression**: Checks if the principal's role is `manager`.
- **Result**: If `true`, the condition is satisfied, and the associated action is allowed or denied based on the policy's effect.

### Example 2: Time-Based Access Control

```json
{
  "condition": {
    "match": {
      "expr": "now().getHours() >= 9 && now().getHours() <= 17"
    }
  }
}
```

**Explanation:**
- **Expression**: Allows access only during working hours (9 AM to 5 PM).
- **Result**: If the request is made within the specified hours, the condition is satisfied.

---

## 10.4 Complex Conditions with Logical Operators

As your policies become more advanced, you may need to combine multiple expressions using logical operators. The `all`, `any`, and `none` operators provide the flexibility to create complex conditions that evaluate multiple criteria simultaneously.

### Example 1: Combining Expressions with `all`

```json
{
  "condition": {
    "match": {
      "all": {
        "of": [
          { "expr": "P.attr.role == 'admin'" },
          { "expr": "R.attr.status == 'active'" }
        ]
      }
    }
  }
}
```

**Explanation:**
- **All Operator**: Both expressions must evaluate to `true` for the condition to be satisfied.
- **Use Case**: This condition allows an action only if the principal is an `admin` and the resource's status is `active`.

### Example 2: Allowing Access with `any`

```json
{
  "condition": {
    "match": {
      "any": {
        "of": [
          { "expr": "P.attr.department == 'engineering'" },
          { "expr": "P.attr.department == 'support'" }
        ]
      }
    }
  }
}
```

**Explanation:**
- **Any Operator**: At least one of the expressions must evaluate to `true` for the condition to be satisfied.
- **Use Case**: This condition allows access if the principal belongs to either the `engineering` or `support` department.

### Example 3: Negating Conditions with `none`

```json
{
  "condition": {
    "match": {
      "none": {
        "of": [
          { "expr": "P.attr.role == 'intern'" },
          { "expr": "P.attr.role == 'contractor'" }
        ]
      }
    }
  }
}
```

**Explanation:**
- **None Operator**: None of the expressions must evaluate to `true` for the condition to be satisfied.
- **Use Case**: This condition denies access if the principal is either an `intern` or a `contractor`.

---

## 10.5 Nested Conditions

You can create highly complex conditions by nesting `match` objects within each other. This allows you to combine multiple logical operators and create intricate rules that handle a wide range of scenarios.

### Example: Nested Logical Operators

```json
{
  "condition": {
    "match": {
      "all": {
        "of": [
          { "expr": "P.attr.role == 'admin'" },
          {
            "any": {
              "of": [
                { "expr": "R.attr.sensitivity == 'high'" },
                { "expr": "R.attr.sensitivity == 'medium'" }
              ]
            }
          },
          {
            "none": {
              "of": [
                { "expr": "R.attr.status == 'archived'" },
                { "expr": "R.attr.status == 'deleted'" }
              ]
            }
          }
        ]
      }
    }
  }
}
```

**Explanation:**
- **All Operator**: The overall condition requires all sub-conditions to be satisfied.
- **Nested Any Operator**: Allows access if the resource's sensitivity is either `high` or `medium`.
- **Nested None Operator**: Denies access if the resource's status is either `archived` or `deleted`.

---

## 10.6 Using Variables in Expressions

Variables play a crucial role in making conditions more dynamic and reusable. You can define local or imported variables and reference them in your expressions.

### Example: Using a Variable

```json
{
  "condition": {
    "match": {
      "expr": "V.is_weekend && P.attr.role == 'admin'"
    }
  }
}
```

**Explanation:**
- **Variable Reference**: The variable `is_weekend` is used to check if the current day is a weekend.
- **Combined Condition**: The condition allows access only if it is the weekend and the principal is an `admin`.

---

## 10.7 Advanced Examples

Let's look at some more advanced examples that demonstrate the full potential of conditions, match objects, and expressions in Agsiri policies.

### Example 1: Role-Based and Time-Based Access Control

```json
{
  "condition": {
    "match": {
      "all": {
        "of": [
          { "expr": "P.attr.role == 'manager'" },
          { "expr": "now().getDayOfWeek() < 6" },
          { "expr": "now().getHours() >= 9 && now().getHours() <= 17" }
        ]
      }
    }
  }
}
```

**Explanation:**
- **Combined Logic**: Access is allowed only

 if the principal is a `manager`, the current day is a weekday, and the request is made during working hours (9 AM to 5 PM).

### Example 2: Conditional Resource Sensitivity

```json
{
  "condition": {
    "match": {
      "any": {
        "of": [
          { "expr": "P.attr.clearance_level >= 3 && R.attr.sensitivity == 'high'" },
          { "expr": "P.attr.clearance_level >= 2 && R.attr.sensitivity == 'medium'" }
        ]
      }
    }
  }
}
```

**Explanation:**
- **Clearance Level Check**: This condition allows access if the principal has a sufficient clearance level based on the sensitivity of the resource.

### Example 3: Preventing Access on Specific Dates

```json
{
  "condition": {
    "match": {
      "none": {
        "of": [
          { "expr": "now().format('YYYY-MM-DD') == '2024-12-25'" },
          { "expr": "now().format('YYYY-MM-DD') == '2024-01-01'" }
        ]
      }
    }
  }
}
```

**Explanation:**
- **Date-Based Restriction**: Access is denied on specific dates, such as Christmas Day and New Year's Day.

---

## Conclusion

Understanding and effectively using conditions, match objects, and expressions are fundamental to developing robust Agsiri policies. These components provide the flexibility needed to create complex, context-sensitive rules that ensure precise access control. By mastering the use of simple and complex conditions, logical operators, and variables, policy developers can build powerful policies that meet the most demanding security and access requirements.


