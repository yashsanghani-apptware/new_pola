# Chapter 7: Outputs in Pola Policies

## 7.1 Defining Outputs

Outputs are a powerful and versatile feature in Pola Policies that allow policy writers to define actions or provide feedback when specific conditions are met or when certain rules are triggered. Outputs enable policies to interact dynamically with the system by generating messages, triggering external actions, or integrating with other systems. This makes them an essential tool for creating robust, responsive, and intelligent policies.

### Explanation of Outputs and Their Use in Pola Policies

In Pola, Outputs serve as the mechanism by which a policy can produce side effects or communicate the results of a policy evaluation. They are typically defined within a rule and are triggered when a policy condition is met or when an action is taken that matches the defined rule. Outputs can be used to:

1. **Provide Feedback**: Outputs can generate messages or logs that inform users or administrators about the result of a policy evaluation. This feedback can be crucial for understanding why a particular action was allowed or denied.

2. **Trigger Actions**: Outputs can be configured to trigger specific actions within the system or in integrated external systems. This can include sending notifications, executing scripts, or invoking webhooks to alert other services.

3. **Integrate with External Systems**: Outputs can be used to seamlessly integrate Pola Policies with external systems, such as incident management platforms, monitoring tools, or auditing services. This allows for automated responses to policy events, enhancing the security and operational efficiency of the system.

### Structure of Outputs in Pola Policies

Outputs in Pola are typically defined within the `output` block of a rule. The structure of an output can vary depending on its purpose, but it generally includes conditions for when the output should be triggered and the specific action or message that should be generated.

**Example: Basic Output Structure**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "confidential_document",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["manager"],
        "condition": {
          "match": {
            "expr": "P.attr.clearance_level >= 3"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "logEvent('Access granted', P.id, R.id, now())",
            "conditionNotMet": "logEvent('Access denied due to insufficient clearance', P.id, R.id, now())"
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

**Explanation:**

- **`output` Block**: The output is defined within the `output` block of the rule.
- **`when` Conditions**: The `when` object specifies the conditions under which the output should be triggered. In this example, the `ruleActivated` output is triggered when the rule is successfully applied (i.e., when access is granted), and the `conditionNotMet` output is triggered when the condition is not met (i.e., when access is denied).
- **Actions**: The outputs trigger a logging function (`logEvent`) that records the event, including details such as the principal's ID, the resource ID, and the current time.

### How Outputs Can Provide Feedback, Trigger Actions, or Integrate with External Systems

Outputs can be used in various ways depending on the requirements of the policy and the specific use case. Below are some common scenarios where outputs are beneficial:

**1. Providing Feedback to Users and Administrators**

Outputs can be used to generate feedback messages that inform users or administrators about the outcome of a policy evaluation. This feedback can be useful for transparency and for helping users understand the reasons behind access decisions.

**Example: User Notification**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "financial_report",
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
            "expr": "P.attr.department == 'Finance'"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "sendNotification(P.email, 'Access to financial report granted.')",
            "conditionNotMet": "sendNotification(P.email, 'Access to financial report denied. Please contact your administrator.')"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T14:00:00Z"
  }
}
```

**Explanation:**

- **User Notification**: In this example, the output triggers a notification to the user via email. If the user is allowed to view the financial report, they receive a confirmation message. If access is denied, they receive a message advising them to contact their administrator.

**2. Triggering Actions in the System**

Outputs can be used to trigger specific actions within the system, such as initiating workflows, sending alerts, or logging critical events.

**Example: Triggering an Alert**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "critical_system",
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
            "expr": "P.attr.ip_address != '192.168.1.1'"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "triggerSecurityAlert(P.id, R.id, P.attr.ip_address, now())"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "security_admin",
    "createdAt": "2024-08-19T14:30:00Z"
  }
}
```

**Explanation:**

- **Security Alert**: In this example, if an unauthorized login attempt is made from an IP address that does not match the expected address, the system triggers a security alert. The alert includes details about the principal, the resource, the IP address, and the time of the event.

**3. Integrating with External Systems**

Outputs can be used to integrate Pola Policies with external systems, such as logging services, incident management platforms, or compliance tools. This allows for automated and seamless responses to policy events, enhancing the overall security posture and operational efficiency of the organization.

**Example: Integrating with an Incident Management Platform**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "database_access",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
          }
        ],
        "roles": ["*"],
        "condition": {
          "match": {
            "expr": "P.attr.clearance_level < 5"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "createIncident('Unauthorized delete attempt', P.id, R.id, now())"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "compliance_officer",
    "createdAt": "2024-08-19T15:00:00Z"
  }
}
```

**Explanation:**

- **Incident Creation**: If a user with insufficient clearance attempts to delete a database, the system automatically creates an incident in the organization's incident management platform. This ensures that potential security breaches are quickly identified and addressed.

## 7.2 Advanced Use Cases for Outputs

While Outputs are commonly used for simple notifications or triggers, they can also be employed in more complex scenarios to drive sophisticated, automated responses to policy evaluations. Below are some advanced use cases that demonstrate the versatility of Outputs in Pola Policies.

### Examples of Using Outputs for Notifications and System Integrations

**1. Multi-Stage Approval Workflows**

In environments where certain actions require multiple levels of approval, Outputs can be used to manage the workflow by sending notifications to the next approver in the chain or by triggering additional steps in the process.

**Example: Multi-Stage Document Approval**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "contract_document",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "approve",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["manager"],
        "condition": {
          "match": {
            "expr": "R.attr.approval_stage == 1 && P.attr.department == 'Legal'"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "advanceApprovalStage(R.id); notifyNextApprover('VP of Legal', R.id, now())"
          }
        }
      },
      {
        "actions": [
          {
            "action": "approve",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["vp_legal"],
        "condition":

 {
          "match": {
            "expr": "R.attr.approval_stage == 2 && P.attr.department == 'Legal'"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "finalizeApproval(R.id); notifyStakeholders(R.id, now())"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "legal_admin",
    "createdAt": "2024-08-19T15:30:00Z"
  }
}
```

