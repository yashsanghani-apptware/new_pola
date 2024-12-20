## Creating Resources

Here are the curl commands to **create a resource** and **list all resources** using the API endpoint `localhost:4000/v1`.

### 1. Create a New Resource

#### Request
```bash
curl -X POST http://localhost:4000/v1/resources \
-H "Content-Type: application/json" \
-d '{
  "typeName": "ServiceName::ResourceType::ResourceName",
  "ari": "ari:service:region:account:resource-id",
  "description": "This is a description of the resource",
  "name": "SampleResource",
  "sourceUrl": "https://example.com/resource-source",
  "documentationUrl": "https://example.com/resource-docs",
  "replacementStrategy": "create_then_delete",
  "tagging": {
    "taggable": true,
    "tagOnCreate": true,
    "tagUpdatable": true,
    "cloudFormationSystemTags": true,
    "tagProperty": "/properties/Tags"
  },
  "properties": {
    "key1": "value1",
    "key2": "value2"
  },
  "required": ["key1", "key2"],
  "handlers": {
    "create": {
      "permissions": ["create:resource"],
      "timeoutInMinutes": 60
    },
    "read": {
      "permissions": ["read:resource"],
      "timeoutInMinutes": 60
    },
    "update": {
      "permissions": ["update:resource"],
      "timeoutInMinutes": 60
    },
    "delete": {
      "permissions": ["delete:resource"],
      "timeoutInMinutes": 60
    },
    "list": {
      "permissions": ["list:resource"],
      "timeoutInMinutes": 60
    }
  },
  "primaryIdentifier": ["resourceId"],
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}'
```

### 2. List All Resources

#### Request
```bash
curl -X GET http://localhost:4000/v1/resources \
-H "Content-Type: application/json"
```

### Summary
- The **create resource** command provides all necessary fields required for the creation of a resource in compliance with the schema, including `typeName`, `ari`, `description`, `tagging`, `properties`, `handlers`, `primaryIdentifier`, and `auditInfo`.


- The **list resources** command retrieves all the resources available in the system.

Replace placeholders such as `resourceId`, `key1`, `value1`, etc., with the actual values as needed for your specific use case.

It appears that the `events` attribute is missing from the resource listing because it may not be initialized or populated when the resource was created or retrieved from the database. The `events` attribute must be explicitly defined in the data model and properly handled during CRUD operations.

### Updating the Resource Data Model and Controller

To ensure that the `events` attribute is properly included in the listing and handled correctly, let's ensure the following:

1. **Ensure `events` Field is Added to the Resource Data Model**: Confirm that the `events` attribute is defined in the `Resource` model with its interface `IEvent`.

2. **Update CRUD Operations to Handle `events`**: Make sure CRUD operations like creation, updating, and retrieval of resources handle the `events` field properly.

Let's check if the `events` attribute is correctly defined and initialized in the data model.

### Updated Resource Data Model

The `events` field needs to be properly integrated into the `Resource` model:

```typescript
import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing an event for the resource.
 */
export interface IEvent {
  eventType: string;
  eventName: string;
  description: string;
}

/**
 * Interface representing a resource document in MongoDB.
 */
export interface IResource extends Document {
  // ... existing properties ...

  /**
   * Events associated with the resource.
   * @type {IEvent[]}
   */
  events: IEvent[];  // <-- Add this line to the interface
}

// Resource schema definition
const ResourceSchema: Schema = new Schema({
  // ... existing schema properties ...

  events: [
    {
      eventType: { type: String, required: true },
      eventName: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],  // <-- Add this line to the schema
});

/**
 * Mongoose model for interacting with the `Resource` collection.
 */
export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
```

### Controller Adjustments for Handling `events`

Ensure the `events` attribute is properly handled in the controller:

#### Update `createResource` Method

Ensure the `events` attribute is passed during resource creation:

```typescript
public async createResource(req: Request, res: Response): Promise<void> {
  try {
    const newResource = new Resource({
      ...req.body,
      events: req.body.events || [], // Initialize events if not provided
    });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (error: unknown) {
    handleError(res, error);
  }
}
```

#### Update `getAllResources` Method

