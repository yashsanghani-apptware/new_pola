# Chapter 5: Derived Roles in Pola Policies

## 5.1 Introduction to Derived Roles

Derived Roles are one of the most powerful and flexible components of the Pola Policy framework. They allow organizations to dynamically assign roles to principals (users or groups) based on a wide range of conditions, such as attributes of the principal, the resource being accessed, or the context in which the request is made. This dynamic nature of Derived Roles enables organizations to implement fine-grained access control policies that adapt to changing conditions in real-time, making them an essential tool in managing complex security requirements.

In this chapter, we will explore the concept of Derived Roles in depth, discussing their purpose, how they can be defined and used within Pola Policies, and best practices for implementing them effectively. We will also provide a variety of examples to demonstrate the versatility and power of Derived Roles in real-world scenarios.

## 5.2 Purpose of Derived Roles

The primary purpose of Derived Roles is to provide a dynamic mechanism for assigning roles to principals based on specific conditions. Unlike static roles, which are predefined and assigned to users regardless of context, Derived Roles are evaluated at runtime, allowing for more responsive and context-sensitive access control.

For example, a user might be assigned a basic "Employee" role by default, but depending on certain conditions—such as their department, the time of day, or the sensitivity level of the resource they are accessing—they might also be dynamically assigned a "Confidential Viewer" or "High-Privilege Editor" role. This capability ensures that users have exactly the level of access they need, no more and no less, based on the current context.

Derived Roles are particularly useful in scenarios where access needs to be controlled based on complex, multi-faceted criteria, such as:

- **Sensitive Data Handling**: Only users who meet certain criteria, such as being part of a specific department or having a high security clearance, should be able to access sensitive data.
- **Temporal Access Control**: Certain roles might only be active during specific times of the day, such as administrative roles being active only during business hours.
- **Contextual Access Control**: Access might be granted or restricted based on the location of the user or the type of device they are using to access the resource.

## 5.3 Defining Derived Roles

Derived Roles are defined within a policy by specifying a name for the role, the conditions under which it should be assigned, and any parent roles that the derived role inherits from. The conditions are typically expressed using the Pola Expression Language (PXL), allowing for a wide range of logical operations and comparisons.

