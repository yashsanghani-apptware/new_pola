
# Outputs in Agsiri Policies: A Comprehensive Guide with Advanced Use Cases

In Agsiri Pola policies, the `Outputs` function is a versatile tool that goes beyond simply sending messages. It enables you to trigger specific actions, notify external systems, and integrate with incident management processes. By defining expressions that are evaluated based on the activation state of a policy rule, you can create detailed responses that are included in the Agsiri Pola API output. These outputs can be used to notify users, invoke webhooks, or trigger other systems, making them a powerful feature for building responsive and integrated applications.

This guide explores the use of outputs in Agsiri policies, highlighting advanced scenarios such as integrating with incident management systems through webhooks, and provides practical examples and best practices for using these features effectively.

## Understanding Outputs in Agsiri Policies

Outputs are expressions that are evaluated when a policy rule is either fully activated (when the `action`, `roles`, `derivedRoles`, and `condition` all match) or partially activated (when the `condition` is not met). These outputs allow your application to respond in specific ways based on the outcome of the policy evaluation, whether by providing feedback to users, triggering external systems, or logging incidents.

### When to Use Outputs

Outputs are particularly useful in scenarios where you want to trigger specific actions based on the evaluation of a policy rule. For example, if a policy rule denies access due to a security violation, an output can be configured to send a notification to an incident management system via a webhook. This ensures that critical events are automatically reported and can be acted upon without manual intervention.

## Advanced Use Case: Integrating with Incident Management Systems

One of the most powerful applications of the `Outputs` function is its ability to invoke webhooks, enabling integration with external systems such as incident management platforms. In this scenario, when a policy violation occurs, an output expression can trigger a webhook, notifying the incident management system of the event. This allows for real-time monitoring and response to policy violations, enhancing the security and responsiveness of your system.

### Defining a Webhook as an Exported Variable

To streamline the management of webhooks across multiple policies, you can define the webhook URL as an exported variable. This approach ensures consistency and makes it easier to update the webhook URL across all policies if needed.

#### Example: Defining a Webhook as an Exported Variable

```yaml
---
apiVersion: api.agsiri.dev/v1
description: Webhook for incident management system
exportVariables:
  name: incident_management_webhook
  definitions: 
    webhook_url: '"https://incident-management.example.com/webhook"'
```

**Explanation:**

- **webhook_url**: This exported variable defines the URL of the incident management system's webhook. By centralizing this definition, you ensure that all policies reference the same webhook, making it easier to manage and update.

### Using the Webhook in a Policy Output

Once the webhook URL is defined as an exported variable, you can use it in a policy’s output to notify the incident management system whenever a policy rule is triggered.

#### Example: Using a Webhook in a Resource Policy Output

