# Chapter 6: Export Variables in Pola Policies

## 6.1 Defining Export Variables

Export Variables are an essential feature of the Pola Policy framework, providing a powerful mechanism for managing policy configurations and conditions across multiple policies. They allow policy writers to define reusable values and expressions that can be referenced in various policies, ensuring consistency, reducing redundancy, and simplifying the maintenance of complex policies.

### Purpose of Export Variables in Policy Management

In large and complex systems, policies often need to evaluate similar conditions or use consistent values across multiple rules and scenarios. Without Export Variables, this could lead to repetitive definitions and a higher risk of errors when changes are needed. Export Variables address this problem by allowing you to define a set of reusable variables that can be referenced throughout your policies.

Export Variables serve several critical purposes:

1. **Consistency Across Policies**: By defining common conditions or values as Export Variables, you ensure that the same logic is applied consistently across all relevant policies. This reduces the risk of discrepancies that could arise from manually duplicating conditions in multiple places.

2. **Simplified Maintenance**: When policies need to be updated, especially in response to changing business requirements or security policies, Export Variables make it easier to implement changes. Instead of updating every policy that uses a particular condition, you only need to update the Export Variable definition, and the change will automatically propagate to all policies that reference it.

3. **Enhanced Readability**: Export Variables can make policies more readable and easier to understand. By abstracting complex expressions into named variables, you can make the intent of the policy clearer to anyone reviewing or maintaining it.

4. **Optimized Performance**: Reusing Export Variables across policies can also lead to performance optimizations. Since the same conditions are evaluated consistently, the system can cache the results of these evaluations, reducing the computational overhead when the same conditions are checked multiple times.

### How to Define and Use Export Variables Across Multiple Policies

Defining Export Variables in Pola Policies is straightforward. They are typically defined in a separate policy file and can include any number of key-value pairs. Each key represents the name of the variable, and the value is the expression or constant that the variable represents.

**Example: Defining Export Variables**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "exportVariables": {
    "name": "common_conditions",
    "definitions": {
      "is_weekend": "now().getDayOfWeek() >= 6",
      "is_office_hours": "now().getHours() >= 9 && now().getHours() <= 17",
      "high_sensitivity_level": "R.attr.sensitivity_level >= 4",
      "manager_role": "P.attr.role == 'manager'"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T09:00:00Z"
  }
}
```

**Explanation:**

- **`apiVersion`**: Indicates the version of the Pola API being used.
- **`exportVariables`**: The main block for defining Export Variables. 
- **`name`**: The name of the set of Export Variables, in this case, "common_conditions".
- **`definitions`**: A key-value map where each key is a variable name, and each value is the expression that defines the variable.
- **`auditInfo`**: Metadata about who created the Export Variables and when they were created.

In this example, four Export Variables are defined:

- **`is_weekend`**: Evaluates to `true` if the current day is Saturday or Sunday.
- **`is_office_hours`**: Evaluates to `true` if the current time is within standard office hours (9 AM to 5 PM).
- **`high_sensitivity_level`**: Evaluates to `true` if the resource's sensitivity level is 4 or higher.
- **`manager_role`**: Evaluates to `true` if the principal (user) has the role of a manager.

Once these variables are defined, they can be imported and used in any number of policies, ensuring that these common conditions are consistently applied across your organization's policy framework.

### Using Export Variables in Policies

After defining Export Variables, you can import them into any policy where they are needed. This is done by referencing the Export Variables in the `variables` block of the policy.

**Example: Using Export Variables in a Principal Policy**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "employee",
    "version": "1.0",
    "variables": {
      "import": ["common_conditions"]
    },
    "rules": [
      {
        "resource": "company_portal",
        "actions": [
          {
            "action": "login",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    {"expr": "V.is_office_hours"},
                    {"expr": "P.attr.department == 'IT'"}
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
    "createdAt": "2024-08-19T10:00:00Z"
  }
}
```

**Explanation:**

- **Importing Export Variables**: The `import` block in the `variables` section brings in the previously defined Export Variables from the `common_conditions` set.
- **Using the Variables**: The `login` action is only allowed during office hours (`V.is_office_hours`) and if the principal belongs to the IT department.

This example demonstrates how Export Variables simplify policy writing and ensure that the conditions are consistently enforced across multiple policies.

## 6.2 Importing and Reusing Export Variables

The true power of Export Variables lies in their ability to be imported and reused across multiple policies. This capability not only streamlines policy management but also makes it easier to enforce consistent rules throughout an organization.

### Examples of Importing and Utilizing Export Variables in Policies

Export Variables can be imported into both Principal and Resource Policies. They are particularly useful in scenarios where the same conditions need to be evaluated in different contexts or where complex conditions are involved.