**Example: Defining a Basic Derived Role**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "confidential_viewer",
    "definitions": [
      {
        "name": "confidential_viewer",
        "parentRoles": ["viewer"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.department == 'legal'"},
                {"expr": "R.attr.confidential == true"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "security_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Derived Role Definition**: The `confidential_viewer` role is derived from the `viewer` role but is only assigned if the user belongs to the `legal` department and the resource being accessed is marked as confidential.
- **Conditions**: The conditions ensure that only users who meet both criteria are granted this derived role.
- **Audit Information**: Metadata tracks when and by whom the derived role was created.

This example illustrates how Derived Roles can be used to grant additional permissions dynamically based on specific criteria. In this case, only legal department employees can view confidential resources.

## 5.4 Inheritance and Role Hierarchies

Derived Roles can inherit from one or more parent roles, allowing for the creation of complex role hierarchies. This inheritance mechanism ensures that Derived Roles can build upon the permissions and restrictions of existing roles, adding further specificity as needed.

**Example: Inheriting from Multiple Parent Roles**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "senior_manager",
    "definitions": [
      {
        "name": "senior_manager",
        "parentRoles": ["manager", "confidential_viewer"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.years_of_service >= 10"},
                {"expr": "P.attr.department == 'management'"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "hr_admin",
    "createdAt": "2024-08-19T13:00:00Z"
  }
}
```

**Explanation:**

- **Multiple Parent Roles**: The `senior_manager` role inherits from both the `manager` and `confidential_viewer` roles, combining the permissions of both roles.
- **Conditions**: This role is only assigned to principals with at least 10 years of service in the management department.
- **Role Hierarchy**: By inheriting from multiple roles, the `senior_manager` role encapsulates a broader range of permissions while still being contextually constrained by the defined conditions.

This hierarchical approach is particularly useful in large organizations where roles often need to be layered and combined to accommodate different levels of authority and responsibility.

## 5.5 Using Derived Roles in Policies

Once defined, Derived Roles can be used in both Principal and Resource Policies to control access based on the dynamic role assignments. The flexibility of Derived Roles allows them to be applied in various scenarios, ranging from simple access control to complex, condition-based restrictions.

**Example: Using a Derived Role in a Principal Policy**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "senior_manager",
    "version": "1.0",
    "rules": [
      {
        "resource": "company_financials",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "finance_admin",
    "createdAt": "2024-08-19T14:00:00Z"
  }
}
```

**Explanation:**

- **Principal Policy with Derived Role**: The `senior_manager` derived role is used to allow viewing and editing of company financials.
- **Dynamic Role Application**: The `senior_manager` role is assigned dynamically based on the user's attributes, ensuring that only qualified individuals can access and modify sensitive financial data.

**Example: Using a Derived Role in a Resource Policy**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "project:beta",
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
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["senior_manager"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "project_admin",
    "createdAt": "2024-08-19T15:00:00Z"
  }
}
```

**Explanation:**

- **Resource Policy with Derived Role**: The `senior_manager` role is used to allow viewing but deny editing of a specific project.
- **Role-Specific Control**: The policy ensures that even senior managers cannot edit the project, reflecting the organization's security policies.

## 5.6 Advanced Scenarios with Derived Roles

Derived Roles excel in scenarios where access control needs to be both dynamic and context-sensitive. This section will explore some advanced scenarios where Derived Roles can be used to implement sophisticated access control mechanisms.

**Example: Temporary Elevated Access**

In some situations, employees may need temporary elevated access to perform specific tasks. Derived Roles can be used to grant this access based on predefined conditions, such as the completion of mandatory training or the approval of a supervisor.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "temporary_admin",
    "definitions": [
      {
        "name": "temporary_admin",
        "parentRoles": ["admin"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.training_completed == true"},
                {"expr": "P.attr.supervisor_approval == true"},
                {"expr": "now().isBetween('2024-08-19T09:00:00Z', '2024-08-19T17:00:00Z')"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "it_admin",
    "createdAt": "2024-08-19T16:00:00Z"
  }
}
```

**Explanation:**

- **Temporary Elevated Role**: The `temporary_admin` role is assigned based on the completion of training, approval from a supervisor, and access within a specific time window.
- **Time-Based Control**:

 The `isBetween` function ensures that the elevated role is only active during the specified time, providing temporary administrative access as needed.

**Example: Location-Based Access Control**

Derived Roles can also be used to implement location-based access control, granting or restricting access based on the user's geographical location.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "location_based_editor",
    "definitions": [
      {
        "name": "location_based_editor",
        "parentRoles": ["editor"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.location == 'headquarters'"},
                {"expr": "R.attr.sensitivity_level <= 3"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "security_admin",
    "createdAt": "2024-08-19T17:00:00Z"
  }
}
```

**Explanation:**

- **Location-Based Role**: The `location_based_editor` role is granted only to users located at the headquarters and accessing resources with a sensitivity level of 3 or lower.
- **Geographical Restriction**: This policy enforces strict control over who can edit sensitive documents based on their physical location.

**Example: Department-Based Role Assignments**

In large organizations, roles often need to be assigned based on the department or team a user belongs to. Derived Roles can streamline this process by dynamically assigning roles based on departmental attributes.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "engineering_lead",
    "definitions": [
      {
        "name": "engineering_lead",
        "parentRoles": ["team_lead"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.department == 'engineering'"},
                {"expr": "P.attr.title == 'Lead Engineer'"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "hr_admin",
    "createdAt": "2024-08-19T18:00:00Z"
  }
}
```

**Explanation:**

- **Department-Based Role**: The `engineering_lead` role is dynamically assigned to principals who are part of the engineering department and hold the title of Lead Engineer.
- **Organizational Hierarchy**: This approach allows for efficient role management across departments, ensuring that only those with the appropriate title and department are granted leadership roles.

## 5.7 Best Practices for Implementing Derived Roles

Implementing Derived Roles effectively requires careful planning and consideration of various factors, such as the organizational structure, security requirements, and the specific use cases you need to address. Here are some best practices to keep in mind:

1. **Start with Clear Requirements**: Before defining Derived Roles, ensure that you have a clear understanding of the specific access control requirements and the conditions under which roles should be assigned. This will help you design roles that are both effective and maintainable.

2. **Use Inheritance Wisely**: Leverage role inheritance to create a clear and logical hierarchy of roles. This allows you to build complex role structures while keeping the policy definitions concise and manageable.

3. **Avoid Over-Complexity**: While Derived Roles offer powerful capabilities, avoid making your conditions too complex. Overly intricate conditions can be difficult to manage and troubleshoot, leading to potential security gaps or unintended access.

4. **Test Thoroughly**: Test your Derived Roles in a variety of scenarios to ensure they behave as expected. This includes testing with different user attributes, resource conditions, and contextual factors such as time and location.

5. **Document Roles and Conditions**: Maintain clear documentation of your Derived Roles, including the conditions under which they are assigned and any relevant context. This helps ensure that others in your organization can understand and maintain the policies over time.

6. **Monitor and Update Regularly**: As organizational needs evolve, regularly review and update your Derived Roles to ensure they continue to meet your security and access control requirements. This includes monitoring for any changes in organizational structure, security policies, or external regulations.

7. **Use Derived Roles in Combination with Other Policies**: Derived Roles are most effective when used in conjunction with Principal Policies, Resource Policies, and Export Variables. By combining these components, you can create a comprehensive and cohesive access control framework that adapts to the needs of your organization.

## 5.8 Conclusion

Derived Roles are a cornerstone of the Pola Policy framework, providing the flexibility and dynamism needed to implement fine-grained access control in modern organizations. By allowing roles to be assigned based on real-time conditions, Derived Roles enable organizations to enforce security policies that are both robust and adaptable to changing circumstances.

Whether you are managing access to sensitive data, implementing location-based restrictions, or dynamically assigning roles based on departmental attributes, Derived Roles offer a powerful toolset for achieving your security objectives. By following the best practices outlined in this chapter and leveraging the examples provided, you can harness the full potential of Derived Roles to secure your organization's resources effectively.

As you continue to develop and refine your policies, keep in mind the importance of clarity, maintainability, and regular review. With careful planning and thoughtful implementation, Derived Roles can help you build a security framework that not only meets today's challenges but is also prepared for the demands of tomorrow.
