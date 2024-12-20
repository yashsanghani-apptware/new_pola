curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "RolePolicy for Admin role",
  "rolePolicy": {
    "role": "Admin",
    "version": "1.0",
    "rules": [
      {
        "resource": "arn:agsiri:resource:admin-dashboard",
        "actions": [
          {
            "action": "READ",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "R.attr.admin == true"
              }
            }
          },
          {
            "action": "DELETE",
            "effect": "EFFECT_DENY",
            "condition": {
              "match": {
                "expr": "R.attr.admin == false"
              }
            }
          }
        ]
      }
    ],
    "variables": {
      "import": ["roleVar1", "roleVar2"],
      "local": {
        "localVar2": "localRoleValue"
      }
    }
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-22T14:00:00Z"
  }
}'

