
# Variables and Export Variable Tutorial

## Example 1: Resource Policy with Local Variables

**Policy Description:** This resource policy defines local variables to check if a resource is flagged and assigns labels and teams specific to the policy. The policy ensures that a user can view or edit the document only if the resource is not flagged and the user belongs to one of the specified teams.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "ari:resource:example:document/123456",
    "variables": {
      "local": {
        "flagged_resource": "request.resource.attr.flagged",
        "label": "\"latest\"",
        "teams": "[\"red\", \"blue\"]"
      }
    },
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "V.flagged_resource == false" },
                { "expr": "P.attr.department in V.teams" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @variables.1.json
```

## Example 2: Exported Variables for Reuse

**Policy Description:** This example defines exported variables that can be reused across multiple policies. These variables include a check for flagged resources and assign common labels and teams for consistency across policies.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "exportVariables": {
    "name": "apatr_common_variables",
    "definitions": {
      "flagged_resource": "request.resource.attr.flagged",
      "label": "\"latest\"",
      "teams": "[\"red\", \"blue\"]"
    }
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @variables.2.json
```

## Example 3: Importing Exported Variables in a Resource Policy

**Policy Description:** This resource policy imports variables defined in `apatr_common_variables` and uses them to enforce access control. The policy ensures that only users whose department matches one of the defined teams and where the resource is not flagged can view or edit the document.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "ari:resource:example:document/123456",
    "variables": {
      "import": ["apatr_common_variables"]
    },
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "V.flagged_resource == false" },
                { "expr": "P.attr.department in V.teams" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @variables.3.json
```

## Example 4: Conflict Resolution Between Local and Exported Variables

**Policy Description:** This policy imports `apatr_common_variables` but also defines a local variable `flagged_resource`, which overrides the imported one. The policy ensures that a user can view or edit the document only if the local `flagged_resource` condition (set to `false`) is met and the user belongs to one of the specified teams.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "ari:resource:example:document/123456",
    "variables": {
      "import": ["apatr_common_variables"],
      "local": {
        "flagged_resource": "false"
      }
    },
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "V.flagged_resource == false" },
                { "expr": "P.attr.department in V.teams" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @variables.4.json
```

**Explanation:**

- **flagged_resource**: The local variable `flagged_resource` set to `false` takes precedence over the imported one.
- **teams**: The imported array of team names, `"red"` and `"blue"`, is used for department checks.

These examples now conform to the JSON Schema provided earlier, with the `auditInfo` field correctly included in each policy.