Ensure the `events` attribute is included in the response:

```typescript
public async getAllResources(req: Request, res: Response): Promise<void> {
  try {
    const resources = await Resource.find().exec(); // Ensure we get all fields including `events`
    res.status(200).json(resources);
  } catch (error: unknown) {
    handleError(res, error);
  }
}
```

### Creating a Resource with Events

When creating a resource, make sure to include the `events` attribute in the request payload:

```bash
curl -X POST http://localhost:4000/v1/resources \
-H "Content-Type: application/json" \
-d '{
  "typeName": "ServiceName::ResourceType::ResourceName",
  "ari": "ari:service:region:account:resource-id",
  "description": "This is a description of the resource",
  "name": "SampleResource",
  "events": [   
    {
      "eventType": "Alert",
      "eventName": "UnauthorizedAccess",
      "description": "Triggered when unauthorized access is attempted."
    }
  ],
  "sourceUrl": "https://example.com/resource-source",
  "documentationUrl": "https://example.com/resource-docs",
  "replacementStrategy": "create_then_delete",
  "tagging": {
    "taggable": true,
    "tagOnCreate": true,
    "tagUpdatable": true,
    "cloudFormationSystemTags": true,
    "tagProperty": "/properties/Tags"
  },
  "properties": {
    "key1": "value1",
    "key2": "value2"
  },
  "required": ["key1", "key2"],
  "handlers": {
    "create": {
      "permissions": ["create:resource"],
      "timeoutInMinutes": 60
    },
    "read": {
      "permissions": ["read:resource"],
      "timeoutInMinutes": 60
    },
    "update": {
      "permissions": ["update:resource"],
      "timeoutInMinutes": 60
    },
    "delete": {
      "permissions": ["delete:resource"],
      "timeoutInMinutes": 60
    },
    "list": {
      "permissions": ["list:resource"],
      "timeoutInMinutes": 60
    }
  },
  "primaryIdentifier": ["resourceId"],
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}'
```

## Event Policies

To add an `eventPolicy` to a resource using the `POST /:id/policies` endpoint, you will need to provide the resource ID and the `eventPolicy` data in the request body.

Below is the `curl` command to add an `eventPolicy` to a specific resource:

### `curl` Command to Add an `eventPolicy` to a Resource

```bash
curl -X POST http://localhost:4000/v1/resources/<resource_id>/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v1",
  "eventPolicy": {
    "event": "access_attempt",
    "resource": "ari:resource:region:account:sensitive-data",
    "version": "1.0",
    "rules": [
      {
        "actions": [
          {
            "action": "ALERT",
            "effect": "EFFECT_DENY",
            "notify": {
              "service": "webservice",
              "serviceConfig": {
                "url": "https://alerts.example.com/unauthorized-access",
                "method": "POST"
              }
            }
          }
        ],
        "conditions": {
          "match": {
            "none": {
              "of": [
                { "expr": "user.role == '\''PrivilegedUser'\''" }
              ]
            }
          }
        }
      }
    ],
    "scope": "global"
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}'
```

### Explanation:

- **Replace `<resource_id>`** with the actual ID of the resource to which you want to add the `eventPolicy`.
- **Endpoint:** `http://localhost:4000/v1/resources/<resource_id>/policies` is the endpoint for adding policies to a resource.
- **Request Method:** `POST`
- **Content-Type:** `application/json` specifies that the request body is in JSON format.
- **Request Body:**
  - `"apiVersion"` specifies the API version.
  - `"eventPolicy"` contains the details of the policy to be added.
  - `"auditInfo"` includes information about who created the policy and when.





## Resource Query

To add a `/query` endpoint that supports extensive logical and complex queries using MongoDB, we need to create a new `queryResources` method in the `ResourceController`. This method will accept a `POST` request with a JSON body that specifies the filter conditions, sorting options, and other query parameters. This approach provides maximum flexibility, enabling the use of complex MongoDB queries, including `$and`, `$or`, `$in`, `$regex`, and more.

### Explanation of New `queryResources` Method

