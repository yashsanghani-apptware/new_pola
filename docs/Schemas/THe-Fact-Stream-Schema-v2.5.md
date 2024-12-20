### **Fact Streams Developer Guide (Version 2.5)**

This guide provides a detailed overview of how to implement and use Fact Streams based on the revised JSON Schema, **Fact Streams v2.5**. The Fact Streams v2.5 schema is designed to align with Activity Streams concepts while providing a flexible and structured format for capturing diverse events and actions within a system. 

---

## **1. What Are Fact Streams?**

Fact Streams are a collection of structured JSON objects that represent activities or "facts" occurring within a system. These facts capture interactions between actors (e.g., users or applications) and objects (e.g., resources or policies) under specific conditions or contexts.

### **1.1 Use Cases for Fact Streams**

- **Activity Logging**: Record detailed logs of user or system actions.
- **Policy Evaluation**: Monitor and enforce policies based on real-time facts.
- **Security Monitoring**: Detect and respond to anomalous or suspicious behaviors.
- **Auditing and Compliance**: Provide a reliable trail of activities for auditing and compliance checks.

### **1.2 Key Components in Fact Streams v2.5**

The schema for Fact Streams v2.5 is built around the following core components:

- **Activity**: Represents an action or event.
- **Actor**: The entity performing the action.
- **Object**: The primary object affected by the action.
- **Target**: The entity receiving or affected by the action.
- **Result**: The outcome of the activity.
- **Context**: Additional metadata about the environment or conditions under which the activity occurred.

---

## **2. Structure of Fact Streams v2.5**

### **2.1 Fact Stream JSON Structure**

