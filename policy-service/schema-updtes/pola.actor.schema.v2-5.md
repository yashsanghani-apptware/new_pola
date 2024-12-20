# **Pola Actor Schema User Guide**

The **Pola Actor Schema** is designed to represent entities (users, groups, roles, and resources) in the Pola system, along with their contextual information. This schema is flexible and allows for rich descriptions of actors and their interactions within the system, enhancing security, access control, and auditing capabilities.

## **Overview of Pola Actor Schema**

The Pola Actor Schema defines four main actor types:

1. **User**: Represents an individual with specific attributes like name, email, roles, groups, and policies.
2. **Group**: Represents a collection of users or other groups that share common roles or policies.
3. **Role**: Represents a set of permissions or access rights that can be assigned to users or groups.
4. **Resource**: Represents an entity within the system, like a service or a data object, with specific properties, tags, and associated policies.

Additionally, the schema includes an optional **Context** to provide further details about the environment, policy, user, resource, intent, or interaction associated with the actor.

## **Schema Structure**

The schema is based on the JSON Schema standard and is structured using the `oneOf` construct to allow exactly one of the actor types (User, Group, Role, Resource) to be included, along with an optional `Context`.

## **Detailed Explanation of Schema Elements**

### 1. **User**
Represents an individual user with various attributes and identifiers.

**Attributes:**
- **id** (string): Unique identifier of the user.
- **name** (string): Full name of the user.
- **givenName** (string): Given (first) name of the user.
- **familyName** (string): Family (last) name of the user.
- **email** (string): Email address of the user.
- **telephone** (string): Primary contact number.
- **jobTitle** (string, optional): Job title of the user.
- **username** (string): Username for authentication.
- **password** (string): Hashed password for authentication.
- **address** (object): Address details including street address, city, state, postal code, and country.
- **contactPoint** (object): Contact details including telephone, contact type, and email.
- **groups** (array of strings): References to groups the user is a part of.
- **roles** (array of strings): References to roles assigned to the user.
- **policies** (array of strings): References to policies associated with the user.
- **organization** (string): Reference to the organization the user belongs to.
- **attr** (object): Custom attributes for extensibility.

### 2. **Group**
Represents a collection of users or other groups.

**Attributes:**
- **id** (string): Unique identifier of the group.
- **name** (string): Name of the group.
- **description** (string, optional): Description of the group's purpose.
- **memberOf** (string, nullable): Reference to the parent group.
- **members** (array of objects): Members of the group, which can be users or sub-groups.
- **roles** (array of strings): References to associated roles.
- **policies** (array of strings): References to associated policies.
- **organization** (string, nullable): Reference to the organization.

### 3. **Role**
Represents a set of permissions or access rights that can be assigned to users or groups.

**Attributes:**
- **id** (string): Unique identifier of the role.
- **name** (string): Name of the role.
- **description** (string, optional): Description of the role's purpose.
- **inheritsFrom** (array of strings): List of parent roles this role inherits from.
- **policies** (array of strings): References to associated policies.
- **organization** (string, nullable): Reference to the organization.

### 4. **Resource**
Represents an entity in the system with specific properties and associated policies.

**Attributes:**
- **id** (string): Unique identifier of the resource.
- **typeName** (string): The type of the resource (e.g., `drs::dataroom::exampleResource`).
- **name** (string, optional): Name of the resource.
- **ari** (string): Agsiri Resource Identifier (ARI) for the resource.
- **description** (string): Brief description of the resource.
- **sourceUrl** (string, optional): Source URL where the resource originated.
- **documentationUrl** (string, optional): URL pointing to the resource's documentation.
- **replacementStrategy** (string, optional): Strategy for resource replacement (`create_then_delete` or `delete_then_create`).
- **tagging** (object, optional): Options for tagging the resource.
- **properties** (object): Key-value pairs of resource properties.
- **required** (array of strings): List of required properties for the resource.
- **primaryIdentifier** (array of strings): Primary identifier property names.
- **policies** (array of strings): References to policies linked to the resource.
- **auditInfo** (object, optional): Audit information, including who created or updated the resource and when.

