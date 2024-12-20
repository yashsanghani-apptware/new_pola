# Chapter 15: Pola JSON Schema: A Comprehensive Guide

---

The Pola JSON Schema is a foundational element of the Pola policy framework, providing the structure and validation necessary to define robust, scalable, and compliant access control policies. This chapter serves as an exhaustive guide to understanding the building blocks of the Pola JSON Schema, detailing both mandatory and optional attributes, and providing practical examples to aid policy writers in creating well-formed policies.

---

## 15.1 Introduction to Pola JSON Schema

The Pola JSON Schema is based on the JSON Schema standard (specifically draft-07) and is designed to ensure that every policy adheres to a consistent and well-defined structure. This not only helps in maintaining the integrity of policies across different environments but also aids in automated validation, debugging, and audit processes.

### Key Components of the Schema

- **$id**: A unique identifier for the schema, which is typically a URL.
- **$schema**: Specifies the version of JSON Schema being used.
- **definitions**: A collection of reusable schema definitions that can be referenced throughout the policy.

*Example*:
```json
{
  "$id": "https://api.agsiri.dev/v1.3.2/agsiri/policy/v1/policy.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

---

## 15.2 The `definitions` Section

The `definitions` section is a crucial part of the Pola JSON Schema, as it houses all the reusable components that can be referenced in different parts of the policy. These definitions are designed to promote modularity and consistency across policies.

### 15.2.1 `agsiri.policy.v1.Condition`

The `Condition` object in the Pola JSON Schema is crucial for defining the circumstances under which a policy should be applied. Conditions allow policy writers to set specific criteria that must be met for the policy’s rules to take effect. The `Condition` object can operate in two primary ways:

1. **Using the `match` object**: This method involves evaluating conditions based on logical expressions and operators like `all`, `any`, `none`, and `expr`, as discussed in the previous section.
2. **Using a `script`**: This method allows for more complex and custom logic through the use of scripts that are evaluated to determine if the condition is met.

Both approaches can be used within a single policy, depending on the requirements and complexity of the conditions.

#### 15.2.1.1 Structure of the `Condition` Object

The `Condition` object is structured as follows:

```json
{
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
}
```

This structure defines that a `Condition` object can contain either a `match` object or a `script` string, but not both at the same time. The `match` object is used for evaluating conditions through logical expressions, while the `script` string allows for more custom logic.

#### 15.2.1.2 Using the `match` Object in Conditions

The `match` object within the `Condition` is the most common way to define criteria that must be met for a policy to apply. It leverages the logical operators (`all`, `any`, `none`, and `expr`) to create conditions that can range from simple to highly complex.

**Example 1: Simple Match Condition**
```json
{
  "condition": {
    "match": {
      "expr": "P.attr.role == 'admin'"
    }
  }
}
```
*Explanation*: This condition checks if the principal's role is `admin`. If true, the policy rule it is attached to will be enforced.

**Example 2: Complex Match Condition with Multiple Criteria**
```json
{
  "condition": {
    "match": {
      "all": {
        "of": [
          { "expr": "P.attr.role == 'editor'" },
          { "expr": "R.attr.status == 'published'" },
          { "expr": "P.attr.department == 'marketing'" }
        ]
      }
    }
  }
}
```
*Explanation*: This condition applies if the principal is an editor in the marketing department and the resource status is published. All these criteria must be true for the condition to pass.

#### 15.2.1.3 Using the `script` Attribute in Conditions

The `script` attribute provides an alternative way to define conditions using custom logic. Scripts are useful when the required condition logic is too complex or dynamic to be handled by the `match` object alone.

**Example 1: Custom Script for Time-Based Access**
```json
{
  "condition": {
    "script": "P.attr.role == 'admin' && (new Date()).getDay() === 5"
  }
}
```
*Explanation*: This script allows access only if the principal’s role is `admin` and today is Friday (day 5 in JavaScript’s `getDay()` method). The script allows for custom logic that goes beyond simple expressions.

**Example 2: Conditional Access Based on Dynamic Factors**
```json
{
  "condition": {
    "script": "P.attr.clearance >= 4 && R.attr.classification !== 'top_secret'"
  }
}
```
*Explanation*: This script grants access if the principal has a clearance level of 4 or higher and the resource is not classified as `top_secret`. This dynamic evaluation is suited for conditions involving multiple, potentially unrelated factors.

#### 15.2.1.4 Combining `match` and `script` Conditions (Advanced Scenarios)

While `match` and `script` cannot be used simultaneously in a single `Condition` object, complex policies often involve multiple conditions that use both `match` and `script` in different parts of the policy. This approach allows for granular control where each condition is tailored to specific criteria.

**Example 1: Mixed Conditions in a Principal Policy**
```json
{
  "principalPolicy": {
    "principal": "employee",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.attr.department == 'hr'" },
                    { "expr": "R.attr.confidential == false" }
                  ]
                }
              }
            }
          },
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "script": "P.attr.role == 'manager' && (new Date()).getHours() >= 8 && (new Date()).getHours() <= 18"
            }
          }
        ]
      }
    ]
  }
}
```
*Explanation*: This example shows a principal policy with two conditions:
1. The `view` action is allowed if the principal is in the HR department and the resource is not confidential (using `match`).
2. The `edit` action is allowed if the principal is a manager and the action is taken during business hours (using `script`).

This mixed approach ensures that different actions within the same policy rule can be governed by conditions best suited to their requirements.

#### 15.2.1.5 Best Practices for Using Conditions

When using the `Condition` object, consider the following best practices to ensure your policies are effective and maintainable:

1. **Use `match` for Simplicity**: Whenever possible, use the `match` object for conditions. It is simpler, easier to read, and benefits from standardized logical operators.
   
2. **Reserve `script` for Complexity**: Use the `script` attribute only when the condition logic cannot be effectively expressed using `match`. This keeps your policies simpler and more maintainable.

3. **Test Custom Scripts Extensively**: Scripts introduce custom logic that must be thoroughly tested to ensure they behave as expected across different scenarios.

4. **Document Complex Conditions**: When using `script` or complex nested `match` conditions, include comments or annotations to explain the logic, making it easier for others (or your future self) to understand the policy’s intent.

5. **Consider Performance**: While scripts offer flexibility, they can also introduce performance overhead, especially if they involve complex computations. Use them judiciously and optimize the logic where possible.

6. **Leverage Variables**: Use policy variables to simplify complex conditions. Variables can store commonly used expressions or results, making the policy easier to read and manage.

#### 15.2.1.6 Additional Examples of `Condition` Usage

To provide further clarity, let's explore more examples that showcase different ways to use conditions in Pola policies.

**Example 1: Role and Time-Based Access Control**
```json
{
  "condition": {
    "script": "P.attr.role == 'supervisor' && (new Date()).getHours() >= 9 && (new Date()).getHours() <= 17"
  }
}
```
*Explanation*: This policy condition ensures that only supervisors can access the resource during standard business hours.

**Example 2: Resource Sensitivity and Clearance Check**
```json
{
  "condition": {
    "match": {
      "all": {
        "of": [
          { "expr": "P.attr.clearance >= 3" },
          { "expr": "R.attr.sensitivity <= 2" }
        ]
      }
    }
  }
}
```
*Explanation*: This condition allows access if the principal has a clearance level of 3 or higher and the resource has a sensitivity level of 2 or lower.

**Example 3: Exclusion Based on Department and Resource Type**
```json
{
  "condition": {
    "match": {
      "none": {
        "of": [
          { "expr": "P.attr.department == 'legal'" },
          { "expr": "R.attr.type == 'restricted'" }
        ]
      }
    }
  }
}
```
*Explanation*: This condition denies access if the principal belongs to the legal department or if the resource type is `restricted`.

**Example 4: Dynamic Script for Multi-Factor Condition**
```json
{
  "condition": {
    "script": "P.attr.mfa_enabled == true && P.attr.last_login_within_30_days == true"
  }
}
```
*Explanation*: This script ensures that access is only granted to principals who have multi-factor authentication enabled and have logged in within the last 30 days.

**Example 5: Combining Match and Script in a Derived Role Policy**
```json
{
  "

derivedRoles": {
    "name": "ProjectManagerRoles",
    "definitions": [
      {
        "name": "ProjectManager",
        "parentRoles": ["manager"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.attr.department == 'operations'" },
                { "expr": "P.attr.project == R.attr.project" }
              ]
            }
          }
        }
      },
      {
        "name": "SeniorManager",
        "parentRoles": ["manager"],
        "condition": {
          "script": "P.attr.years_experience >= 10 && R.attr.budget > 100000"
        }
      }
    ]
  }
}
```
*Explanation*: In this derived role policy:
1. The `ProjectManager` role is assigned if the principal is in the operations department and the project matches the resource project (using `match`).
2. The `SeniorManager` role is assigned if the principal has 10 or more years of experience and the resource’s budget exceeds $100,000 (using `script`).

This example demonstrates the versatility of using both `match` and `script` within a single policy structure.

---

By fully understanding and utilizing the `Condition` object, policy writers can craft nuanced and effective policies that align precisely with organizational requirements. Whether using the straightforward `match` object or the more flexible `script` approach, the `Condition` object is central to defining the logic that governs access control in Pola policies. The provided examples and best practices should serve as a comprehensive guide for leveraging this powerful feature in your policy development process.
### 15.2.2  `agsiri.policy.v1.Match`

The `Match` object is one of the most powerful tools in the Pola JSON Schema. It defines how different conditions within a policy are evaluated and combined to determine whether the policy should be applied. The `Match` object can operate with the following logical operators:

1. **`all`**: All conditions in the list must be true.
2. **`any`**: At least one condition in the list must be true.
3. **`none`**: None of the conditions in the list should be true.
4. **`expr`**: A single expression that evaluates to true or false.

Each of these operators can be used individually or nested within one another to create complex and fine-grained policies. Let's explore each operator in detail with examples.

#### 15.2.2.1 The `all` Operator

The `all` operator is used when you want every condition in a list to be true for the policy to apply. This operator is typically used in scenarios where multiple criteria must be met simultaneously.

**Example 1: Access Control Based on Role and Status**
```json
{
  "match": {
    "all": {
      "of": [
        { "expr": "P.attr.role == 'admin'" },
        { "expr": "R.attr.status == 'active'" }
      ]
    }
  }
}
```
*Explanation*: In this policy, access is granted only if the principal's role is `admin` and the resource status is `active`. Both conditions must be true for the policy to apply.

**Example 2: Time and Location-Based Access**
```json
{
  "match": {
    "all": {
      "of": [
        { "expr": "P.attr.geography == 'US'" },
        { "expr": "now().getHours() >= 9" },
        { "expr": "now().getHours() <= 17" }
      ]
    }
  }
}
```
*Explanation*: This policy allows access only if the user is in the US and the current time is between 9 AM and 5 PM. It ensures that access is restricted to business hours for users in a specific region.

#### 15.2.2.2 The `any` Operator

The `any` operator is used when you want at least one condition in a list to be true for the policy to apply. This operator is useful in scenarios where meeting any one of several conditions is sufficient.

**Example 1: Multiple Department Access**
```json
{
  "match": {
    "any": {
      "of": [
        { "expr": "P.attr.department == 'finance'" },
        { "expr": "P.attr.department == 'hr'" }
      ]
    }
  }
}
```
*Explanation*: This policy allows access if the principal belongs to either the finance or HR department. Only one of these conditions needs to be true for the policy to apply.

**Example 2: Resource Status or Clearance Level**
```json
{
  "match": {
    "any": {
      "of": [
        { "expr": "R.attr.status == 'approved'" },
        { "expr": "P.attr.clearance_level >= 5" }
      ]
    }
  }
}
```
*Explanation*: Access is granted if the resource status is `approved` or if the principal has a clearance level of 5 or higher. This flexibility allows for access based on either approval status or high-level clearance.

#### 15.2.2.3 The `none` Operator

The `none` operator is used when you want to ensure that none of the conditions in a list are true. This is particularly useful for enforcing negative conditions or exclusions.

**Example 1: Exclude Certain Roles from Access**
```json
{
  "match": {
    "none": {
      "of": [
        { "expr": "P.attr.role == 'guest'" },
        { "expr": "P.attr.role == 'contractor'" }
      ]
    }
  }
}
```
*Explanation*: This policy denies access if the principal's role is either `guest` or `contractor`. The policy is applied only when neither of these roles are assigned to the principal.

**Example 2: Restrict Access During Maintenance**
```json
{
  "match": {
    "none": {
      "of": [
        { "expr": "R.attr.status == 'maintenance'" },
        { "expr": "R.attr.status == 'decommissioned'" }
      ]
    }
  }
}
```
*Explanation*: This policy prevents access to resources that are under maintenance or have been decommissioned. It ensures that no access is granted if either condition is true.

#### 15.2.2.4 The `expr` Operator

The `expr` operator is used for single conditions that must evaluate to true or false. This operator is ideal for simple, straightforward conditions that do not require combining multiple criteria.

**Example 1: Check for Active Subscription**
```json
{
  "match": {
    "expr": "P.attr.subscription_status == 'active'"
  }
}
```
*Explanation*: This policy allows access only if the principal's subscription status is `active`. It’s a simple condition that checks a single attribute.

**Example 2: Ensure Resource Availability**
```json
{
  "match": {
    "expr": "R.attr.available == true"
  }
}
```
*Explanation*: Access is granted if the resource is marked as available. This ensures that resources are only accessed when they are in an available state.

#### 15.2.2.5 Nesting Match Operators

Pola allows you to nest `all`, `any`, and `none` operators within each other to create more complex logical structures. This nesting is particularly powerful for scenarios requiring multiple layers of conditions.

**Example 1: Complex Departmental and Time-Based Access**
```json
{
  "match": {
    "all": {
      "of": [
        {
          "any": {
            "of": [
              { "expr": "P.attr.department == 'engineering'" },
              { "expr": "P.attr.department == 'operations'" }
            ]
          }
        },
        {
          "none": {
            "of": [
              { "expr": "R.attr.status == 'maintenance'" }
            ]
          }
        },
        {
          "expr": "now().getHours() >= 6 && now().getHours() <= 18"
        }
      ]
    }
  }
}
```
*Explanation*: This policy allows access to resources if the principal belongs to either the engineering or operations department, the resource is not under maintenance, and the access occurs between 6 AM and 6 PM. This policy combines multiple logical operators to enforce complex access rules.

**Example 2: Role and Project-Based Access with Exceptions**
```json
{
  "match": {
    "all": {
      "of": [
        { "expr": "P.attr.role == 'manager'" },
        {
          "any": {
            "of": [
              { "expr": "P.attr.project == 'ProjectX'" },
              { "expr": "P.attr.project == 'ProjectY'" }
            ]
          }
        },
        {
          "none": {
            "of": [
              { "expr": "R.attr.sensitive == true" }
            ]
          }
        }
      ]
    }
  }
}
```
*Explanation*: This policy allows access if the principal is a manager working on either Project X or Project Y, but only if the resource is not marked as sensitive. The nested operators enable a nuanced access control mechanism that takes multiple factors into account.

#### 15.2.2.6 Best Practices for Using `Match`

To effectively use the `Match` object in your policies, consider the following best practices:

1. **Start Simple**: Begin with simple conditions using `expr` and gradually introduce `all`, `any`, and `none` as needed.
   
2. **Combine with Care**: When nesting operators, ensure that the logical structure makes sense and that conditions are not conflicting.

3. **Test Extensively**: Complex conditions should be thoroughly tested to ensure they work as intended across all scenarios.

4. **Document Intent**: When using nested and complex conditions, include comments or annotations to explain the logic and intent behind the policy.

5. **Use Variables**: Define variables for commonly used expressions to simplify your conditions and make them easier to maintain.

---

By thoroughly understanding and utilizing the `Match` object and its operators, you can craft highly effective and precise Pola policies. These tools give you the flexibility to enforce nuanced access control rules that align with your organization’s security requirements, ensuring that the right individuals have access to the right resources under the right conditions.

Certainly! Let's dive deep into **section 15.2.3** with a focus on the `agsiri.policy.v1.DerivedRoles` object. This section will provide a comprehensive explanation, including examples, to help policy writers effectively utilize derived roles in their Pola policies.

---

### 15.2.3 `agsiri.policy.v1.DerivedRoles`

The `DerivedRoles` object in the Pola JSON Schema is a powerful feature that allows policy writers to define roles that are dynamically assigned based on specific conditions. These derived roles enhance the flexibility and granularity of access control within a system, enabling policies to adapt to the context in which they are evaluated.

Derived roles are particularly useful in complex environments where static role assignments are insufficient to capture the nuances of access control requirements. By leveraging conditions and parent roles, derived roles can be created and applied dynamically, providing a more precise and responsive security model.

#### 15.2.3.1 Structure of the `DerivedRoles` Object

The `DerivedRoles` object is structured as follows:

```json
{
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
}
```

This structure defines the `DerivedRoles` object with three key components:

1. **`name` (Required)**: A unique identifier for the derived role.
2. **`definitions` (Required)**: An array of role definitions, each defining a specific derived role and its associated conditions.
3. **`variables` (Optional)**: A set of variables that can be used within the derived role definitions.

#### 15.2.3.2 `name` Attribute

The `name` attribute is a string that uniquely identifies the derived role group. This name must follow a specific pattern (`^[\\-\\.0-9A-Z_a-z]+$`) and cannot be empty. The name is used to reference the derived roles in policies and must be distinct within the context of the policy.

**Example 1: Naming a Derived Role Group**
```json
{
  "derivedRoles": {
    "name": "ProjectRoles"
  }
}
```
*Explanation*: The `name` here is `ProjectRoles`, which will be used to identify this set of derived roles in the policy.

#### 15.2.3.3 `definitions` Array

The `definitions` array is the core of the `DerivedRoles` object. Each item in this array is a `RoleDef` object that defines a specific derived role, its parent roles, and the conditions under which it is assigned.

The `RoleDef` object includes:

1. **`name` (Required)**: The name of the derived role.
2. **`parentRoles` (Required)**: An array of one or more roles from which this derived role inherits permissions.
3. **`condition` (Optional)**: A condition that must be met for the derived role to be assigned. This condition can be specified using either a `match` object or a `script`.
4. **`variables` (Optional)**: Any additional variables specific to this derived role.

**Example 2: Defining a Simple Derived Role**
```json
{
  "derivedRoles": {
    "name": "ProjectRoles",
    "definitions": [
      {
        "name": "ProjectViewer",
        "parentRoles": ["viewer"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.attr.project == R.attr.project" },
                { "expr": "R.attr.visibility == 'public'" }
              ]
            }
          }
        }
      }
    ]
  }
}
```
*Explanation*: In this example, the `ProjectViewer` role is derived from the `viewer` role. It is assigned only if the principal's project matches the resource's project and the resource's visibility is set to `public`.

#### 15.2.3.4 Conditions in Derived Roles

Conditions in derived roles are similar to conditions in other parts of Pola policies. They determine whether the derived role should be assigned based on specific criteria. Conditions can be defined using the `match` object for logical expressions or the `script` attribute for custom logic.

**Example 3: Complex Derived Role with Nested Conditions**
```json
{
  "derivedRoles": {
    "name": "DepartmentRoles",
    "definitions": [
      {
        "name": "DeptManager",
        "parentRoles": ["manager"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.attr.department == R.attr.department" },
                { "expr": "P.attr.role == 'manager'" },
                {
                  "any": {
                    "of": [
                      { "expr": "R.attr.budget > 100000" },
                      { "expr": "R.attr.priority == 'high'" }
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    ]
  }
}
```
*Explanation*: The `DeptManager` role is derived from the `manager` role. It is assigned if the principal and resource are in the same department, the principal's role is `manager`, and either the resource's budget is over $100,000 or its priority is `high`.

#### 15.2.3.5 Using `script` for Custom Logic

While the `match` object is suitable for most conditions, there are cases where custom logic is necessary. The `script` attribute allows you to write complex conditions that can handle more dynamic or non-standard criteria.

**Example 4: Derived Role with a Script-Based Condition**
```json
{
  "derivedRoles": {
    "name": "AdvancedRoles",
    "definitions": [
      {
        "name": "SeniorDeveloper",
        "parentRoles": ["developer"],
        "condition": {
          "script": "P.attr.years_experience >= 5 && R.attr.technology == 'cloud'"
        }
      }
    ]
  }
}
```
*Explanation*: The `SeniorDeveloper` role is assigned if the principal has at least 5 years of experience and the resource is related to `cloud` technology. The script allows for a more tailored evaluation that combines multiple attributes.

#### 15.2.3.6 Variables in Derived Roles

Variables in derived roles can simplify the policy by storing reusable values or expressions. These variables can be local to the derived role or imported from other parts of the policy.

**Example 5: Using Variables in a Derived Role**
```json
{
  "derivedRoles": {
    "name": "ProjectRoles",
    "variables": {
      "local": {
        "is_lead": "P.attr.role == 'lead'",
        "high_priority": "R.attr.priority == 'high'"
      }
    },
    "definitions": [
      {
        "name": "LeadDeveloper",
        "parentRoles": ["developer"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "V.is_lead" },
                { "expr": "V.high_priority" }
              ]
            }
          }
        }
      }
    ]
  }
}
```
*Explanation*: In this example, the `LeadDeveloper` role is assigned if the principal is a lead and the resource is high priority. The use of local variables `is_lead` and `high_priority` makes the condition more readable and easier to manage.

#### 15.2.3.7 Advanced Use Cases with Derived Roles

Derived roles can be extremely powerful in complex environments, allowing for dynamic role assignment based on intricate conditions. Here are some advanced use cases to illustrate the versatility of derived roles.

**Example 6: Time-Based Role Assignment**
```json
{
  "derivedRoles": {
    "name": "TimeSensitiveRoles",
    "definitions": [
      {
        "name": "AfterHoursSupport",
        "parentRoles": ["support"],
        "condition": {
          "script": "(new Date()).getHours() >= 18 || (new Date()).getHours() < 6"
        }
      }
    ]
  }
}
```
*Explanation*: The `AfterHoursSupport` role is assigned if the current time is outside of normal business hours (before 6 AM or after 6 PM). This dynamic role assignment is useful for scenarios where different permissions are required based on the time of day.

**Example 7: Location-Based Role Assignment**
```json
{
  "derivedRoles": {
    "name": "LocationRoles",
    "definitions": [
      {
        "name": "OnsiteManager",
        "parentRoles": ["manager"],
        "condition": {
          "match": {
            "expr": "P.attr.location == 'onsite'"
          }
        }
      },
      {
        "name": "RemoteWorker",
        "parentRoles": ["employee"],
        "condition": {
          "match": {
            "expr": "P.attr.location == 'remote'"
          }
        }
      }
    ]
  }
}
```
*Explanation*: The `OnsiteManager` role is assigned to principals located onsite, while the `RemoteWorker` role is assigned to those working remotely. This differentiation allows for distinct permissions

 based on the principal's location.

**Example 8: Role Assignment Based on Hierarchical Data**
```json
{
  "derivedRoles": {
    "name": "HierarchyRoles",
    "definitions": [
      {
        "name": "TeamLead",
        "parentRoles": ["lead"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.attr.team == 'engineering'" },
                { "expr": "P.attr.level == 3" }
              ]
            }
          }
        }
      }
    ]
  }
}
```
*Explanation*: The `TeamLead` role is assigned to engineering team members who are at level 3. This hierarchical condition ensures that only those at a specific level within a particular team are assigned this role.

#### 15.2.3.8 Best Practices for Using Derived Roles

When defining derived roles, consider the following best practices:

1. **Clarity**: Ensure that the conditions for derived roles are clear and straightforward. Complex conditions should be well-documented to avoid confusion.
2. **Modularity**: Use variables to break down complex conditions into smaller, reusable components. This approach improves readability and maintainability.
3. **Testing**: Regularly test derived roles under different scenarios to ensure they behave as expected. This is especially important in dynamic environments where roles may change frequently.
4. **Performance**: Be mindful of the performance impact of complex conditions, especially when using scripts. Optimize conditions to minimize the computational overhead during policy evaluation.

---

By thoroughly understanding and effectively utilizing the `DerivedRoles` object, policy writers can create flexible and dynamic access control policies that respond to various organizational requirements. The examples provided above demonstrate the versatility of derived roles and offer a foundation for developing advanced and nuanced policies in your Pola framework.

### 15.2.4 `agsiri.policy.v1.ExportVariables`

The `ExportVariables` object in the Pola JSON Schema is a powerful feature that allows policy writers to define variables that can be shared and reused across multiple policies. Export variables enhance the modularity and reusability of policies by allowing commonly used expressions or data points to be defined once and referenced in various contexts.

Export variables are particularly useful in complex policy environments where certain conditions or calculations are frequently reused. By defining these variables in a centralized way, you can simplify policy management, reduce redundancy, and ensure consistency across your policy framework.

#### 15.2.4.1 Structure of the `ExportVariables` Object

The `ExportVariables` object is structured as follows:

```json
{
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
}
```

This structure defines the `ExportVariables` object with two key components:

1. **`name` (Required)**: A unique identifier for the set of export variables.
2. **`definitions` (Optional but Commonly Used)**: An object where each key is the name of an export variable, and the value is a string representing the expression or data that the variable holds.

#### 15.2.4.2 `name` Attribute

The `name` attribute is a string that uniquely identifies the export variable group. This name must follow a specific pattern (`^[\\-\\.0-9A-Z_a-z]+$`) and cannot be empty. The name is used to reference the export variables in other parts of the policy and must be unique within the context of the policy framework.

**Example 1: Naming an Export Variable Group**
```json
{
  "exportVariables": {
    "name": "CommonCalculations"
  }
}
```
*Explanation*: The `name` here is `CommonCalculations`, which will be used to identify this set of export variables in the policy.

#### 15.2.4.3 `definitions` Object

The `definitions` object is where the actual export variables are defined. Each key in this object represents the name of an export variable, and the associated value is a string that defines the variable's value or expression. These variables can then be referenced throughout other policies, making complex policies easier to write and maintain.

**Example 2: Defining Simple Export Variables**
```json
{
  "exportVariables": {
    "name": "ProjectMetrics",
    "definitions": {
      "high_budget": "R.attr.budget > 100000",
      "is_critical": "R.attr.priority == 'high'",
      "is_in_qa": "R.attr.qa == true"
    }
  }
}
```
*Explanation*: This example defines three export variables within the `ProjectMetrics` group:
- `high_budget`: Evaluates to `true` if the resource's budget exceeds $100,000.
- `is_critical`: Evaluates to `true` if the resource's priority is marked as `high`.
- `is_in_qa`: Evaluates to `true` if the resource is in the QA phase.

These variables can be reused across different policies, reducing redundancy and ensuring consistency.

#### 15.2.4.4 Using Export Variables in Policies

Once export variables are defined, they can be referenced in other parts of your policies, such as conditions, rules, or even within other variable definitions. This makes your policies more modular and easier to manage.

**Example 3: Using Export Variables in a Resource Policy**
```json
{
  "resourcePolicy": {
    "version": "1.0",
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "V.high_budget" },
                { "expr": "V.is_critical" }
              ]
            }
          }
        }
      }
    ]
  },
  "exportVariables": {
    "name": "ProjectMetrics",
    "definitions": {
      "high_budget": "R.attr.budget > 100000",
      "is_critical": "R.attr.priority == 'high'"
    }
  }
}
```
*Explanation*: In this resource policy, the actions "view" and "edit" are allowed only if both `high_budget` and `is_critical` are true. These conditions reference export variables defined in the same policy, demonstrating how export variables can simplify complex conditions.

#### 15.2.4.5 Advanced Use Cases with Export Variables

Export variables can be particularly powerful in scenarios that require complex calculations or checks that are reused across multiple policies or rules. Here are some advanced examples that illustrate the versatility of export variables.

**Example 4: Time-Based Export Variables**
```json
{
  "exportVariables": {
    "name": "TimeBasedChecks",
    "definitions": {
      "is_weekend": "(new Date()).getDay() == 0 || (new Date()).getDay() == 6",
      "is_after_hours": "(new Date()).getHours() >= 18 || (new Date()).getHours() < 6"
    }
  }
}
```
*Explanation*: This example defines two export variables related to time:
- `is_weekend`: Evaluates to `true` if the current day is a weekend (Saturday or Sunday).
- `is_after_hours`: Evaluates to `true` if the current time is outside of normal business hours (before 6 AM or after 6 PM).

These variables can then be used to control access based on the time of the request.

**Example 5: Combining Multiple Export Variables**
```json
{
  "exportVariables": {
    "name": "ComplexConditions",
    "definitions": {
      "is_senior_employee": "P.attr.years_experience >= 10",
      "has_high_access": "P.attr.access_level >= 7",
      "is_high_value_project": "R.attr.value > 500000"
    }
  },
  "resourcePolicy": {
    "version": "1.0",
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "rules": [
      {
        "actions": ["delete"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "V.is_senior_employee" },
                { "expr": "V.has_high_access" },
                { "expr": "V.is_high_value_project" }
              ]
            }
          }
        }
      }
    ]
  }
}
```
*Explanation*: In this advanced example, three export variables are defined in the `ComplexConditions` group:
- `is_senior_employee`: Checks if the principal has 10 or more years of experience.
- `has_high_access`: Checks if the principal's access level is 7 or higher.
- `is_high_value_project`: Checks if the resource's value exceeds $500,000.

These variables are used in a resource policy to allow the "delete" action only if all three conditions are met.

**Example 6: Export Variables for Regulatory Compliance**
```json
{
  "exportVariables": {
    "name": "ComplianceChecks",
    "definitions": {
      "is_gdpr_compliant": "P.attr.location == 'EU' && R.attr.data_classification != 'sensitive'",
      "is_hipaa_compliant": "R.attr.data_classification == 'medical' && P.attr.role == 'healthcare_provider'"
    }
  }
}
```
*Explanation*: This example defines two export variables for regulatory compliance:
- `is_gdpr_compliant`: Ensures that access is compliant with GDPR regulations by checking the principal's location and the data classification of the resource.
- `is_hipaa_compliant`: Ensures that access is compliant with HIPAA regulations by checking that the resource's data classification is medical and that the principal's role is a healthcare provider.

These variables can be referenced across multiple policies to ensure consistent enforcement of regulatory requirements.

#### 15.2.4.6 Best Practices for Using Export Variables

When defining and using export variables, consider the following best practices:

1. **Modularity**: Break down complex conditions into smaller, reusable export variables. This modular approach makes your policies easier to understand and maintain.
2. **Consistency**: Define commonly used conditions or calculations as export variables to ensure they are applied consistently across all relevant policies.
3. **Documentation**: Document the purpose and logic behind each export variable, especially in complex scenarios. This will make it easier for others (or your future self) to understand and maintain the policies.
4. **Testing**: Regularly test policies that use export variables to ensure they behave as expected, especially when variables are updated or reused in different contexts.
5. **Performance**: Be mindful of the performance implications of complex or computationally expensive expressions in export variables. Optimize where possible to minimize the impact on policy evaluation times.

#### 15.2.4.7 Debugging and Troubleshooting Export Variables

Given the importance of export variables in complex policies, it is crucial to have strategies for debugging and troubleshooting. When an issue

 arises, consider the following steps:

- **Isolate the Variable**: Test the export variable independently to ensure it evaluates as expected.
- **Log Outputs**: If supported by your environment, log the outputs of export variables during policy evaluation to verify their values.
- **Simplify Expressions**: Break down complex expressions into simpler components to identify the source of any issues.
- **Check Dependencies**: Ensure that any variables or data points that the export variable relies on are available and correctly defined.

**Example 7: Logging Export Variable Outputs**
```json
{
  "exportVariables": {
    "name": "DebuggingExample",
    "definitions": {
      "is_vip": "P.attr.customer_status == 'VIP'",
      "debug_vip_check": "log('VIP Check: ' + P.attr.customer_status)"
    }
  }
}
```
*Explanation*: In this example, the `debug_vip_check` variable logs the `customer_status` of the principal during evaluation. This can help identify issues if the `is_vip` variable is not behaving as expected.

---

By understanding and effectively utilizing the `ExportVariables` object, policy writers can greatly enhance the modularity, reusability, and maintainability of their policies. The examples and best practices provided above offer a solid foundation for leveraging export variables in the Pola policy framework, enabling you to write more efficient and powerful policies.

### 15.2.5 `agsiri.policy.v1.PrincipalPolicy`

The `PrincipalPolicy` object is a key component of the Pola policy framework, designed to define access control rules based on the attributes of a principal, such as a user or a group of users. Principal policies specify what actions a principal can perform on certain resources under specific conditions. These policies are essential for enforcing fine-grained access control in complex systems, where different users may have varying levels of permissions based on their roles, attributes, or other contextual factors.

#### 15.2.5.1 Structure of the `PrincipalPolicy` Object

The `PrincipalPolicy` object is structured as follows:

```json
{
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
}
```

This structure defines the `PrincipalPolicy` object with several key components:

1. **`principal` (Required)**: A string that identifies the principal to which the policy applies. This could be a specific user, group, or role.
2. **`rules` (Optional but Commonly Used)**: An array of rules that define the actions the principal can perform on specific resources, including any conditions that must be met.
3. **`scope` (Optional)**: A string that defines the scope within which the policy is valid. This can be used to limit the policy's application to specific contexts or environments.
4. **`variables` (Optional)**: A set of variables that can be used within the policy to simplify expressions and reduce redundancy.
5. **`version` (Required)**: A string that specifies the version of the policy. This is important for managing policy updates and ensuring compatibility.

#### 15.2.5.2 `principal` Attribute

The `principal` attribute is a string that uniquely identifies the principal to which the policy applies. This could be a specific user, a group of users, or a role. The principal must be defined with a non-empty string that adheres to the required pattern.

**Example 1: Defining a Principal for a User**
```json
{
  "principalPolicy": {
    "principal": "user:john_doe"
  }
}
```
*Explanation*: This policy applies to the user identified as `john_doe`.

**Example 2: Defining a Principal for a Group**
```json
{
  "principalPolicy": {
    "principal": "group:engineering_team"
  }
}
```
*Explanation*: This policy applies to all members of the `engineering_team` group.

#### 15.2.5.3 `rules` Array

The `rules` array is where the actual access control rules are defined. Each rule specifies what actions the principal can perform on specific resources and under what conditions. These rules are defined using the `PrincipalRule` object, which we will explore in detail.

**Example 3: Basic Rule for a Principal**
```json
{
  "principalPolicy": {
    "principal": "user:john_doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  }
}
```
*Explanation*: This policy allows the user `john_doe` to view all resources in the specified data room.

#### 15.2.5.4 `scope` Attribute

The `scope` attribute is an optional string that defines the scope within which the policy is valid. This can be used to limit the policy's application to specific environments, such as production, development, or a particular geographical region. The `scope` must match the specified pattern to be valid.

**Example 4: Defining a Scope for a Principal Policy**
```json
{
  "principalPolicy": {
    "principal": "user:john_doe",
    "version": "1.0",
    "scope": "production"
  }
}
```
*Explanation*: This policy is only applicable in the `production` environment.

#### 15.2.5.5 `variables` Object

The `variables` object allows you to define local variables within the policy. These variables can be referenced throughout the policy to simplify expressions and reduce redundancy. The `variables` object can include both local variables and imported variables from other sources.

**Example 5: Using Variables in a Principal Policy**
```json
{
  "principalPolicy": {
    "principal": "user:john_doe",
    "version": "1.0",
    "variables": {
      "local": {
        "is_admin": "P.attr.role == 'admin'"
      }
    },
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "V.is_admin"
              }
            }
          }
        ]
      }
    ]
  }
}
```
*Explanation*: This policy allows the user `john_doe` to edit resources in the specified data room only if they have the `admin` role. The `is_admin` variable is defined once and reused in the condition.

#### 15.2.5.6 `version` Attribute

The `version` attribute is a string that specifies the version of the policy. This is important for managing policy updates, ensuring compatibility, and tracking changes over time. The version string must follow the specified pattern to be valid.

**Example 6: Versioning a Principal Policy**
```json
{
  "principalPolicy": {
    "principal": "user:john_doe",
    "version": "1.1"
  }
}
```
*Explanation*: This policy is identified as version `1.1`, indicating that it may have been updated from a previous version.

#### 15.2.5.7 Defining Complex Rules in `PrincipalPolicy`

Principal policies can include complex rules that involve multiple actions, conditions, and outputs. By leveraging the flexibility of the `PrincipalRule` object, you can create detailed access control scenarios that meet specific security requirements.

**Example 7: Complex Rule with Multiple Conditions**
```json
{
  "principalPolicy": {
    "principal": "user:john_doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    { "expr": "P.attr.role == 'admin'" },
                    { "expr": "P.attr.department == 'engineering'" }
                  ]
                }
              }
            }
          },
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  }
}
```
*Explanation*: This policy allows the user `john_doe` to delete resources in the specified data room only if they are an `admin` in the `engineering` department. The user can also view the resources without any additional conditions.

#### 15.2.5.8 Incorporating Outputs in `PrincipalPolicy`

Outputs can be defined within a `PrincipalPolicy` to provide feedback or trigger additional actions based on the policy's evaluation. Outputs are useful in scenarios where you need to log actions, notify other systems, or trigger workflows when certain conditions are met.

**Example 8: Defining Outputs in a Principal Policy**
```json
{
  "principalPolicy": {
    "principal": "user:john_doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
        "actions": [
          {
            "action": "access",
            "effect": "EFFECT_ALLOW",
            "output": {
              "expr": "log('User john_doe accessed the resource')"
            }
          }
        ]
      }
    ]
  }
}
```
*Explanation*: This policy allows the user `john_doe` to access resources in the specified data room and logs a message each time the resource is accessed.

#### 15.2.5.9 Best Practices for Using `PrincipalPolicy`

When defining `PrincipalPolicy` objects, consider the following best practices:

1. **Clarity**: Clearly define the principal and the actions they are allowed to perform. Avoid overly complex conditions that could make the policy difficult to understand or maintain.
2. **Reusability**: Use variables and

 outputs to simplify the policy and make it more reusable across different scenarios.
3. **Versioning**: Always specify a version for your policies to track changes and ensure compatibility with other system components.
4. **Testing**: Test your policies thoroughly in different environments (e.g., development, staging, production) to ensure they behave as expected.

#### 15.2.5.10 Common Pitfalls and Troubleshooting

When working with `PrincipalPolicy` objects, you may encounter issues such as unexpected behavior or errors during policy evaluation. Here are some tips for troubleshooting:

- **Check Conditions**: Ensure that all conditions are correctly defined and that the logic accurately reflects the intended access control rules.
- **Review Variables**: Verify that any variables used in the policy are correctly defined and that their values are as expected during evaluation.
- **Validate JSON**: Ensure that the JSON structure of the policy conforms to the schema, particularly when defining complex rules or using advanced features like outputs.
- **Log Outputs**: Use outputs to log policy evaluations and identify where the policy may not be behaving as expected.

**Example 9: Troubleshooting with Logging**
```json
{
  "principalPolicy": {
    "principal": "user:john_doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "P.attr.role == 'editor'"
              }
            },
            "output": {
              "expr": "log('Edit action evaluated for john_doe with role: ' + P.attr.role)"
            }
          }
        ]
      }
    ]
  }
}
```
*Explanation*: In this example, the policy logs the principal's role each time the `edit` action is evaluated. This can help troubleshoot issues related to role-based access control.

---

By understanding and effectively utilizing the `PrincipalPolicy` object, policy writers can create robust and flexible access control policies tailored to specific users, groups, or roles. The examples and best practices provided above offer a comprehensive guide for leveraging `PrincipalPolicy` in the Pola policy framework, enabling the creation of effective, maintainable, and secure policies.

### 15.2.6 `agsiri.policy.v1.ResourcePolicy`

The `ResourcePolicy` object in the Pola policy framework is a critical tool for defining access controls based on the attributes and conditions of specific resources. This object enables policy writers to craft detailed and precise policies that determine what actions can be performed on resources, under what conditions, and by whom. By leveraging the `ResourcePolicy` object, you can ensure that resources within your system are accessed and manipulated only in ways that align with your security and operational requirements.

#### 15.2.6.1 Structure of the `ResourcePolicy` Object

The `ResourcePolicy` object is structured as follows:

```json
{
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
}
```

This structure defines the `ResourcePolicy` object with several key components:

1. **`importDerivedRoles` (Optional)**: An array of strings that specifies the derived roles to be imported into the policy. These roles can be used within the policy's rules to grant or deny permissions based on predefined roles.
2. **`resource` (Required)**: A string that identifies the specific resource or resources to which the policy applies. This field must be a non-empty string.
3. **`rules` (Optional but Commonly Used)**: An array of rules that define the actions that can be performed on the resource, including any conditions and effects associated with those actions.
4. **`schemas` (Optional)**: A reference to schemas that validate the attributes of the principal and resource involved in the policy. This ensures that only valid and expected data is processed by the policy.
5. **`scope` (Optional)**: A string that defines the scope within which the policy is valid. This can be used to limit the policy's application to specific contexts or environments.
6. **`variables` (Optional)**: A set of variables that can be used within the policy to simplify expressions and reduce redundancy.
7. **`version` (Required)**: A string that specifies the version of the policy. This is important for managing policy updates and ensuring compatibility.

#### 15.2.6.2 `importDerivedRoles` Attribute

The `importDerivedRoles` attribute allows you to import derived roles into the policy. Derived roles are roles that are dynamically assigned based on conditions or other roles. By importing these roles, you can leverage existing role definitions within your resource policies.

**Example 1: Importing Derived Roles**
```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "version": "1.0",
    "importDerivedRoles": [
      "editor_roles",
      "viewer_roles"
    ]
  }
}
```
*Explanation*: This policy imports two sets of derived roles, `editor_roles` and `viewer_roles`, which can be used within the policy's rules.

#### 15.2.6.3 `resource` Attribute

The `resource` attribute specifies the resource or set of resources to which the policy applies. This is a critical field, as it defines the scope of the policy's influence. The resource identifier must be a non-empty string that adheres to the ARI (Agsiri Resource Identifier) format.

**Example 2: Defining a Resource in a Policy**
```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:project:us:123456789012:project/*",
    "version": "1.0"
  }
}
```
*Explanation*: This policy applies to all projects under the specified account and region.

#### 15.2.6.4 `rules` Array

The `rules` array is where the core logic of the resource policy is defined. Each rule specifies what actions can be performed on the resource, under what conditions, and with what effects. These rules are defined using the `ResourceRule` object, which allows for detailed and precise control over resource access.

**Example 3: Basic Rule for a Resource**
```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view"],
        "effect": "EFFECT_ALLOW",
        "roles": ["viewer"]
      }
    ]
  }
}
```
*Explanation*: This policy allows any principal with the `viewer` role to view resources in the specified data room.

#### 15.2.6.5 `schemas` Attribute

The `schemas` attribute provides a mechanism to validate the attributes of both the principal and the resource against predefined schemas. By enforcing schemas, you can ensure that the data used in policy evaluations conforms to expected formats and structures, reducing the risk of errors and inconsistencies.

**Example 4: Using Schemas in a Resource Policy**
```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:project:us:123456789012:project/*",
    "version": "1.0",
    "schemas": {
      "principalSchema": {
        "ref": "agsiri:///principal.json"
      },
      "resourceSchema": {
        "ref": "agsiri:///project.json"
      }
    }
  }
}
```
*Explanation*: This policy validates the principal's attributes against the `principal.json` schema and the resource's attributes against the `project.json` schema.

#### 15.2.6.6 `scope` Attribute

The `scope` attribute is an optional string that defines the specific context or environment within which the policy is valid. This attribute is useful for limiting the policy's application to certain stages of development (e.g., production, staging) or specific geographical regions.

**Example 5: Defining a Scope in a Resource Policy**
```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "version": "1.0",
    "scope": "production"
  }
}
```
*Explanation*: This policy is only applicable in the `production` environment.

#### 15.2.6.7 `variables` Object

The `variables` object allows you to define local variables within the policy. These variables can be referenced throughout the policy, simplifying complex expressions and making the policy easier to maintain and update.

**Example 6: Using Variables in a Resource Policy**
```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:project:us:123456789012:project/*",
    "version": "1.0",
    "variables": {
      "local": {
        "is_confidential": "R.attr.confidential == true"
      }
    },
    "rules": [
      {
        "actions": ["view"],
        "effect": "EFFECT_DENY",
        "condition": {
          "match": {
            "expr": "V.is_confidential"
          }
        }
      }
    ]
  }
}
```
*Explanation*: This policy denies view access to any project marked as confidential. The `is_confidential` variable simplifies the condition expression.

#### 15.2.6.8 `version` Attribute

The `version` attribute is a required string that specifies the version of the policy. Versioning is crucial for managing updates to policies, ensuring backward compatibility, and tracking changes over time. The version string must follow a specific pattern to be valid.

**Example 7: Versioning a Resource Policy**
```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:project:us:123456789012:project/*",
    "version": "2.0"
  }
}
```
*Explanation*: This policy is identified as version `2.0`, indicating it may have been updated from a previous version.

#### 15.2.6.9 Defining Complex Rules in `ResourcePolicy`

Resource policies can include complex rules that involve multiple actions, conditions, roles, and outputs. By leveraging the flexibility of the `ResourceRule` object, you can create detailed access control scenarios that meet specific security requirements.

**Example 8: Complex Rule with Multiple Conditions and Roles**
```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:project:us:123456789012:project/*",
    "version": "1.0",
    "rules": [
     

 {
        "actions": ["edit", "delete"],
        "effect": "EFFECT_ALLOW",
        "roles": ["admin", "editor"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "R.attr.status != 'archived'"},
                {"expr": "P.attr.department == 'engineering'"}
              ]
            }
          }
        },
        "output": {
          "expr": "log('Admin or Editor edited or deleted project in engineering department')"
        }
      }
    ]
  }
}
```
*Explanation*: This policy allows admins and editors in the engineering department to edit or delete projects that are not archived. The policy also logs the action for auditing purposes.

#### 15.2.6.10 Best Practices for `ResourcePolicy`

To make the most effective use of `ResourcePolicy` objects, consider the following best practices:

1. **Leverage Derived Roles**: Use derived roles to simplify role management within your policies, particularly in large or complex systems.
2. **Use Schemas for Validation**: Incorporate schemas to validate principal and resource attributes, ensuring data consistency and reducing errors.
3. **Version Control**: Always version your policies to track changes and maintain compatibility with other system components.
4. **Simplify with Variables**: Use variables to simplify complex expressions and reduce redundancy in your policies.
5. **Test Thoroughly**: Test your policies in different environments to ensure they behave as expected and meet security requirements.

#### 15.2.6.11 Troubleshooting `ResourcePolicy`

When working with `ResourcePolicy` objects, you may encounter issues such as unexpected behavior or errors during policy evaluation. Here are some tips for troubleshooting:

- **Check Conditions**: Ensure that all conditions are correctly defined and that the logic accurately reflects the intended access control rules.
- **Review Roles and Actions**: Verify that the roles and actions specified in the policy align with the intended permissions and that there are no conflicts.
- **Validate JSON**: Ensure that the JSON structure of the policy conforms to the schema, particularly when defining complex rules or using advanced features like outputs.
- **Log Outputs**: Use outputs to log policy evaluations and identify where the policy may not be behaving as expected.

**Example 9: Troubleshooting with Logging**
```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["edit"],
        "effect": "EFFECT_ALLOW",
        "roles": ["editor"],
        "condition": {
          "match": {
            "expr": "R.attr.status == 'active'"
          }
        },
        "output": {
          "expr": "log('Edit action evaluated for resource with status: ' + R.attr.status)"
        }
      }
    ]
  }
}
```
*Explanation*: This policy logs the status of the resource each time the `edit` action is evaluated, helping to troubleshoot issues related to resource state and access control.

---

By understanding and effectively utilizing the `ResourcePolicy` object, policy writers can create robust and flexible access control policies tailored to specific resources. The examples and best practices provided above offer a comprehensive guide for leveraging `ResourcePolicy` in the Pola policy framework, enabling the creation of effective, maintainable, and secure policies.

### 15.2.7 `agsiri.policy.v1.Schemas`

The `Schemas` object in the Pola policy framework plays a crucial role in validating the attributes associated with principals and resources. By defining and enforcing schemas, you can ensure that the data used in policy evaluations conforms to expected formats and standards. This not only enhances the reliability of your policies but also ensures consistency across different environments and use cases.

#### 15.2.7.1 Structure of the `Schemas` Object

The `Schemas` object is defined as follows:

```json
{
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
}
```

This structure allows you to specify schemas for both principal and resource attributes within a policy. Each of these schemas is defined using the `Schema` object, which provides a reference to the actual schema file and, optionally, a set of conditions under which the schema should be ignored.

#### 15.2.7.2 `principalSchema` and `resourceSchema` Attributes

The `principalSchema` and `resourceSchema` attributes define the schemas for validating the attributes of the principal and the resource, respectively. These schemas ensure that the data associated with these entities adheres to predefined structures, reducing the likelihood of errors during policy evaluation.

**Example 1: Basic Schema Definitions for Principal and Resource**

```json
{
  "schemas": {
    "principalSchema": {
      "ref": "agsiri:///schemas/principal.json"
    },
    "resourceSchema": {
      "ref": "agsiri:///schemas/resource.json"
    }
  }
}
```

*Explanation*: This example references two JSON schema files, one for validating the principal’s attributes and another for the resource’s attributes.

#### 15.2.7.3 The `Schema` Object

The `Schema` object is used to define each individual schema within the `Schemas` object. It is structured as follows:

```json
{
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
}
```

Key components of the `Schema` object include:

1. **`ref` (Required)**: A string that provides a reference to the location of the schema file. This is typically a URL or a path that points to a JSON schema document.
2. **`ignoreWhen` (Optional)**: A condition that specifies when the schema validation should be ignored. This is particularly useful in scenarios where certain actions or conditions make schema validation unnecessary or irrelevant.

#### 15.2.7.4 The `ignoreWhen` Object

The `ignoreWhen` object allows you to specify actions for which schema validation should be skipped. This can be useful in cases where certain operations do not require full schema validation, such as when creating new resources with minimal initial data or performing deletions where the full schema is not needed.

The `ignoreWhen` object is structured as follows:

```json
{
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
}
```

**Example 2: Ignoring Schema Validation for Certain Actions**

```json
{
  "schemas": {
    "resourceSchema": {
      "ref": "agsiri:///schemas/resource.json",
      "ignoreWhen": {
        "actions": ["delete", "archive"]
      }
    }
  }
}
```

*Explanation*: This policy skips schema validation for the `delete` and `archive` actions, assuming these operations do not require full resource validation.

#### 15.2.7.5 Practical Use Cases for Schema Validation

Schema validation ensures that only well-formed and expected data is processed during policy evaluations. This is particularly important in systems where the integrity and consistency of data are critical. Below are some practical use cases that illustrate how schema validation can be applied effectively.

**Example 3: Ensuring Consistent Resource Attributes**

Consider a scenario where all resources in a project management system must have a specific set of attributes, such as `status`, `owner`, and `deadline`. The following schema ensures that every resource evaluated by the policy includes these attributes.

```json
{
  "schemas": {
    "resourceSchema": {
      "ref": "agsiri:///schemas/project_resource.json"
    }
  }
}
```

*Explanation*: The referenced `project_resource.json` schema would define the required attributes, ensuring that every resource evaluated against this policy has the necessary structure.

**Example 4: Validating Principal Attributes for Access Control**

In a scenario where access control depends on specific attributes of the principal, such as department and role, you can enforce a schema to validate these attributes.

```json
{
  "schemas": {
    "principalSchema": {
      "ref": "agsiri:///schemas/principal_access.json"
    }
  }
}
```

*Explanation*: The `principal_access.json` schema could specify that the principal must have attributes like `department` and `role`, which are crucial for determining access rights.

#### 15.2.7.6 Advanced Scenarios with Schema Validation

In more complex scenarios, you might need to conditionally apply schema validation based on the context of the request, such as the specific action being performed or the state of the resource. The `ignoreWhen` object is particularly useful in these cases.

**Example 5: Conditional Schema Validation Based on Resource State**

Consider a situation where schema validation should only be applied if the resource is in an `active` state. If the resource is in a `draft` state, you might choose to skip certain validations.

```json
{
  "schemas": {
    "resourceSchema": {
      "ref": "agsiri:///schemas/resource_active.json",
      "ignoreWhen": {
        "actions": ["create"],
        "condition": {
          "match": {
            "expr": "R.attr.status == 'draft'"
          }
        }
      }
    }
  }
}
```

*Explanation*: This policy ensures that the resource is validated against the `resource_active.json` schema only if it is not in a `draft` state when performing the `create` action.

**Example 6: Selective Schema Enforcement in a Multi-Tenant Environment**

In a multi-tenant system, you may need to enforce different schemas based on the tenant making the request. This can be managed by dynamically referencing schemas based on the tenant ID or other identifying attributes.

```json
{
  "schemas": {
    "resourceSchema": {
      "ref": "agsiri:///schemas/${R.attr.tenant_id}_resource.json"
    }
  }
}
```

*Explanation*: This approach dynamically selects the schema based on the tenant ID, ensuring that each tenant's resources are validated according to their specific schema requirements.

#### 15.2.7.7 Best Practices for Using `Schemas`

To maximize the effectiveness of schema validation in your policies, consider the following best practices:

1. **Define Comprehensive Schemas**: Ensure that your schemas cover all necessary attributes and constraints, reducing the risk of unexpected errors during policy evaluations.
2. **Use `ignoreWhen` Sparingly**: While the `ignoreWhen` object is powerful, overusing it can lead to inconsistencies. Apply it only when absolutely necessary.
3. **Version Your Schemas**: Just like policies, schemas should be versioned to track changes and ensure compatibility over time.
4. **Test Schemas Rigorously**: Validate your schemas against various test cases to ensure they behave as expected under different conditions.
5. **Leverage Dynamic References**: Use dynamic references where appropriate to tailor schema validation to specific contexts, such as different tenants or environments.

#### 15.2.7.8 Troubleshooting Schema Validation Issues

When working with schema validation, you may encounter issues such as validation failures or unexpected behavior during policy evaluation. Here are some tips for troubleshooting:

- **Review Schema Definitions**: Ensure that your schema definitions are accurate and comprehensive, covering all required attributes and constraints.
- **Check Schema References**: Verify that the `ref` attributes in your schemas correctly point to the intended JSON schema documents.
- **Test with Real Data**: Validate your schemas using real data from your system to identify potential issues before they affect production environments.
- **Log Validation Errors**: Implement logging for schema validation errors to help diagnose issues quickly and effectively.

**Example 7: Logging Validation Errors**

```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:project:us:123456789012:project/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["create", "edit"],
        "effect": "EFFECT_ALLOW",
        "output": {
          "expr": "log('Validation error for resource: ' + R.attr.name)"
        }
      }
    ],
    "schemas": {
      "resourceSchema": {
        "ref": "agsiri:///schemas/project_resource.json"
      }
    }
  }
}
```

*Explanation*: This policy logs validation errors related to the resource name, helping to identify issues with schema conformance.

---

By

 effectively utilizing the `Schemas` object in your Pola policies, you can enforce data integrity, ensure consistency, and reduce the likelihood of errors during policy evaluations. The examples and best practices provided in this section offer a comprehensive guide to leveraging schema validation in the Pola policy framework, enabling the creation of robust, reliable, and maintainable policies.

### 15.2.8 `agsiri.policy.v1.Metadata`

The `Metadata` object in the Pola policy framework is essential for providing additional context and information about policies. Metadata helps with tracking, auditing, and managing policies by offering a structured way to store auxiliary data that may not directly impact policy evaluation but is crucial for policy management and governance.

#### 15.2.8.1 Structure of the `Metadata` Object

The `Metadata` object is structured as follows:

```json
{
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
}
```

This structure allows the inclusion of various metadata attributes that can be used for different purposes, such as identifying the origin of a policy, associating additional information with the policy, and ensuring that the policy’s content has not been tampered with.

#### 15.2.8.2 `annotations` Attribute

The `annotations` attribute provides a flexible way to attach arbitrary key-value pairs to a policy. This can be particularly useful for tagging policies with additional information that might be relevant for tracking, categorization, or documentation.

**Example 1: Using Annotations for Categorization**

```json
{
  "metadata": {
    "annotations": {
      "category": "security",
      "environment": "production",
      "author": "JohnDoe"
    }
  }
}
```

*Explanation*: In this example, the policy is tagged with annotations that indicate it belongs to the "security" category, is intended for the "production" environment, and was authored by "JohnDoe."

**Example 2: Using Annotations for Policy Versioning**

```json
{
  "metadata": {
    "annotations": {
      "version": "2.3.1",
      "changelog": "Updated conditions for resource access."
    }
  }
}
```

*Explanation*: This example uses annotations to document the version of the policy and provide a brief changelog, which is useful for tracking policy updates and changes over time.

#### 15.2.8.3 `hash` Attribute

The `hash` attribute can be used to store a checksum or hash value that verifies the integrity of the policy. This is especially important in scenarios where policies are stored in distributed systems or transmitted over networks, as it ensures that the policy content has not been altered.

The `hash` attribute can be either an integer or a string, depending on the hashing method used.

**Example 3: Storing a Hash for Policy Integrity**

```json
{
  "metadata": {
    "hash": "1234567890abcdef1234567890abcdef"
  }
}
```

*Explanation*: This string hash could be the result of a cryptographic hash function like SHA-256, providing a way to verify the integrity of the policy’s content.

**Example 4: Using an Integer Hash**

```json
{
  "metadata": {
    "hash": 987654321
  }
}
```

*Explanation*: Alternatively, an integer value can be used if the hashing method produces numeric output, such as a simple checksum.

#### 15.2.8.4 `sourceAttributes` Attribute

The `sourceAttributes` attribute allows the inclusion of additional attributes related to the source of the policy. This could include information such as the origin of the policy, specific attributes tied to the policy’s creation, or any other contextual data that might be relevant.

**Example 5: Source Attributes for Policy Origin**

```json
{
  "metadata": {
    "sourceAttributes": {
      "attributes": {
        "origin": "internal_system",
        "createdBy": "policy_generator_v2"
      }
    }
  }
}
```

*Explanation*: In this case, the `sourceAttributes` indicate that the policy was generated by an internal system and created using a specific version of a policy generator tool.

**Example 6: Tracking Source Attributes for Audit**

```json
{
  "metadata": {
    "sourceAttributes": {
      "attributes": {
        "auditTrail": "Created by admin on 2024-08-19"
      }
    }
  }
}
```

*Explanation*: This example shows how you might use `sourceAttributes` to maintain an audit trail, noting who created the policy and when.

#### 15.2.8.5 `sourceFile` Attribute

The `sourceFile` attribute specifies the file name or path where the policy was originally defined or stored. This is particularly useful for policies that are generated from source files or managed within a version-controlled repository.

**Example 7: Storing the Source File Path**

```json
{
  "metadata": {
    "sourceFile": "/policies/resource_access_policy.json"
  }
}
```

*Explanation*: This example indicates that the policy was originally defined in the `/policies/resource_access_policy.json` file.

**Example 8: Using `sourceFile` in a CI/CD Pipeline**

```json
{
  "metadata": {
    "sourceFile": "pipeline_generated_policy.json"
  }
}
```

*Explanation*: This could be used in a CI/CD environment where policies are generated and stored automatically, providing a link back to the source file used in the pipeline.

#### 15.2.8.6 `storeIdentifer` and `storeIdentifier` Attributes

The `storeIdentifer` and `storeIdentifier` attributes (noting that the first is likely a typo or variation) are intended to store an identifier for the policy’s storage location. This could be a unique identifier used by a storage service or database where the policy is managed.

**Example 9: Storing a Unique Store Identifier**

```json
{
  "metadata": {
    "storeIdentifier": "policy_store_1234567890"
  }
}
```

*Explanation*: This identifier could be used to track the policy across different storage systems or services, ensuring that it can be easily retrieved or referenced.

#### 15.2.8.7 Best Practices for Using `Metadata`

To effectively use the `Metadata` object in your Pola policies, consider the following best practices:

1. **Use Annotations for Clarity**: Annotations are a powerful tool for tagging policies with relevant information. Use them to categorize, document, and track policies efficiently.
2. **Ensure Policy Integrity with Hashes**: Always include a `hash` attribute for policies that are stored or transmitted in environments where integrity is a concern. This will help detect any unauthorized changes.
3. **Document Policy Origin**: Use the `sourceAttributes` and `sourceFile` attributes to clearly document where a policy came from and how it was created. This is especially important for auditing and compliance purposes.
4. **Leverage Store Identifiers for Tracking**: If your policies are stored in a database or service, use the `storeIdentifier` attribute to maintain a clear link to the storage location. This aids in managing and retrieving policies across different systems.

#### 15.2.8.8 Advanced Scenarios with `Metadata`

In advanced use cases, metadata can be leveraged to enhance policy management and governance, particularly in large or complex environments.

**Example 10: Using Metadata for Policy Lifecycle Management**

In environments where policies undergo frequent updates, metadata can be used to track the policy lifecycle, including versions, authors, and the changes made over time.

```json
{
  "metadata": {
    "annotations": {
      "version": "1.2.0",
      "author": "JaneDoe",
      "lastModified": "2024-08-20T10:00:00Z",
      "status": "approved"
    },
    "sourceAttributes": {
      "attributes": {
        "origin": "policy_editor_v3",
        "approvalWorkflow": "policy_approval_2024"
      }
    }
  }
}
```

*Explanation*: This metadata structure provides a comprehensive view of the policy’s lifecycle, including its current version, the author, the last modification date, and its approval status. The `sourceAttributes` further document the workflow used for approval, ensuring traceability.

**Example 11: Automating Metadata Population**

In a CI/CD pipeline, metadata can be automatically populated to ensure consistency and reduce manual errors.

```json
{
  "metadata": {
    "annotations": {
      "buildNumber": "1234",
      "pipeline": "policy_deployment_v1",
      "environment": "staging"
    },
    "sourceFile": "ci_generated_policy.json",
    "storeIdentifier": "ci_policy_store_67890"
  }
}
```

*Explanation*: In this automated setup, metadata is populated with information such as the build number, pipeline name, and environment. This helps track policies that are automatically generated and deployed, making it easier to manage them across different stages of the deployment process.

#### 15.2.8.9 Troubleshooting Metadata Issues

When working with metadata in your Pola policies, you may encounter issues such as missing or incorrect metadata, which can affect policy management and auditing.

-

 **Missing Metadata**: Ensure that all relevant metadata fields are populated, especially when policies are generated or modified. This is critical for maintaining a complete audit trail.
- **Incorrect Metadata**: Validate metadata values to ensure accuracy. For instance, check that hashes are correctly computed and that source file paths are accurate.
- **Inconsistent Metadata**: In large environments, inconsistencies in metadata can lead to confusion or errors. Standardize metadata usage across policies and automate its population wherever possible.

By thoroughly understanding and effectively utilizing the `Metadata` object in the Pola policy framework, policy writers can enhance policy governance, ensure traceability, and maintain the integrity of policies across diverse environments. The examples and best practices provided in this section serve as a comprehensive guide for incorporating metadata into your Pola policies, enabling better management and oversight of access control policies in complex systems.

### 15.2.9 `agsiri.policy.v1.Output`

The `Output` object in the Pola policy framework plays a crucial role in defining how policies interact with external systems or provide feedback during policy evaluation. Outputs are used to trigger actions, send notifications, or log specific events based on the conditions and rules defined within a policy. Understanding how to configure and use the `Output` object effectively allows policy writers to create more dynamic and responsive policies.

#### 15.2.9.1 Structure of the `Output` Object

The `Output` object is structured as follows:

```json
{
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
}
```

This structure allows policy writers to specify an expression that defines the output and the conditions under which the output should be triggered using the `when` object.

#### 15.2.9.2 `expr` Attribute

The `expr` attribute is a string that defines the expression to be evaluated when the output is triggered. This expression can perform calculations, generate messages, or trigger other actions based on the policy’s logic.

**Example 1: Logging a Simple Message**

```json
{
  "output": {
    "expr": "'User ' + P.attr.username + ' accessed the resource.'"
  }
}
```

*Explanation*: This example constructs a simple log message indicating that a specific user has accessed a resource. The `P.attr.username` retrieves the principal’s username, and the message is dynamically constructed based on the action.

**Example 2: Triggering a Notification**

```json
{
  "output": {
    "expr": "'Send notification: Resource ' + R.attr.resourceName + ' has been accessed by ' + P.attr.username"
  }
}
```

*Explanation*: This output expression generates a string that could be used to trigger a notification system, alerting that a particular resource has been accessed by a user.

#### 15.2.9.3 `when` Attribute

The `when` attribute within the `Output` object specifies the conditions under which the output should be triggered. This is done through the `agsiri.policy.v1.Output.When` object, which allows for detailed control over when outputs are activated.

The `when` object has the following structure:

```json
{
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
}
```

This structure supports two primary triggers for outputs: when a condition is not met (`conditionNotMet`) and when a rule is activated (`ruleActivated`).

##### 15.2.9.3.1 `conditionNotMet` Trigger

The `conditionNotMet` trigger is used to specify an output that should be activated when a particular condition in the policy is not met. This can be useful for logging errors, generating alerts, or taking corrective actions.

**Example 3: Logging a Warning When a Condition Is Not Met**

```json
{
  "output": {
    "expr": "'Warning: Condition not met for user ' + P.attr.username",
    "when": {
      "conditionNotMet": "UserAccessCondition"
    }
  }
}
```

*Explanation*: In this example, if the `UserAccessCondition` is not met, a warning message is generated, indicating that the condition failed for the specified user. This output could be used to log the incident or trigger further investigation.

##### 15.2.9.3.2 `ruleActivated` Trigger

The `ruleActivated` trigger specifies an output that should be executed when a particular rule within the policy is activated. This is typically used to log successful rule evaluations, notify external systems, or perform other actions when specific rules are applied.

**Example 4: Notifying When a Rule Is Activated**

```json
{
  "output": {
    "expr": "'Notification: Rule ' + RuleName + ' activated for resource ' + R.attr.resourceName",
    "when": {
      "ruleActivated": "ResourceAccessRule"
    }
  }
}
```

*Explanation*: This output sends a notification whenever the `ResourceAccessRule` is activated, providing details about the rule and the resource involved. This can be used to track which rules are being applied in real-time.

#### 15.2.9.4 Combining `expr` and `when` for Complex Outputs

The `expr` and `when` attributes can be combined to create more complex and conditional outputs. This allows for greater flexibility in defining how and when outputs should be triggered based on the evaluation of the policy.

**Example 5: Complex Output with Conditional Trigger**

```json
{
  "output": {
    "expr": "'Alert: User ' + P.attr.username + ' attempted to access restricted resource ' + R.attr.resourceName",
    "when": {
      "conditionNotMet": "AccessControlCondition"
    }
  }
}
```

*Explanation*: In this scenario, an alert is triggered when the `AccessControlCondition` is not met, indicating that a user attempted to access a resource that they were not authorized to access. This output could be integrated with a security monitoring system to flag potential unauthorized access attempts.

**Example 6: Conditional Logging Based on Multiple Triggers**

```json
{
  "output": {
    "expr": "'Log: Condition failed or rule applied for ' + R.attr.resourceName",
    "when": {
      "conditionNotMet": "SecurityCheckCondition",
      "ruleActivated": "SensitiveDataAccessRule"
    }
  }
}
```

*Explanation*: This output logs a message if either the `SecurityCheckCondition` is not met or the `SensitiveDataAccessRule` is activated. This approach ensures that critical events are logged, regardless of whether they involve a failed condition or an activated rule.

#### 15.2.9.5 Best Practices for Using `Output`

To effectively use the `Output` object in your Pola policies, consider the following best practices:

1. **Use Descriptive Expressions**: Ensure that the `expr` attribute clearly describes the action being taken or the event being logged. This helps with clarity and makes the output more informative.
2. **Leverage Conditional Triggers**: Use the `when` attribute to ensure that outputs are only triggered when necessary. This avoids unnecessary logging or notifications and ensures that outputs are relevant.
3. **Integrate with External Systems**: Outputs can be used to trigger actions in external systems, such as logging services, notification systems, or monitoring tools. Ensure that the output format is compatible with these systems.
4. **Test Outputs Thoroughly**: Before deploying policies with outputs, test them thoroughly to ensure that they behave as expected under different scenarios. This includes verifying that outputs are triggered correctly and that the content of the outputs is accurate.

#### 15.2.9.6 Advanced Scenarios with `Output`

In advanced use cases, the `Output` object can be used to create sophisticated logging and notification mechanisms that enhance the observability and responsiveness of your policies.

**Example 7: Output for Multi-Step Approval Processes**

In a scenario where resources require multi-step approval, the `Output` object can be used to notify different stakeholders as each step is completed.

```json
{
  "output": {
    "expr": "'Approval step completed by ' + P.attr.username + ' for resource ' + R.attr.resourceName",
    "when": {
      "ruleActivated": "ApprovalStepRule"
    }
  }
}
```

*Explanation*: This output sends a notification each time an approval step is completed, ensuring that all stakeholders are informed of the progress.

**Example 8: Dynamic Output Based on User Roles**

You can also use the `Output` object to generate outputs that vary based on the roles of the principal. This allows for more personalized or role-specific notifications.

```json
{
  "output": {
    "expr": "'Role ' + P.attr.role + ' user ' + P.attr.username + ' performed an action on ' + R.attr.resourceName",
    "when": {
      "ruleActivated": "RoleBasedAccessRule"
    }
  }
}
```

*Explanation*: This output provides role-specific information, indicating which role the user holds and what action they performed on the resource. This is useful for detailed logging and auditing.

#### 15.2.9.7 Troubleshooting Output Issues

When working with outputs in your Pola policies, you may encounter issues such as outputs not being triggered as expected or generating incorrect content.

- **Outputs Not Triggered**: Ensure that the conditions specified in the `when` attribute are correctly defined and that the rules or conditions they refer to are evaluated as expected.
- **Incorrect Output Content**: Double-check the `expr` attribute to ensure that it correctly references the attributes and variables you intend to use. Errors in the expression syntax can lead to incorrect or incomplete outputs.
- **Overly Verbose Outputs**: If outputs are triggered too frequently or generate excessive content, refine the conditions in the `when` attribute to limit output generation to only the most critical events.

By thoroughly understanding and effectively utilizing the `Output` object in the Pola policy framework, policy writers can create policies that not only control access but also provide valuable feedback and integrate seamlessly with external systems. The examples and best practices provided in this section serve as a comprehensive guide for incorporating outputs into your Pola policies, enabling better observability, logging, and automation within your access control framework.

### 15.2.10 `agsiri.policy.v1.AuditInfo`

The `AuditInfo` object in the Pola policy framework is a crucial component that enables tracking the creation, modification, and review of policies. This object allows organizations to maintain a detailed history of policy changes, providing essential information for compliance audits, forensic analysis, and internal governance. Understanding how to effectively use the `AuditInfo` object helps ensure that policies are not only robust and secure but also transparent and accountable.

#### 15.2.10.1 Structure of the `AuditInfo` Object

The `AuditInfo` object is structured as follows:

```json
{
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
```

This structure includes attributes for tracking the user who created the policy, timestamps for creation and updates, and information about who last updated the policy.

#### 15.2.10.2 `createdBy` Attribute

The `createdBy` attribute is a mandatory field that records the identifier (typically a username or user ID) of the user who originally created the policy. This attribute is essential for maintaining accountability and traceability in policy management.

**Example 1: Basic Creation Audit**

```json
{
  "auditInfo": {
    "createdBy": "admin"
  }
}
```

*Explanation*: This simple example records that the policy was created by the user "admin." Even in this basic form, the `createdBy` attribute provides a critical link between the policy and its originator.

**Example 2: Creation by a Specific User**

```json
{
  "auditInfo": {
    "createdBy": "user12345"
  }
}
```

*Explanation*: Here, the `createdBy` field identifies "user12345" as the creator of the policy, which could correspond to an employee ID or a system account, ensuring that all policies are traceable to their source.

#### 15.2.10.3 `createdAt` Attribute

The `createdAt` attribute is an optional field that records the date and time when the policy was created. This field uses the `date-time` format, following the ISO 8601 standard, to ensure consistency and compatibility across systems.

**Example 3: Tracking Creation Time**

```json
{
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-22T10:00:00Z"
  }
}
```

*Explanation*: This example provides both the creator ("admin") and the exact time of creation ("2024-08-22T10:00:00Z"), which is useful for maintaining detailed records of policy lifecycles.

#### 15.2.10.4 `updatedBy` Attribute

The `updatedBy` attribute records the identifier of the user who last updated the policy. This field is optional but highly recommended for tracking changes and understanding the evolution of a policy over time.

**Example 4: Tracking Updates**

```json
{
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-22T10:00:00Z",
    "updatedBy": "security_admin"
  }
}
```

*Explanation*: In this example, the policy was originally created by "admin" but was later updated by "security_admin," indicating a change in responsibility or the application of additional oversight.

#### 15.2.10.5 `updatedAt` Attribute

The `updatedAt` attribute complements the `updatedBy` field by recording the date and time of the last update. This field also uses the `date-time` format, providing a precise timestamp for when changes were made.

**Example 5: Detailed Update Tracking**

```json
{
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-22T10:00:00Z",
    "updatedBy": "security_admin",
    "updatedAt": "2024-09-01T12:30:00Z"
  }
}
```

*Explanation*: This example shows a comprehensive audit trail, where the policy was created on "2024-08-22T10:00:00Z" by "admin" and later updated on "2024-09-01T12:30:00Z" by "security_admin." This level of detail is crucial for compliance and security audits.

#### 15.2.10.6 Best Practices for Using `AuditInfo`

To ensure that the `AuditInfo` object is used effectively in Pola policies, consider the following best practices:

1. **Always Populate `createdBy`**: Since `createdBy` is a mandatory field, ensure that this attribute is accurately filled out during policy creation. This is the cornerstone of your audit trail.
  
2. **Use `createdAt` and `updatedAt` for Time Tracking**: While these fields are optional, they provide valuable time-based context for when a policy was created or updated. This information is especially useful for time-bound audits and forensic investigations.

3. **Regularly Update `updatedBy` and `updatedAt`**: Every time a policy is modified, update these fields to reflect who made the changes and when. This practice helps maintain an accurate and complete history of the policy's evolution.

4. **Integrate with Audit Logs**: Consider integrating `AuditInfo` with your organization’s broader audit logging and SIEM (Security Information and Event Management) systems to provide a holistic view of policy changes across your infrastructure.

5. **Document Audit Policies**: Ensure that your organization has clear policies in place regarding who is allowed to create and update policies, and ensure that these roles are reflected in the `AuditInfo` fields.

6. **Automate Audit Information**: Where possible, automate the population of `AuditInfo` fields through your policy management tools. This reduces the risk of human error and ensures consistency across all policies.

#### 15.2.10.7 Advanced Scenarios for `AuditInfo`

In advanced use cases, `AuditInfo` can be used to meet specific regulatory or organizational requirements, such as tracking policy changes across different departments or ensuring that only authorized personnel can modify critical policies.

**Example 6: Departmental Policy Creation**

In an organization where different departments manage their own policies, the `AuditInfo` object can be used to track which department created and modified each policy.

```json
{
  "auditInfo": {
    "createdBy": "HR_department",
    "createdAt": "2024-07-15T09:00:00Z",
    "updatedBy": "HR_manager",
    "updatedAt": "2024-08-01T14:45:00Z"
  }
}
```

*Explanation*: This example shows that the HR department created the policy and that it was later updated by a specific HR manager. This information is crucial for maintaining clear lines of responsibility.

**Example 7: Compliance-Driven Audit Information**

For organizations subject to strict regulatory requirements, `AuditInfo` can be used to provide detailed documentation of all policy changes, which is essential for passing audits and maintaining certifications.

```json
{
  "auditInfo": {
    "createdBy": "compliance_officer",
    "createdAt": "2024-06-30T08:30:00Z",
    "updatedBy": "compliance_manager",
    "updatedAt": "2024-09-10T11:00:00Z"
  }
}
```

*Explanation*: In this scenario, the policy was created and managed by specific roles within the compliance department, providing clear evidence that the policy was handled according to regulatory standards.

#### 15.2.10.8 Troubleshooting `AuditInfo` Issues

While the `AuditInfo` object is generally straightforward, issues can arise if it is not populated correctly or if there are inconsistencies in the information provided.

- **Missing `createdBy`**: Since this field is mandatory, policies without a `createdBy` value will not validate correctly. Ensure that this field is always populated.
- **Incorrect Timestamps**: Verify that `createdAt` and `updatedAt` fields are correctly formatted and reflect accurate times. Misformatted timestamps can lead to audit issues and hinder forensic analysis.
- **Inconsistent Update Information**: If the `updatedBy` and `updatedAt` fields are not updated consistently, it can lead to confusion about who made the most recent changes to a policy. Always ensure these fields are synchronized with actual update events.

By thoroughly understanding and effectively utilizing the `AuditInfo` object in the Pola policy framework, policy writers can ensure that their policies are not only functional and secure but also transparent and accountable. The examples and best practices provided in this section serve as a comprehensive guide for incorporating audit information into your Pola policies, enabling better governance, compliance, and traceability across your organization’s access control framework.

### 15.2.11 `agsiri.policy.v1.Notify`

The `agsiri.policy.v1.Notify` object is a powerful addition to the Pola policy framework, designed to deliver notifications to specified services when certain conditions in a policy are met. This object allows for seamless integration with various notification mechanisms, including web services, Pub/Sub services, and queuing services like Kafka and RabbitMQ. By leveraging the flexibility of schemas to define the payloads of these notifications, policy writers can ensure that their notifications are both structured and adaptable to different system architectures.

#### Overview

The `Notify` object is an optional component in a policy that specifies how and when notifications should be sent. It is particularly useful for triggering external systems or alerting teams when specific actions or conditions occur within a policy.

#### Structure

The `Notify` object includes the following key properties:

- **`service`**: Specifies the type of notification service (web service, Pub/Sub, or queue).
- **`serviceConfig`**: Contains the configuration details specific to the chosen notification service.
- **`payloadSchema`**: Defines the structure of the notification payload using a schema.
- **`when`**: Specifies the conditions under which the notification should be triggered.

Each of these properties is crucial for ensuring that the notification is sent to the correct destination, in the correct format, and under the correct circumstances.

#### Mandatory and Optional Attributes

1. **`service`** (Mandatory)
   - **Type**: `string`
   - **Enum**: `"webservice"`, `"pubsub"`, `"queue"`
   - **Description**: This attribute specifies the type of notification service to which the notification will be sent. It determines the structure and content of the `serviceConfig` object.
   - **Example**:
     ```json
     "service": "webservice"
     ```

2. **`serviceConfig`** (Mandatory)
   - **Type**: `object`
   - **Description**: This object holds the configuration details specific to the notification service type selected in the `service` attribute. Depending on the type of service, the `serviceConfig` object can take different forms:
     - **WebServiceConfig**
     - **PubSubConfig**
     - **QueueConfig**
   - **Example**:
     ```json
     "serviceConfig": {
       "url": "https://notification-service.example.com/notify",
       "method": "POST",
       "headers": {
         "Authorization": "Bearer token"
       }
     }
     ```

3. **`payloadSchema`** (Mandatory)
   - **Type**: `object`
   - **$ref**: `#defs/agsiri.policy.v1.Schemas.Schema`
   - **Description**: The `payloadSchema` defines the structure of the notification payload that will be sent to the specified service. This schema ensures that the payload is properly formatted and adheres to any specific requirements of the receiving service.
   - **Example**:
     ```json
     "payloadSchema": {
       "ref": "agsiri:///schemas/notificationPayload.json"
     }
     ```

4. **`when`** (Optional)
   - **Type**: `object`
   - **$ref**: `#defs/agsiri.policy.v1.Notify.When`
   - **Description**: This object defines the conditions under which the notification should be sent. The `when` object can include conditions like `conditionMet` or `ruleActivated`, which determine the precise moment when the notification is triggered.
   - **Example**:
     ```json
     "when": {
       "conditionMet": "R.attr.status == 'critical'"
     }
     ```

#### Detailed Example: Web Service Notification

Below is an example of a `Notify` object configured to send a notification to a web service when a certain condition is met.

```json
{
  "notify": {
    "service": "webservice",
    "serviceConfig": {
      "url": "https://api.notification.example.com/send",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer abc123",
        "Content-Type": "application/json"
      }
    },
    "payloadSchema": {
      "ref": "agsiri:///schemas/notificationPayload.json"
    },
    "when": {
      "conditionMet": "R.attr.status == 'critical'"
    }
  }
}
```

**Explanation:**

- **`service`**: Specifies that the notification will be sent to a web service.
- **`serviceConfig`**: Contains the URL of the web service, the HTTP method (POST), and optional headers such as an authorization token.
- **`payloadSchema`**: References a predefined schema that outlines the structure of the notification payload.
- **`when`**: The notification is triggered when the resource's status is marked as "critical."

#### Detailed Example: Pub/Sub Notification

The following example demonstrates how to configure a `Notify` object to publish a message to a Pub/Sub topic when a policy rule is activated.

```json
{
  "notify": {
    "service": "pubsub",
    "serviceConfig": {
      "topic": "projects/project-id/topics/notification-topic",
      "messageAttributes": {
        "severity": "high",
        "environment": "production"
      }
    },
    "payloadSchema": {
      "ref": "agsiri:///schemas/pubsubNotificationPayload.json"
    },
    "when": {
      "ruleActivated": "critical-alert-rule"
    }
  }
}
```

**Explanation:**

- **`service`**: Specifies that the notification will be sent to a Pub/Sub service.
- **`serviceConfig`**: Defines the topic to which the message will be published, along with optional message attributes.
- **`payloadSchema`**: References a schema that defines the structure of the message payload.
- **`when`**: The notification is triggered when a specific rule (e.g., "critical-alert-rule") is activated.

#### Detailed Example: Queue Notification (e.g., Kafka or RabbitMQ)

The following example illustrates how to configure a `Notify` object to send a message to a queue service like Kafka or RabbitMQ.

```json
{
  "notify": {
    "service": "queue",
    "serviceConfig": {
      "queueName": "critical-alerts-queue",
      "messageGroupId": "group-1"
    },
    "payloadSchema": {
      "ref": "agsiri:///schemas/queueNotificationPayload.json"
    },
    "when": {
      "conditionMet": "R.attr.status == 'critical'"
    }
  }
}
```

**Explanation:**

- **`service`**: Specifies that the notification will be sent to a queue service.
- **`serviceConfig`**: Contains the name of the queue and an optional message group ID, which is useful for FIFO queues or services that require message ordering.
- **`payloadSchema`**: References a schema that outlines the structure of the queue message payload.
- **`when`**: The notification is triggered when the resource's status is marked as "critical."

#### `Notify` Object Subtypes and Their Usage

1. **`agsiri.policy.v1.Notify.WebServiceConfig`**:
   - **Purpose**: Configures notifications sent to a web service.
   - **Attributes**:
     - `url`: The endpoint URL.
     - `method`: The HTTP method (`POST` or `PUT`).
     - `headers`: Optional HTTP headers.
   - **Use Case**: Triggering a RESTful API when a policy condition is met.

2. **`agsiri.policy.v1.Notify.PubSubConfig`**:
   - **Purpose**: Configures notifications sent to a Pub/Sub service.
   - **Attributes**:
     - `topic`: The Pub/Sub topic name.
     - `messageAttributes`: Optional attributes for the message.
   - **Use Case**: Publishing alerts to a topic in a messaging system like Google Cloud Pub/Sub.

3. **`agsiri.policy.v1.Notify.QueueConfig`**:
   - **Purpose**: Configures notifications sent to a queuing service.
   - **Attributes**:
     - `queueName`: The name of the queue.
     - `messageGroupId`: Optional group ID for FIFO queues.
   - **Use Case**: Sending messages to Kafka or RabbitMQ queues for further processing.

#### Example of `Notify` Object with Payload Schema

To illustrate the integration of a `payloadSchema`, consider the following example schema for a Kafka queue notification payload:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "eventId": { "type": "string" },
    "eventType": { "type": "string" },
    "priority": { "type": "string" },
    "timestamp": { "type": "string", "format": "date-time" }
  },
  "required": ["eventId", "eventType", "priority", "timestamp"]
}
```

This schema ensures that any message sent to the queue conforms to the expected structure, which includes an event ID, event type, priority level, and timestamp.

### Conclusion

The `agsiri.policy.v1.Notify` object provides a versatile and robust mechanism for integrating notifications into the Pola policy framework. By supporting various notification services and leveraging schemas to define payloads, the `Notify` object enables policy writers to create effective and efficient notifications that seamlessly integrate with diverse system architectures. Whether you're triggering RESTful APIs, publishing to Pub/Sub topics, or sending messages to queues, the `Notify` object ensures that critical events are communicated effectively, enhancing the overall responsiveness and reliability of your system.

### 15.2.12 `agsiri.policy.v1.GroupPolicy`

The `GroupPolicy` in the Pola Policy Framework allows you to define access control policies specifically for groups. A group represents a collection of users or other entities, and a `GroupPolicy` defines the actions that members of this group are allowed or denied to perform on specific resources. This section will detail the structure, mandatory and optional attributes, and provide examples for defining a `GroupPolicy`.

#### **Structure of `GroupPolicy`**

The `GroupPolicy` JSON object consists of several fields, categorized into mandatory and optional attributes. The policy also includes an array of rules that define the specific permissions granted or denied to the group.

#### **15.2.12.1 Mandatory Attributes**

1. **group**
   - **Description**: The name or identifier of the group to which the policy applies.
   - **Type**: `string`
   - **Example**:
     ```json
     "group": "Engineering"
     ```

2. **version**
   - **Description**: The version of the group policy. This ensures that different versions of the policy can be maintained and tracked over time.
   - **Type**: `string`
   - **Format**: Follows the `major.minor.patch` convention (e.g., `"1.0.0"`).
   - **Example**:
     ```json
     "version": "1.0.0"
     ```

3. **rules**
   - **Description**: An array of rules that define what actions members of this group can perform on specific resources. Each rule contains at least one action and a resource identifier.
   - **Type**: `array` of `GroupRule` objects
   - **Example**:
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

#### **15.2.12.2 Optional Attributes**

1. **scope**
   - **Description**: Defines the context or boundaries where the policy is applicable. This can be used to limit the policy's effect to specific environments, such as production or development.
   - **Type**: `string`
   - **Example**:
     ```json
     "scope": "development"
     ```

2. **variables**
   - **Description**: Dynamic values that can be referenced within the policy to provide flexibility in defining conditions and rules.
   - **Type**: `object` of `Variables`
   - **Example**:
     ```json
     "variables": {
       "import": ["env_var1", "env_var2"],
       "local": { "region": "us-east-1" }
     }
     ```

3. **condition**
   - **Description**: Defines the conditions under which the policy applies. You can use logical operators (`all`, `any`, `none`) or expressions to create complex conditions.
   - **Type**: `Condition` object
   - **Example**:
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

#### **15.2.12.3 GroupRule Object Structure**

Each `GroupRule` within the `rules` array must include the following fields:

1. **resource**
   - **Description**: The resource identifier to which this rule applies (e.g., `document123`).
   - **Type**: `string`
   - **Example**:
     ```json
     "resource": "server123"
     ```

2. **actions**
   - **Description**: An array of actions that members of the group are allowed or denied to perform on the resource.
   - **Type**: `array` of `Action` objects
   - **Example**:
     ```json
     "actions": [
       {
         "action": "restart",
         "effect": "EFFECT_ALLOW"
       }
     ]
     ```

#### **15.2.12.4 Example of a `GroupPolicy`**

Below is a full example of a `GroupPolicy` object, including all mandatory and some optional attributes.

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
          },
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
          }
        ]
      }
    ],
    "scope": "development",
    "variables": {
      "import": ["env_var1"],
      "local": { "region": "us-east-1" }
    },
    "condition": {
      "match": {
        "none": {
          "of": [
            { "expr": "R.attr.status == 'inactive'" }
          ]
        }
      }
    }
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T13:00:00Z"
  }
}
```

### **15.2.12.5 Best Practices**

- **Descriptive Group Names**: Use meaningful and descriptive names for your groups to easily identify their purpose and scope within your organization.
  
- **Versioning**: Always include a version number for your policies. This helps in tracking changes and maintaining different versions as the group’s permissions evolve.

- **Scope Usage**: Utilize the `scope` attribute to limit the policy's applicability, which can help avoid unauthorized access in different environments.

- **Conditions**: Leverage the `condition` attribute to apply rules conditionally, making your policies more dynamic and adaptable to different scenarios.

This detailed breakdown should help you create effective and compliant `GroupPolicy` objects in the Pola Policy Framework.

### 15.2.13 `agsiri.policy.v1.RolePolicy`

The `RolePolicy` in the Pola Policy Framework is designed to define access control policies specifically for roles. A role represents a set of permissions that can be assigned to users, groups, or other entities within an organization. The `RolePolicy` defines the actions that members assigned to a particular role are allowed or denied to perform on specific resources. This section will detail the structure, mandatory and optional attributes, and provide examples for defining a `RolePolicy`.

#### **Structure of `RolePolicy`**

The `RolePolicy` JSON object is composed of several fields, which are categorized into mandatory and optional attributes. The policy also includes an array of rules that define the specific permissions granted or denied to the role.

#### **15.2.13.1 Mandatory Attributes**

1. **role**
   - **Description**: The name or identifier of the role to which the policy applies.
   - **Type**: `string`
   - **Example**:
     ```json
     "role": "Admin"
     ```

2. **version**
   - **Description**: The version of the role policy. This ensures that different versions of the policy can be maintained and tracked over time.
   - **Type**: `string`
   - **Format**: Follows the `major.minor.patch` convention (e.g., `"1.0.0"`).
   - **Example**:
     ```json
     "version": "1.0.0"
     ```

3. **rules**
   - **Description**: An array of rules that define what actions members assigned to this role can perform on specific resources. Each rule contains at least one action and a resource identifier.
   - **Type**: `array` of `RoleRule` objects
   - **Example**:
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

#### **15.2.13.2 Optional Attributes**

1. **scope**
   - **Description**: Defines the context or boundaries where the policy is applicable. This can be used to limit the policy's effect to specific environments, such as production or development.
   - **Type**: `string`
   - **Example**:
     ```json
     "scope": "production"
     ```

2. **variables**
   - **Description**: Dynamic values that can be referenced within the policy to provide flexibility in defining conditions and rules.
   - **Type**: `object` of `Variables`
   - **Example**:
     ```json
     "variables": {
       "import": ["env_var1", "env_var2"],
       "local": { "region": "us-east-1" }
     }
     ```

3. **condition**
   - **Description**: Defines the conditions under which the policy applies. You can use logical operators (`all`, `any`, `none`) or expressions to create complex conditions.
   - **Type**: `Condition` object
   - **Example**:
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

#### **15.2.13.3 RoleRule Object Structure**

Each `RoleRule` within the `rules` array must include the following fields:

1. **resource**
   - **Description**: The resource identifier to which this rule applies (e.g., `document123`).
   - **Type**: `string`
   - **Example**:
     ```json
     "resource": "server123"
     ```

2. **actions**
   - **Description**: An array of actions that members assigned to the role are allowed or denied to perform on the resource.
   - **Type**: `array` of `Action` objects
   - **Example**:
     ```json
     "actions": [
       {
         "action": "restart",
         "effect": "EFFECT_ALLOW"
       },
       {
         "action": "delete",
         "effect": "EFFECT_DENY"
       }
     ]
     ```

#### **15.2.13.4 Example of a `RolePolicy`**

Below is a full example of a `RolePolicy` object, including all mandatory and some optional attributes.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "rolePolicy": {
    "role": "Admin",
    "version": "1.0.0",
    "rules": [
      {
        "resource": "server123",
        "actions": [
          {
            "action": "restart",
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
      "local": { "region": "us-east-1" }
    },
    "condition": {
      "match": {
        "none": {
          "of": [
            { "expr": "R.attr.status == 'inactive'" }
          ]
        }
      }
    }
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T13:00:00Z"
  }
}
```

### **15.2.13.5 Best Practices**

- **Descriptive Role Names**: Use meaningful and descriptive names for your roles to easily identify their purpose and scope within your organization.
  
- **Versioning**: Always include a version number for your policies. This helps in tracking changes and maintaining different versions as the role’s permissions evolve.

- **Scope Usage**: Utilize the `scope` attribute to limit the policy's applicability, which can help avoid unauthorized access in different environments.

- **Conditions**: Leverage the `condition` attribute to apply rules conditionally, making your policies more dynamic and adaptable to different scenarios.

This detailed breakdown should help you create effective and compliant `RolePolicy` objects in the Pola Policy Framework.


## 15.3 Building Blocks of a Pola Policy

The core structure of a Pola policy revolves around several key components, each of which plays a specific role in defining access control rules. Understanding these components is essential for crafting effective policies.

### 15.3.1 `apiVersion`

The `apiVersion` field specifies the version of the API that the policy conforms to. This is important for ensuring compatibility with the policy engine and any updates that may be introduced in future versions.

*Example*:
```json
{
  "apiVersion": "api.agsiri.dev/v1"
}
```

### 15.3.2 `derivedRoles`

The `derivedRoles` field contains a set of dynamically assigned roles based on conditions defined in the policy. This allows for flexible role management, enabling the assignment of roles based on context rather than static configurations.

*Example*:
```json
{
  "derivedRoles": {
    "name": "ProjectManager",
    "definitions": [
      {
        "name": "ManagerForProjectA",
        "parentRoles": ["manager"],
        "condition": {
          "match": {
            "expr": "P.attr.project == 'ProjectA'"
          }
        }
      }
    ]
  }
}
```

### 15.3.3 `resourcePolicy` and `principalPolicy`

These fields define the specific rules that apply to resources or principals. Each policy includes a list of actions that are allowed or denied, along with any conditions that must be met.

*Resource Policy Example*:
```json
{
  "resourcePolicy": {
    "resource": "ari:agsiri:database:us:123456789012:records/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "P.attr.clearance_level >= 3"
          }
        }
      }
    ]
  }
}
```

*Principal Policy Example*:
```json
{
  "principalPolicy": {
    "principal": "user123",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:document:us:123456789012:files/*",
        "actions": ["delete"],
        "effect": "EFFECT_DENY"
      }
    ]
  }
}
```

### 15.3.4 `variables`

Variables allow for the reuse of expressions within a policy, making it more maintainable and easier to update.

*Example*:
```json
{
  "variables": {
    "local": {
      "is_admin": "P.attr.role == 'admin'"
    }
  }
}
```

This defines a variable `is_admin` that checks if the principal's role is `admin`, which can then be referenced throughout the policy.

---

## 15.4 Practical Examples

To help solidify the concepts discussed, let's look at a few comprehensive examples that demonstrate how these components come together in a complete policy.

### Example 1: Access Control Based on Project Membership

*Scenario*: A company wants to restrict access to project-specific resources based on the principal's project assignment.

*Policy*:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:project:us:123456789012:resources/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "P.attr.project == R.attr.project"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "project_admin",
    "createdAt": "2024-08-20T10:00:00Z"
  }
}
```

*Explanation*: This policy allows principals to view and edit resources only if they are assigned to the same project as the resource.

### Example 2: Time-Based Access Control with Derived Roles

*Scenario*: Access to certain system resources should be granted to managers during business hours, with a fallback to emergency access outside these hours.

*Policy*:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "TimeBasedAccess",
    "definitions": [
      {
        "name": "BusinessHoursManager",
        "parentRoles": ["manager"],
        "condition": {
          "match": {
            "expr": "now().getHours() >= 9 && now().getHours() <= 17"
          }
        }
      },
      {
        "name": "EmergencyAccess",
        "parentRoles": ["emergency_staff"],
        "condition": {
          "match": {
            "expr": "now().getHours() < 9 || now().getHours() > 17"
          }
        }
      }
    ]
  },
  "resourcePolicy": {
    "resource": "ari:agsiri:system:us:123456789012:critical/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["access"],
        "effect": "EFFECT_ALLOW",
        "roles": ["BusinessHoursManager", "EmergencyAccess"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "it_admin",
    "createdAt": "2024-08-20T11:00:00Z"
  }
}
```

*Explanation*: This policy uses derived roles to grant access based on the time of day, ensuring that managers have access during business hours, while emergency staff can access the system outside of these hours.

---

## 15.5 Conclusion

Understanding the building blocks of the Pola JSON Schema is crucial for policy writers who aim to create effective and maintainable access control policies. By leveraging the detailed components and examples provided in this chapter, policy writers can ensure that their policies are not only compliant with organizational standards but also optimized for performance and scalability.

As you continue to explore the possibilities with Pola, keep in mind that the flexibility and power of the JSON Schema provide endless opportunities for fine-tuning your access control strategies, ensuring that your resources remain secure and accessible to the right people at the right time.
