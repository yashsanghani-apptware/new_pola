# Pola Policy Specification Developer Guide (v2.3)

## Introduction

Pola Policy Specification v2.3 introduces a powerful and flexible framework for defining and managing various types of policies that govern access control, event handling, and role-based permissions within your applications. This version includes seven policy types: `PrincipalPolicy`, `ResourcePolicy`, `RolePolicy`, `GroupPolicy`, `DerivedRoles`, `ExportVariables`, and the newly introduced `EventPolicy`.

This guide provides a comprehensive overview of the Pola Policy Specification, detailed examples of each policy type, and step-by-step instructions on creating, managing, and deploying these policies using the Pola API. It also demonstrates how these policies can be interconnected to create robust and dynamic policy-driven systems.

### API Endpoint

All curl commands in this guide assume the following API endpoint:

```
http://polahub.com:4000/v1
```

### General Notes

- **API Version**: Each policy must include `"apiVersion": "api.pola.dev/v2.3"`.
- **AuditInfo**: All policies require audit information, including who created the policy and when.
- **Patterns and Compliance**: Ensure that all string values, especially those for names, roles, and resource identifiers, follow the required patterns and formats.

---

## 1. Principal Policy

### Overview

A `PrincipalPolicy` defines access rules for specific principals (e.g., users, groups, or roles). This policy type is used to specify what actions a principal can perform on a particular resource.

### Example Scenario

**Scenario**: John Doe is a project manager who should have read access to all project documents but should be denied access to delete any documents.

### Policy Definition