Consider a policy that restricts access to a system outside of working hours and triggers a webhook when access is denied:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "system_access",
    "variables": {
      "import": [
        "incident_management_webhook"
      ]
    },
    "rules": [
      {
        "name": "working-hours-only",
        "actions": ["*"],
        "effect": "EFFECT_DENY",
        "roles": ["*"],
        "condition": {
          "match": {
            "expr": "now().getHours() > 18 || now().getHours() < 8"
          }
        },
        "output": {
          "when": {
            "ruleActivated": "{\"principal\": P.id, \"resource\": R.id, \"timestamp\": now(), \"message\": \"System can only be accessed between 0800 and 1800\", \"notify\": http.post(V.webhook_url, {\"event\": \"access_denied\", \"details\": {\"principal\": P.id, \"resource\": R.id, \"timestamp\": now()}})}",
            "conditionNotMet": "{\"principal\": P.id, \"resource\": R.id, \"timestamp\": now(), \"message\": \"System can be accessed at this time\"}"
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

- **Condition**: The condition checks if the current time is outside the range of 08:00 to 18:00 hours.
- **Output when ruleActivated**: If the condition is met (i.e., the request is made outside of working hours), this output does two things:
  - It generates a message stating that the system can only be accessed between 08:00 and 18:00, along with the principal’s ID, the resource ID, and the current timestamp.
  - It triggers a webhook by invoking an HTTP POST request to the `webhook_url` with details about the event, including the principal’s ID, the resource ID, and the timestamp. This notifies the incident management system of the access denial.
- **Output when conditionNotMet**: If the condition is not met (i.e., the request is made within working hours), this output generates a message indicating that the system can be accessed at this time, without invoking the webhook.

### Example: Principal Policy with Webhook Notification

Consider another scenario where a principal policy restricts non-admin users from deleting resources, and a webhook is triggered whenever a deletion is attempted by a non-admin user:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "user_john",
    "version": "1.0",
    "rules": [
      {
        "resource": "album:object",
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_DENY",
            "condition": {
              "match": {
                "expr": "P.attr.role != 'admin'"
              }
            },
            "output": {
              "when": {
                "ruleActivated": "{\"principal\": P.id, \"resource\": R.id, \"timestamp\": now(), \"message\": \"Delete action denied for non-admin users\", \"notify\": http.post(V.webhook_url, {\"event\": \"access_denied\", \"details\": {\"principal\": P.id, \"resource\": R.id, \"timestamp\": now()}})}",
                "conditionNotMet": "{\"principal\": P.id, \"resource\": R.id, \"timestamp\": now(), \"message\": \"Action allowed for admin users\"}"
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

- **Condition**: This policy checks if the user’s role is not 'admin'.
- **Output when ruleActivated**: If a non-admin user attempts to delete a resource, the action is denied, and a webhook is triggered, notifying the incident management system of the event.
- **Output when conditionNotMet**: If the user is an admin, the action is allowed, and a message is generated indicating that the action is permitted.

## Evaluating and Responding to Outputs

When a request is processed by the Agsiri Pola API, the outputs generated by the policy are included in the API response. In scenarios where outputs trigger webhooks, these actions are executed as part of the policy evaluation, ensuring that external systems are notified in real-time.

### Example: Response When Request Is Made Outside Working Hours

If a request is made outside of the specified working hours, and the webhook is triggered, the response from Agsiri Pola might look like this:

```json
{
  "requestId": "xx-010023-23459",
  "results": [
    {
      "resource": {
        "id": "bastion_002",
        "kind": "system_access"
      },
      "actions": {
        "login": "EFFECT_DENY"
      },
      "meta": {
        "actions": {
          "login": {
            "matchedPolicy": "resource.system_access.v1.0"
          }
        }
      },
      "outputs": [
        {
          "src": "resource.system_access.v1.0#working-hours-only",
          "val": {
            "message": "System can only be accessed between 0800 and 1800",
            "principal": "john",
            "resource": "bastion_002",
            "timestamp": "2024-08-19T21:53:58.319506543+01:00",
            "notify": "Webhook triggered"
          }
        }
      ]
    }
  ]
}
```

**Explanation:**

- **Effect**: The action (`login`) is denied (`EFFECT_DENY`) because the request was made outside of working hours.
- **Output**: The output includes a message explaining the reason for the denial and confirms that the webhook was triggered to notify the incident management system.

## Key Considerations for Using Outputs with Webhooks

When integrating outputs with webhooks, several

 important considerations should be kept in mind:

1. **Performance Impact**: Invoking webhooks adds overhead to the policy evaluation process, especially if the webhook involves network communication. While this can be necessary for real-time notifications, it’s important to balance the need for immediate action with the potential impact on system performance.

2. **Error Handling**: Consider how to handle cases where the webhook invocation fails. Depending on your application’s requirements, you might want to include fallback mechanisms or retry logic to ensure that critical notifications are not lost.

3. **Security and Validation**: Ensure that the data sent to webhooks is properly validated and sanitized. Additionally, secure the webhook endpoints to prevent unauthorized access or malicious use.

4. **Scalability**: If your system is expected to handle a high volume of policy evaluations, consider the scalability of your webhook infrastructure. Make sure that the external systems receiving the webhook notifications can handle the load.

## Best Practices for Using Outputs with Webhooks

- **Centralize Webhook Management**: Define webhook URLs as exported variables to ensure consistency and ease of maintenance across policies. This also simplifies updates, as changes to the webhook URL only need to be made in one place.

- **Use Outputs Judiciously**: While outputs are powerful, they should be used strategically. Focus on scenarios where real-time notifications or detailed feedback are genuinely beneficial.

- **Monitor and Optimize**: Regularly monitor the performance of policies that use outputs and webhooks. Look for opportunities to optimize, such as reducing the complexity of output expressions or batch-processing webhook notifications.

## Conclusion

The `Outputs` function in Agsiri policies is a versatile tool that enables you to create responsive, integrated systems. By defining output expressions that trigger based on the activation state of policy rules, you can provide clear feedback to users, invoke webhooks, and integrate with external systems like incident management platforms.

This guide has provided a comprehensive overview of how to use outputs in Agsiri policies, including advanced scenarios such as invoking webhooks for real-time incident reporting. By carefully integrating outputs into your policies, you can build systems that are not only secure and compliant but also responsive and proactive in handling critical events.

---