Fact Streams v2.5 are defined using a JSON Schema with prefixed definitions (`pola.factstream.v2.5`) to ensure versioning and namespace control. Below is a high-level view of the Fact Stream structure:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/factstream.schema.json",
  "type": "object",
  "required": ["type", "id", "totalItems", "items"],
  "properties": {
    "type": { "enum": ["Collection", "OrderedCollection"] },
    "id": { "type": "string", "format": "uri" },
    "totalItems": { "type": "integer", "minimum": 0 },
    "items": { "type": "array", "items": { "$ref": "#/definitions/pola.factstream.v2.5.Activity" } },
    "context": { "$ref": "#/definitions/pola.factstream.v2.5.Context" },
    "metadata": { "type": "object", "additionalProperties": true }
  }
}
```

### **2.2 Detailed Explanation of Core Components**

#### **Collection or OrderedCollection**

- **`type`**: Defines whether the Fact Stream is a `"Collection"` or `"OrderedCollection"`.
  - **`Collection`**: A general collection of activities, where order is not significant.
  - **`OrderedCollection`**: A collection where the order of activities is significant.

#### **Activity (`pola.factstream.v2.5.Activity`)**

- Represents an individual fact or event in the system.

**Properties:**
- **`type`**: The type of activity (e.g., `"Create"`, `"Update"`, `"Access"`).
- **`id`**: A unique URI identifying the activity.
- **`actor`**: The entity (person, application, etc.) performing the activity.
- **`summary`**: A brief description of the activity.
- **`object`**: The primary object being acted upon.
- **`target`**: The target entity affected by the activity.
- **`result`**: The outcome of the activity.
- **`context`**: Additional context metadata related to the activity.
- **`timestamp`**: ISO 8601 formatted timestamp when the activity occurred.
- **`metadata`**: Additional metadata relevant to the activity (e.g., policy ID).

---

## **3. Implementing Fact Streams**

### **3.1 Creating a Fact Stream**

To create a Fact Stream, follow these steps:

1. **Define the Collection Object**: Start with the root collection object, specifying the type as `"Collection"` or `"OrderedCollection"`.
2. **Add Activity Objects**: Populate the `"items"` array with Activity objects (`pola.factstream.v2.5.Activity`), each capturing an individual event or action.
3. **Include Context and Metadata**: Add relevant context and metadata to provide additional information about the Fact Stream.

### **3.2 Example: Creating a Simple Fact Stream**

Here’s a complete example of a Fact Stream capturing access control events:

```json
{
  "type": "Collection",
  "id": "http://example.com/factstream/access-control",
  "totalItems": 2,
  "items": [
    {
      "type": "Access",
      "id": "http://example.com/fact/401",
      "actor": {
        "type": "Person",
        "id": "http://example.com/user/12345",
        "name": "Alice Johnson"
      },
      "summary": "User accessed data room",
      "object": {
        "type": "Resource",
        "id": "http://example.com/resource/dataroom/56789",
        "name": "Data Room 56789"
      },
      "target": {
        "type": "Resource",
        "id": "http://example.com/resource/dataroom/56789"
      },
      "result": {
        "type": "Success",
        "details": "Access granted to data room."
      },
      "timestamp": "2024-09-01T09:00:00Z",
      "context": {
        "user": {
          "id": "http://example.com/user/12345",
          "role": "admin"
        },
        "environment": {
          "region": "us-west-2",
          "timestamp": "2024-09-01T09:00:00Z"
        }
      },
      "metadata": {
        "policyId": "http://example.com/policy/67890"
      }
    },
    {
      "type": "PolicyEvaluation",
      "id": "http://example.com/fact/402",
      "actor": {
        "type": "Application",
        "id": "http://example.com/app/policy-engine",
        "name": "Policy Engine"
      },
      "summary": "Policy evaluation denied access",
      "object": {
        "type": "Policy",
        "id": "http://example.com/policy/67890",
        "name": "Access Control Policy"
      },
      "target": {
        "type": "Resource",
        "id": "http://example.com/resource/dataroom/56789"
      },
      "result": {
        "type": "Deny",
        "details": "Access denied due to insufficient privileges."
      },
      "timestamp": "2024-09-01T10:15:00Z",
      "context": {
        "user": {
          "id": "http://example.com/user/67890",
          "role": "member"
        },
        "environment": {
          "region": "us-west-2",
          "timestamp": "2024-09-01T10:15:00Z"
        }
      },
      "metadata": {
        "policyId": "http://example.com/policy/67891"
      }
    }
  ]
}
```

### **3.3 Best Practices for Using Fact Streams**

- **Use Unique Identifiers**: Ensure all `id` fields are globally unique URIs to prevent conflicts and ambiguity.
- **Maintain Consistent Structure**: Follow the schema strictly, especially for required properties, to ensure compatibility and easy parsing.
- **Proper Timestamps**: Always use ISO 8601 format for `timestamp` to maintain a consistent time format across systems.
- **Metadata Usage**: Use the `metadata` field to store additional relevant information, such as policy IDs, source information, and creator details.

### **3.4 Example: Complex Fact Stream for Anomaly Detection**

This example shows a more complex Fact Stream that captures multiple types of events, including anomaly detection:

```json
{
  "type": "OrderedCollection",
  "id": "http://example.com/factstream/security-monitoring",
  "totalItems": 3,
  "items": [
    {
      "type": "Login",
      "id": "http://example.com/fact/501",
      "actor": {
        "type": "Person",
        "id": "http://example.com/user/98765",
        "name": "John Smith"
      },
      "summary": "User attempted login",
      "object": {
        "type": "Application",
        "id": "http://example.com/app/login-service",
        "name": "Login Service"
      },
      "result": {
        "type": "Failure",
        "details": "Invalid password"
      },
      "timestamp": "2024-09-01T08:15:00Z",
      "context": {
        "environment": {
          "region": "us-east-1",
          "ip": "203.0.113.45",
          "device": "Desktop"
        }
      },
      "metadata": {
        "attemptCount": 3
      }
    },
    {
      "type": "Access",
      "id": "http://example.com/fact/

502",
      "actor": {
        "type": "Service",
        "id": "http://example.com/service/api-gateway",
        "name": "API Gateway"
      },
      "summary": "Service accessed data API",
      "object": {
        "type": "Data",
        "id": "http://example.com/data/resource/78901",
        "name": "Customer Data"
      },
      "result": {
        "type": "Success",
        "details": "Data retrieved successfully"
      },
      "timestamp": "2024-09-01T09:45:00Z",
      "context": {
        "environment": {
          "region": "eu-central-1",
          "device": "Server"
        }
      }
    },
    {
      "type": "AnomalyDetection",
      "id": "http://example.com/fact/503",
      "actor": {
        "type": "Application",
        "id": "http://example.com/app/security-monitor",
        "name": "Security Monitor"
      },
      "summary": "Detected unusual login activity",
      "object": {
        "type": "LoginAttempt",
        "id": "http://example.com/attempt/501",
        "name": "Login Attempt 501"
      },
      "result": {
        "type": "Alert",
        "details": "Multiple failed login attempts detected from new IP."
      },
      "timestamp": "2024-09-01T10:00:00Z",
      "context": {
        "user": {
          "id": "http://example.com/user/98765",
          "role": "user"
        },
        "environment": {
          "region": "us-east-1",
          "ip": "203.0.113.45"
        }
      }
    }
  ]
}
```

---

## **4. Extending Fact Streams**

### **4.1 Adding New Activity Types**

You can extend the Fact Streams schema by adding new activity types to handle different scenarios specific to your application:

- **DataExport**: For activities involving data export.
- **Alert**: For activities that trigger alerts or notifications.

To extend, simply add your new types to the `enum` for `pola.factstream.v2.5.Activity.type`.

### **4.2 Adding Custom Properties**

To capture more specific information, you can add custom properties under the `"metadata"` or `"context"` fields. This allows for flexibility while maintaining the core structure of the Fact Streams.

#### **Example: Adding Custom Metadata**

```json
"metadata": {
  "dataSensitivity": "high",
  "exportFormat": "CSV"
}
```

### **4.3 Schema Validation**

Ensure that all Fact Streams are validated against the JSON Schema (`pola.factstream.v2.5`) using standard JSON validation libraries available in your preferred programming language.

---

## **5. Conclusion**

Fact Streams v2.5 provides a robust, flexible framework for capturing, structuring, and analyzing activities within your system. By adhering to this schema and following best practices, you can implement powerful monitoring, auditing, and compliance mechanisms in your applications, tailored to your specific requirements.
