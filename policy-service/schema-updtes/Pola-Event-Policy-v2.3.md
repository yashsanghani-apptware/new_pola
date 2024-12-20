# Pola Policy Framework: Integration of EventPolicy

## Introduction

The Pola Policy Framework is a robust system designed to handle complex security, access, and operational policies within an organization. To further enhance its capabilities, the framework has been extended to include an `eventPolicy`, which allows the system to react to specific events in a sophisticated and context-aware manner. The `eventPolicy` integrates with existing constructs like `Metadata`, `Output`, and `Notify` to provide a comprehensive event-driven policy management system.

This document outlines the updated `eventPolicy` schema, provides detailed examples of its usage, and offers a developer guide to implementing and validating these policies.

# Updated `eventPolicy` Schema v2.3

The enhanced `eventPolicy` schema incorporates several key components that enable rich event handling within the Pola framework. Below is the schema, now featuring `Metadata`, `Output`, and `Notify` objects to fully utilize the power of event-driven policies.

```json
{
  "pola.policy.v1.EventPolicy": {
    "type": "object",
    "required": [
      "event",
      "version"
    ],
    "additionalProperties": false,
    "properties": {
      "event": {
        "type": "string",
        "minLength": 1
      },
      "actions": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "minItems": 1
      },
      "conditions": {
        "$ref": "#/definitions/pola.policy.v1.Condition"
      },
      "metadata": {
        "$ref": "#/definitions/pola.policy.v1.Metadata"
      },
      "output": {
        "$ref": "#/definitions/pola.policy.v1.Output"
      },
      "notify": {
        "$ref": "#/definitions/pola.policy.v1.Notify"
      },
      "version": {
        "type": "string",
        "pattern": "^[0-9]+(\\.[0-9]+)*$"
      }
    }
  }
}
```

## Key Components

1. **Event**: Specifies the event that triggers the policy.
2. **Actions**: Defines the list of actions to be executed when the event occurs.
3. **Conditions**: Optional conditions that must be satisfied for the actions to be triggered.
4. **Metadata**: Provides additional contextual information, such as environment, source, and annotations.
5. **Output**: Dictates what happens after the event is processed, such as logging or triggering a secondary event.
6. **Notify**: Configures how notifications are sent to external systems or services when the event occurs.
7. **Version**: The version of the event policy schema being used.

# Practical Use Cases and Examples

## Example 1: Security Alerting with Metadata and Notify

