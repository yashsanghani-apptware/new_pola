# 3. Principal Policies

Principal Policies are the cornerstone of access control in the Pola framework. These policies define the rules and conditions that govern the actions a specific principal—such as a user, group, or system entity—can perform on various resources within the system. By meticulously crafting Principal Policies, organizations can ensure that access is granted or denied based on a well-defined set of criteria, thereby enhancing security and ensuring compliance with internal and external regulations.

---

## **3.1 Defining Principal Policies**

**Purpose and Structure of Principal Policies**

The primary purpose of a Principal Policy is to define what a specific principal can or cannot do within a system. Principal Policies are crucial in environments where access control needs to be fine-grained and tailored to individual users or groups. These policies typically include several key components:

1. **Principal Identifier**: The entity (e.g., user, group) to which the policy applies.
2. **Resource**: The resource(s) to which the principal has access.
3. **Actions**: The actions that the principal is allowed or denied to perform on the resource.
4. **Effect**: The outcome of the policy rule—either `EFFECT_ALLOW` or `EFFECT_DENY`.
5. **Conditions**: Optional criteria that must be met for the policy to apply, such as time-based restrictions or role-based conditions.
6. **Variables**: Local or imported variables that make the policy more dynamic and reusable.

A Principal Policy is structured in a JSON format that defines these elements clearly and logically. Below is a basic example that illustrates the core structure of a Principal Policy:

**Example: Basic Principal Policy**

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

- **Principal**: The policy applies to the user `john_doe`.
- **Rules**: Two rules are defined—`john_doe` is allowed to `view` the document but is denied the `edit` action.
- **Audit Info**: The policy includes metadata for tracking its creation.

**Defining Access Rules for Specific Principals**

Principal Policies allow you to define access rules at a granular level. For example, you might want to create a policy that grants access to a particular resource only during business hours or restricts access to certain resources based on the principal's department.

**Example: Time-Based Access Control for a Specific Principal**

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
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "now().getHours() >= 9 && now().getHours() <= 17"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T09:00:00Z"
  }
}
```

**Explanation:**

- **Time-Based Condition**: The `view` action is allowed only if the request is made between 9 AM and 5 PM.
- **Effect**: The policy ensures that `john_doe` can only view the document during business hours.

**Advanced Principal Policies**

Principal Policies can also be designed to handle more complex scenarios. These might include combining multiple conditions, incorporating dynamic role assignments, or using hierarchical roles where permissions cascade based on the principal’s position in the organization.

**Example: Role-Based Access with Conditions**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "john_doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "project:alpha",
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    {"expr": "P.attr.role == 'manager'"},
                    {"expr": "R.attr.status == 'active'"}
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
    "createdBy": "project_admin",
    "createdAt": "2024-08-19T10:00:00Z"
  }
}
```

**Explanation:**

- **Role and Resource Status**: The `edit` action is allowed only if `john_doe` is a `manager` and the project's status is `active`.
- **Conditions**: The policy uses the `all` operator to combine multiple conditions, ensuring that both criteria must be true for the action to be allowed.

**Hierarchical Role-Based Access**

In some organizations, roles are hierarchical, meaning that permissions cascade from one role to another. For example, a `senior_manager` might inherit all the permissions of a `manager`, with additional privileges.

