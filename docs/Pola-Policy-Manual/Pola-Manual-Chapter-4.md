# **Chapter 4: Resource Policies**

Resource Policies are a cornerstone of the Agsiri Pola Smart Policies framework. They provide a structured way to control access to various resources within an organization based on attributes of the resource, the requesting principal, and the surrounding context. Unlike Principal Policies, which are focused on defining what actions a specific principal can take, Resource Policies are concerned with the resource itself and under what circumstances it can be accessed, modified, or acted upon.

This chapter will delve deeply into the structure, capabilities, and applications of Resource Policies, illustrating their importance in a comprehensive access control system. We will explore basic and advanced examples, discuss the role of conditions and attributes, and examine how Resource Policies can be utilized to enforce granular access controls. Additionally, we will look at how Resource Policies interact with other components like Derived Roles and Export Variables to create dynamic, context-aware access controls.

---

## **4.1 Introduction to Resource Policies**

Resource Policies in the Agsiri Pola framework are designed to enforce access control based on the characteristics of the resource in question. This type of policy is resource-centric, meaning that it revolves around the attributes and context of the resource rather than focusing primarily on the attributes of the principal (user or group) as in Principal Policies.

A Resource Policy typically includes the following key elements:

1. **Resource Identifier**: A unique identifier for the resource(s) the policy applies to.
2. **Version**: The version of the policy, which is important for managing updates and changes over time.
3. **Rules**: The core of the policy, where specific actions are either allowed or denied based on various conditions.
4. **Conditions**: Logical expressions that must be satisfied for the rule to apply, which can be based on resource attributes, principal attributes, or other context.
5. **Roles and Derived Roles**: Roles that are necessary for the policy to apply. These can include both static roles and dynamically assigned derived roles.
6. **Audit Info**: Metadata that tracks the creation and modification of the policy for auditing and compliance purposes.

**Example: Basic Resource Policy**

Let’s begin with a simple Resource Policy example. This policy allows managers to view and edit a project named `alpha`, but denies them the ability to delete it.

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

---

## **4.2 Detailed Breakdown of Resource Policies**

A Resource Policy is a multifaceted tool that requires careful consideration and understanding to implement effectively. In this section, we’ll break down the components of a Resource Policy and discuss best practices for utilizing them.

**Resource Identifier**

The `resource` field in a Resource Policy specifies the unique identifier for the resource(s) the policy applies to. This identifier is crucial because it ensures that the policy is applied only to the intended resources.

In Agsiri Pola, resources are identified using ARIs (Agsiri Resource Identifiers), which follow a standardized format similar to ARNs (Amazon Resource Names) in AWS. The ARI format typically includes information about the service, region, account ID, and the specific resource.

**Example: ARI Structure**

```json
"ari:agsiri:dataroom:us-west-2:123456789012:resource/abc123"
```

In this ARI:
- **Service**: `dataroom` is the service.
- **Region**: `us-west-2` specifies the AWS region.
- **Account ID**: `123456789012` is the account ID.
- **Resource**: `resource/abc123` is the specific resource identifier.

The ARI format allows for precise targeting of resources within the Agsiri platform, ensuring that policies are enforced exactly where they are needed.

**Versioning**

The `version` field is an integral part of any policy. It ensures that changes to policies over time can be tracked and managed appropriately. Versioning is particularly important in large organizations where policies may need to be updated regularly to reflect changes in business processes, security requirements, or regulatory compliance.

When updating a policy, it's important to increment the version number to reflect the changes. This allows administrators to keep track of different iterations of a policy and, if necessary, revert to a previous version.