This scenario demonstrates how an event policy can be used to monitor and respond to suspicious login attempts by integrating metadata and sending notifications.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "eventPolicy": {
    "event": "security:login_failure",
    "version": "1.0",
    "actions": ["lock_account"],
    "conditions": {
      "match": {
        "expr": "P.failed_attempts > 3"
      }
    },
    "metadata": {
      "annotations": {
        "severity": "high",
        "environment": "production"
      },
      "sourceAttributes": {
        "source": "authentication_service"
      }
    },
    "output": {
      "expr": "log('Account locked due to multiple failed login attempts for user {P.username}')"
    },
    "notify": {
      "service": "webservice",
      "serviceConfig": {
        "url": "https://security-alerts.example.com/notify",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer example_token"
        }
      },
      "payloadSchema": {
        "ref": "https://api.pola.dev/v1/schemas/notificationPayload.schema.json"
      }
    }
  },
  "auditInfo": {
    "createdBy": "security_admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

**Explanation**:
- **Event**: Triggered by a security-related event (`security:login_failure`).
- **Actions**: The `lock_account` action is executed when the policy conditions are met.
- **Conditions**: The policy checks if the number of failed login attempts exceeds three.
- **Metadata**: Provides additional context such as the severity level and the environment (production).
- **Output**: Logs a message indicating that the account was locked.
- **Notify**: Sends a POST request to a security alert system with relevant details.

## Example 2: Resource Access with Conditional Output and Notifications

This scenario shows how an event policy can manage access to sensitive resources, log actions, and notify administrators when specific conditions are met.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "eventPolicy": {
    "event": "resource:access_attempt",
    "version": "2.0",
    "actions": ["deny_access"],
    "conditions": {
      "match": {
        "expr": "P.role != 'admin' && R.sensitivity == 'high'"
      }
    },
    "metadata": {
      "annotations": {
        "incidentType": "unauthorized_access",
        "environment": "production"
      },
      "sourceAttributes": {
        "source": "resource_management_service"
      }
    },
    "output": {
      "expr": "log('Unauthorized access attempt by {P.username} on sensitive resource {R.resourceId}')"
    },
    "notify": {
      "service": "queue",
      "serviceConfig": {
        "queueName": "access_alerts",
        "messageGroupId": "high_sensitivity"
      },
      "payloadSchema": {
        "ref": "https://api.pola.dev/v1/schemas/queuePayload.schema.json"
      }
    }
  },
  "auditInfo": {
    "createdBy": "resource_admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

**Explanation**:
- **Event**: Triggered when a resource access attempt is made.
- **Actions**: Access is denied if the user’s role is not `admin` and the resource’s sensitivity is `high`.
- **Conditions**: The policy evaluates the user’s role and the resource’s sensitivity level.
- **Metadata**: Captures the context of the incident and the environment in which it occurred.
- **Output**: Logs an unauthorized access attempt.
- **Notify**: Sends an alert to a message queue for further processing or alerting.

# Developer Guide for Implementing `eventPolicy`

## Step-by-Step Implementation

1. **Define the Event**: Identify the event that will trigger the policy. This could be anything from a user login attempt to a resource being accessed.

   ```json
   "event": "user:login"
   ```

2. **Specify Actions**: List the actions that should be executed when the event occurs and conditions are met.

   ```json
   "actions": ["validate_user", "log_event"]
   ```

3. **Set Conditions**: Optionally define conditions that control when the actions should be executed. This could include checks on the user's role, resource sensitivity, or other attributes.

   ```json
   "conditions": {
     "match": {
       "expr": "P.role == 'admin' && R.status == 'active'"
     }
   }
   ```

4. **Add Metadata**: Provide additional context that can be useful for auditing, filtering, or detailed logging.

   ```json
   "metadata": {
     "annotations": {
       "environment": "staging"
     },
     "sourceAttributes": {
       "source": "auth_service"
     }
   }
   ```

5. **Define Output**: Specify what should be logged or outputted after the event is processed. This could involve logging specific details or formatting a message.

   ```json
   "output": {
     "expr": "log('Admin {P.username} accessed resource {R.resourceId}')"
   }
   ```

6. **Configure Notifications**: Use the `Notify` object to set up notifications to external systems or services. This could involve sending an HTTP request, publishing to a queue, or another form of communication.

   ```json
   "notify": {
     "service": "webservice",
     "serviceConfig": {
       "url": "https://webhook.example.com/notify",
       "method": "POST",
       "headers": {
         "Authorization": "Bearer example_token"
       }
     },
     "payloadSchema": {
       "ref": "https://api.pola.dev/v1/schemas/notificationPayload.schema.json"
     }
   }
   ```

7. **Set Versioning**: Always include a version number for your policy to ensure backward compatibility and proper management of policy updates.

   ```json
   "version": "1.0"
   ```

8. **Audit Information**: Include audit information to track who created or modified the policy and when.

   ```json
   "auditInfo": {
     "createdBy": "admin",
     "createdAt": "2023-08-23T12:00:00Z"
   }
   ```

# Example Scenarios

1. **Alerting on Unauthorized Access**:
   - **Event**: `resource:access_attempt`
   - **Actions**: `deny_access`
   - **Conditions**: User is not an admin and resource is

 highly sensitive.
   - **Notify**: Send an alert to a security system.

2. **Monitoring High-Risk Transactions**:
   - **Event**: `transaction:initiated`
   - **Actions**: `flag_transaction`, `notify_security_team`
   - **Conditions**: Transaction amount exceeds a certain threshold.
   - **Metadata**: Transaction type and risk level.
   - **Output**: Log the transaction details.
   - **Notify**: Send a webhook notification to the fraud detection system.

# Conclusion

The integration of `Metadata`, `Output`, and `Notify` into the `eventPolicy` schema transforms the Pola Policy Framework into a powerful event-driven system. This approach enables more sophisticated and context-aware policies that can react to events in real-time, integrate seamlessly with external systems, and provide rich, actionable insights.

This comprehensive guide should provide developers with the knowledge and tools to effectively implement, manage, and validate event-driven policies within the Pola framework, ensuring robust and responsive security and operational control across their environments.
