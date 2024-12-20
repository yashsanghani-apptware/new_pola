
# **Fact Stream Model 2.0**

The revised model will make use of the following key concepts from Activity Streams 2.0:

1. **Activity**: Represents actions or events, such as user logins, access attempts, resource modifications, etc.
2. **Actor**: The entity performing or causing the activity (e.g., a user, application, or service).
3. **Object**: The primary object of the activity, such as a resource being accessed or a policy being evaluated.
4. **Target**: The entity affected by or receiving the action, such as a data room or a user role.
5. **Context**: Provides additional metadata, including environmental information (e.g., time, location).
6. **Result**: Represents the outcome or impact of the activity.

## **Revised JSON Schema for Fact Streams**

Here's the revised JSON Schema that incorporates the core Activity Streams 2.0 concepts to define Fact Streams more effectively:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/factstream.schema.json",
  "title": "Fact Stream",
  "description": "Schema for representing a collection of facts related to actor interactions within the Pola system, using Activity Streams 2.0.",
  "type": "object",
  "required": ["@context", "type", "id", "totalItems", "items"],
  "properties": {
    "@context": {
      "type": ["string", "array"],
      "description": "JSON-LD context, required by Activity Streams 2.0.",
      "default": "https://www.w3.org/ns/activitystreams"
    },
    "type": {
      "type": "string",
      "description": "Specifies that this object is a collection of Activities.",
      "enum": ["Collection", "OrderedCollection"]
    },
    "id": {
      "type": "string",
      "format": "uri",
      "description": "Unique identifier for the Fact Stream."
    },
    "totalItems": {
      "type": "integer",
      "minimum": 0,
      "description": "Total number of Activity objects in the collection."
    },
    "items": {
      "type": "array",
      "description": "Array of Activity objects or references to Activity objects.",
      "items": {
        "$ref": "#/definitions/activity"
      }
    },
    "context": {
      "$ref": "#/definitions/context"
    },
    "metadata": {
      "type": "object",
      "description": "Additional metadata for the fact stream.",
      "properties": {
        "source": {
          "type": "string",
          "description": "Source of the fact stream."
        },
        "createdBy": {
          "type": "string",
          "description": "Identifier of the creator of the fact stream."
        }
      },
      "additionalProperties": true
    }
  },
  "definitions": {
    "activity": {
      "type": "object",
      "required": ["@context", "type", "id", "actor", "summary", "object", "timestamp"],
      "properties": {
        "@context": {
          "type": "string",
          "description": "JSON-LD context, required by Activity Streams 2.0.",
          "default": "https://www.w3.org/ns/activitystreams"
        },
        "type": {
          "type": "string",
          "description": "Specifies the type of Activity (e.g., Create, Update, Access, Delete).",
          "enum": ["Create", "Update", "Delete", "Access", "PolicyEvaluation", "AnomalyDetection"]
        },
        "id": {
          "type": "string",
          "format": "uri",
          "description": "Unique identifier for the Activity."
        },
        "actor": {
          "$ref": "#/definitions/actor"
        },
        "summary": {
          "type": "string",
          "description": "A brief summary of the activity."
        },
        "object": {
          "$ref": "#/definitions/object"
        },
        "target": {
          "$ref": "#/definitions/target"
        },
        "result": {
          "$ref": "#/definitions/result"
        },
        "context": {
          "$ref": "#/definitions/context"
        },
        "timestamp": {
          "type": "string",
          "format": "date-time",
          "description": "Timestamp when the activity occurred."
        },
        "metadata": {
          "type": "object",
          "description": "Additional metadata related to the activity.",
          "properties": {
            "policyId": {
              "type": "string",
              "description": "Identifier of the policy associated with the activity."
            },
            "relatedActivities": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uri"
              },
              "description": "List of URIs to related activities."
            }
          },
          "additionalProperties": true
        }
      }
    },
    "actor": {
      "type": "object",
      "required": ["type", "id", "name"],
      "properties": {
        "type": {
          "type": "string",
          "description": "The type of actor involved in the activity.",
          "enum": ["Person", "Organization", "Group", "Application", "Service"]
        },
        "id": {
          "type": "string",
          "format": "uri",
          "description": "Unique identifier of the actor."
        },
        "name": {
          "type": "string",
          "description": "The name of the actor."
        }
      }
    },
    "object": {
      "type": "object",
      "required": ["type", "id"],
      "properties": {
        "type": {
          "type": "string",
          "description": "The type of object involved in the activity (e.g., Resource, Policy, Data).",
          "enum": ["Resource", "Policy", "Data", "File", "Document"]
        },
        "id": {
          "type": "string",
          "format": "uri",
          "description": "Unique identifier of the object."
        },
        "name": {
          "type": "string",
          "description": "The name of the object."
        }
      }
    },
    "target": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "description": "The type of target involved in the activity.",
          "enum": ["Resource", "User", "Role"]
        },
        "id": {
          "type": "string",
          "format": "uri",
          "description": "Unique identifier of the target."
        },
        "name": {
          "type": "string",
          "description": "The name of the target."
        }
      }
    },
    "result": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "description": "Type of result (e.g., Success, Failure, Deny, Allow).",
          "enum": ["Success", "Failure", "Deny", "Allow"]
        },
        "details": {
          "type": "string",
          "description": "Detailed description of the result."
        }
      }
    },
    "context": {
      "type": "object",
      "description": "Contextual details that may influence actor interactions and behaviors.",
      "properties": {
        "user": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uri",
              "description": "Unique identifier of the user."
            },
            "role": {
              "type": "string",
              "description": "Role of the user."
            }
          },
          "additionalProperties": true
        },
        "resource": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uri",
              "description": "Unique identifier of the resource."
            },
            "type": {
              "type": "string",
              "description": "Type of the resource."
            }
          },
          "additionalProperties": true
        },
        "environment": {
          "type": "object",
          "properties": {
            "region": {
              "type": "string",
              "description": "Geographic region associated with the context."
            },
            "timestamp": {
              "type": "string",
              "format": "date-time",
              "description": "Timestamp of the context data."
            },
            "ip": {
              "type": "string",
              "format": "ipv4",
              "description": "IP address from which the activity originated."
            },
            "device": {
              "type": "string",
              "description": "Type of device used for the activity."
            }
          },
          "additionalProperties": true
        }
      },
      "additionalProperties": true
    }
  }
}
```

## **Explanation of the Revised JSON Schema**

- **`type`**: The root object is a "Collection" or "OrderedCollection," indicating

 it is a set of activities (facts) that are ordered or unordered.
- **`activity`**: Represents an action or event within the system. Includes properties such as `actor`, `object`, `target`, `result`, and `context`, aligning with Activity Streams 2.0.
- **`actor`**: The entity performing or causing the activity (e.g., a user, application, or service).
- **`object`**: The primary object of the activity (e.g., a resource being accessed or a policy being evaluated).
- **`target`**: The entity affected by or receiving the action (e.g., a resource, user, or role).
- **`result`**: Represents the outcome or impact of the activity, including its type and detailed description.
- **`context`**: Provides additional metadata, including environmental information (e.g., time, location).

## **Diverse Examples for the Revised Fact Stream Model**

Let's provide a few examples that leverage the revised schema:

### **Example 1: Fact Stream for Access Control Events**

```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Collection",
  "id": "http://example.com/factstream/access-control",
  "totalItems": 2,
  "items": [
    {
      "@context": "https://www.w3.org/ns/activitystreams",
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
      "@context": "https://www.w3.org/ns/activitystreams",
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

### **Example 2: Fact Stream for Security Monitoring Activities**

```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "OrderedCollection",
  "id": "http://example.com/factstream/security-monitoring",
  "totalItems": 2,
  "items": [
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "type": "AnomalyDetection",
      "id": "http://example.com/fact/501",
      "actor": {
        "type": "Application",
        "id": "http://example.com/app/security-agent",
        "name": "Security Agent"
      },
      "summary": "Anomaly detected: Unusual login pattern",
      "object": {
        "type": "Person",
        "id": "http://example.com/user/13579",
        "name": "John Doe"
      },
      "result": {
        "type": "Alert",
        "details": "Detected multiple login attempts from different regions."
      },
      "timestamp": "2024-09-01T08:05:00Z",
      "context": {
        "environment": {
          "region": "eu-central-1",
          "timestamp": "2024-09-01T08:05:00Z"
        }
      },
      "metadata": {
        "anomalyType": "login pattern",
        "severity": "high"
      }
    },
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "type": "Update",
      "id": "http://example.com/fact/502",
      "actor": {
        "type": "Person",
        "id": "http://example.com/user/24680",
        "name": "Jane Smith"
      },
      "summary": "User role updated from viewer to editor",
      "object": {
        "type": "Person",
        "id": "http://example.com/user/24680",
        "name": "Jane Smith"
      },
      "result": {
        "type": "Success",
        "details": "Role updated successfully."
      },
      "timestamp": "2024-09-01T09:30:00Z",
      "context": {
        "user": {
          "id": "http://example.com/user/24680",
          "previousRole": "viewer",
          "newRole": "editor"
        }
      },
      "metadata": {
        "changedBy": "admin"
      }
    }
  ]
}
```

## **Summary**

The revised model aligns closely with the Activity Streams 2.0 format by adopting its core concepts, allowing for structured, standardized representation of facts. This structure enhances interoperability, consistency, and expressiveness in capturing diverse fact scenarios across different domains, such as access control, security monitoring, resource management, and policy evaluation.
