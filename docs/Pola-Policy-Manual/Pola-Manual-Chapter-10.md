# Chapter 10: Rules, Actions, and Conditions: A Comprehensive Guide

## 10.1 Understanding Rules

Rules are the cornerstone of any Pola policy. They define the conditions under which actions are allowed or denied, serving as the primary mechanism for enforcing access control. Each rule consists of a set of actions, conditions, effects, and optional metadata that collectively dictate how and when the rule should be applied.

### Definition and Structure of Rules in Pola Policies

In the context of Pola policies, a rule is a directive that specifies what actions can be performed on a resource and under what conditions those actions are allowed or denied. A typical rule contains the following components:

- **Actions**: The specific operations that the rule controls, such as "view," "edit," "delete," etc.
- **Effect**: The outcome of the rule, either allowing (`EFFECT_ALLOW`) or denying (`EFFECT_DENY`) the specified actions.
- **Conditions**: The criteria that must be met for the rule to apply. Conditions can be as simple as a single expression or as complex as a nested combination of multiple expressions.
- **Roles/Derived Roles**: The roles that must be present for the rule to apply. These can include static roles (predefined) or dynamic derived roles (computed based on certain conditions).
- **Metadata**: Optional information that provides context or documentation for the rule, such as descriptions, tags, or audit information.

