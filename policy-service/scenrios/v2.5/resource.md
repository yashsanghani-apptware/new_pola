# **Resource Model Developer Guide**

The Resource Model in this guide represents a comprehensive structure for defining various resources in your application. The model is designed to support diverse functionalities, including actions, alerts, events, and other attributes that provide rich metadata, management capabilities, and observability for resources.

## **Overview**

The `Resource` model is defined using Mongoose, a MongoDB object modeling tool, and is composed of various attributes that cater to different aspects of a resource, such as its type, properties, operations, and observability configurations.

## **Attributes and Their Usage**

Here is a breakdown of key attributes in the `Resource` model:

#### **1. `typeName`** (Required)
- **Type**: `String`
- **Format**: `ServiceName::ResourceType::ResourceName`
- **Example**: `"drs::dataroom:farm240"`
- **Description**: Represents the type of resource using a specific format. This attribute helps categorize the resource and is essential for differentiating between various resource types.

### **2. `ari`** (Required)
- **Type**: `String`
- **Format**: `ari:service:region:client-id:resource-type:resource-id`
- **Example**: `"ari:drs:us:12812121-1:dataroom:MyUniqueId"`
- **Description**: The Agsiri Resource Identifier (ARI) provides a globally unique name for the resource.

### **3. `description`** (Required)
- **Type**: `String`
- **Description**: A brief description of the resource. This field is used to provide human-readable information about the purpose or nature of the resource.

### **4. `properties`** (Required)
- **Type**: `Map` of `{ [key: string]: any }`
- **Description**: Contains key-value pairs defining various properties of the resource. This attribute allows the resource to hold multiple dynamic properties specific to its type or use case.

### **5. `handlers`** (Required)
- **Type**: Object with various operation handlers
- **Subfields**:
  - `create`, `read`, `update`, `delete`, `search`, `query`, `list`, `publish`, `subscribe`, `notify`, `receive`
  - Each handler has:
    - **`permissions`**: List of required permissions for the operation.
    - **`timeoutInMinutes`**: Timeout duration for the operation in minutes.
- **Description**: Defines the permissions required and timeouts for different operations on the resource. These handlers provide granular control over how each operation is executed.

### **6. `alerts`** (Optional)
- **Type**: Array of Alert Objects
- **Alert Object Structure**:
  - **`enabled`**: Indicates if alerts are enabled (`Boolean`).
  - **`rules`**:
    - **`condition`**: Condition for triggering the alert (`Condition` object).
    - **`action`**: Action to take when the alert is triggered (`String`).
    - **`severity`**: Severity level of the alert (`LOW`, `MEDIUM`, `HIGH`).
    - **`output`**: Optional output definition (`Output` object).
    - **`notify`**: Optional notify object for handling notifications (`Notify` object).
- **Description**: Provides observability configurations that help monitor the resource's state or activities.

### **7. `events`** (Optional)
- **Type**: Array of `IEvent` Objects
- **Event Object Structure**:
  - **`eventType`**: Type of the event (`String`), e.g., `"INFO"`, `"ALERT"`, `"ERROR"`.
  - **`eventName`**: Name of the event (`String`).
  - **`description`**: Description of the event (`String`).
- **Description**: Defines events associated with the resource to monitor changes or actions. These can be used for logging, auditing, or triggering specific workflows.

### **8. `rules`** (Optional)
- **Type**: Array of `ResourceRule` Objects
- **Description**: Specifies rules that govern the resource's behavior, which can be overridden by resource policies.

### **9. `actions`** (Optional)
- **Type**: Array of `Action` Objects
- **Action Object Structure**:
  - **`action`**: The specific action (e.g., `"read"`, `"write"`, `"delete"`).
  - **`effect`**: Effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`).
  - **`condition`**: Optional condition that must be met for the action (`Condition` object).
- **Description**: Defines actions that can be performed on the resource, including the conditions under which they are allowed or denied.

## **Illustrative Examples**

### **Example 1: Basic Resource Creation with Required Attributes**

```bash
curl -X POST http://localhost:4000/v1/resources \
-H "Content-Type: application/json" \
-d '{
  "typeName": "drs::dataroom::farm240",
  "ari": "ari:drs:us:12812121-1:dataroom:MyUniqueId",
  "description": "A data room resource for farm240",
  "properties": {
    "location": "North Farm",
    "capacity": 100
  },
  "required": ["location", "capacity"],
  "handlers": {
    "create": { "permissions": ["create_resource"], "timeoutInMinutes": 120 },
    "read": { "permissions": ["read_resource"], "timeoutInMinutes": 60 },
    "update": { "permissions": ["update_resource"], "timeoutInMinutes": 90 },
    "delete": { "permissions": ["delete_resource"], "timeoutInMinutes": 30 },
    "search": { "permissions": ["search_resource"], "timeoutInMinutes": 10 },
    "query": { "permissions": ["query_resource"], "timeoutInMinutes": 10 },
    "list": { "permissions": ["list_resource"], "timeoutInMinutes": 10 },
    "publish": { "permissions": ["publish_resource"], "timeoutInMinutes": 5 },
    "subscribe": { "permissions": ["subscribe_resource"], "timeoutInMinutes": 5 },
    "notify": { "permissions": ["notify_resource"], "timeoutInMinutes": 5 },
    "receive": { "permissions": ["receive_resource"], "timeoutInMinutes": 5 }
  },
  "primaryIdentifier": ["ari"],
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-30T00:28:02.819Z"
  }
}'

