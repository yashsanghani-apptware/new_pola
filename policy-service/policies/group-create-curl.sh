curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "description": "GroupPolicy for QA team",
  "groupPolicy": {
    "group": "QA_Team",
    "version": "1.0",
    "rules": [
      {
        "resource": "arn:agsiri:resource:qa-environment",
        "actions": [
          {
            "action": "READ",
            "effect": "EFFECT_ALLOW",
            "condition": {
              "match": {
                "expr": "R.attr.qa == true"
              }
            }
          },
          {
            "action": "WRITE",
            "effect": "EFFECT_DENY",
            "condition": {
              "match": {
                "expr": "R.attr.qa == false"
              }
            }
          }
        ]
      }
    ],
    "variables": {
      "import": ["globalVar1", "globalVar2"],
      "local": {
        "localVar1": "localValue1"
      }
    }
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-22T13:00:00Z"
  }
}'

