### **Pola Actor Schema User Guide**

The Pola Actor Schema defines the core entities and their contexts within the Pola system. This schema captures various actor types (such as Users, Groups, Roles, Resources, Organizations) and the contextual information that may affect their interactions and behaviors within the system. Additionally, it includes Facts and Blacklists, which are crucial for policy evaluation and decision-making.

This guide provides a detailed explanation of the building blocks, main elements, and usage examples of the Pola Actor Schema.

---

### **1. Overview of the Pola Actor Schema**

The Pola Actor Schema is designed to support flexible and comprehensive definitions for key actors within the Pola system. The schema leverages JSON Schema standards to ensure compatibility, extensibility, and validation. 

#### **Main Elements:**

1. **User**: Represents an individual entity with personal and organizational information.
2. **Group**: Represents a collection of users or other groups sharing common roles or policies.
3. **Role**: Represents a set of permissions or access rights that can be assigned to users or groups.
4. **Resource**: Represents a resource within the system, such as a service, file, or database.
5. **Organization**: Represents an entity (e.g., a company or department) that encompasses users, groups, roles, and policies.
6. **Fact**: Represents contextual information or data points generated during the lifecycle of an actor.
7. **Blacklist**: Represents restrictions or denials applied to an actor due to certain reasons (e.g., policy violations).
8. **Context**: Provides additional metadata that influences actor interactions, including user, resource, environment, and policy contexts.

### **2. Detailed Description of Building Blocks**

#### **2.1. User**

A **User** represents an individual entity with specific personal and organizational attributes.

- **Properties**:
  - `id`: Unique identifier for the user.
  - `name`, `givenName`, `familyName`: The full name and its components.
  - `email`, `telephone`: Contact information.
  - `jobTitle`: The user's job title (optional).
  - `username`, `password`: Authentication credentials.
  - `address`, `contactPoint`: Detailed address and contact point information.
  - `groups`, `roles`, `policies`: References to associated groups, roles, and policies.
  - `organization`: Reference to the user's organization.
  - `attr`: Custom attributes for extensibility.

- **Example**:
```json
{
  "user": {
    "id": "6123456789abcdef01234567",
    "name": "John Doe",
    "givenName": "John",
    "familyName": "Doe",
    "email": "john.doe@example.com",
    "telephone": "+1234567890",
    "jobTitle": "Software Engineer",
    "username": "johndoe",
    "password": "hashedpassword123",
    "address": {
      "streetAddress": "123 Main St",
      "addressLocality": "Springfield",
      "addressRegion": "IL",
      "postalCode": "62701",
      "addressCountry": "US"
    },
    "contactPoint": {
      "telephone": "+1234567890",
      "contactType": "work",
      "email": "john.doe@example.com"
    },
    "groups": ["60d21b4667d0d8992e610c85"],
    "roles": ["5e57c5e6e919f7000f0e6d35"],
    "policies": ["5f5b2a3b6b7a41001e0e6d36"],
    "organization": "60e57c5e6e919f7000f0e6d37",
    "attr": {
      "customField1": "value1"
    }
  }
}
```

#### **2.2. Group**

A **Group** represents a collection of users or subgroups that share common roles or policies.

- **Properties**:
  - `id`: Unique identifier for the group.
  - `name`: Name of the group.
  - `description`: Description of the group's purpose.
  - `memberOf`: Reference to a parent group (if applicable).
  - `members`: List of members within the group (can be users or subgroups).
  - `roles`, `policies`: References to associated roles and policies.
  - `organization`: Reference to the organization that this group belongs to.

- **Example**:
```json
{
  "group": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Engineering Team",
    "description": "Group for all engineering team members",
    "memberOf": null,
    "members": [
      {
        "id": "6123456789abcdef01234567",
        "onModel": "User"
      }
    ],
    "roles": ["5e57c5e6e919f7000f0e6d35"],
    "policies": ["5f5b2a3b6b7a41001e0e6d36"],
    "organization": "60e57c5e6e919f7000f0e6d37"
  }
}
```

#### **2.3. Role**

A **Role** defines a set of permissions or access rights that can be assigned to users or groups.

- **Properties**:
  - `id`: Unique identifier for the role.
  - `name`: Name of the role.
  - `description`: Description of the role's purpose.
  - `inheritsFrom`: List of parent roles that this role inherits from.
  - `policies`: References to associated policies.
  - `organization`: Reference to the organization that this role belongs to.

- **Example**:
```json
{
  "role": {
    "id": "5e57c5e6e919f7000f0e6d35",
    "name": "Admin",
    "description": "Administrative role with full access",
    "inheritsFrom": [],
    "policies": ["5f5b2a3b6b7a41001e0e6d36"],
    "organization": "60e57c5e6e919f7000f0e6d37"
  }
}
```

#### **2.4. Resource**

A **Resource** represents any entity within the system that can be acted upon, such as a file, service, or database.

