# Agsiri Pola Policy Models

In the Agsiri ecosystem, Pola Policies offer a flexible and powerful framework for managing access control across various resources, principals, and scopes. By utilizing the Pola Expressions, you can define precise rules that govern how and when specific actions are allowed or denied. The integration of variables within these policies further enhances their flexibility, reducing redundancy and enabling dynamic evaluations based on real-time data.

This guide provides an in-depth exploration of Agsiri Pola Policy Models, focusing on resource policies, principal policies, scoped policies, and the use of expanded conditions with Pola Expressions. Each section is accompanied by detailed examples to illustrate how these concepts are applied in practice.

## Resource Policies

Resource policies in Agsiri define the rules and conditions under which specific actions can be performed on a given resource. These policies are scoped to a particular domain (e.g., "acme.corp") and may include derived roles, variables, and specific rules that dictate access permissions.

Here's an enhanced JSON policy definition for a resource policy:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "album:object",
    "version": "default",
    "scope": "acme.corp",
    "importDerivedRoles": [
      "apatr_common_roles"
    ],
    "variables": {
      "import": [
        "apatr_common_variables"
      ],
      "local": {
        "is_corporate_network": "P.attr.ip_address.inIPAddrRange('10.20.0.0/16')",
        "flagged_resource": "request.resource.attr.flagged",
        "label": "'latest'",
        "teams": "[\"red\", \"blue\"]"
      }
    },
    "rules": [
      {
        "actions": ["*"],
        "effect": "EFFECT_ALLOW",
        "derivedRoles": [
          "owner"
        ]
      },
      {
        "actions": ["view"],
        "effect": "EFFECT_ALLOW",
        "roles": [
          "user"
        ],
        "condition": {
          "match": {
            "expr": "request.resource.attr.public == true"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "\"view_allowed:%s\".format([request.principal.id])",
            "conditionNotMet": "\"view_not_allowed:%s\".format([request.principal.id])"
          }
        }
      },
      {
        "name": "moderator_rule",
        "actions": ["view", "delete"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "V.is_corporate_network"
          }
        },
        "derivedRoles": [
          "abuse_moderator"
        ]
      }
    ],
    "schemas": {
      "principalSchema": {
        "schema": "path/to/principal/schema"
      },
      "resourceSchema": {
        "schema": "path/to/resource/schema"
      }
    }
  }
}
```

### Breakdown of the Resource Policy Example:

- **Resource and Scope**: The policy applies to resources of type "album:object" within the "acme.corp" scope.
- **Imported Roles and Variables**: Common roles and variables are imported to maintain consistency and reduce redundancy across policies.
- **Local Variables**: Specific variables are defined within the policy, such as checking if the request originates from a corporate network or if a resource is flagged.
- **Rules**: The policy includes several rules:
  - A wildcard rule allowing all actions for users with the "owner" role.
  - A rule allowing the "view" action for resources that are public, with output conditions providing feedback on whether the view was allowed.
  - A specialized rule for abuse moderators, allowing them to view and delete content, but only when the request comes from within the corporate network.

## Principal Policies

Principal policies are tailored to specific users or groups, overriding default resource policies when necessary. These policies allow for granular control over user permissions, enabling or restricting access based on the principal's attributes and the context of the request.

Here’s an example of a principal policy:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "daffy_duck",
    "version": "dev",
    "scope": "acme.corp",
    "variables": {
      "import": [
        "apatr_common_variables"
      ],
      "local": {
        "is_dev_record": "request.resource.attr.dev_record == true"
      }
    },
    "rules": [
      {
        "resource": "leave_request",
        "actions": [
          {
            "name": "dev_record_wildcard",
            "action": "*",
            "condition": {
              "match": {
                "expr": "variables.is_dev_record"
              }
            },
            "effect": "EFFECT_ALLOW",
            "output": {
              "when": {
                "ruleActivated": "\"wildcard_override:%s\".format([request.principal.id])",
                "conditionNotMet": "\"wildcard_condition_not_met:%s\".format([request.principal.id])"
              }
            }
          }
        ]
      },
      {
        "resource": "employee_profile",
        "actions": [
          {
            "name": "view_employee_profile",
            "action": "*",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "V.is_dev_record" },
                    { "expr": "request.resource.attr.public == true" }
                  ]
                }
              }
            },
            "effect": "EFFECT_ALLOW"
          }
        ]
      },
      {
        "resource": "salary_record",
        "actions": [
          {
            "action": "*",
            "effect": "EFFECT_DENY"
          }
        ]
      }
    ]
  }
}
```

### Breakdown of the Principal Policy Example:

- **Principal**: The policy is specific to the user "daffy_duck" within the "acme.corp" scope.
- **Variables**: The policy imports common variables and defines a local variable to check if a resource is a development record.
- **Rules**:
  - A wildcard rule allowing all actions on development records, with outputs providing detailed feedback on whether the condition was met.
  - A rule allowing viewing of employee profiles if the record is public and marked as a development record.
  - A rule denying all actions on salary records, ensuring sensitive information is protected.

## Scoped Policies

Scoped policies define rules that apply within a specific context or project. These policies are crucial for managing access control in multi-tenant environments, where different teams or projects may have unique access requirements.

Here’s an example of a scoped policy:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "scopedPolicy": {
    "scope": "project.alpha",
    "version": "default",
    "variables": {
      "import": [
        "project_alpha_variables"
      ],
      "local": {
        "is_project_member": "P.attr.project_id == 'alpha'"
      }
    },
    "rules": [
      {
        "resource": "project_document",
        "actions": [
          {
            "name": "view_project_docs",
            "action": "view",
            "condition": {
              "match": {
                "expr": "V.is_project_member && request.resource.attr.public == true"
              }
            },
            "effect": "EFFECT_ALLOW"
          },
          {
            "name": "edit_project_docs",
            "action": "edit",
            "condition": {
              "match": {
                "expr": "V.is_project_member && request.resource.attr.editable == true"
              }
            },
            "effect": "EFFECT_ALLOW"
          }
        ]
      },
      {
        "resource": "project_task",
        "actions": [
          {
            "name": "assign_task",
            "action": "assign",
            "condition": {
              "match": {
                "expr": "V.is_project_member && request.principal.attr.role == 'manager'"
              }
            },
            "effect": "EFFECT_ALLOW"
          },
          {
            "name": "complete_task",
            "action": "complete",
            "condition": {
              "match": {
                "expr": "V.is_project_member && request.principal.attr.role == 'team_member'"
              }
            },
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  }
}
```

### Breakdown of the Scoped Policy Example:

- **Scope**: The policy is scoped to "project.alpha," ensuring that the rules apply only within this project.
- **Variables**: The policy imports project-specific variables and defines a local variable to check if the principal is a member of the project.
- **Rules**:
  - A rule allowing project members to view public documents.
  - A rule allowing project members to edit documents if they are marked as editable.
  - A rule allowing managers to assign tasks and team members to complete tasks within the project.

## Exported Variables

To enhance reusability and maintainability, variables can be defined in a separate file and imported across multiple policies. This approach reduces duplication and ensures consistency in variable definitions.

Here’s an example of exporting variables:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Common variables used within the Apatr app",
  "exportVariables": {
    "name": "apatr_common_variables",
    "definitions": {
      "flagged_resource": "request.resource.attr.flagged",
      "label": "'latest'",
      "

teams": "[\"red\", \"blue\"]"
    }
  }
}
```

### Breakdown of the Exported Variables Example:

- **Description**: The file contains common variables used throughout the Apatr app.
- **Definitions**: Variables such as "flagged_resource," "label," and "teams" are defined, which can be imported into various policies, ensuring consistent usage across the application.

## Expanded Conditions

Conditions in Pola Policies are expressed using Pola Expressions, which provide a powerful and flexible way to define the logic that governs access control. Conditions can be simple or complex, involving multiple expressions combined with logical operators such as `all`, `any`, and `none`.

### Top-Level Identifiers

Pola Expressions use several top-level identifiers to reference different parts of the request and the environment:

- **request**: Contains data about the principal, resource, and any auxiliary information provided in the request.
- **runtime**: Holds additional data computed during policy evaluation, such as derived roles.
- **variables**: Represents variables declared within the policy.
- **globals**: Refers to global variables declared in the policy engine configuration.

### Single Boolean Expression

A simple condition might involve checking whether the principal's ID matches a specific pattern:

```json
{
  "condition": {
    "match": {
      "expr": "P.id.matches('^dev_.*')"
    }
  }
}
```

### All Operator

The `all` operator ensures that all expressions within the condition must evaluate to true for the condition to be met:

```json
{
  "condition": {
    "match": {
      "all": {
        "of": [
          { "expr": "R.attr.status == 'PENDING_APPROVAL'" },
          { "expr": "'GB' in R.attr.geographies" },
          { "expr": "P.attr.geography == 'GB'" }
        ]
      }
    }
  }
}
```

### Any Operator

The `any` operator allows the condition to be met if at least one expression evaluates to true:

```json
{
  "condition": {
    "match": {
      "any": {
        "of": [
          { "expr": "R.attr.status == 'PENDING_APPROVAL'" },
          { "expr": "'GB' in R.attr.geographies" },
          { "expr": "P.attr.geography == 'GB'" }
        ]
      }
    }
  }
}
```

### None Operator

The `none` operator ensures that none of the expressions within the condition evaluate to true:

```json
{
  "condition": {
    "match": {
      "none": {
        "of": [
          { "expr": "R.attr.status == 'PENDING_APPROVAL'" },
          { "expr": "'GB' in R.attr.geographies" },
          { "expr": "P.attr.geography == 'GB'" }
        ]
      }
    }
  }
}
```

### Nesting Operators

Complex conditions can be created by nesting operators, allowing for intricate logic that can evaluate multiple criteria in a single condition block:

```json
{
  "condition": {
    "match": {
      "all": {
        "of": [
          { "expr": "R.attr.status == 'DRAFT'" },
          {
            "any": {
              "of": [
                { "expr": "R.attr.dev == true" },
                { "expr": "R.attr.id.matches('^[98][0-9]+')" }
              ]
            }
          },
          {
            "none": {
              "of": [
                { "expr": "R.attr.qa == true" },
                { "expr": "R.attr.canary == true" }
              ]
            }
          }
        ]
      }
    }
  }
}
```

This condition block can be equivalently represented as a single expression:

```json
{
  "condition": {
    "match": {
      "expr": "(R.attr.status == 'DRAFT' && (R.attr.dev == true || R.attr.id.matches('^[98][0-9]+')) && !(R.attr.qa == true || R.attr.canary == true))"
    }
  }
}
```

## Quotes in Expressions

When your expressions contain quotes, it's important to use the correct syntax to avoid parsing errors. You can either use YAML block scalar syntax or wrap the expression in parentheses:

```json
{
  "condition": {
    "match": {
      "expr": "'GB' in R.attr.geographies"
    }
  }
}
```

## Auxiliary Data

Pola Expressions can also access auxiliary data sources configured in the system, such as JWT claims. This allows policies to incorporate additional context or metadata into their evaluations.

### Example: Accessing JWT Claims

```json
{
  "condition": {
    "match": {
      "expr": "\"cerbie\" in request.auxData.jwt.aud && request.auxData.jwt.iss == 'agsiri'"
    }
  }
}
```

## Operators in Pola Expressions

Pola Expressions support a wide range of logical and arithmetic operators, enabling complex conditions to be evaluated efficiently.

### Logical and Arithmetic Operators

| Operator | Description                            |
|----------|----------------------------------------|
| **`!`**  | Logical negation (NOT)                 |
| **`-`**  | Subtraction/numeric negation           |
| **`!=`** | Unequals                               |
| **`%`**  | Modulo                                 |
| **`&&`** | Logical AND                            |
| **`||`** | Logical OR                             |
| **`*`**  | Multiplication                         |
| **`+`**  | Addition/concatenation                 |
| **`/`**  | Division                               |
| **`<=`** | Less than or equal to                  |
| **`<`**  | Less than                              |
| **`==`** | Equals                                 |
| **`>=`** | Greater than or equal to               |
| **`>`**  | Greater than                           |
| **`in`** | Membership in lists or maps            |
| **`?:`** | Ternary condition (if-then-else)       |

These operators can be combined and nested within expressions to create complex, context-aware conditions.

## Working with Durations

Pola Expressions allow you to work with duration values, which must be specified in precise units such as nanoseconds, microseconds, milliseconds, seconds, minutes, or hours. This ensures that time-based conditions are evaluated accurately.

### Example: Using Durations in Conditions

```json
{
  "resource": {
    "kind": "leave_request",
    "attr": {
      "cooldownPeriod": "3750s",
      "lastAccessed": "2021-04-20T10:00:20.021-05:00"
    }
  }
}
```

**Functions for Durations:**

- `duration(R.attr.cooldownPeriod).getSeconds() == 3750`
- `duration(R.attr.cooldownPeriod).getHours() == 1`
- `duration(R.attr.cooldownPeriod).getMilliseconds() == 3750000`
- `duration(R.attr.cooldownPeriod).getMinutes() == 62`

These functions allow you to perform calculations and comparisons with time-based data, ensuring that actions are only allowed when appropriate.

## Hierarchies in Pola Expressions

Hierarchical data structures, such as dotted strings or nested lists, are common in complex systems. Pola Expressions provide functions for manipulating and evaluating these hierarchies.

### Example: Hierarchical Functions

```json
{
  "principal": {
    "id": "john",
    "roles": ["employee"],
    "attr": {
      "scope": "foo.bar.baz.qux"
    }
  },
  "resource": {
    "kind": "leave_request",
    "attr": {
      "scope": "foo.bar"
    }
  }
}
```

**Functions for Hierarchies:**

- `hierarchy("a.b.c") == hierarchy(["a","b","c"])`
- `hierarchy("a:b:c", ":").size() == 3`
- `hierarchy("a.b").ancestorOf(hierarchy("a.b.c.d")) == true`
- `hierarchy(R.attr.scope).commonAncestors(hierarchy(P.attr.scope)) == hierarchy("foo.bar")`

These functions enable you to evaluate relationships within hierarchical structures, such as determining whether one scope is an ancestor of another.

## IP Address Functions

In many scenarios, access control decisions need to be based on IP addresses, particularly in networked environments. Pola Expressions include functions for evaluating IP address ranges.

### Example: Evaluating IP Address Ranges

```json
{
  "principal": {
    "id": "elmer_fudd",
    "attr": {
      "ipv4Address": "192.168.0.10",
      "ipv6Address": "2001:0db8:0000:0000:0000:0000:1000:0000"
    }
  }
}
```

**Functions for IP Addresses:**

- `P.attr.ipv4Address.inIPAddrRange("192.168.0.0/24") && P.attr.ipv6Address.inIPAddrRange("2001:db8::/48")`

These functions allow you to restrict or permit actions based on whether a request originates from a specific IP address range.

## Lists and Maps in Pola Expressions

Lists and maps are versatile data structures that can be used to represent a wide range of information in policies. Pola Expressions provide functions for working with these structures, including filtering, mapping, and checking for membership.

### Example: Working with Lists and Maps

```json
{
  "principal": {
    "id": "elmer_fudd",
    "

attr": {
      "id": "125",
      "teams": ["design", "communications", "product", "commercial"],
      "clients": {
        "acme": {"active": true},
        "bb inc": {"active": true}
      }
    }
  }
}
```

**Functions for Lists and Maps:**

- `P.attr.teams + ["design", "engineering"]`
- `P.attr.teams[0] == "design" && P.attr.clients["acme"]["active"] == true`
- `P.attr.teams.all(t, size(t) > 3)`
- `P.attr.teams.exists(t, t.startsWith("comm"))`

These functions allow you to perform sophisticated evaluations and transformations on list and map data, enabling dynamic and context-aware policy conditions.

## Mathematical Functions in Pola Expressions

Mathematical operations are often necessary when evaluating conditions in policies. Pola Expressions include a range of mathematical functions that can be used to compare and manipulate numeric data.

### Example: Mathematical Functions

```json
{
  "condition": {
    "match": {
      "expr": "math.greatest([1, 3, 5]) == 5"
    }
  }
}
```

**Functions for Math:**

- `math.greatest([1, 3, 5]) == 5`
- `math.least([1, 3, 5]) == 1`

These functions allow you to determine the greatest or least value within a list of numbers, which can be useful in a variety of access control scenarios.

## String Manipulation in Pola Expressions

String manipulation is a common requirement in access control policies, particularly when working with identifiers, roles, or other textual data. Pola Expressions provide a comprehensive set of functions for manipulating strings.

### Example: String Functions

```json
{
  "resource": {
    "kind": "leave_request",
    "attr": {
      "id": "125",
      "department": "marketing"
    }
  }
}
```

**Functions for Strings:**

- `R.attr.department.contains("arket")`
- `R.attr.department.startsWith("mark")`
- `R.attr.department.replace("market", "engineer") == "engineering"`

These functions enable you to evaluate and transform string data within your policies, ensuring that conditions are met based on specific textual criteria.

## Timestamps and Time Functions

Handling time-based conditions is essential in many access control scenarios, such as setting expiration dates or time-limited access. Pola Expressions provide functions for working with timestamps and durations.

### Example: Time Functions

```json
{
  "resource": {
    "kind": "leave_request",
    "attr": {
      "lastAccessed": "2021-04-20T10:00:20.021-05:00",
      "lastUpdateTime": "2021-05-01T13:34:12.024Z"
    }
  }
}
```

**Functions for Timestamps:**

- `timestamp(R.attr.lastAccessed).getFullYear() == 2021`
- `timestamp(R.attr.lastAccessed).getDayOfMonth() == 19`
- `timestamp(R.attr.lastUpdateTime) - timestamp(R.attr.lastAccessed) > duration("36h")`

These functions allow you to perform precise calculations and comparisons with date and time data, enabling time-based access control within your policies.

## Conclusion

The Agsiri Pola Policy Models, supported by Pola Expressions, offer a powerful and flexible framework for defining and managing access control across various contexts. By leveraging the capabilities of Pola Expressions, you can create dynamic and context-aware policies that ensure secure and efficient access control. The integration of resource policies, principal policies, scoped policies, and variable management allows for fine-grained control over who can access what, when, and under what conditions.

By mastering the use of Pola Expressions and the associated functions, you can develop robust policies that adapt to the needs of your organization, ensuring that access control is both effective and efficient in a wide range of scenarios.