**Example: Versioning in a Resource Policy**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "project:alpha",
    "version": "2.0",
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
    "createdAt": "2024-08-20T09:45:00Z"
  }
}
```

**Explanation:**

- **Version**: This is version `2.0` of the policy, indicating that it has been updated from a previous version.
- **Audit Info**: Reflects the creation date and the user who created this version of the policy.

**Rules**

Rules are the heart of any Resource Policy. They define what actions can be taken on the resource and under what conditions those actions are permitted or denied. Each rule in a Resource Policy consists of the following components:

1. **Actions**: A list of actions (e.g., `view`, `edit`, `delete`) that the rule applies to.
2. **Effect**: Specifies whether the action is allowed (`EFFECT_ALLOW`) or denied (`EFFECT_DENY`).
3. **Roles**: The roles that must be present for the rule to apply. This can include both static roles and derived roles.
4. **Conditions**: Logical expressions that must be true for the rule to take effect. These conditions can involve attributes of the resource, the principal, or other contextual information.

**Example: Rule Structure in a Resource Policy**

```json
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
}
```

**Explanation:**

- **Actions**: The rule applies to `view` and `edit` actions.
- **Effect**: The effect is set to `EFFECT_ALLOW`, meaning these actions are permitted if the conditions are met.
- **Roles**: The rule applies to users with the `manager` role.
- **Conditions**: The actions are only allowed if the resource is not confidential and the principal has a clearance level of 3 or higher.

**Conditions in Resource Policies**

Conditions are a powerful feature of Resource Policies that allow for granular control over resource access. They enable policy writers to define complex logic that must be satisfied for a rule to apply. Conditions are typically based on attributes of the resource (`R`), the principal (`P`), or other contextual data.

In Agsiri Pola, conditions are expressed using the Pola Expression Language (PXL), which allows for sophisticated expressions involving logical operators (`all`, `any`, `none`), comparisons, and function calls.

**Example: Complex Condition in a Resource Policy**

```json
{
  "condition": {
    "match": {
      "all": {
        "of": [
          {"expr": "R.attr.status == 'active'"},
          {
            "any": {
              "of": [
                {"expr": "P.attr.role == 'admin'"},
                {"expr": "P.attr.department == 'legal'"}
              ]
            }
          },
          {"expr": "R.attr.confidential == false"}
        ]
      }
    }
  }
}
```

**Explanation:**

- **All Operator**: The overall condition uses the `all` operator, meaning all the sub-conditions must be true for the rule to apply.
- **Nested Any Operator**: Within the `all` block, the `any` operator is used to allow either of the two conditions (`admin` role or `legal` department) to satisfy that part

 of the condition.
- **Combination**: This complex condition ensures that the resource is active, the principal is either an admin or from the legal department, and the resource is not confidential.

**Roles and Derived Roles**

In a Resource Policy, roles define who the rule applies to. These can be static roles that are predefined in the system or dynamic derived roles that are computed based on certain conditions or attributes.

**Static Roles**

Static roles are straightforward and represent fixed classifications within an organization, such as `manager`, `employee`, or `contractor`. These roles are assigned to users and determine their permissions based on the policies in place.

**Example: Using Static Roles in a Resource Policy**

```json
{
  "resourcePolicy": {
    "resource": "document:financial_report",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["manager"]
      }
    ]
  }
}
```

**Explanation:**

- **Roles**: The rule applies to users with the `manager` role.
- **Effect**: Managers are allowed to view the financial report.

**Derived Roles**

Derived roles, on the other hand, are more flexible and can be assigned dynamically based on specific conditions. This allows for more adaptive access control, where roles can change depending on the current context or attributes of the user and resource.

**Example: Using Derived Roles in a Resource Policy**

```json
{
  "derivedRoles": {
    "name": "confidential_viewer",
    "definitions": [
      {
        "name": "confidential_manager",
        "parentRoles": ["manager"],
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
  }
}
```

**Explanation:**

- **Derived Role**: The `confidential_manager` role is derived from the `manager` role but is only assigned if the principal is in the `legal` department and the resource is confidential.
- **Flexibility**: This allows for dynamic role assignment, ensuring that only those with the appropriate department and resource clearance can access confidential resources.

**Audit Information**

Audit information is a crucial aspect of Resource Policies, ensuring that all changes to the policies are tracked for compliance and accountability. The `auditInfo` section typically includes details like the user who created or modified the policy and the timestamp of these actions.

**Example: Audit Information in a Resource Policy**

```json
{
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:34:56Z",
    "modifiedBy": "security_admin",
    "modifiedAt": "2024-08-20T09:30:00Z"
  }
}
```

**Explanation:**

- **Created By**: The policy was originally created by `admin`.
- **Created At**: The policy was created on August 19, 2024.
- **Modified By**: The policy was later modified by `security_admin`.
- **Modified At**: The modification occurred on August 20, 2024.

Audit information is vital for maintaining a clear history of policy changes, which is essential for regulatory compliance and internal governance.

---

## **4.3 Advanced Resource Policies**

Resource Policies in Agsiri Pola are not limited to simple allow/deny rules. They can be crafted to handle highly complex scenarios involving dynamic conditions, nested roles, and conditional actions. In this section, we will explore some advanced use cases that demonstrate the full power of Resource Policies.

**Dynamic Access Control Based on Resource Sensitivity**

One common scenario in enterprise environments is controlling access to resources based on their sensitivity. For example, a company might have documents that are classified as `public`, `internal`, or `confidential`, and the level of access to these documents should vary accordingly.

**Example: Dynamic Access Control Policy**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "document:classified",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["employee"],
        "condition": {
          "match": {
            "any": {
              "of": [
                {"expr": "R.attr.sensitivity == 'public'"},
                {
                  "all": {
                    "of": [
                      {"expr": "R.attr.sensitivity == 'internal'"},
                      {"expr": "P.attr.clearance_level >= 2"}
                    ]
                  }
                },
                {
                  "all": {
                    "of": [
                      {"expr": "R.attr.sensitivity == 'confidential'"},
                      {"expr": "P.attr.clearance_level >= 3"},
                      {"expr": "P.attr.department == R.attr.department"}
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
    "createdBy": "security_admin",
    "createdAt": "2024-08-20T10:00:00Z"
  }
}
```

**Explanation:**

- **Any Operator**: The policy allows viewing if any of the specified conditions are met.
- **Public Documents**: If the document is classified as `public`, all employees can view it.
- **Internal Documents**: For `internal` documents, the employee must have a clearance level of at least 2.
- **Confidential Documents**: For `confidential` documents, the employee must have a clearance level of at least 3 and must belong to the same department as the document owner.
- **Audit Info**: Tracks the creation of the policy by the `security_admin`.

This policy dynamically adjusts access based on the sensitivity of the document, ensuring that confidential information is only accessible to those with the appropriate clearance and department alignment.

**Conditional Action Blocks**

In some cases, access control needs to adapt not just to who the principal is, but also to the current state or attributes of the resource. For example, a company might allow the editing of a document only if it is in a draft state and has not been archived.

**Example: Conditional Action Blocks**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "document:project_plan",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["editor"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "R.attr.status == 'draft'"},
                {"expr": "R.attr.archived == false"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "content_manager",
    "createdAt": "2024-08-20T11:00:00Z"
  }
}
```

**Explanation:**

- **Actions**: The policy applies to the `edit` action.
- **Effect**: The effect is `EFFECT_ALLOW`, but only under specific conditions.
- **Conditions**: The document must be in a `draft` status and not archived for the `edit` action to be allowed.
- **Roles**: The policy applies to users with the `editor` role.
- **Audit Info**: Tracks the creation of the policy by the `content_manager`.

This example illustrates how Resource Policies can enforce strict control over resource actions based on the resource’s state, ensuring that only documents in a specific state can be edited.

**Resource Policies with Derived Roles and Export Variables**

In environments where access control needs to be both flexible and consistent, combining derived roles and export variables within Resource Policies can be highly effective. This allows for dynamic role assignments and reusable logic, reducing redundancy and simplifying policy management.

**Example: Resource Policy with Derived Roles and Export Variables**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "system:configuration",
    "version": "1.0",
    "variables": {
      "import": ["network_security", "common_variables"]
    },
    "importDerivedRoles": ["system_admin_roles"],
    "rules": [
      {
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["system_admin"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "V.is_trusted_network"},
                {"expr": "P.attr.department == 'IT'"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "sysadmin_lead",
    "createdAt": "2024-08-20T12:00:00Z"
  }
}
```

