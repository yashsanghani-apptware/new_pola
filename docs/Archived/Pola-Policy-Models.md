# Pola Policy Models

## 1. **User (Principal) Policy Example**

This policy defines what actions a specific user (principal) is allowed to perform on a resource.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "principalPolicy": {
    "principal": "user123",  // Mandatory: Defines the principal (user)
    "version": "1.0",        // Mandatory: Policy version
    "rules": [               // Mandatory: List of rules
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",  // Mandatory: Resource ARI
        "actions": [          // Mandatory: Actions the principal can perform
          {
            "action": "access",  // Mandatory: Action type
            "effect": "EFFECT_ALLOW",  // Mandatory: Allow or Deny
            "condition": {       // Optional: Condition under which the action is allowed
              "match": {
                "expr": "'agsirian' in request.auxData.jwt.aud && request.auxData.jwt.iss == 'agsiri'"
              }
            }
          }
        ]
      }
    ],
    "scope": "global",       // Optional: Defines the scope of the policy
    "variables": {           // Optional: Defines variables
      "import": ["env_var1"],
      "local": {
        "local_var1": "value1"
      }
    }
  },
  "description": "User-specific policy to check JWT claims.",  // Optional: Description of the policy
  "auditInfo": {            // Optional: Audit information
    "createdBy": "admin",
    "createdAt": "2024-08-19T13:40:00Z"
  }
}
```

## 2. **Group Policy Example**

This policy applies to a group of users, defining what actions they can perform on specific resources.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "groupPolicy": {
    "group": "engineering_team",  // Mandatory: Group identifier
    "version": "1.0",             // Mandatory: Policy version
    "rules": [                    // Mandatory: List of rules
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",  // Mandatory: Resource ARI
        "actions": [               // Mandatory: Actions allowed for the group
          {
            "action": "edit",      // Mandatory: Action type
            "effect": "EFFECT_ALLOW",  // Mandatory: Allow or Deny
            "condition": {          // Optional: Condition for the action
              "match": {
                "expr": "P.attr.department == 'engineering'"
              }
            }
          }
        ]
      }
    ],
    "scope": "organization",       // Optional: Defines the scope
    "variables": {                 // Optional: Defines variables
      "import": ["group_var"],
      "local": {
        "team_var": "eng_value"
      }
    }
  },
  "description": "Policy for the engineering team to edit resources.",  // Optional: Description
  "auditInfo": {                    // Optional: Audit information
    "createdBy": "admin",
    "createdAt": "2024-08-19T13:50:00Z"
  }
}
```

## 3. **Role Policy Example**

This policy defines what actions are allowed or denied based on the user's role.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "rolePolicy": {
    "role": "editor",  // Mandatory: Role identifier
    "version": "1.0",  // Mandatory: Policy version
    "rules": [         // Mandatory: List of rules
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",  // Mandatory: Resource ARI
        "actions": [       // Mandatory: Actions allowed for the role
          {
            "action": "edit",      // Mandatory: Action type
            "effect": "EFFECT_ALLOW",  // Mandatory: Allow or Deny
            "condition": {          // Optional: Condition for the action
              "match": {
                "all": {
                  "of": [
                    {"expr": "R.attr.status == 'ACTIVE'"},
                    {"expr": "P.attr.jobTitle == 'Editor'"}
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    "scope": "project",            // Optional: Defines the scope
    "variables": {                 // Optional: Defines variables
      "import": ["role_var"],
      "local": {
        "project_var": "project_value"
      }
    }
  },
  "description": "Role-based policy for editors to edit resources.",  // Optional: Description
  "auditInfo": {                    // Optional: Audit information
    "createdBy": "admin",
    "createdAt": "2024-08-19T14:00:00Z"
  }
}
```

## 4. **Derived Role Policy Example**

This policy defines derived roles based on specific conditions.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "derivedRoles": {
    "name": "LocationBasedRoles",  // Mandatory: Name of the derived role set
    "definitions": [               // Mandatory: Role definitions
      {
        "name": "GB_Editor",       // Mandatory: Derived role name
        "parentRoles": ["editor"],  // Mandatory: Parent roles
        "condition": {             // Optional: Condition for applying the derived role
          "match": {
            "all": {
              "of": [
                {"expr": "R.attr.geographies.contains('GB')"},
                {"expr": "P.attr.geography == 'GB'"}
              ]
            }
          }
        }
      }
    ],
    "variables": {                 // Optional: Variables for derived roles
      "import": ["derived_var"],
      "local": {
        "derived_local_var": "derived_value"
      }
    }
  },
  "description": "Assign derived role based on resource location.",  // Optional: Description
  "auditInfo": {                    // Optional: Audit information
    "createdBy": "system",
    "createdAt": "2024-08-19T12:20:00Z"
  }
}
```

## 5. **Export Variables Example**

This defines variables that can be exported and used in different parts of the policy.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "exportVariables": {
    "name": "ExportedVars",  // Mandatory: Name of the exported variables set
    "definitions": {         // Optional: Variable definitions
      "export_var1": "value1",
      "export_var2": "value2"
    }
  },
  "description": "Set of variables to be exported.",  // Optional: Description
  "auditInfo": {                                      // Optional: Audit information
    "createdBy": "admin",
    "createdAt": "2024-08-19T14:10:00Z"
  }
}
```

## 6. **Resource Policy Example**

This policy defines the actions allowed or denied on specific resources.

```json
{
  "apiVersion": "api.pola.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:resource/*",  // Mandatory: Resource ARI
    "version": "1.0",           // Mandatory: Policy version
    "rules": [                  // Mandatory: List of rules
      {
        "actions": ["view", "edit"],  // Mandatory: Actions on the resource
        "effect": "EFFECT_ALLOW",     // Mandatory: Allow or Deny
        "condition": {                // Optional: Condition for the action
          "match": {
            "all": {
              "of": [
                {"expr": "R.attr.status == 'PENDING_APPROVAL'"},
                {"expr": "'GB' in R.attr.geographies"}
              ]
            }
          }
        }
      }
    ],
    "variables": {                 // Optional: Variables for resource policies
      "import": ["resource_var"],
      "local": {
        "resource_local_var": "resource_value"
      }
    }
  },
  "description": "Allow actions if the resource is pending approval and located in GB.",  // Optional: Description
  "auditInfo": {                                      // Optional: Audit information
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

## Summary

Each of the examples above is structured according to the Pola JSON Schema, incorporating both mandatory and optional attributes. The examples include policies for individual users (principals), groups, roles, derived roles, export variables, and resources. These examples can be adapted and extended based on specific requirements and use cases.