**Example: Importing Export Variables in a Resource Policy**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "confidential_document",
    "version": "1.0",
    "variables": {
      "import": ["common_conditions"]
    },
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    {"expr": "V.high_sensitivity_level"},
                    {"expr": "P.attr.clearance_level >= 3"}
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
                "expr": "V.is_weekend"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "security_admin",
    "createdAt": "2024-08-19T11:00:00Z"
  }
}
```

**Explanation:**

- **Viewing the Document**: The `view` action is only allowed if the document has a high sensitivity level (`V.high_sensitivity_level`) and the principal has a clearance level of 3 or higher.
- **Editing the Document**: The `edit` action is denied on weekends (`V.is_weekend`), reflecting a security policy that restricts editing sensitive documents outside regular working days.

This example shows how Export Variables can be leveraged to enforce complex and nuanced access control rules across different resources.

### Best Practices for Maintaining and Updating Export Variables

Maintaining and updating Export Variables is crucial to ensuring that your policy framework remains effective and up-to-date. Here are some best practices to follow:

1. **Centralize Export Variables**: Store all Export Variables in a central location, such as a dedicated policy file. This makes it easier to manage and update them as needed.

2. **Use Descriptive Names**: When naming Export Variables, use clear and descriptive names that convey the purpose of the variable. This will make it easier for other policy writers and administrators to understand and use them correctly.

3. **Document Variables**: Provide documentation for each Export Variable, including its purpose, the conditions it evaluates, and examples of how it is used in policies. This documentation should be kept alongside the Export Variables themselves.

4. **Review and Update Regularly**: Regularly review your Export Variables to ensure they still meet your organization's needs. Update them as necessary to reflect changes in business processes, security requirements, or other relevant factors.

5. **Version Control**: Implement version control for your Export Variables. When changes are made, update the version number and document the changes. This helps ensure that all policies using the Export Variables are consistent and up-to-date.

6. **Testing and Validation**: Test any changes to Export Variables in a controlled environment before deploying them to production. This helps to identify and address any potential issues that could arise from the changes.

7. **Avoid Overloading**: While Export Variables are powerful, avoid overloading them with too many complex conditions. If a variable becomes too complex, consider breaking it down into smaller, more manageable variables.

8. **Monitor Usage**: Keep track of where each Export Variable is used across your policies. This can help in assessing the impact of changes and in ensuring that the variables are used consistently

.

### Advanced Examples of Export Variables in Action

**Example: Multi-Level Access Control**

In some scenarios, access control needs to consider multiple factors, such as the user's role, the sensitivity of the resource, and the time of access. Export Variables can be used to encapsulate these conditions and apply them consistently.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "exportVariables": {
    "name": "multi_level_conditions",
    "definitions": {
      "is_high_clearance": "P.attr.clearance_level >= 4",
      "is_sensitive_resource": "R.attr.sensitivity_level >= 5",
      "is_authorized_time": "now().getHours() >= 7 && now().getHours() <= 19"
    }
  },
  "auditInfo": {
    "createdBy": "security_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Usage in a Policy:**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "high_security_system",
    "version": "1.0",
    "variables": {
      "import": ["multi_level_conditions"]
    },
    "rules": [
      {
        "actions": [
          {
            "action": "access",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    {"expr": "V.is_high_clearance"},
                    {"expr": "V.is_sensitive_resource"},
                    {"expr": "V.is_authorized_time"}
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
    "createdBy": "security_admin",
    "createdAt": "2024-08-19T13:00:00Z"
  }
}
```

**Explanation:**

- **Multi-Level Conditions**: The policy allows access to a high-security system only if the principal has a clearance level of 4 or higher (`V.is_high_clearance`), the resource is of high sensitivity (`V.is_sensitive_resource`), and the access is requested during authorized hours (`V.is_authorized_time`).

This example illustrates the power of Export Variables in managing complex, multi-factor access control scenarios across different policies.

**Example: Time and Location-Based Controls**

In some organizations, access to certain resources may need to be restricted based on both time and location. Export Variables can help manage these requirements efficiently.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "exportVariables": {
    "name": "time_location_controls",
    "definitions": {
      "is_working_hours": "now().getHours() >= 8 && now().getHours() <= 18",
      "is_headquarters": "P.attr.location == 'headquarters'",
      "is_remote_access": "P.attr.location == 'remote'"
    }
  },
  "auditInfo": {
    "createdBy": "security_admin",
    "createdAt": "2024-08-19T14:00:00Z"
  }
}
```

**Usage in a Policy:**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "confidential_report",
    "version": "1.0",
    "variables": {
      "import": ["time_location_controls"]
    },
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    {"expr": "V.is_working_hours"},
                    {"expr": "V.is_headquarters"}
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
                "any": {
                  "of": [
                    {"expr": "V.is_remote_access"},
                    {"expr": "!V.is_working_hours"}
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
    "createdBy": "security_admin",
    "createdAt": "2024-08-19T15:00:00Z"
  }
}
```

**Explanation:**

- **Viewing the Report**: The `view` action is allowed only during working hours and when the user is physically located at the headquarters.
- **Editing the Report**: The `edit` action is denied if the user is accessing remotely or if the request is made outside of working hours.

This example demonstrates how Export Variables can streamline the implementation of complex, context-sensitive access controls.

# Conclusion

Export Variables are a cornerstone of the Pola Policy framework, offering a way to centralize, reuse, and consistently apply common conditions and expressions across multiple policies. By leveraging Export Variables, organizations can ensure that their policies are not only robust and consistent but also easier to manage and update.

As policies evolve and grow more complex, Export Variables will become increasingly important for maintaining clarity, reducing redundancy, and ensuring that access controls remain aligned with organizational goals. By following the best practices outlined in this chapter and utilizing the advanced examples provided, policy writers and administrators can harness the full power of Export Variables to create a flexible and scalable access control framework.