**Explanation:**

- **Variables**: The policy imports `network_security` and `common_variables`, allowing it to use shared logic for trusted network checks and other common conditions.
- **Derived Roles**: The policy imports `system_admin_roles`, a set of dynamically assigned roles relevant to system administrators.
- **Conditions**: The `edit` action is allowed only if the principal is part of the `IT` department and is accessing the system from a

 trusted network.
- **Audit Info**: Tracks the creation of the policy by the `sysadmin_lead`.

This policy exemplifies the power of combining derived roles and export variables, creating a flexible and scalable approach to access control.

---

## **4.4 Best Practices for Writing Resource Policies**

Resource Policies are a powerful tool in the Agsiri Pola Smart Policies framework, but they require careful planning and best practices to be effective. Here are some key guidelines to consider when writing Resource Policies:

1. **Start Simple, Then Iterate**: Begin with basic policies that address core access control needs. As your understanding of the system grows, iterate on these policies to add complexity and handle edge cases.

2. **Use Versioning Diligently**: Always version your policies, especially when making changes. This practice not only helps in tracking changes but also provides a safety net if you need to roll back to a previous version.

3. **Leverage Conditions**: Utilize conditions to create granular and context-aware access controls. Conditions allow your policies to adapt to different scenarios, making them more flexible and robust.

4. **Combine Static and Derived Roles**: Use static roles for general access control and derived roles for dynamic, context-sensitive permissions. This combination provides a balanced approach to managing access across different user groups and contexts.

5. **Incorporate Export Variables**: Export variables help reduce redundancy and improve maintainability by allowing you to define common logic once and reuse it across multiple policies.

6. **Audit and Monitor**: Regularly audit your Resource Policies to ensure they are functioning as intended and align with your organization's security policies. Monitoring access logs and policy enforcement can help identify potential issues early.

7. **Test Policies Thoroughly**: Before deploying policies in a production environment, test them thoroughly to ensure they behave as expected. Use a variety of test cases, including edge cases, to validate your policies.

8. **Document Policies**: Maintain clear and comprehensive documentation for each policy. This should include the rationale behind the policy, how it interacts with other policies, and any conditions or exceptions that apply.

9. **Use Specific Resource Identifiers**: When possible, avoid using overly broad resource identifiers. Specific identifiers help minimize the risk of unintended access and ensure that policies are applied only where necessary.

10. **Consider Performance Impacts**: Be mindful of the potential performance impacts of complex conditions and large numbers of rules. Optimize your policies to strike a balance between security and system performance.

---

## **4.5 Conclusion**

Resource Policies in the Agsiri Pola Smart Policies framework provide a robust and flexible mechanism for controlling access to resources. By leveraging conditions, roles, derived roles, and export variables, you can create dynamic and context-aware policies that adapt to the needs of your organization.

As you develop and refine your Resource Policies, remember that simplicity and clarity are key. Start with basic policies, iterate based on real-world requirements, and always prioritize maintainability and scalability. With careful planning and best practices, Resource Policies can become a powerful tool in your security arsenal, helping you protect sensitive resources while enabling efficient and controlled access for your users.