```

### **Example 2: Resource with Complete Set of Attributes**

```bash
curl -X POST http://localhost:4000/v1/resources \
-H "Content-Type: application/json" \
-d '{
  "typeName": "drs::dataroom:farm240",
  "ari": "ari:drs:us:12812121-1:dataroom:MyUniqueId",
  "description": "A data room resource for farm240",
  "sourceUrl": "https://resources.example.com/farm240",
  "documentationUrl": "https://docs.example.com/resources/farm240",
  "replacementStrategy": "create_then_delete",
  "tagging": {
    "taggable": true,
    "tagOnCreate": true,
    "tagUpdatable": true,
    "tagProperty": "/properties/Tags"
  },
  "properties": {
    "location": "North Farm",
    "capacity": 100,
    "manager": "John Doe"
  },
  "required": ["location", "capacity", "manager"],
  "propertyTransform": { "manager": "user.name" },
  "handlers": {
    "create": { "permissions": ["create_resource"], "timeoutInMinutes": 120 },
    "read": { "permissions": ["read_resource"], "timeoutInMinutes": 60 },
    "update": { "permissions": ["update_resource"], "timeoutInMinutes": 90 },
    "delete": { "permissions": ["delete_resource"], "timeoutInMinutes": 30 },
    "search": { "permissions": ["search_resource"], "timeoutInMinutes": 10 },
    "query": { "permissions": ["query_resource"], "timeoutInMinutes": 10 },
    "list": { "permissions": ["list_resource"], "timeoutInMinutes": 10 },
    "publish": { "permissions": ["publish_resource"], "timeoutInMinutes": 5 },
    "subscribe": { "permissions": ["subscribe_resource"], "timeoutInMinutes": 5 },
    "notify": { "permissions": ["notify_resource"], "timeoutInMinutes": 5 },
    "receive": { "permissions": ["receive_resource"], "timeoutInMinutes": 5 }
  },
  "readOnlyProperties": ["id"],
  "writeOnlyProperties": ["secretKey"],
  "createOnlyProperties": ["initDate"],
  "deprecatedProperties": ["oldField"],
  "conditionalCreateOnlyProperties": ["conditionField"],
  "privateProperties": ["internalId"],
  "privateDefinitions": ["internalSchema"],
  "primaryIdentifier": ["name"],
  "additionalIdentifiers": ["manager"],
  "events": [
    {
      "eventType": "ALERT",
      "eventName": "CapacityThresholdReached",
      "description": "Triggered when capacity exceeds 80%"
    }
  ],
  "alerts": [
    {
      "enabled": true,
      "rules": {
        "condition": {
          "match": {
            "all": { "of": [{ "expr": "resource.capacity > 80" }] }
          }
        },
        "action": "send_email",
        "severity": "HIGH"
      }
    }
  ],
  "configuration": {
    "maxRetries": 3,
    "retryInterval": 5
  },
  "resourceLink": {
    "templateUri": "https://templates.example.com/resource-template",
    "mappings": "defaultMapping"
  },
  "attr": { "customAttr1": "value1", "customAttr2": "value2" },
  "policies": ["66d172d2ebe514852871b8f1"],
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-30T00:28:02.819Z

"
  },
  "version": "1.0"
}'
```

### **Important Considerations**

- **Required Fields**: Always ensure that the required fields (`typeName`, `ari`, `description`, `properties`, `required`, `handlers`, and `primaryIdentifier`) are provided.
- **Optional Fields**: Fields like `alerts`, `events`, `rules`, `actions`, and others are optional but provide enhanced functionality and observability.
- **Conflict Resolution**: Be mindful of the business logic that might require resolving conflicts between different policies, alerts, and rules.
- **Error Handling**: Implement proper error handling and validation to ensure data integrity and proper functioning of the resource management operations.

### **Conclusion**

The Resource Model is designed to be highly flexible and extendable, allowing developers to define various resource types with rich metadata and observability configurations. This guide provides an overview of the model's key attributes and how to use them effectively.
### **cURL Command 1: Required Fields Only**