# Example of a Basic Rule Structure

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
        "roles": ["manager"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Actions**: The rule permits the "view" action on the "project:alpha" resource.
- **Effect**: The rule allows this action for users with the "manager" role.
- **Roles**: Only principals assigned the "manager" role can apply this rule.

### Examples of Specific, Wildcard, and Conditional Rules

**Specific Rules**

A specific rule applies to a well-defined action or set of actions. These rules are the most straightforward and provide precise control over what actions are allowed or denied.

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
            "action": "edit",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["viewer"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Specific Action**: The rule explicitly denies the "edit" action for users with the "viewer" role on the "document:report" resource.

**Wildcard Rules**

Wildcard rules use the `*` symbol to apply the rule to all actions or a subset of actions that match a pattern. Wildcards are particularly useful when you want to apply a rule broadly without listing every possible action.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "file:*",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "*",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["admin"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Wildcard Action**: The rule allows all actions on any resource prefixed with "file:" for users with the "admin" role.

**Conditional Rules**

Conditional rules apply only if certain criteria are met. These rules provide fine-grained control by allowing actions based on the attributes of the principal, the resource, or other contextual data.

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
            "expr": "request.resource.attr.status == 'pending_approval'"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "legal_team",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Condition**: The rule allows the "approve" action for users with the "legal" role, but only if the resource's status is "pending_approval."

## 10.2 Actions in Pola Policies

Actions represent the operations that a principal (user) or system can attempt to perform on a resource. In Pola policies, actions are central to the policy's enforcement logic, as they define what the policy controls. Actions can be specific (targeting a particular operation) or wildcard-based (applying broadly across multiple operations).

### Overview of Actions, Including Specific and Wildcard Actions

Actions in Pola policies can be:

- **Specific Actions**: Targeting a particular operation like "view," "edit," or "delete."
- **Wildcard Actions**: Using the `*` symbol to apply the rule to a range of actions, such as all actions that begin with a certain prefix.

# Example of Specific Actions in a Resource Policy

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
          },
          {
            "action": "download",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["employee"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Specific Actions**: The rule allows the "view" and "download" actions for users with the "employee" role on the "document:report" resource.

# Example of Wildcard Actions in a Resource Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "file:*",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "*",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["admin"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Wildcard Action**: The rule allows all actions on any resource prefixed with "file:" for users with the "admin" role.

### Examples of Role-Specific Actions and Combining Multiple Actions in Policies

**Role-Specific Actions**

Role-specific actions are tailored to particular user roles, allowing or denying operations based on the role assigned to the principal. This approach enables fine-grained access control, ensuring that users can only perform actions appropriate for their roles.

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
            "action": "edit",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["project_manager"]
      },
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["team_member"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "project_manager",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Role-Specific Actions**: The rule allows "edit" actions for users with the "project_manager" role and "view" actions for users with the "team_member" role on the "project:alpha" resource.

**Combining Multiple Actions in a Single Rule**

Multiple actions can be combined within a single rule to simplify policy management, particularly when the same effect applies to several actions.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "document:financials",
    "version": "1.0",
    "rules": [
      {
        "actions":

 [
          {
            "action": "view"
          },
          {
            "action": "download"
          },
          {
            "action": "print"
          }
        ],
        "effect": "EFFECT_ALLOW",
        "roles": ["finance_team"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "finance_manager",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Combined Actions**: The rule allows the "view," "download," and "print" actions for users with the "finance_team" role on the "document:financials" resource.

## 10.3 Defining Complex Actions

Complex actions in Pola policies involve scenarios where multiple conditions, roles, and effects must be carefully orchestrated to enforce the desired access control logic. This section explores how to define and manage such actions effectively.

### Combining Allow and Deny Actions within the Same Policy

In many cases, you may need to allow certain actions while denying others within the same policy. Pola policies provide the flexibility to define multiple rules within a policy, each specifying different actions and effects.

# Example of Combining Allow and Deny Actions

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
        "roles": ["finance_manager"]
      },
      {
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["finance_manager"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "finance_manager",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Allow Actions**: The rule allows "view" and "edit" actions for users with the "finance_manager" role on the "document:financial_report" resource.
- **Deny Actions**: The rule denies the "delete" action for the same role, ensuring that the financial report cannot be deleted by anyone, even those with editing permissions.

### Conditional Actions Based on Resource Attributes

Conditional actions allow you to specify rules that apply only if certain resource attributes meet specific criteria. This approach provides dynamic and context-sensitive access control.

# Example of Conditional Actions Based on Resource Attributes

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
            "expr": "request.resource.attr.status == 'pending_approval'"
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
            "expr": "request.resource.attr.status == 'final'"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "legal_team",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Conditional Approval**: The rule allows the "approve" action for users with the "legal" role, but only if the resource's status is "pending_approval."
- **Conditional Denial**: The rule denies the "edit" action for users with the "legal" role if the resource's status is "final," preventing changes to finalized contracts.

### Best Practices for Managing Complex Action Scenarios

Managing complex action scenarios in Pola policies requires careful planning and a clear understanding of how different rules interact. Here are some best practices to follow:

1. **Prioritize Clarity and Simplicity**: Whenever possible, avoid unnecessary complexity in your rules. Clear and straightforward rules are easier to manage, audit, and troubleshoot.

2. **Use Wildcards Wisely**: Wildcards can simplify policies but should be used cautiously. Overuse of wildcards can lead to unintended consequences, especially in large or dynamic environments.

3. **Leverage Conditions for Precision**: Use conditions to fine-tune the application of rules. By applying rules only when specific conditions are met, you can ensure that your policies are both precise and flexible.

4. **Document Your Rules**: Always include descriptions and metadata to document the purpose and scope of each rule. This practice not only aids in understanding and maintaining the policy but also ensures compliance with organizational standards.

5. **Test Thoroughly**: Before deploying complex policies, thoroughly test them in a controlled environment. Ensure that the rules behave as expected and that there are no conflicts or unintended effects.

6. **Monitor and Review**: Regularly review and monitor your policies to ensure they continue to meet your organization's needs. Update policies as necessary to adapt to changing requirements or to address any issues that arise.

## 10.4 Roles and Derived Roles in Action

Roles are a fundamental concept in Pola policies, providing a way to group users and assign them permissions based on their responsibilities. Derived roles extend this concept by dynamically assigning roles based on conditions or existing roles, allowing for more flexible and context-aware access control.

### Understanding the Interaction Between Actions and Roles

Actions and roles are closely intertwined in Pola policies. Actions specify what operations can be performed, while roles determine who is allowed to perform those actions. The combination of actions and roles forms the core of any access control policy.

# Example of Role-Based Actions in a Resource Policy

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
        "roles": ["viewer", "editor"]
      },
      {
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["editor"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Role-Based Actions**: The rule allows the "view" action for both "viewer" and "editor" roles but restricts the "edit" action to only those with the "editor" role.

### Examples of Using Roles and Derived Roles to Control Access

Derived roles provide dynamic role assignment based on conditions or existing roles, allowing for more granular and context-sensitive access control.

# Example of a Derived Role Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "ProjectRoles",
    "definitions": [
      {
        "name": "ProjectEditor",
        "parentRoles": ["editor"],
        "condition": {
          "match": {
            "expr": "request.resource.attr.project == P.attr.project"
          }
        }
      },
      {
        "name": "ProjectViewer",
        "parentRoles": ["viewer"],
        "condition": {
          "match": {
            "expr": "request.resource.attr.department == P.attr.department"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Derived Roles**: The "ProjectEditor" role is dynamically assigned to users who are editors and are working on the same project as the resource. The "ProjectViewer" role is assigned to users who are viewers and are in the same department as the resource.

# Example of Using Derived Roles in a Resource Policy

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "project:alpha",
    "version": "1.0",
    "importDerivedRoles": ["ProjectRoles"],
    "rules": [
      {
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["ProjectEditor"]
      },
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["ProjectViewer"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "project_manager",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Using Derived Roles**: The rule allows "edit" actions for users with the dynamically assigned "ProjectEditor" role and "view" actions for users with the "ProjectViewer" role, ensuring that access is controlled based on both the user's role and their relationship to the resource.

## 10.5 Utilizing Output Expressions

Output expressions in Pola policies allow you to generate custom feedback

 or trigger additional actions when a rule is activated or when a condition is not met. Outputs can be used to provide detailed information to users, log events, or integrate with external systems.

### Examples of Using Outputs to Provide Feedback and Trigger Integrations

Outputs are particularly useful in scenarios where you need to provide feedback to the user or trigger other processes based on the outcome of a policy evaluation.

# Example of a Custom Output for Denied Access

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
    "createdBy": "system_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Custom Output**: If the user tries to log in from a location other than the headquarters, the system provides a specific denial message. If the condition is not met (i.e., the user is at headquarters), a different message is provided.

# Example of Triggering a Webhook with Outputs

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
            "ruleActivated": "triggerWebhook('http://incident-management.local', 'access_denied')"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system_admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**Explanation:**

- **Webhook Trigger**: When the rule detects that a login attempt is made from a location other than headquarters, it triggers a webhook to notify an incident management system.

### Best Practices for Using Outputs to Enhance Policy Functionality

Using outputs effectively can greatly enhance the functionality of your Pola policies. Here are some best practices:

1. **Provide Clear Feedback**: Use outputs to provide clear and actionable feedback to users. For example, if access is denied, explain why and what steps the user can take to gain access.

2. **Integrate with External Systems**: Leverage outputs to trigger actions in external systems, such as logging tools, incident management platforms, or notification services. This integration can automate responses to policy decisions and improve system efficiency.

3. **Use Outputs for Auditing**: Outputs can be used to generate detailed audit logs, capturing the exact conditions under which rules were applied. This is particularly useful for compliance and security monitoring.

4. **Keep Outputs Simple**: While outputs are powerful, they should be kept as simple as possible to avoid unnecessary complexity. Focus on providing the most critical information or actions.

5. **Test Output Scenarios**: Just like with the rules themselves, thoroughly test your output scenarios to ensure they behave as expected in all possible situations.

# Conclusion

Rules, actions, and conditions are the building blocks of Pola policies, providing the framework for enforcing access control in your organization. By understanding how to define and combine these elements, you can create robust, flexible, and dynamic policies that meet your security and operational needs.

Whether you're working with specific actions, complex conditional rules, or dynamic derived roles, Pola's policy framework offers the tools and flexibility needed to manage even the most complex access control scenarios. By following best practices and leveraging the full capabilities of the Pola Expression Language (PXL), you can ensure that your policies are both effective and maintainable. 

This comprehensive guide serves as a foundation for crafting, testing, and refining your Pola policies, enabling you to implement precise and adaptable access controls in your systems.