**Explanation:**

- **Stage 1 Approval**: The first rule allows a manager in the Legal department to approve a contract document, advancing it to the next stage and notifying the Vice President of Legal for final approval.
- **Stage 2 Approval**: The second rule allows the VP of Legal to finalize the approval process, triggering notifications to relevant stakeholders.

**2. Dynamic Resource Allocation Based on Policy Evaluation**

In scenarios where resources need to be allocated dynamically based on the results of a policy evaluation, Outputs can be used to initiate the allocation process automatically.

**Example: Allocating Cloud Resources**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "cloud_service",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "provision",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["devops_engineer"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.role == 'DevOps Engineer'"},
                {"expr": "R.attr.availability == 'high'"}
              ]
            }
          }
        },
        "output": {
          "when": {
            "ruleActivated": "allocateResources(R.id, P.id, now())"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "cloud_admin",
    "createdAt": "2024-08-19T16:00:00Z"
  }
}
```

**Explanation:**

- **Resource Allocation**: This policy allows a DevOps engineer to provision cloud resources only if the service availability is high. If the rule is activated, the system automatically allocates the necessary resources.

**3. Conditional Data Export Based on Access Controls**

In cases where data exports need to be controlled based on specific conditions, Outputs can be used to manage the export process, ensuring that only authorized data is shared.

**Example: Controlled Data Export**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "customer_data",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "export",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["data_analyst"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.role == 'Data Analyst'"},
                {"expr": "R.attr.data_sensitivity < 3"}
              ]
            }
          }
        },
        "output": {
          "when": {
            "ruleActivated": "initiateDataExport(R.id, P.id, now())"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "data_security_officer",
    "createdAt": "2024-08-19T16:30:00Z"
  }
}
```

**Explanation:**

- **Data Export**: The policy allows a Data Analyst to export customer data only if the data's sensitivity level is below a certain threshold. Upon activation, the system initiates the export process automatically.

**4. Automated Compliance Reporting**

In highly regulated environments, Outputs can be used to automate compliance reporting by generating logs or reports whenever certain actions are taken or conditions are met.

**Example: Compliance Logging for Data Access**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "financial_records",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          }
        ],
        "roles": ["accountant"],
        "condition": {
          "match": {
            "expr": "P.attr.role == 'Accountant'"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "logComplianceEvent('Financial record viewed', P.id, R.id, now())"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "compliance_admin",
    "createdAt": "2024-08-19T17:00:00Z"
  }
}
```

**Explanation:**

- **Compliance Logging**: Every time an accountant views a financial record, the system logs the event as part of the organization's compliance reporting. This ensures that all access to sensitive financial data is tracked and auditable.

### Best Practices for Leveraging Outputs in Complex Policies

When using Outputs in Pola Policies, it is important to follow best practices to ensure that they are effective, maintainable, and scalable.

**1. Clearly Define Output Actions**

Always define the actions to be taken within Outputs clearly and concisely. Avoid ambiguity in the actions triggered by Outputs to ensure that the intended response is always achieved.

**2. Use Outputs for Transparency and Auditability**

Leverage Outputs to enhance the transparency and auditability of your policies. By generating logs, notifications, and reports, Outputs can provide valuable insights into how and why certain decisions were made, which is crucial for security and compliance.

**3. Integrate with External Systems Judiciously**

While integrating with external systems can be powerful, it is important to do so judiciously. Ensure that the integration is necessary and that it adds value to the policy's effectiveness. Avoid over-complicating the policy with unnecessary external triggers.

**4. Test Outputs Thoroughly**

Before deploying policies with Outputs in a production environment, test them thoroughly to ensure that they behave as expected. This includes verifying that all conditions trigger the appropriate Outputs and that the resulting actions are correct.

**5. Keep Outputs Aligned with Organizational Goals**

Ensure that the Outputs defined in your policies align with the broader goals of your organization. Whether it's enhancing security, improving operational efficiency, or ensuring compliance, Outputs should be designed to support these objectives.

**6. Document Outputs for Clarity and Maintenance**

Document the Outputs in your policies clearly, explaining their purpose, conditions, and actions. This documentation is invaluable for future maintenance, troubleshooting, and updates to the policies.

# Conclusion

Outputs are a powerful feature in Pola Policies, enabling dynamic responses to policy evaluations and seamless integration with internal systems and external platforms. By understanding how to define and use Outputs effectively, policy writers can create responsive, transparent, and efficient access control mechanisms that align with organizational objectives.

Whether used for simple notifications, complex integrations, or automated workflows, Outputs provide the flexibility and power needed to manage modern, complex systems securely. By following the best practices and examples outlined in this chapter, you can harness the full potential of Outputs to enhance the effectiveness of your Pola Policies.
