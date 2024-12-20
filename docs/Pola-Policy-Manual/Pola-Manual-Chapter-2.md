### **Chapter 2: Fundamentals of Pola Smart Policies**

---

#### **2.1 Overview of Pola Smart Policies**

Pola Smart Policies are the backbone of a robust access control system that dynamically adapts to a wide range of scenarios. These policies allow organizations to specify rules that govern how and when resources can be accessed based on a variety of conditions. Unlike traditional access control methods, which often rely solely on static roles and permissions, Pola Smart Policies are dynamic, context-aware, and capable of enforcing complex logic. This chapter will delve into the core components of Pola Smart Policies, exploring how they work together to provide fine-grained access control.

At the heart of Pola Smart Policies is the Pola Expression Language (PXL), a flexible and powerful language designed to evaluate conditions and make decisions based on real-time data. PXL allows policy writers to craft rules that account for numerous factors, including the attributes of the user (or principal), the characteristics of the resource, and the context in which an access request is made.

This chapter introduces the fundamental concepts of Pola Smart Policies, including Principal Policies, Resource Policies, Derived Roles, Export Variables, and Conditions. By understanding these core components, policy writers can create powerful policies that meet the specific needs of their organizations.

---

#### **2.2 Principal Policies**

**What Are Principal Policies?**

Principal Policies define the rules that apply to specific principals, such as users or groups of users. These policies are central to Pola Smart Policies, as they determine what actions a principal is allowed or denied to perform on specified resources. Principal Policies are highly flexible and can incorporate conditions based on a wide range of factors, including the principal’s attributes, the time of day, or the specific resource being accessed.

Each Principal Policy is identified by a unique `principal` field, which specifies the principal to whom the policy applies. This field can represent a specific user, a group of users, or even a dynamic role that is assigned based on certain conditions.

**Basic Structure of a Principal Policy**

The structure of a Principal Policy includes several key components:

1. **Principal**: The identifier of the user or group to whom the policy applies.
2. **Version**: The version of the policy, which helps in managing updates and changes.
3. **Rules**: A set of rules that define what actions the principal is allowed or denied to perform on specific resources.
4. **Variables**: Optional variables that can be used to simplify and reuse conditions within the policy.
5. **Conditions**: Logical expressions that determine when a rule should apply.
6. **Audit Info**: Metadata that tracks the creation and modification of the policy.

**Example: Simple Principal Policy**

Let’s start with a simple example of a Principal Policy that allows a specific user to view a document but denies them the ability to edit it:

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
- **Rules**: Two rules are defined—one that allows the user to `view` the document and another that denies the `edit` action.
- **Audit Info**: This section tracks who created the policy and when it was created, which is essential for auditing and compliance.

**Using Variables in Principal Policies**

Variables in Principal Policies allow policy writers to define reusable expressions that can be referenced multiple times within the policy. This is particularly useful when the same condition needs to be checked in multiple rules, as it reduces redundancy and makes the policy easier to maintain.

**Example: Principal Policy with Variables**

In this example, we define a variable that checks whether the current day is a weekend. The policy then uses this variable to determine whether the user can view the document.

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
- **Condition**: The `view` action is allowed only if the request is made on a weekend.
- **Audit Info**: This ensures that the creation and maintenance of the policy are well-documented for compliance and auditing purposes.

**Advanced Principal Policies**

Principal Policies can also be more complex, incorporating multiple conditions, derived roles, and nested logic. Let’s consider an example where access is granted only if the user belongs to the “management” department and the request is made during working hours.

