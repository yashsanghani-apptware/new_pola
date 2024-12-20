# Pola Policy Creation Examples

## Principal Policy 

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "version": "1.0",
  "principalPolicy": {
    "principal": "user123",
    "version": "1.0",
    "scope": "example-scope",
    "variables": {
      "import": ["var1", "var2"],
      "local": {
        "customVar1": "value1",
        "customVar2": "value2"
      }
    },
    "rules": [
      {
        "resource": "resource123",
        "actions": [
          {
            "action": "view",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "edit",
            "effect": "EFFECT_DENY"
          }
        ]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "purpose": "Example policy for user123"
    },
    "hash": "abc123"
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-18T12:34:56Z"
  }
}'
```

### Explanation of the `curl` Command

- **URL**: `http://localhost:4000/api/policies` — The endpoint for creating a new policy.
- **Header**: `-H "Content-Type: application/json"` — Specifies that the data being sent is in JSON format.
- **Data**: `-d '{ ... }'` — The JSON payload defining the `PrincipalPolicy` to be created.

### Payload Details

- **apiVersion**: Specifies the version of the API.
- **version**: The version of the policy itself.
- **principalPolicy**: Contains the details of the `PrincipalPolicy`, including:
  - `principal`: The identifier for the user or entity the policy applies to.
  - `version`: The version of the `PrincipalPolicy`.
  - `scope`: The scope within which the policy is applicable.
  - `variables`: Includes both imported and local variables.
  - `rules`: Defines the rules that specify what actions are allowed or denied on the resource.
- **metadata**: Additional metadata related to the policy.
- **auditInfo**: Tracks who created the policy and when.

You can modify the data fields as needed to match your specific use case.

## 2. Resource Policy

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "version": "1.0",
  "resourcePolicy": {
    "resource": "resource456",
    "version": "1.0",
    "scope": "example-scope",
    "importDerivedRoles": ["adminRole", "userRole"],
    "variables": {
      "import": ["envVars"],
      "local": {
        "resourceVar1": "value1"
      }
    },
    "schemas": {
      "principalSchema": {
        "ref": "principalSchemaRef"
      },
      "resourceSchema": {
        "ref": "resourceSchemaRef"
      }
    },
    "rules": [
      {
        "actions": ["read", "write"],
        "effect": "EFFECT_ALLOW",
        "roles": ["editor"],
        "condition": {
          "match": {
            "expr": "R.attr.confidential != true"
          }
        }
      }
    ]
  },
  "metadata": {
    "annotations": {
      "description": "Example ResourcePolicy for resource456"
    },
    "hash": "xyz789"
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-18T12:34:56Z"
  }
}'
```

## 3. DerivedRole

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "version": "1.0",
  "derivedRoles": {
    "name": "confidentialViewer",
    "definitions": [
      {
        "name": "confidential",
        "parentRoles": ["viewer"],
        "condition": {
          "match": {
            "expr": "R.attr.confidential == true"
          }
        }
      }
    ],
    "variables": {
      "local": {
        "viewerVar": "viewerValue"
      }
    }
  },
  "metadata": {
    "annotations": {
      "description": "DerivedRole for viewing confidential resources"
    },
    "hash": "def456"
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-18T12:34:56Z"
  }
}'
```

## 4. Export Variable

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "version": "1.0",
  "exportVariables": {
    "name": "globalVars",
    "definitions": {
      "globalVar1": "globalValue1",
      "globalVar2": "globalValue2"
    }
  },
  "metadata": {
    "annotations": {
      "description": "Global export variables"
    },
    "hash": "ghi123"
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-18T12:34:56Z"
  }
}'
```

### Explanation of Each `curl` Command

- **URL**: `http://localhost:4000/api/policies` — The endpoint for creating a new policy.
- **Header**: `-H "Content-Type: application/json"` — Specifies that the data being sent is in JSON format.
- **Data**: `-d '{ ... }'` — The JSON payload defining the specific policy type (`ResourcePolicy`, `DerivedRole`, or `ExportVariable`).

### Payload Details

1. **`ResourcePolicy`**:
   - `resource`: The resource identifier the policy applies to.
   - `importDerivedRoles`: A list of roles that are imported.
   - `variables`: Includes imported and local variables.
   - `schemas`: Defines principal and resource schemas.
   - `rules`: A set of rules defining actions, effects, roles, and conditions.

2. **`DerivedRole`**:
   - `name`: The name of the derived role.
   - `definitions`: The role definitions, which may include conditions.
   - `variables`: Any local variables specific to the derived role.

3. **`ExportVariable`**:
   - `name`: The name of the export variable.
   - `definitions`: The key-value pairs defining the export variables.

All these `curl` commands are tailored to create policies for different aspects of the Agsiri policy model, allowing for fine-grained control over resources, roles, and variables within your application.