- **Properties**:
  - `id`: Unique identifier for the resource.
  - `typeName`: The type of the resource (format: `ServiceName::ResourceType::ResourceName`).
  - `name`: Name of the resource.
  - `ari`: Agsiri Resource Identifier (ARI) for the resource.
  - `description`: Description of the resource.
  - `sourceUrl`, `documentationUrl`: URLs related to the resource's origin and documentation.
  - `replacementStrategy`: Strategy for replacing the resource.
  - `tagging`: Tagging options for the resource.
  - `properties`, `required`, `primaryIdentifier`: Details about resource properties and identifiers.
  - `policies`: References to associated policies.
  - `auditInfo`: Audit information related to the resource's creation and updates.

- **Example**:
```json
{
  "resource": {
    "id": "5e67c7e4e419a12345678901",
    "typeName": "drs::dataroom:farm240",
    "name": "Data Room Farm 240",
    "ari": "ari:drs:us:12812121-1:dataroom:MyUniqueId",
    "description": "Data room for storing farm data",
    "sourceUrl": "https://example.com/resource",
    "documentationUrl": "https://example.com/resource/doc",
    "replacementStrategy": "create_then_delete",
    "tagging": {
      "taggable": true,
      "tagOnCreate": true,
      "tagUpdatable": true,
      "tagProperty": "/properties/Tags"
    },
    "properties": {
      "property1": "value1",
      "property2": "value2"
    },
    "required": ["property1"],
    "primaryIdentifier": ["id"],
    "policies": ["5f5b2a3b6b7a41001e0e6d36"],
    "auditInfo": {
      "createdBy": "admin",
      "createdAt": "2023-08-01T10:00:00Z"
    }
  }
}
```

#### **2.5. Organization**

An **Organization** represents an entity (such as a company or department) that encompasses users, groups, roles, and policies.

- **Properties**:
  - `name`: Name of the organization.
  - `url`, `logo`: URL to the organization's homepage and logo image.
  - `sameAs`: URL to a related entity (e.g., social media profile).
  - `description`: Brief description of the organization.
  - `taxID`, `telephone`: Tax identification number and primary contact number.
  - `location`: Physical location details.
  - `legalName`: Legal name of the organization.
  - `contactPoint`: Contact point information (e.g., Customer Support).
  - `policies`, `variables`: References to associated policies and variables.

- **Example**:
```json
{
  "organization": {
    "name": "Acme Corp",
    "url": "https://www.acme.com",
    "logo": "https://www.acme.com

/logo.png",
    "sameAs": "https://linkedin.com/company/acme",
    "description": "Leading provider of innovative products",
    "taxID": "123-45-6789",
    "telephone": "+19876543210",
    "location": {
      "streetAddress": "456 Elm St",
      "addressLocality": "Metropolis",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "legalName": "Acme Corporation",
    "contactPoint": {
      "telephone": "+19876543210",
      "contactType": "Customer Support",
      "email": "support@acme.com"
    },
    "policies": ["5f5b2a3b6b7a41001e0e6d36"],
    "variables": ["var1", "var2"]
  }
}
```

#### **2.6. Fact**

A **Fact** represents contextual information or data points that are generated during the lifecycle of an actor.

- **Properties**:
  - `id`: Unique identifier for the fact.
  - `type`: The type of fact (e.g., "access_granted", "login_attempt").
  - `actorId`: The ID of the actor associated with this fact.
  - `description`: Description of the fact.
  - `timestamp`: Time when the fact was generated.
  - `context`: Contextual details (e.g., user, environment).

- **Example**:
```json
{
  "fact": {
    "id": "60d21b4667d0d8992e610c85",
    "type": "access_granted",
    "actorId": "6123456789abcdef01234567",
    "description": "User granted access to resource",
    "timestamp": "2023-08-01T12:30:00Z",
    "context": {
      "user": {
        "id": "6123456789abcdef01234567",
        "role": "admin"
      },
      "environment": {
        "timestamp": "2023-08-01T12:30:00Z",
        "region": "us-east-1"
      }
    }
  }
}
```

#### **2.7. Blacklist**

A **Blacklist** represents entries that deny access or impose restrictions on an actor for specific reasons (e.g., policy violations).

- **Properties**:
  - `id`: Unique identifier for the blacklist entry.
  - `actorId`: The ID of the actor associated with this blacklist entry.
  - `reason`: Reason for blacklisting the actor.
  - `effectiveFrom`, `effectiveUntil`: Time period when the blacklist entry is active.
  - `context`: Contextual details (e.g., user, resource).

- **Example**:
```json
{
  "blacklist": {
    "id": "5e57c5e6e919f7000f0e6d35",
    "actorId": "6123456789abcdef01234567",
    "reason": "Suspicious activity detected",
    "effectiveFrom": "2023-08-01T00:00:00Z",
    "effectiveUntil": "2023-08-31T23:59:59Z",
    "context": {
      "user": {
        "id": "6123456789abcdef01234567",
        "role": "user"
      }
    }
  }
}
```

#### **2.8. Context**

**Context** provides additional metadata influencing actor interactions and behaviors. This includes information related to the user, resource, environment, intent, and more.