**Example: Advanced Principal Policy**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "john_doe",
    "version": "1.0",
    "variables": {
      "local": {
        "is_working_hours": "now().getHours() >= 9 && now().getHours() <= 17"
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
                "all": {
                  "of": [
                    {"expr": "P.attr.department == 'management'"},
                    {"expr": "V.is_working_hours"}
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
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**

- **Multiple Conditions**: The `view` action is allowed only if the user is in the “management” department and the request is made during working hours.
- **Condition Logic**: The `all` operator is used to ensure that both conditions must be true for the rule to apply.
- **Audit Info**: As always, this tracks the creation and modification of the policy for compliance purposes.

---

#### **2.3 Resource Policies**

**What Are Resource Policies?**

Resource Policies are another core component of Pola Smart Policies. While Principal Policies focus on what actions a principal can perform, Resource Policies are concerned with controlling access to specific resources. These policies define the rules that determine what actions can be performed on a resource and under what conditions.

Resource Policies are essential for managing access to resources such as files, databases, applications, and other digital assets. By defining Resource Policies, organizations can ensure that sensitive resources are protected and that access is granted only when it is appropriate.

**Basic Structure of a Resource Policy**

The structure of a Resource Policy includes several key components:

1. **Resource**: The identifier of the resource to which the policy applies.
2. **Version**: The version of the policy, used for managing updates and changes.
3. **Rules**: A set of rules that define what actions are allowed or denied on the resource.
4. **Roles/Derived Roles**: Roles that must be present for the rule to apply, including both static and dynamic roles.
5. **Conditions**: Logical expressions that determine when a rule should apply.
6. **Audit Info**: Metadata that tracks the creation and modification of the policy.

**Example: Simple Resource Policy**

Here is a simple example of a Resource Policy that allows managers to view and edit a project, but denies them the ability to delete it.

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

**Explanation:**

- **Resource**: The policy applies to the resource `project:alpha`.
- **Rules**: Two rules are defined—one that allows managers to `view` and `edit` the project, and another that denies them the ability to `delete` it.
- **Audit Info**: Tracks the creation and modification of the policy.

**Advanced Resource Policies**

Resource Policies can be much more complex, incorporating conditions, derived roles, and nested logic. Consider a scenario where a resource policy grants access to a document only if the document is not confidential and the user has a clearance level of 3 or higher.

**Example: Advanced Resource Policy**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "document:alpha",
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
        "roles": ["manager"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "R.attr.confidential == false"},
                {"expr": "P.attr.clearance_level >= 3"}
              ]
            }
          }
        }
      },
      {
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["manager"],
        "condition": {
          "match": {
            "expr": "R.attr.confidential == true"
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

- **Conditions**: The `view` and `edit` actions are allowed only if the document is not confidential and the user has a clearance level of 3 or higher.
- **Deny Condition**: The `delete` action is denied if the document is confidential.
- **Audit Info**: Ensures that all actions related to the policy's creation and modification are tracked.

**Nested Conditions in Resource Policies**

Resource Policies can also use nested conditions to create more granular access control. For example, consider a policy that allows access to a resource if it is in draft status and either the user is in the legal department or the resource is not flagged as high risk.

**Example: Resource Policy with Nested Conditions**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "contract:beta",
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
        "roles": ["legal"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "R.attr.status == 'draft'"},
                {
                  "any": {
                    "of": [
                      {"expr": "P.attr.department == 'legal'"},
                      {"expr": "R.attr.risk_level != 'high'"}
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
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**

- **Nested Conditions**: The policy uses a combination of `all` and `any` operators to allow access only if the resource is in draft status and either the user is in the legal department or the resource is not flagged as high risk.
- **Granular Control**: This example demonstrates how nested conditions can be used to create highly specific access control rules.
- **Audit Info**: Maintains a record of the policy’s creation and updates.

---

#### **2.4 Derived Roles**

**What Are Derived Roles?**

Derived Roles are a powerful feature in Pola Smart Policies that allows for the dynamic assignment of roles based on conditions. Unlike static roles, which are predefined and assigned to users directly, Derived Roles are computed at runtime based on specific criteria. This enables organizations to create policies that adapt to changing contexts, making access control more flexible and responsive.

Derived Roles are particularly useful in scenarios where access needs to be granted or denied based on real-time data, such as the user's location, the time of day, or the current status of a resource. By using Derived Roles, policy writers can create dynamic, context-aware policies that enforce security in a more granular and effective manner.

**Basic Structure of a Derived Role**

A Derived Role is defined by specifying a name, the parent roles from which it is derived, and the conditions that must be met for the role to be assigned. The structure of a Derived Role includes:

1. **Name**: The name of the derived role.
2. **Parent Roles**: The roles from which the derived role is created.
3. **Conditions**: The conditions that must be met for the derived role to be assigned.
4. **Audit Info**: Metadata that tracks the creation and modification of the derived role.

**Example: Simple Derived Role**

Here is an example of a Derived Role that assigns a `project_manager` role to users in the “management” department.

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

- **Derived Role**: The `project_manager` role is assigned to users who belong to the “management” department and are already `senior_employee`.
- **Condition**: The role is only assigned if the user’s department is “management.”
- **Audit Info**: Tracks the creation and modification of the derived role.

**Using Derived Roles in Policies**

Once defined, Derived Roles can be used in both Principal and Resource Policies. This allows for dynamic access control that adapts to the context in which an access request is made.

**Example: Using Derived Roles in a Resource Policy**

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

- **Importing Derived Roles**: The `project_manager` role is imported and used to grant `edit` permissions on the resource.
- **Dynamic Assignment**: The `edit` action is only allowed for users who are dynamically assigned the `project_manager` role based on the conditions defined in the derived role.
- **Audit Info**: Ensures that the policy’s creation and updates are well-documented.

**Advanced Derived Roles**

Derived Roles can also be more complex, incorporating multiple conditions and nested logic. Let’s consider a scenario where a `confidential_viewer` role is assigned to users who belong to the “legal” department and have a clearance level of 3 or higher.

**Example: Advanced Derived Role**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "confidential_viewer",
    "definitions": [
      {
        "name": "viewer",
        "parentRoles": ["employee"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.department == 'legal'"},
                {"expr": "P.attr.clearance_level >= 3"}
              ]
            }
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

- **Complex Conditions**: The `confidential_viewer` role is only assigned if the user belongs to the “legal” department and has a clearance level of 3 or higher.
- **Dynamic Role Assignment**: This role allows for dynamic and context-aware access control, ensuring that only authorized users can access sensitive information.
- **Audit Info**: Keeps track of the creation and modification of the derived role.

---

#### **2.5 Export Variables**

**What Are Export Variables?**

Export Variables are a feature in Pola Smart Policies that allow for

 the definition of reusable variables across multiple policies. By defining variables in a central location, policy writers can avoid redundancy, reduce errors, and make policies easier to maintain and update.

Export Variables are particularly useful when the same condition or value needs to be referenced in multiple policies. Instead of duplicating the condition in each policy, it can be defined once as an Export Variable and then imported wherever it is needed.

**Basic Structure of Export Variables**

The structure of Export Variables includes:

1. **Name**: The name of the export variables policy.
2. **Definitions**: A set of key-value pairs that define the variables.
3. **Audit Info**: Metadata that tracks the creation and modification of the export variables.

**Example: Defining Export Variables**

Here is an example of an Export Variables policy that defines a variable for checking whether the current day is a weekend and another for storing the administrator’s email address.

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

- **Export Variables**: The `is_weekend` variable checks if the current day is a weekend, and `admin_email` stores the administrator’s email address.
- **Reusability**: These variables can be imported and used across multiple policies, reducing redundancy and making the policies easier to maintain.
- **Audit Info**: Tracks the creation and modification of the export variables.

**Importing and Using Export Variables**

Once defined, Export Variables can be imported into any policy. This allows for consistent and efficient policy management.

**Example: Using Export Variables in a Principal Policy**

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
- **Efficiency**: By importing the variable, the policy is easier to maintain and update, as any changes to the `is_weekend` logic can be made in one place and applied across all policies that use it.
- **Audit Info**: Ensures that the creation and updates of the policy are well-documented.

**Advanced Use of Export Variables**

Export Variables can also be used in more complex scenarios, such as defining variables that depend on multiple conditions or external data sources. Let’s consider an example where an export variable is defined to check if the current user is accessing the system from a trusted network.

**Example: Advanced Export Variable**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "exportVariables": {
    "name": "network_security",
    "definitions": {
      "is_trusted_network": "P.attr.ip_address.inIPAddrRange('10.0.0.0/8')"
    }
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**

- **Export Variable**: The `is_trusted_network` variable checks if the user’s IP address is within a trusted range (e.g., the organization’s internal network).
- **Security**: This variable can be used in multiple policies to enforce network-based access control, ensuring that sensitive resources are only accessible from trusted locations.
- **Audit Info**: Keeps track of the creation and modification of the export variable.

**Using Export Variables with Conditions**

Export Variables can also be combined with conditions to create more dynamic and context-aware policies. For example, a policy might allow access only if the user is on a trusted network and it is within working hours.

**Example: Using Export Variables with Conditions**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "system:dashboard",
    "version": "1.0",
    "variables": {
      "import": ["network_security", "common_variables"]
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
                    {"expr": "V.is_trusted_network"},
                    {"expr": "V.is_weekend == false"}
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
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**

- **Combined Variables**: The policy imports `is_trusted_network` from `network_security` and `is_weekend` from `common_variables`.
- **Condition Logic**: Access to the system dashboard is allowed only if the user is on a trusted network and it is not the weekend.
- **Audit Info**: Tracks the policy’s creation and updates for compliance and auditing purposes.

---

### **Conclusion**

By understanding and effectively utilizing Principal Policies, Resource Policies, Derived Roles, and Export Variables, policy developers can create highly flexible and dynamic access control systems that meet the unique needs of their organizations. These components allow for the creation of policies that are not only secure but also adaptable to changing contexts, ensuring that access control is both effective and responsive.

As you continue to develop policies using Pola Smart Policies, consider the specific needs of your organization, and leverage the power of Pola’s features to create robust, context-aware access control mechanisms. Whether you are managing access to sensitive resources, enforcing compliance with regulatory requirements, or simply ensuring that users have the right access at the right time, Pola Smart Policies provide the tools you need to achieve your goals.
