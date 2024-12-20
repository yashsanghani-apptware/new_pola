# Agsiri Pola Conditions Manual

The Agsiri Pola policy framework provides a robust mechanism for defining and enforcing conditions through the Pola Expression Language (PXL). These conditions are crucial for evaluating requests against specific criteria, ensuring that actions are permitted only when they meet the defined rules. This capability is integral to enforcing fine-grained access control in complex systems, where policies need to consider various attributes of the principal (user), resource, and context.

This document offers a comprehensive guide to understanding and applying Pola conditions in your policies. We'll explore the structure of condition expressions, how to utilize top-level identifiers, the logic behind operators, and the various functions available within PXL. Examples will be provided throughout to illustrate how these concepts work in practice using the four types of policies: Resource Policy, Principal Policy, Derived Roles, and Export Variables.

## Understanding Condition Expressions

At its core, every condition expression in Pola must evaluate to a boolean value—either `true` or `false`. The result of this evaluation determines whether a particular policy rule is applicable. For instance, if a condition evaluates to `true`, the policy rule it is attached to will be enforced; otherwise, it will be skipped.

Condition blocks in policies can contain either a single condition expression or multiple expressions combined using logical operators like `all`, `any`, or `none`. These operators allow for complex conditions by evaluating multiple expressions in conjunction.

### Example of a Simple Condition Block

