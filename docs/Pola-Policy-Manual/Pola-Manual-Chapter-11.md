## Chapter 11: Condition, Match, and Expressions

# 11.1 Overview of Conditions

**The Importance of Conditions in Fine-Grained Access Control**

In the realm of access control, conditions are the cornerstone of decision-making processes. Conditions define the specific criteria that must be met for a policy to grant or deny access to a resource. They are vital for ensuring that access control mechanisms are not only secure but also flexible and dynamic. By allowing policies to adapt based on real-time attributes and contextual information, conditions enable organizations to enforce fine-grained access controls that can handle complex and evolving scenarios.

Conditions are particularly important in environments where security needs to be both rigorous and adaptive. For example, in a corporate setting, access to sensitive financial data might be restricted based on the time of day, the user's role within the organization, or even their current physical location. Without conditions, policies would be too rigid to accommodate these nuances, potentially leading to either overly restrictive or dangerously permissive access controls.

**Simple vs. Complex Conditions: When and How to Use Them**

Conditions can range from simple, single-criteria checks to complex, multi-criteria evaluations involving multiple logical operators and nested conditions. The decision to use simple or complex conditions depends on the specific access control requirements and the context in which the policy will be applied.

- **Simple Conditions**: These are straightforward checks that evaluate a single attribute or criterion. Simple conditions are ideal when the access control decision hinges on one or two easily defined factors. For instance, a simple condition might check if a user’s role is ‘admin’ or if the current time is within business hours. Simple conditions are easier to implement, test, and maintain, making them suitable for policies that don’t require nuanced decision-making.

    *Example*:
    ```json
    {
      "condition": {
        "match": {
          "expr": "P.attr.role == 'admin'"
        }
      }
    }
    ```
    In this example, access is granted if the user has an administrative role.

- **Complex Conditions**: These involve multiple criteria and often include logical operators such as `and`, `or`, and `not`, as well as nested conditions. Complex conditions are necessary when access decisions need to account for multiple variables or when the criteria are interdependent. For example, a complex condition might require that a user is both an admin and accessing the system during non-business hours, or that the resource they are trying to access is not flagged as confidential.

    *Example*:
    ```json
    {
      "condition": {
        "match": {
          "all": {
            "of": [
              { "expr": "P.attr.role == 'admin'" },
              { "expr": "R.attr.confidential == false" }
            ]
          }
        }
      }
    }
    ```
    This complex condition only allows access if the user is an admin and the resource is not confidential.

**When to Use Simple vs. Complex Conditions**:
- Use **simple conditions** when the access decision is based on a single attribute or when you want to minimize policy complexity for ease of maintenance.
- Use **complex conditions** when access decisions need to take into account multiple attributes, interdependencies, or when the policy must adapt to a variety of different contexts.

# 11.2 The Match Object

**Structure and Purpose of the Match Object in Conditions**

The match object in Pola policies serves as the core structure for defining conditions. It provides a flexible framework that can evaluate one or more criteria to determine whether a rule should be applied. The match object supports various logical operators, allowing you to create both simple and complex conditions.

At its most basic level, the match object contains an expression (expr) that evaluates to a boolean value (`true` or `false`). However, the match object can also include logical operators such as `all`, `any`, and `none`, which allow multiple expressions to be combined in powerful ways.

*Example of a Basic Match Object*:
```json
{
  "condition": {
    "match": {
      "expr": "P.attr.role == 'admin'"
    }
  }
}
```
This match object checks whether the user’s role is ‘admin’.

**Logical Operators (all, any, none) and Their Use Cases**

Pola policies support three primary logical operators within the match object: `all`, `any`, and `none`. These operators allow you to create conditions that evaluate multiple expressions, providing a means to handle complex decision-making processes.

- **all**: The `all` operator requires that all specified expressions must evaluate to `true` for the condition to be satisfied. This is equivalent to a logical `AND`.

    *Use Case*: You want to ensure that a user is both a manager and accessing a resource during business hours.
    
    *Example*:
    ```json
    {
      "match": {
        "all": {
          "of": [
            { "expr": "P.attr.role == 'manager'" },
            { "expr": "now().getHours() >= 9 && now().getHours() <= 17" }
          ]
        }
      }
    }
    ```
    This condition will only be satisfied if both expressions are `true`.