- **Properties**:
  - `user`: Details about the user in the context (e.g., ID, role).
  - `resource`: Details about the resource in the context (e.g., ARI, type).
  - `environment`: Details about the environment (e.g., timestamp, region).
  - `intent`: Information about the intended action or objective.
  - `interaction`: Details about the interaction that triggered an event.

- **Example**:
```json
{
  "context": {
    "user": {
      "id": "6123456789abcdef01234567",
      "role": "admin"
    },
    "resource": {
      "ari": "ari:drs:us:12812121-1:dataroom:MyUniqueId",
      "id": "5e67c7e4e419a12345678901",
      "type": "dataroom"
    },
    "environment": {
      "timestamp": "2023-08-01T12:30:00Z",
      "region": "us-east-1",
      "ip": "192.168.1.1",
      "os": "Linux"
    },
    "intent": {
      "objective": "Access resource",
      "action": "read"
    }
  }
}
```

### **3. Summary**

The Pola Actor Schema provides a robust framework for defining and managing actors, their relationships, and contexts within the Pola system. The schema is designed to be flexible and comprehensive, allowing for detailed representation of users, groups, roles, resources, organizations, facts, blacklists, and contexts, ensuring that all aspects of actor interactions are captured and effectively managed. By understanding these building blocks, developers and administrators can leverage the schema to build, manage, and enforce policies effectively within their systems.

Here are the updated curl commands using the plural form for each type in the endpoint:

### 1. **User**

```bash
curl -X POST http://localhost:4000/v1/users \
-H "Content-Type: application/json" \
-d '{
  "id": "6123456789abcdef01234567",
  "name": "Jane Smith",
  "givenName": "Jane",
  "familyName": "Smith",
  "email": "jane.smith@example.com",
  "telephone": "+1234567891",
  "username": "janesmith",
  "password": "hashedpassword321",
  "contactPoint": {
    "telephone": "+1234567891",
    "contactType": "work",
    "email": "jane.smith@example.com"
  }
}'
```

### 2. **Group**

```bash
curl -X POST http://localhost:4000/v1/groups \
-H "Content-Type: application/json" \
-d '{
  "id": "60d21b4667d0d8992e610c86",
  "name": "Analytics Team",
  "members": [
    {
      "id": "6123456789abcdef01234567",
      "onModel": "User"
    }
  ]
}'
```

### 3. **Role**

```bash
curl -X POST http://localhost:4000/v1/roles \
-H "Content-Type: application/json" \
-d '{
  "id": "5e57c5e6e919f7000f0e6d38",
  "name": "Data Analyst"
}'
```

To match the format, the corrected `typeName` could look like:

- **`ServiceName::ResourceType::ResourceName`**  
- Each part (ServiceName, ResourceType, ResourceName) must have between 2 and 64 characters.

### Corrected cURL Command:

Here's the updated `cURL` command:

```bash
curl -X POST http://localhost:4000/v1/resources \
-H "Content-Type: application/json" \
-d '{
  "id": "5e67c7e4e419a12345678901",
  "typeName": "drs::DataroomService::Farm240",
  "ari": "ari:drs:us:12812121-1:dataroom:MyUniqueId",
  "description": "Data room for storing farm data",
  "properties": {
    "property1": "value1"
  },
  "required": ["property1"],
  "primaryIdentifier": ["id"]
}'
```

### Explanation of the Corrected `typeName`:
- **`drs`**: Represents the service name.
- **`DataroomService`**: Represents the resource type (e.g., a service that handles data rooms).
- **`Farm240`**: Represents the specific resource name or identifier.

By following this corrected format, the `typeName` now adheres to the schema's constraints, with three segments separated by `::` and each segment meeting the length and character restrictions.

### 5. **Organization**

```bash
curl -X POST http://localhost:4000/v1/organizations \
-H "Content-Type: application/json" \
-d '{
  "name": "Acme Corp",
  "url": "https://www.acme.com",
  "description": "Leading provider of innovative products",
  "telephone": "+19876543210",
  "location": {
    "streetAddress": "456 Elm St",
    "addressLocality": "Metropolis",
    "addressRegion": "NY",
    "postalCode": "10001",
    "addressCountry": "US"
  },
  "contactPoint": {
    "telephone": "+19876543210",
    "contactType": "Customer Support",
    "email": "support@acme.com"
  }
}'
```

### 6. **Fact**

```bash
curl -X POST http://localhost:4000/v1/facts \
-H "Content-Type: application/json" \
-d '{
  "id": "60d21b4667d0d8992e610c85",
  "type": "access_granted",
  "actorId": "6123456789abcdef01234567",
  "description": "User granted access to resource",
  "timestamp": "2023-08-01T12:30:00Z"
}'
```

### 7. **Blacklist**

```bash
curl -X POST http://localhost:4000/v1/blacklists \
-H "Content-Type: application/json" \
-d '{
  "id": "5e57c5e6e919f7000f0e6d35",
  "actorId": "6123456789abcdef01234567",
  "reason": "Suspicious activity detected",
  "effectiveFrom": "2023-08-01T00:00:00Z",
  "effectiveUntil": "2023-08-31T23:59:59Z"
}'
```