Consider a scenario where you want to ensure that a particular action is only allowed if the resource status is "PENDING_APPROVAL" and the resource's geographical location includes "GB". This can be expressed in a Resource Policy as:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Allow actions if the resource is pending approval and located in GB.",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "R.attr.status == 'PENDING_APPROVAL'"},
                {"expr": "'GB' in R.attr.geographies"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

In this example, the `all` operator ensures that both conditions must be `true` for the policy to apply.

## Top-Level Identifiers in Condition Expressions

To write effective condition expressions, you need to understand the top-level identifiers available in PXL. These identifiers represent various aspects of the request and the environment in which the policy is evaluated. Here's a breakdown of the key identifiers:

- **`request`**: This identifier represents the data provided in the check or plan request. It includes information about the principal (the entity performing the action), the resource (the object of the action), and any auxiliary data that might be relevant.
  
- **`runtime`**: This identifier includes additional data computed during policy evaluation, such as derived roles that are dynamically assigned based on the policy's conditions.
  
- **`variables`**: These are variables declared within the policy itself. They are useful for avoiding redundancy in condition expressions and for making policies more maintainable.

- **`globals`**: These are global variables declared in the policy engine configuration, accessible across all policies.

To make expressions more concise, PXL also provides single-letter aliases for these identifiers:

- **`P`**: Alias for `request.principal`
- **`R`**: Alias for `request.resource`
- **`V`**: Alias for `variables`
- **`G`**: Alias for `globals`

### Example of Using the `request` Object

The `request` object is central to condition expressions. Here's an example of how you might structure a `Principal Policy` object:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Allow access if the principal is an employee in GB.",
  "principalPolicy": {
    "principal": "employee",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
        "actions": [
          {
            "action": "access",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    {"expr": "P.attr.geography == 'GB'"},
                    {"expr": "request.resource.attr.owner == P.id"}
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
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:10:00Z"
  }
}
```

In this example:

- The `principal` is identified as "employee," with a geographical location in "GB."
- The policy ensures that the employee can access resources they own within the specified geographical area.

## Exploring the `runtime` Object

The `runtime` object holds data computed during the evaluation of the policy. One key element here is `effectiveDerivedRoles`, which represents roles dynamically assigned to the principal based on the policy's logic. This is particularly relevant in resource policies where conditions might assign or remove roles depending on the current state of the resource.

### Example of the `runtime` Object in a Derived Role Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Assign derived role based on resource location.",
  "derivedRoles": {
    "name": "LocationBasedRoles",
    "definitions": [
      {
        "name": "GB_Editor",
        "parentRoles": ["editor"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "R.attr.geographies.contains('GB')"},
                {"expr": "P.attr.geography == 'GB'"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:20:00Z"
  }
}
```

In this scenario, the principal is dynamically assigned the `GB_Editor` role if they are located in the GB and the resource is also tagged as being in the GB geography.

## Crafting Expressions and Blocks

Pola allows for crafting both simple and complex expressions to fit your access control needs. Let's look at how you can structure these expressions.

### Single Boolean Expression

A single boolean expression might look like this in an Export Variables policy:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Export variable for checking if the principal is in a dev environment.",
  "exportVariables": {
    "name": "dev_environment",
    "definitions": {
      "is_dev_user": "P.id.matches('^dev_.*')"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:30:00Z"
  }
}
```

Here, the expression checks whether the principal's ID matches a specific pattern, which could be useful for applying policies to development accounts.

### Combining Expressions with `all`, `any`, and `none`

You can combine multiple expressions using the `all`, `any`, and `none` operators:

- **`all`**: All expressions must be true.
- **`any`**: At least one expression must be true.
- **`none`**: None of the expressions should be true.

#### Example with `all` Operator in a Resource Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Allow actions if resource is pending approval and both resource and principal are in GB.",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "R.attr.status == 'PENDING_APPROVAL'"},
                {"expr": "'GB' in R.attr.geographies"},
                {"expr": "P.attr.geography == 'GB'"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:40:00Z"
  }
}
```

This policy will apply only if the resource status is "PENDING_APPROVAL," the resource's geographies include "GB," and the principal's geography is also "GB."

#### Example with `any` Operator in a Principal Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Allow access if the principal is in GB or the resource is pending approval.",
  "principalPolicy": {
    "principal": "employee",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:

resource/*",
        "actions": [
          {
            "action": "access",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "any": {
                  "of": [
                    {"expr": "P.attr.geography == 'GB'"},
                    {"expr": "R.attr.status == 'PENDING_APPROVAL'"}
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
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:50:00Z"
  }
}
```

Here, the policy will apply if any one of these conditions is true.

#### Example with `none` Operator in a Derived Role Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Assign 'RestrictedAccess' role if resource is neither in QA nor in Canary.",
  "derivedRoles": {
    "name": "RestrictedAccess",
    "definitions": [
      {
        "name": "No_QA_Canary",
        "parentRoles": ["viewer"],
        "condition": {
          "match": {
            "none": {
              "of": [
                {"expr": "R.attr.qa == true"},
                {"expr": "R.attr.canary == true"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T13:00:00Z"
  }
}
```

This policy applies if none of the listed conditions are true, i.e., the resource must not be in QA or Canary deployment.

## Nesting Operators for Complex Conditions

Pola supports nesting logical operators to create complex conditions. This is particularly useful when you need to combine several criteria into a single condition block.

### Example of Nested Operators in a Resource Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Allow edits if the resource is a draft, dev, or matches specific patterns.",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "R.attr.status == 'DRAFT'"},
                {
                  "any": {
                    "of": [
                      {"expr": "R.attr.dev == true"},
                      {"expr": "R.attr.id.matches('^[98][0-9]+')"}
                    ]
                  }
                },
                {
                  "none": {
                    "of": [
                      {"expr": "R.attr.qa == true"},
                      {"expr": "R.attr.canary == true"}
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
    "createdBy": "admin",
    "createdAt": "2024-08-19T13:10:00Z"
  }
}
```

This complex block combines three different logical operations:

1. The resource must have a status of "DRAFT."
2. Either the resource is marked as a development resource, or its ID matches a specific pattern.
3. The resource must not be marked for QA or Canary deployment.

This complex condition block ensures that only specific resources are editable under certain circumstances.

## Handling Quotes in Expressions

Since JSON has special rules for handling quotes, it's essential to ensure that expressions are correctly formatted to prevent parsing errors.

### Example of Quotes in Expressions in a Principal Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Check if geography is GB within a Principal Policy.",
  "principalPolicy": {
    "principal": "user",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "'GB' in P.attr.geographies"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T13:20:00Z"
  }
}
```

This policy checks if the principal's geography includes "GB" by using the correct JSON syntax for quotes.

## Using Policy Variables

To avoid redundancy in your condition expressions, you can define variables within the policy. These variables can then be referenced throughout the policy, making it easier to maintain and update your rules.

### Example of Using Variables in a Resource Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Use variables to define project membership.",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:project/*",
    "version": "1.0",
    "variables": {
      "local": {
        "is_project_member": "P.attr.project_id == 'alpha'"
      }
    },
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "V.is_project_member"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T13:30:00Z"
  }
}
```

This policy defines a variable `is_project_member` to check if the principal is part of the project "alpha" and uses this variable in the conditions.

## Leveraging Auxiliary Data

If your system configuration includes auxiliary data sources, such as JWT tokens or other external data, you can access these through the `request.auxData` object. This capability extends the flexibility of your policies, allowing them to incorporate real-time data from various sources.

### Example of Accessing JWT Claims in a Principal Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Check JWT claims to validate principal.",
  "principalPolicy": {
    "principal": "user",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
        "actions": [
          {
            "action": "access",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "'agsirian' in request.auxData.jwt.aud && request.auxData.jwt.iss == 'agsiri'"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T13:40:00Z"
  }
}
```

In this example, the policy checks that the JWT's audience includes "agsirian" and that the token was issued by "agsiri."

## Operators in Pola Expressions

PXL supports a wide range of operators, allowing you to craft precise and powerful conditions. Here’s a summary of the operators you can use:

| Operator | Description                            |
|----------|----------------------------------------|
| `!`      | Logical negation (NOT)                 |
| `-`      | Subtraction/numeric negation           |
| `!=`     | Unequals                               |
| `%`      | Modulo                                 |
| `&&`     | Logical AND                            |
| `||`     | Logical OR                             |
| `*`      | Multiplication                         |
| `+`      | Addition/concatenation                 |
| `/`      | Division                               |
| `<=`     | Less than or equal to                  |
| `<`      | Less than                              |
| `==`     | Equals                                 |
| `>=`     | Greater than or equal to               |
| `>`      | Greater than                           |
| `in`     | Membership in lists or maps            |
| `?:`     | Ternary condition (if-then-else)       |

These operators can be combined in various ways to evaluate complex conditions efficiently.

## Working with Durations

PXL supports duration values, which must be specified in units such as nanoseconds, microseconds, milliseconds, seconds, minutes, or hours. Larger units like days, weeks, or years are not supported due to potential ambiguities, such as daylight saving time transitions.

### Example of Working with Durations in a Resource Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Allow actions only if more than 36 hours have passed since the last access.",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "timestamp(R.attr.lastAccessed) - timestamp(R.attr.lastUpdateTime) > duration('36h')"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "

admin",
    "createdAt": "2024-08-19T13:50:00Z"
  }
}
```

This expression calculates the time difference between the last update and last access times and checks if it exceeds 36 hours.

## Hierarchical Functions

PXL also provides functions for working with hierarchical data structures, such as dotted strings or nested lists. These functions are particularly useful when dealing with complex organizational structures or categorization schemes.

### Example of Hierarchy Functions in a Principal Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Check if a department is an ancestor of another department.",
  "principalPolicy": {
    "principal": "employee",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
        "actions": [
          {
            "action": "access",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "hierarchy(P.attr.department).ancestorOf(hierarchy('a.b.c')) == true"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T14:00:00Z"
  }
}
```

This example checks if the principal's department is an ancestor of "a.b.c" within a hierarchical structure.

## Lists and Maps

PXL includes powerful functions for manipulating lists and maps, which are common data structures in policy conditions. These functions allow you to perform operations like filtering, mapping, and checking for intersections or subsets.

### Example of List and Map Functions in a Derived Role Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Assign 'TeamViewer' role if the principal is part of design or engineering.",
  "derivedRoles": {
    "name": "TeamRoles",
    "definitions": [
      {
        "name": "TeamViewer",
        "parentRoles": ["viewer"],
        "condition": {
          "match": {
            "expr": "hasIntersection(['design', 'engineering'], P.attr.teams)"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T14:10:00Z"
  }
}
```

This expression checks if there is any overlap between the `teams` attribute of the principal and the specified list of teams.

## Mathematical Functions

Mathematical operations are often necessary in policy conditions, especially when dealing with numeric attributes or calculating thresholds.

### Example of Mathematical Functions in an Export Variables Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Export the greatest value of a list.",
  "exportVariables": {
    "name": "max_value",
    "definitions": {
      "greatest_value": "math.greatest([1, 3, 5])"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T14:20:00Z"
  }
}
```

This example returns the greatest value from a list of numbers and exports it as a variable.

## String Manipulation

String manipulation is another common requirement in policy conditions. PXL offers a variety of string functions, such as `contains`, `startsWith`, `substring`, and `replace`.

### Example of String Functions in a Resource Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Allow actions if the department starts with 'mark'.",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "R.attr.department.startsWith('mark')"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T14:30:00Z"
  }
}
```

This condition checks if the `department` attribute of the resource starts with "mark."

## Timestamps and Time Functions

Handling dates and times accurately is crucial in many policies, especially those that involve expiration dates, schedules, or time-based access control.

### Example of Time Functions in a Resource Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Allow access if the resource was last accessed in 2021.",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["access"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "timestamp(R.attr.lastAccessed).getFullYear() == 2021"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T14:40:00Z"
  }
}
```

This expression checks if the resource was last accessed in the year 2021.

## Conclusion

Agsiri Pola policies provide a flexible and powerful way to define access controls using the Pola Expression Language (PXL). By leveraging condition expressions, top-level identifiers, operators, and various built-in functions, you can create policies that accurately reflect your organization's security requirements.

Whether you are working with simple boolean expressions or complex nested conditions, PXL offers the tools you need to ensure that your resources are protected and that actions are only permitted when they meet specific criteria. By mastering the use of condition blocks, variables, auxiliary data, and operators, you can implement a robust policy framework that adapts to the needs of your environment.

This guide serves as a foundation for developing and refining your policies, providing examples and best practices to help you harness the full potential of Agsiri Pola. As you become more familiar with PXL and its capabilities, you'll be able to craft more sophisticated policies that provide the fine-grained access control your systems require.
