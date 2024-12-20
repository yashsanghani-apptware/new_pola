### 1. **Resource Policy**

**Description:**
A Resource Policy defines the actions that are allowed or denied on a specific resource or set of resources. It controls what operations can be performed on the resource based on conditions and roles.

**Mandatory Attributes:**
- `resource`: The ARI of the resource(s) the policy applies to.
- `version`: The version of the policy.
- `rules`: A list of rules defining actions, effects, conditions, and optional roles.

**Optional Attributes:**
- `importDerivedRoles`: A list of derived roles to be imported and used in this policy.
- `scope`: A string to define the scope of the policy.
- `variables`: Variables that can be used within the policy to simplify complex conditions.
- `schemas`: Specifies custom schemas for validation.

**Example: Granting full access to all cabinets within a specific data room to Admins**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Admins have full access to all cabinets in Data Room 123.",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:cabinet/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["*"],
        "effect": "EFFECT_ALLOW",
        "roles": ["admin"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T11:00:00Z"
  }
}'
```

### 2. **Principal Policy**

**Description:**
A Principal Policy defines what actions a principal (e.g., a user or role) is allowed or denied on specific resources. It is often used to enforce access control based on the principal's attributes or roles.

**Mandatory Attributes:**
- `principal`: The identifier of the principal (user or role).
- `version`: The version of the policy.
- `rules`: A list of rules defining resources, actions, and conditions.

**Optional Attributes:**
- `scope`: Defines the scope of the policy, limiting its application.
- `variables`: Variables to be used within the policy for dynamic conditions.

**Example: Allowing project managers to edit only active files in their department's cabinets**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Project Managers can edit active files in their department's cabinets.",
  "principalPolicy": {
    "principal": "project_manager",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:cabinet/department-*",
        "actions": [
          {
            "action": "edit",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "all": {
                  "of": [
                    {"expr": "P.attr.role == 'project_manager'"},
                    {"expr": "request.resource.attr.status == 'active'"}
                  ]
                }
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T11:10:00Z"
  }
}'
```

### 3. **Derived Roles**

**Description:**
Derived Roles are dynamically assigned based on conditions defined in the policy. They are typically used to grant roles based on certain attributes or conditions evaluated at runtime.

**Mandatory Attributes:**
- `name`: The name of the derived role.
- `definitions`: A list of role definitions, each including a name, parent roles, and conditions.

**Optional Attributes:**
- `variables`: Variables to be used within the policy for dynamic role assignment.

**Example: Defining a Derived Role for Senior Engineers to access sensitive files only if they are flagged as secure**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Senior Engineers can access sensitive files only if they are flagged as secure.",
  "derivedRoles": {
    "name": "SeniorEngineer",
    "definitions": [
      {
        "name": "SecureFileAccess",
        "parentRoles": ["engineer"],
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.experience_level == 'senior'"},
                {"expr": "request.resource.attr.type == 'secure'"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T11:20:00Z"
  }
}'
```

### 4. **Export Variables**

**Description:**
Export Variables define reusable variables that can be imported and used across multiple policies, simplifying policy management and ensuring consistency.

**Mandatory Attributes:**
- `name`: The name of the export variable set.
- `definitions`: The actual variables and their definitions.

**Example: Exporting variables for project membership and admin role across multiple policies**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "Exported variables for project alpha membership and admin role.",
  "exportVariables": {
    "name": "project_alpha_variables",
    "definitions": {
      "is_project_member": "P.attr.project_id == '\''alpha'\''",
      "is_admin": "P.attr.role == '\''admin'\''"
    }
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T11:30:00Z"
  }
}'
```

These curl commands provide examples of how to create each type of policy. Users can modify these examples to suit their specific requirements, ensuring compliance with the provided JSON schema.
