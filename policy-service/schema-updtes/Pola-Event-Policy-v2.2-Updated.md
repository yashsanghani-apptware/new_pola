# Extending `eventPolicy` with `Metadata` and `Output`

Including `Metadata` and `Output` objects in the `eventPolicy` would indeed enhance its flexibility and power. These additions would allow the `eventPolicy` to carry richer contextual information and enable more sophisticated responses based on the event's occurrence.

## Enhancing `eventPolicy` with `Metadata` and `Output`

### 1. **Metadata Object in `eventPolicy`**:
- **Purpose**: The `Metadata` object provides additional contextual information about the event, such as annotations, source attributes, and identifiers. This can be particularly useful for logging, auditing, and filtering events based on their metadata.
- **Use Case**: Suppose an event is triggered by a specific application or environment (e.g., "production" vs. "staging"). Including `Metadata` allows the event policy to capture this context and potentially take different actions based on the environment.

### 2. **Output Object in `eventPolicy`**:
- **Purpose**: The `Output` object defines the result or side effect that should occur when the event is triggered and the conditions are met. It could specify how to format the output, what to log, or which external systems to notify.
- **Use Case**: After an event is processed, the `Output` object could dictate sending a formatted message to a monitoring system, logging specific details, or triggering a secondary event.

## Updated `eventPolicy` Schema

Here's how the schema might look with these enhancements:

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
      "version": {
        "type": "string",
        "pattern": "^[0-9]+(\\.[0-9]+)*$"
      }
    }
  }
}
```

## Detailed Developer Guide on Enhanced `eventPolicy`

### Introduction

The enhanced `eventPolicy` now includes `Metadata` and `Output` objects, allowing for more sophisticated event handling within the Pola Policy Framework. These additions provide greater context and control over how events are managed, enabling richer interactions and more granular responses.

### Key Components of the Enhanced `eventPolicy`

1. **Event**: The event that triggers the policy.
2. **Actions**: A list of actions to be executed when the event occurs.
3. **Conditions**: Optional conditions that must be met for the actions to be triggered.
4. **Metadata**: Additional contextual information that can be used for logging, auditing, or filtering events.
5. **Output**: Specifies the result or side effect that occurs after the event is processed.
6. **Version**: The version of the event policy.

### Practical Use Cases and Examples

#### Example 1: Event Policy with Metadata

This example demonstrates an event policy that includes metadata to differentiate between production and staging environments.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "eventPolicy": {
    "event": "file:uploaded",
    "version": "1.2",
    "actions": ["notify_admin"],
    "conditions": {
      "match": {
        "expr": "R.directory == '/secure/uploads'"
      }
    },
    "metadata": {
      "annotations": {
        "environment": "production"
      },
      "sourceAttributes": {
        "source": "file_upload_service"
      }
    },
    "output": {
      "expr": "log('File uploaded to secure directory')"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

In this example, the event policy includes metadata indicating that the event occurred in the production environment. The `Output` object ensures that a log entry is created whenever the event is processed.

#### Example 2: Event Policy with Conditional Output

This example demonstrates an event policy that uses the `Output` object to conditionally format the output based on the event's details.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "eventPolicy": {
    "event": "user:login_attempt",
    "version": "2.0",
    "actions": ["block_user"],
    "conditions": {
      "match": {
        "expr": "P.failed_attempts > 5"
      }
    },
    "metadata": {
      "annotations": {
        "severity": "high"
      },
      "sourceAttributes": {
        "source": "auth_service"
      }
    },
    "output": {
      "expr": "send_alert('User {P.username} blocked after multiple failed login attempts')"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

Here, the `eventPolicy` triggers an alert if a user exceeds the allowed number of login attempts. The `Output` object formats the alert message, providing specific details about the user.

## Conclusion

The inclusion of `Metadata` and `Output` objects in the `eventPolicy` enhances the flexibility and power of Pola's event-driven capabilities. By providing richer context and more precise control over the actions triggered by events, this enhancement allows developers to create more sophisticated and responsive policies.

This guide, with its detailed explanations and practical examples, should help developers leverage the full potential of the enhanced `eventPolicy` within the Pola Policy Framework.