```json
{
  "apiVersion": "api.pola.dev/v2.3",
  "principalPolicy": {
    "principal": "user:john.doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "resource:project-documents",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

### Create Policy (curl Command)

```bash
curl -X POST http://polahub.com:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.3",
  "principalPolicy": {
    "principal": "user:john.doe",
    "version": "1.0",
    "rules": [
      {
        "resource": "resource:project-documents",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}'
```

---

## 2. Resource Policy

### Overview

A `ResourcePolicy` defines rules for specific resources. This policy type is used to manage who can interact with a particular resource and under what conditions.

### Example Scenario

**Scenario**: The project documents resource should be protected to ensure that only certain actions are permitted, like allowing updates but denying the creation of new documents by anyone.

### Policy Definition

```json
{
  "apiVersion": "api.pola.dev/v2.3",
  "resourcePolicy": {
    "resource": "resource:project-documents",
    "version": "1.1",
    "rules": [
      {
        "actions": ["update"],
        "effect": "EFFECT_ALLOW"
      },
      {
        "actions": ["create"],
        "effect": "EFFECT_DENY"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

### Create Policy (curl Command)

```bash
curl -X POST http://polahub.com:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.3",
  "resourcePolicy": {
    "resource": "resource:project-documents",
    "version": "1.1",
    "rules": [
      {
        "actions": ["update"],
        "effect": "EFFECT_ALLOW"
      },
      {
        "actions": ["create"],
        "effect": "EFFECT_DENY"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}'
```

---

## 3. Role Policy

### Overview

A `RolePolicy` defines rules for specific roles within the organization. Roles aggregate permissions, and this policy type is used to specify what actions roles are allowed to perform on resources.

### Example Scenario

**Scenario**: Developers should be allowed to update project documents but should not be allowed to delete them.

### Policy Definition

```json
{
  "apiVersion": "api.pola.dev/v2.3",
  "rolePolicy": {
    "role": "role:developer",
    "version": "2.0",
    "rules": [
      {
        "resource": "resource:project-documents",
        "actions": ["update"],
        "effect": "EFFECT_ALLOW"
      },
      {
        "resource": "resource:project-documents",
        "actions": ["delete"],
        "effect": "EFFECT_DENY"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

### Create Policy (curl Command)

```bash
curl -X POST http://polahub.com:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.3",
  "rolePolicy": {
    "role": "role:developer",
    "version": "2.0",
    "rules": [
      {
        "resource": "resource:project-documents",
        "actions": ["update"],
        "effect": "EFFECT_ALLOW"
      },
      {
        "resource": "resource:project-documents",
        "actions": ["delete"],
        "effect": "EFFECT_DENY"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}'
```

---

## 4. Group Policy

### Overview

A `GroupPolicy` defines access control rules at the group level. This policy type allows you to manage permissions for entire groups of users.

### Example Scenario

**Scenario**: The development team should have read access to all project documents but should be restricted from updating or deleting them.

### Policy Definition

```json
{
  "apiVersion": "api.pola.dev/v2.3",
  "groupPolicy": {
    "group": "group:dev-team",
    "version": "1.2",
    "rules": [
      {
        "resource": "resource:project-documents",
        "actions": ["read"],
        "effect": "EFFECT_ALLOW"
      },
      {
        "resource": "resource:project-documents",
        "actions": ["update", "delete"],
        "effect": "EFFECT_DENY"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

### Create Policy (curl Command)

```bash
curl -X POST http://polahub.com:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.3",
  "groupPolicy": {
    "group": "group:dev-team",
    "version": "1.2",
    "rules": [
      {
        "resource": "resource:project-documents",
        "actions": ["read"],
        "effect": "EFFECT_ALLOW"
      },
      {
        "resource": "resource:project-documents",
        "actions": ["update", "delete"],
        "effect": "EFFECT_DENY"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}'
```

---

## 5. Derived Roles

### Overview

`DerivedRoles` allow you to define roles based on conditions or combinations of other roles. This is particularly useful for implementing complex role hierarchies and conditions.

### Example Scenario

**Scenario**: Define a `senior_developer` role that inherits permissions from the `developer` role, but only under specific conditions.

### Policy Definition

```json
{
  "apiVersion": "api.pola.dev/v2.3",
  "derivedRoles": {
    "name": "senior_developer",
    "definitions

": [
      {
        "name": "developer",
        "parentRoles": ["role:developer"],
        "condition": {
          "match": {
            "expr": "P.yearsOfExperience >= 5"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

### Create Derived Role (curl Command)

```bash
curl -X POST http://polahub.com:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.3",
  "derivedRoles": {
    "name": "senior_developer",
    "definitions": [
      {
        "name": "developer",
        "parentRoles": ["role:developer"],
        "condition": {
          "match": {
            "expr": "P.yearsOfExperience >= 5"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}'
```

---

## 6. Export Variables

### Overview

`ExportVariables` allow you to define variables that can be used across multiple policies. These variables can be shared and reused, making your policies more modular and easier to manage.

### Example Scenario

**Scenario**: Define a variable `min_security_level` that is required for certain actions across different policies.

### Policy Definition

```json
{
  "apiVersion": "api.pola.dev/v2.3",
  "exportVariables": {
    "name": "min_security_level",
    "definitions": {
      "min_security_level": "3"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}
```

### Create Export Variable (curl Command)

```bash
curl -X POST http://polahub.com:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.3",
  "exportVariables": {
    "name": "min_security_level",
    "definitions": {
      "min_security_level": "3"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}'
```

---

## 7. Event Policy

### Overview

`EventPolicy` allows you to define actions triggered by specific events, integrating event-driven architecture into your access control and security framework.

### Example Scenario

**Scenario**: When a file is uploaded to a secure directory, notify the admin team and log the event.

### Policy Definition

```json
{
  "apiVersion": "api.pola.dev/v2.3",
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

### Create Event Policy (curl Command)

```bash
curl -X POST http://polahub.com:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v2.3",
  "eventPolicy": {
    "event": "file:uploaded",
    "version": "1.2",
    "actions": ["notify_admin"],
    "conditions": {
      "match": {
        "expr": "R.directory == \"/secure/uploads\""
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
      "expr": "log(\"File uploaded to secure directory\")"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2023-08-23T12:00:00Z"
  }
}'
```

---

## Conclusion

The Pola Policy Specification v2.3 provides a robust and flexible framework for defining and managing security policies across various dimensions of your applications. By using the seven policy types—`PrincipalPolicy`, `ResourcePolicy`, `RolePolicy`, `GroupPolicy`, `DerivedRoles`, `ExportVariables`, and `EventPolicy`—you can create a comprehensive security architecture that adapts to the needs of your organization.

The provided examples and curl commands should help you get started with creating and managing these policies. The interconnected nature of these policies allows for powerful and dynamic security configurations that can respond to events, manage complex role hierarchies, and enforce strict access controls across your application ecosystem.