- **any**: The `any` operator requires that at least one of the specified expressions evaluates to `true`. This is equivalent to a logical `OR`.

    *Use Case*: You want to allow access if the user is either in the HR department or has a senior role.
    
    *Example*:
    ```json
    {
      "match": {
        "any": {
          "of": [
            { "expr": "P.attr.department == 'HR'" },
            { "expr": "P.attr.role == 'senior_manager'" }
          ]
        }
      }
    }
    ```
    This condition will be satisfied if either expression is `true`.

- **none**: The `none` operator requires that none of the specified expressions evaluate to `true`. This is equivalent to a logical `NOT`.

    *Use Case*: You want to deny access to users who are interns or contractors.
    
    *Example*:
    ```json
    {
      "match": {
        "none": {
          "of": [
            { "expr": "P.attr.role == 'intern'" },
            { "expr": "P.attr.role == 'contractor'" }
          ]
        }
      }
    }
    ```
    This condition will be satisfied if neither expression is `true`.

# 11.3 Writing Expressions

**Crafting Simple and Complex Expressions Using PXL**

Expressions in Pola policies are written using the Pola Expression Language (PXL), a powerful and flexible language that allows for the evaluation of various attributes, conditions, and logical relationships. PXL expressions can be as simple as checking a single attribute or as complex as evaluating multiple nested conditions.

- **Simple Expressions**: These typically involve basic comparisons or checks against specific attributes.

    *Example*:
    ```json
    {
      "match": {
        "expr": "P.attr.role == 'admin'"
      }
    }
    ```
    This expression checks if the user’s role is ‘admin’.

- **Complex Expressions**: These involve multiple conditions, logical operators, and may include functions or references to global or local variables.

    *Example*:
    ```json
    {
      "match": {
        "all": {
          "of": [
            { "expr": "P.attr.role == 'admin'" },
            { "expr": "R.attr.sensitivity == 'high'" },
            { "expr": "now().getDayOfWeek() < 6" } 
          ]
        }
      }
    }
    ```
    This complex expression only allows access if the user is an admin, the resource is classified as highly sensitive, and the current day is a weekday.

**Examples of Conditions Using Time, Role, and Resource Attributes**

- **Time-Based Conditions**: Time-based conditions are commonly used to restrict access to specific hours of the day or days of the week.

    *Example*:
    ```json
    {
      "match": {
        "expr": "now().getHours() >= 9 && now().getHours() <= 17"
      }
    }
    ```
    This expression allows access only during business hours (9 AM to 5 PM).

- **Role-Based Conditions**: Role-based conditions determine access based on the user’s role within the organization.

    *Example*:
    ```json
    {
      "match": {
        "expr": "P.attr.role == 'finance_manager'"
      }
    }
    ```
    This expression grants access only to users with the role of `finance_manager`.

- **Resource Attribute-Based Conditions**: These conditions are used when access depends on specific attributes of the resource being accessed.

    *Example*:
    ```json
    {
      "match": {
        "expr": "R.attr.confidential == false"
      }
    }
    ```
    This expression allows access only to resources that are not marked as confidential.

# 11.4 Nested Conditions

**Examples of Nesting Conditions for Complex Access Control**

Nesting conditions is a powerful technique that allows you to combine multiple conditions in a hierarchical manner. This approach is particularly useful when access control decisions depend on several interrelated criteria.

*Example of Nested Conditions*:
```json
{
  "match": {
    "all": {
      "of": [
        { "expr": "P.attr.role == 'admin'" },
        {
          "any": {
            "of": [
              { "expr": "R.attr.confidential == false" },
              { "expr": "P.attr.department == 'legal'" }
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
```
In this example, access is granted only if:
1. The user’s role is ‘admin’.
2. The resource is either not confidential or the user is in the legal department.
3. The resource is neither archived nor deleted.

**Best Practices for Maintaining Clarity in Nested Conditions**

When working with nested conditions, it’s important to maintain clarity to ensure that the policy remains understandable and maintainable. Here are some best practices:

- **Use Descriptive Comments**: Clearly comment on each part of the nested condition to explain its purpose.

    *Example*:
    ```json
    {
      "match": {
        "all": {
          "of": [
            // Ensure user is an admin
            { "expr": "P.attr.role == 'admin'" },
            // Allow if resource is not confidential or user is in legal
            {
              "any": {
                "of": [
                  { "expr": "R.attr.confidential == false" },
                  { "expr": "P.attr.department == 'legal'" }
                ]
              }
            },
            // Deny if resource is archived or deleted
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
    ```

- **Keep Conditions Modular**: Break down complex conditions into smaller, modular conditions where possible. This makes the policy easier to read and troubleshoot.

- **Consistent Indentation and Formatting**: Properly indent and format your nested conditions to visually separate different parts of the condition, making the logic easier to follow.

# 11.5 Variables in Conditions

**How to Incorporate Variables into Condition Expressions**

Variables play a critical role in making conditions dynamic and reusable across different policies. Pola policies allow you to define both local and imported variables that can be referenced within condition expressions. This not only simplifies the expressions but also ensures consistency across multiple policies.

- **Local Variables**: These are defined within the policy itself and are used to encapsulate commonly used expressions or calculations.

    *Example*:
    ```json
    {
      "variables": {
        "local": {
          "is_weekday": "now().getDayOfWeek() < 6"
        }
      },
      "match": {
        "expr": "V.is_weekday"
      }
    }
    ```
    In this example, a local variable `is_weekday` is defined to check if the current day is a weekday, and this variable is then used in the condition.

- **Imported Variables**: These are variables defined in other policies or configurations and imported into the current policy.

    *Example*:
    ```json
    {
      "variables": {
        "import": ["common_time_vars"]
      },
      "match": {
        "expr": "V.is_business_hour"
      }
    }
    ```
    This example imports a variable `is_business_hour` from another policy and uses it in the condition.

**Examples of Using Local and Imported Variables in Conditions**

- **Using Local Variables**: Local variables are particularly useful when you need to perform the same check multiple times within a policy. By defining the check as a variable, you avoid repetition and make the policy easier to update.

    *Example*:
    ```json
    {
      "variables": {
        "local": {
          "is_confidential_project": "R.attr.project == 'confidential'"
        }
      },
      "rules": [
        {
          "actions": ["view"],
          "effect": "EFFECT_ALLOW",
          "condition": {
            "match": {
              "expr": "V.is_confidential_project && P.attr.role == 'project_manager'"
            }
          }
        }
      ]
    }
    ```
    This policy allows project managers to view confidential projects.

- **Using Imported Variables**: Imported variables allow for greater consistency across multiple policies by centralizing common expressions or calculations.

    *Example*:
    ```json
    {
      "variables": {
        "import": ["common_roles"]
      },
      "rules": [
        {
          "actions": ["edit"],
          "effect": "EFFECT_ALLOW",
          "condition": {
            "match": {
              "expr": "V.is_senior_manager"
            }
          }
        }
      ]
    }
    ```
    Here, the `is_senior_manager` variable is imported from a central policy and used to grant editing rights to senior managers.

**Best Practices for Using Variables in Conditions**

- **Define Variables Centrally**: Whenever possible, define commonly used variables in a central location and import them into individual policies. This promotes consistency and makes it easier to update the logic across multiple policies.

- **Use Descriptive Names**: Name your variables descriptively to indicate what they represent. This makes your policies more readable and easier to maintain.

- **Avoid Overcomplicating Variables**: While variables are powerful, avoid making them too complex. If a variable is difficult to understand, it can lead to confusion and errors when the policy is updated or maintained.

- **Test Variables Independently**: Before integrating variables into complex conditions, test them independently to ensure they return the expected results.

# Conclusion

Conditions are the backbone of fine-grained access control in Pola policies, providing the logic needed to enforce complex security and access requirements. By mastering the use of the match object, expressions, logical operators, and variables, you can create dynamic and powerful policies that adapt to your organization’s needs. Whether you are working with simple role-based checks or complex, nested conditions, the tools and techniques covered in this chapter will help you implement effective access control mechanisms that are both secure and maintainable.