**Example: Hierarchical Role-Based Access**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "jane_doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "financial_reports",
        "actions": [
          {
            "action": "approve",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["senior_manager"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "finance_admin",
    "createdAt": "2024-08-19T11:00:00Z"
  }
}
```

**Explanation:**

- **Hierarchical Role**: The `senior_manager` role inherits permissions from the `manager` role, allowing `jane_doe` to both view and approve financial reports.

## **3.2 Variables in Principal Policies**

Variables in Principal Policies are a powerful feature that enables dynamic rule definitions. By using variables, you can create flexible and reusable policies that adapt to changing conditions and contexts.

**Utilizing Local and Imported Variables**

Variables can be defined locally within a Principal Policy or imported from other policies or common variable stores. Local variables are specific to the policy in which they are defined, while imported variables allow for reusability across multiple policies.

**Example: Using Local Variables**

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
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Local Variable**: The `is_weekend` variable is defined locally to check if the current day is a weekend.
- **Condition**: The `view` action is allowed only if the policy is evaluated on a weekend.

**Imported Variables**

Imported variables are useful when you want to standardize conditions across multiple policies. For example, you might define a common set of variables related to security levels or time-based conditions and import them into various Principal Policies.

**Example: Using Imported Variables**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "john_doe",
    "version": "1.0",
    "variables": {
      "import": ["common_security_levels"]
    },
    "rules": [
      {
        "resource": "project:alpha",
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "P.attr.security_clearance >= V.required_clearance"
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

- **Imported Variable**: The `required_clearance` variable is imported from a common set of security levels.
- **Condition**: The `edit` action is allowed only if `john_doe`'s security clearance meets or exceeds the required level

.

**Examples of Using Variables for Dynamic Rule Definitions**

Variables are not only useful for time-based conditions or security levels but also for defining rules that adapt based on the context of the request, such as the location of the principal or the type of device being used.

**Example: Location-Based Access Control**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "jane_doe",
    "version": "1.0",
    "variables": {
      "local": {
        "is_office_network": "P.attr.ip_address.inSubnet('192.168.1.0/24')"
      }
    },
    "rules": [
      {
        "resource": "confidential_reports",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "V.is_office_network"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "network_admin",
    "createdAt": "2024-08-19T14:00:00Z"
  }
}
```

**Explanation:**

- **Local Variable**: The `is_office_network` variable checks if the principal's IP address is within the office subnet.
- **Condition**: The `view` action is allowed only if `jane_doe` is accessing the resource from within the office network.

**Example: Device-Type Based Access Control**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "john_smith",
    "version": "1.0",
    "variables": {
      "local": {
        "is_trusted_device": "P.attr.device_type == 'corporate_laptop'"
      }
    },
    "rules": [
      {
        "resource": "sensitive_data",
        "actions": [
          {
            "action": "download",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "V.is_trusted_device"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "device_admin",
    "createdAt": "2024-08-19T15:00:00Z"
  }
}
```

**Explanation:**

- **Local Variable**: The `is_trusted_device` variable checks if the principal is using a corporate laptop.
- **Condition**: The `download` action is allowed only if `john_smith` is using a trusted device.

**Best Practices for Variable Management in Principal Policies**

When managing variables within Principal Policies, it's essential to follow best practices to ensure that your policies remain maintainable, scalable, and efficient.

1. **Avoid Hardcoding Values**: Use variables instead of hardcoding values directly in conditions. This practice makes policies more flexible and easier to update.

2. **Centralize Common Variables**: Store frequently used variables in a central location and import them into your policies as needed. This reduces redundancy and ensures consistency across policies.

3. **Document Variable Definitions**: Clearly document the purpose and logic of each variable. This is especially important for complex variables that may be used across multiple policies.

4. **Use Descriptive Variable Names**: Choose variable names that clearly describe their purpose. This makes the policy easier to understand and maintain.

5. **Test Variable Logic**: Thoroughly test the logic of your variables to ensure they work as intended. This is particularly important for complex variables that involve multiple conditions or calculations.

6. **Version Control for Variables**: Just like policies, variables should be version-controlled. This allows you to track changes and roll back to previous versions if necessary.

7. **Optimize for Performance**: Be mindful of the performance implications of complex variable logic. Optimize where possible to ensure that policies are evaluated efficiently.

---

## **3.3 Combining Principal and Resource Policies**

In many cases, you'll need to combine Principal and Resource Policies to achieve more nuanced access control. While Principal Policies define what actions a specific user or group can perform, Resource Policies define the rules governing specific resources. By combining these two types of policies, you can create a comprehensive access control system that takes into account both the user's attributes and the resource's characteristics.

**Example: Combining Principal and Resource Policies**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "jane_doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "project:alpha",
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    {"expr": "P.attr.role == 'manager'"},
                    {"expr": "R.attr.status == 'active'"}
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "resourcePolicy": {
    "resource": "project:alpha",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "R.attr.confidential == false"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "project_admin",
    "createdAt": "2024-08-19T16:00:00Z"
  }
}
```

**Explanation:**

- **Principal Policy**: `jane_doe` is allowed to edit the project `alpha` if she is a `manager` and the project's status is `active`.
- **Resource Policy**: The project `alpha` can only be edited if it is not marked as confidential.
- **Combined Effect**: Both policies must be satisfied for `jane_doe` to edit the project. This ensures that access control is both user-specific and resource-specific.

---

## **3.4 Advanced Scenarios in Principal Policies**

Principal Policies can be adapted to handle complex and dynamic scenarios, such as cross-department collaboration, multi-factor authentication requirements, or temporary access grants.

**Example: Cross-Department Collaboration**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "collab_team",
    "version": "1.0",
    "rules": [
      {
        "resource": "project:gamma",
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "any": {
                  "of": [
                    {"expr": "P.attr.department == 'engineering'"},
                    {"expr": "P.attr.department == 'design'"}
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
    "createdBy": "collab_admin",
    "createdAt": "2024-08-19T17:00:00Z"
  }
}
```

**Explanation:**

- **Cross-Department Access**: The policy allows members of both the `engineering` and `design` departments to edit the project `gamma`.
- **Condition**: The `any` operator is used to permit access from either department, facilitating cross-functional collaboration.

**Example: Multi-Factor Authentication Requirement**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "john_doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "sensitive_data",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    {"expr": "P.attr.mfa_enabled == true"},
                    {"expr": "P.attr.location == 'HQ'"}
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
    "createdAt": "2024-08-19T18:00:00Z"
  }
}
```

**Explanation:**

- **Multi-Factor Authentication**: The policy requires that `john_doe` has multi-factor authentication enabled and is accessing from the headquarters to view sensitive data.
- **Condition**: The `all` operator ensures that both conditions must be met for the action to be allowed.

**Example: Temporary Access Grant**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "temp_worker",
    "version": "1.0",
    "rules": [
      {
        "resource": "system:access",
        "actions": [
          {
            "action": "login",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "now().isBetween('2024-08-19T09:00:00Z', '2024-08-19T17:00:00Z')"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "hr_admin",
    "createdAt": "2024-08-19T19:00:00Z"
  }
}
```

**Explanation:**



- **Temporary Access**: The policy allows the `temp_worker` to log in only during a specified time window.
- **Condition**: The `isBetween` function is used to enforce time-based access control, ensuring that the temporary worker can only access the system during their shift.

---

**Conclusion**

Principal Policies are a powerful and flexible tool in the Pola framework, enabling organizations to define precise access controls based on the attributes of individual users or groups. By leveraging variables, conditions, and the ability to combine policies, you can create sophisticated access control mechanisms that meet the complex needs of modern enterprises.

As you design Principal Policies, consider the dynamic nature of your organization and the various scenarios in which access control must adapt. Whether you're handling cross-departmental collaboration, enforcing security measures like multi-factor authentication, or granting temporary access, Principal Policies in Pola offer the tools you need to secure your resources effectively.
