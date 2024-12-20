
# User Guide: Writing Policy Documents with the Agsiri Schema

This guide will help you understand how to create policy documents using the Agsiri schema. The schema supports four types of policies: Principal Policies, Resource Policies, Derived Roles, and Export Variables. This guide will describe each attribute, indicating whether it is required or optional, and provide `curl` commands to verify the policies.

## Table of Contents

1. [Principal Policy](#principal-policy)
2. [Resource Policy](#resource-policy)
3. [Derived Roles](#derived-roles)
4. [Export Variables](#export-variables)

---

## 1. Principal Policy

**Purpose:**  
Defines actions that a specific principal (e.g., a user, role, or group) is allowed or denied to perform on a resource.

**Attributes:**

- **`principal` (required):**  
  The entity (user, role, group, etc.) to which the policy applies. Example: `"user:12345"`.

- **`version` (required):**  
  The version of the policy. Must follow the pattern `"^[0-9]+(\\.[0-9]+)*$"`. Example: `"1.0"`.

- **`rules` (optional):**  
  An array of rules defining actions the principal can perform on specific resources. Each rule has the following attributes:
  - **`resource` (required):** The resource ARI (Agsiri Resource Identifier) to which the rule applies.
  - **`actions` (required):** An array of actions (e.g., "read", "write"). Each action has:
    - **`action` (required):** The action name.
    - **`effect` (required):** The effect of the action, either `"EFFECT_ALLOW"` or `"EFFECT_DENY"`.
    - **`condition` (optional):** A condition that must be met for the action to be applied.

- **`metadata` (optional):**  
  Additional metadata for the policy, such as annotations and source attributes.

- **`auditInfo` (optional):**  
  Information about who created or updated the policy and when.

**Example: Principal Policy**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "user:12345",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:service:region:account-id:resource-id",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**`curl` Command:**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "user:12345",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:service:region:account-id:resource-id",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

---

## 2. Resource Policy

**Purpose:**  
Defines actions that can be performed on a resource, regardless of the principal.

**Attributes:**

- **`resource` (required):**  
  The resource ARI to which the policy applies. Example: `"ari:service:region:account-id:resource-id"`.

- **`version` (required):**  
  The version of the policy. Must follow the pattern `"^[0-9]+(\\.[0-9]+)*$"`. Example: `"1.0"`.

- **`rules` (optional):**  
  An array of rules defining allowed or denied actions on the resource. Each rule has:
  - **`actions` (required):** An array of actions (e.g., "read", "write").
  - **`effect` (required):** The effect of the action, either `"EFFECT_ALLOW"` or `"EFFECT_DENY"`.
  - **`condition` (optional):** A condition that must be met for the action to be applied.

- **`metadata` (optional):**  
  Additional metadata for the policy.

- **`auditInfo` (optional):**  
  Information about who created or updated the policy and when.

**Example: Resource Policy**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:service:region:account-id:resource-id",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read", "write"],
        "effect": "EFFECT_ALLOW"
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**`curl` Command:**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:service:region:account-id:resource-id",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read", "write"],
        "effect": "EFFECT_ALLOW"
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

---

## 3. Derived Roles

**Purpose:**  
Defines custom roles based on conditions and parent roles, allowing for dynamic role assignment.

**Attributes:**

- **`name` (required):**  
  The name of the derived role. Must follow the pattern `"^[\\-\\.0-9A-Z_a-z]+$"`. Example: `"customDerivedRole"`.

- **`definitions` (required):**  
  An array of role definitions. Each definition includes:
  - **`name` (required):** The name of the derived role. Example: `"derivedRole1"`.
  - **`parentRoles` (required):** An array of parent roles. Example: `["role1", "role2"]`.
  - **`condition` (optional):** A condition that must be met for the role to be applied.

- **`variables` (optional):**  
  Variables that may be used within the conditions.

**Example: Derived Roles**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "customDerivedRole",
    "definitions": [
      {
        "name": "derivedRole1",
        "parentRoles": ["role1", "role2"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.role === 'admin'" },
                { "expr": "R.status === 'active'" }
              ]
            }
          }
        }
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**`curl` Command:**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "customDerivedRole",
    "definitions": [
      {
        "name": "derivedRole1",
        "parentRoles": ["role1", "role2"],
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "P.role === \"admin\"" },
                { "expr": "R.status === \"active\"" }
              ]
            }
          }
        }
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```



---

## 4. Export Variables

**Purpose:**  
Defines variables that can be shared and reused across different policies, maintaining consistency and reducing redundancy.

**Attributes:**

- **`name` (required):**  
  The name of the export variable. Must follow the pattern `"^[\\-\\.0-9A-Z_a-z]+$"`. Example: `"globalVariables"`.

- **`definitions` (required):**  
  A set of key-value pairs defining the variables. Example: `{"env": "staging", "maxRetries": "5"}`.

**Example: Export Variables**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "exportVariables": {
    "name": "globalVariables",
    "definitions": {
      "env": "staging",
      "maxRetries": "5"
    }
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

**`curl` Command:**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "exportVariables": {
    "name": "globalVariables",
    "definitions": {
      "env": "staging",
      "maxRetries": "5"
    }
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

---

## Conclusion

This guide has explained how to define Principal Policies, Resource Policies, Derived Roles, and Export Variables using the Agsiri schema. Each policy type has been detailed with attribute descriptions, examples, and `curl` commands to help you create and verify these policies within your system.