1. **Query Parameters**: Supports complex MongoDB queries using the request body:
   - `filter`: A MongoDB query object to filter documents (e.g., `{ "resource": "ari:resource:region:account:sensitive-data" }`).
   - `projection`: Specifies fields to include or exclude in the result set (e.g., `{ "name": 1, "type": 1 }`).
   - `sort`: Specifies sorting criteria for the result set (e.g., `{ "createdAt": -1 }` for descending).
   - `skip`: Number of documents to skip for pagination (e.g., `0`).
   - `limit`: Maximum number of documents to return in the result set (e.g., `10`).

2. **Flexible Filtering**: Allows for complex MongoDB filters, including logical operators (`$and`, `$or`, `$in`, `$regex`), aggregation, and more.

3. **Projection Support**: Enables selective inclusion/exclusion of fields in the response.

4. **Sorting and Pagination**: Supports advanced sorting and pagination options.

### Usage Example

To query resources based on complex filters and projections, use the following `curl` command:

```bash
curl -X POST "http://localhost:4000/v1/resources/query" \
-H "Content-Type: application/json" \
-d '{
  "filter": {
    "resource": "ari:resource:region:account:sensitive-data",
    "status": { "$in": ["active", "pending"] },
    "createdAt": { "$gte": "2024-08-01T00:00:00Z" }
  },
  "projection": {
    "name": 1,
    "type": 1,
    "createdAt": 1
  },
  "sort": { "createdAt": -1 },
  "skip": 0,
  "limit": 5
}'
```

Thanks for pointing that out! Here are the updated curl commands with the correct API endpoint (`localhost:4000/v1`):

### 1. Query Resources Using Extensive Logical and Complex Query Support

#### Request
```bash
curl -X POST http://localhost:4000/v1/resources/query \
-H "Content-Type: application/json" \
-d '{
  "query": {
    "typeName": { "$regex": "^ServiceName::ResourceType::.*$" },
    "properties.status": "active",
    "createdAt": { "$gte": "2024-01-01T00:00:00Z" }
  }
}'
```

### 2. Get All Events Associated with a Specific Resource

#### Request
```bash
curl -X GET http://localhost:4000/v1/resources/{resourceId}/events \
-H "Content-Type: application/json"
```
Replace `{resourceId}` with the ID of the resource you want to get events for.

### 3. Add an Event to a Specific Resource

#### Request
```bash
curl -X POST http://localhost:4000/v1/resources/{resourceId}/events \
-H "Content-Type: application/json" \
-d '{
  "eventType": "INFO",
  "eventName": "DataAccessAttempt",
  "description": "User attempted to access sensitive data"
}'
```
Replace `{resourceId}` with the ID of the resource you want to add an event to.

### 4. Update an Event of a Specific Resource

#### Request
```bash
curl -X PUT http://localhost:4000/v1/resources/{resourceId}/events/{eventId} \
-H "Content-Type: application/json" \
-d '{
  "eventType": "ALERT",
  "eventName": "UnauthorizedAccessAttempt",
  "description": "User tried to access data without proper authorization"
}'
```
Replace `{resourceId}` with the ID of the resource and `{eventId}` with the ID of the event you want to update.

### 5. Delete an Event from a Specific Resource

#### Request
```bash
curl -X DELETE http://localhost:4000/v1/resources/{resourceId}/events/{eventId} \
-H "Content-Type: application/json"
```
Replace `{resourceId}` with the ID of the resource and `{eventId}` with the ID of the event you want to delete.

### 6. Get the List of Policies Bound to a Resource

#### Request
```bash
curl -X GET http://localhost:4000/v1/resources/{resourceId}/policies \
-H "Content-Type: application/json"
```
Replace `{resourceId}` with the ID of the resource to get the list of bound policies.

### 7. Get the List of `eventPolicy` Type Policies Bound to a Resource

#### Request
```bash
curl -X GET http://localhost:4000/v1/resources/{resourceId}/policies/event \
-H "Content-Type: application/json"
```
Replace `{resourceId}` with the ID of the resource to get the list of `eventPolicy` type policies.

### Summary
These curl commands now reflect the correct API endpoint (`localhost:4000/v1`) and cover all new operations added to the `resourceRoutes.ts` file. Replace placeholders with actual values as needed.