### 5. **Context** (Optional)
Provides additional contextual information relevant to the actor or event.

**Attributes:**
- **user** (object, optional): User-specific context, detailing user ID, name, role, group, and additional attributes.
- **resource** (object, optional): Resource-specific context, detailing resource ARI, ID, type, name, location, tags, and additional attributes.
- **environment** (object, optional): Environment-specific context, detailing timestamp, region, IP address, operating system, device, and additional attributes.
- **variables** (object, optional): Variables relevant to the context.
- **policy** (object, optional): Policy-specific context, detailing policy ID, name, version, and additional attributes.
- **intent** (object, optional): Intent context, specifying the objective and action related to the event.
- **interaction** (object, optional): Interaction context, providing details about the interaction, such as type, channel, and timestamp.

## **Schema Rules**

1. **One Actor Required**: The schema must contain exactly one actor type (User, Group, Role, or Resource).
2. **Optional Context**: The context is optional and can include any combination of the context types provided.

## **Example Scenarios**

### 1. **User Scenario with Context**

A scenario where a user (`Alice Johnson`) is interacting within a specific environment, with additional metadata provided through the context.

```json
{
  "user": {
    "id": "64e7dcb543b6a43e7d4f48a1",
    "name": "Alice Johnson",
    "givenName": "Alice",
    "familyName": "Johnson",
    "email": "alice.johnson@example.com",
    "telephone": "+1234567890",
    "jobTitle": "Software Engineer",
    "username": "alicej",
    "password": "hashedpassword",
    "address": {
      "streetAddress": "1234 Main St",
      "addressLocality": "Metropolis",
      "addressRegion": "CA",
      "postalCode": "90210",
      "addressCountry": "USA"
    },
    "contactPoint": {
      "telephone": "+1234567890",
      "contactType": "work",
      "email": "alice.johnson@example.com"
    },
    "groups": ["64e7dcb543b6a43e7d4f48a2"],
    "roles": ["64e7dcb543b6a43e7d4f48a3"],
    "policies": ["64e7dcb543b6a43e7d4f48a4"],
    "organization": "64e7dcb543b6a43e7d4f48a5",
    "attr": {
      "customAttribute1": "value1",
      "customAttribute2": "value2"
    }
  },
  "context": {
    "user": {
      "id": "64e7dcb543b6a43e7d4f48a1",
      "role": "admin"
    },
    "environment": {
      "timestamp": "2024-08-28T12:34:56Z",
      "region": "us-east-1"
    }
  }
}
```

### 2. **Group Scenario without Context**

A scenario where a group (`Engineering Team`) is defined with its members and associated roles.

```json
{
  "group": {
    "id": "64e7dcb543b6a43e7d4f48a2",
    "name": "Engineering Team",
    "description": "Group for all engineering team members",
    "memberOf": null,
    "members": [
      {
        "id": "64e7dcb543b6a43e7d4f48a1",
        "onModel": "User"
      },
      {
        "id": "64e7dcb543b6a43e7d4f48b6",
        "onModel": "Group"
      }
    ],
    "roles": ["64e7dcb543b6a43e7d4f48a3"],
    "policies": ["64e7dcb543b6a43e7d4f48a4"],
    "organization": "64e7dcb543b6a43e7d4f48a5"
  }
}
```

### 3. **Role Scenario with Context

**

A scenario where a role (`Administrator`) is defined along with context about a policy and interaction details.

```json
{
  "role": {
    "id": "64e7dcb543b6a43e7d4f48a3",
    "name": "Administrator",
    "description": "Full access role for administrators",
    "inheritsFrom": ["64e7dcb543b6a43e7d4f48c1"],
    "policies": ["64e7dcb543b6a43e7d4f48a4"],
    "organization": "64e7dcb543b6a43e7d4f48a5"
  },
  "context": {
    "policy": {
      "id": "64e7dcb543b6a43e7d4f48a4",
      "name": "AdminPolicy",
      "version": "v1.0"
    },
    "interaction": {
      "id": "interaction-12345",
      "type": "api-call",
      "channel": "web",
      "timestamp": "2024-08-28T12:34:56Z"
    }
  }
}
```

### 4. **Resource Scenario with Context**

A scenario where a resource (`Example Resource`) is defined, including context about the intent and interaction.

```json
{
  "resource": {
    "id": "64e7dcb543b6a43e7d4f48a6",
    "typeName": "drs::dataroom::exampleResource",
    "name": "Example Resource",
    "ari": "ari:drs:us-east-1:12812121-1:dataroom:exampleResource",
    "description": "A data room for secure storage.",
    "sourceUrl": "https://example.com/resource",
    "documentationUrl": "https://example.com/docs/resource",
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
    "policies": ["64e7dcb543b6a43e7d4f48a4"],
    "auditInfo": {
      "createdBy": "admin_user",
      "createdAt": "2024-08-28T12:00:00Z"
    }
  },
  "context": {
    "resource": {
      "ari": "ari:drs:us-east-1:12812121-1:dataroom:exampleResource",
      "id": "64e7dcb543b6a43e7d4f48a6",
      "type": "dataroom"
    },
    "intent": {
      "objective": "data storage",
      "action": "create"
    }
  }
}
```

## *Pola Actor JSON Schema**

```json
{
  "$id": "https://api.pola.dev/v2.5.3.2/agsiri/actor/v2.5/actor.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "pola.actor.v2.5.Address": {
      "type": "object",
      "properties": {
        "streetAddress": { "type": "string" },
        "addressLocality": { "type": "string" },
        "addressRegion": { "type": "string" },
        "postalCode": { "type": "string" },
        "addressCountry": { "type": "string" }
      },
      "required": ["streetAddress", "addressLocality", "addressRegion", "postalCode", "addressCountry"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.ContactPoint": {
      "type": "object",
      "properties": {
        "telephone": { "type": "string" },
        "contactType": { "type": "string" },
        "email": { 
          "type": "string", 
          "format": "email" 
        }
      },
      "required": ["telephone", "contactType", "email"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.User": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
        "name": { "type": "string" },
        "givenName": { "type": "string" },
        "familyName": { "type": "string" },
        "email": { 
          "type": "string", 
          "format": "email" 
        },
        "telephone": { "type": "string" },
        "jobTitle": { "type": "string" },
        "username": { "type": "string" },
        "password": { "type": "string" },
        "address": { 
          "$ref": "#/definitions/pola.actor.v2.5.Address" 
        },
        "contactPoint": { 
          "$ref": "#/definitions/pola.actor.v2.5.ContactPoint" 
        },
        "groups": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "roles": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "policies": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "organization": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["id", "name", "givenName", "familyName", "email", "telephone", "username", "password", "contactPoint"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Group": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
        "name": { "type": "string" },
        "description": { "type": "string" },
        "memberOf": { "type": ["string", "null"], "pattern": "^[a-f\\d]{24}$" },
        "members": {
          "type": "array",
          "items": { 
            "type": "object",
            "properties": {
              "id": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
              "onModel": { 
                "type": "string", 
                "enum": ["User", "Group"] 
              }
            },
            "required": ["id", "onModel"],
            "additionalProperties": false
          }
        },
        "roles": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "policies": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "organization": { "type": ["string", "null"], "pattern": "^[a-f\\d]{24}$" }
      },
      "required": ["id", "name", "members"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Role": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
        "name": { "type": "string" },
        "description": { "type": "string" },
        "inheritsFrom": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "policies": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "organization": { "type": ["string", "null"], "pattern": "^[a-f\\d]{24}$" }
      },
      "required": ["id", "name"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Resource": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
        "typeName": { 
          "type": "string", 
          "pattern": "^[a-zA-Z0-9_-]{2,64}::[a-zA-Z0-9_-]{2,64}::[a-zA-Z0-9_-]{2,64}$" 
        },
        "name": { "type": "string" },
        "ari": { "type": "string" },
        "description": { "type": "string" },
        "sourceUrl": { "type": "string", "format": "uri" },
        "documentationUrl": { "type": "string", "format": "uri" },
        "replacementStrategy": { 
          "type": "string", 
          "enum": ["create_then_delete", "delete_then_create"] 
        },
        "tagging": {
          "type": "object",
          "properties": {
            "taggable": { "type": "boolean" },
            "tagOnCreate": { "type": "boolean" },
            "tagUpdatable": { "type": "boolean" },
            "tagProperty": { "type": "string" }
          },
          "additionalProperties": false
        },
        "properties": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        },
        "required": { 
          "type": "array", 
          "items": { "type": "string" }
        },
        "primaryIdentifier": { 
          "type": "array", 
          "items": { "type": "string" }
        },
        "policies": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "auditInfo": {
          "type": "object",
          "properties": {
            "createdBy": { "type": "string" },
            "createdAt": { "type": "string", "format": "date-time" },
            "updatedBy": { "type": "string" },
            "updatedAt": { "type": "string", "format": "date-time" }
          },
          "additionalProperties": false
        }
      },
      "required": ["id", "typeName", "ari", "description", "properties", "required", "primaryIdentifier"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Context": {
      "type": "object",
      "properties": {
        "user": { "$ref": "#/definitions/pola.actor.v2.5.UserContext" },
        "resource": { "$ref": "#/definitions/pola.actor.v2.5.ResourceContext" },
        "environment": { "$ref": "#/definitions/pola.actor.v2.5.EnvironmentContext" },
        "variables": { "$ref": "#/definitions/pola.policy.v2.5.Variables" },
        "policy": { "$ref": "#/definitions/pola.actor.v2

.5.PolicyContext" },
        "intent": { "$ref": "#/definitions/pola.actor.v2.5.IntentContext" },
        "interaction": { "$ref": "#/definitions/pola.actor.v2.5.InteractionContext" }
      },
      "additionalProperties": false
    },
    "pola.actor.v2.5.UserContext": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "role": { "type": "string" },
        "group": { "type": "string" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["id", "role"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.ResourceContext": {
      "type": "object",
      "properties": {
        "ari": { "type": "string" },
        "id": { "type": "string" },
        "type": { "type": "string" },
        "name": { "type": "string" },
        "location": { "type": "string" },
        "tags": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["ari", "id", "type"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.EnvironmentContext": {
      "type": "object",
      "properties": {
        "timestamp": { "type": "string", "format": "date-time" },
        "region": { "type": "string" },
        "ip": { "type": "string" },
        "os": { "type": "string" },
        "device": { "type": "string" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["timestamp"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.IntentContext": {
      "type": "object",
      "properties": {
        "objective": { "type": "string" },
        "action": { "type": "string" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["objective", "action"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.InteractionContext": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "type": { "type": "string" },
        "channel": { "type": "string" },
        "timestamp": { "type": "string", "format": "date-time" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["id", "type", "timestamp"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.PolicyContext": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "version": { "type": "string" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["id"],
      "additionalProperties": false
    }
  },
  "type": "object",
  "properties": {
    "user": { "$ref": "#/definitions/pola.actor.v2.5.User" },
    "group": { "$ref": "#/definitions/pola.actor.v2.5.Group" },
    "role": { "$ref": "#/definitions/pola.actor.v2.5.Role" },
    "resource": { "$ref": "#/definitions/pola.actor.v2.5.Resource" },
    "context": { "$ref": "#/definitions/pola.actor.v2.5.Context" }
  },
  "oneOf": [
    { "required": ["user"] },
    { "required": ["group"] },
    { "required": ["role"] },
    { "required": ["resource"] }
  ],
  "additionalProperties": false
}
```

## **Conclusion**

The **Pola Actor Schema** is a flexible and comprehensive framework for defining actors (users, groups, roles, resources) and their contexts within the Pola system. It enables clear representation and management of entities and their interactions, supporting robust access control, security policies, and auditing.

By leveraging this schema, organizations can define, manage, and audit their users, roles, resources, and groups effectively, ensuring that the right entities have the appropriate access and capabilities within the system.
