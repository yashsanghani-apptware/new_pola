
### **cURL Command 1: Required Fields Only**

```bash
curl -X POST http://localhost:4000/v1/resources \
-H "Content-Type: application/json" \
-d '{
  "typeName": "drs::dataroom:farm240",
  "name": "SampleResource",
  "ari": "ari:drs:us:12812121-1:dataroom:MyUniqueId",
  "description": "This is a description of the resource",
  "properties": {
    "key1": "value1",
    "key2": "value2"
  },
  "required": ["key1", "key2"],
  "primaryIdentifier": ["resourceId"],
  "handlers": {
    "create": {
      "permissions": ["create:resource"],
      "timeoutInMinutes": 120
    },
    "read": {
      "permissions": ["read:resource"],
      "timeoutInMinutes": 120
    },
    "update": {
      "permissions": ["update:resource"],
      "timeoutInMinutes": 120
    },
    "delete": {
      "permissions": ["delete:resource"],
      "timeoutInMinutes": 120
    },
    "search": {
      "permissions": ["search:resource"],
      "timeoutInMinutes": 120
    },
    "query": {
      "permissions": ["query:resource"],
      "timeoutInMinutes": 120
    },
    "list": {
      "permissions": ["list:resource"],
      "timeoutInMinutes": 120
    },
    "publish": {
      "permissions": ["publish:resource"],
      "timeoutInMinutes": 120
    },
    "subscribe": {
      "permissions": ["subscribe:resource"],
      "timeoutInMinutes": 120
    },
    "notify": {
      "permissions": ["notify:resource"],
      "timeoutInMinutes": 120
    },
    "receive": {
      "permissions": ["receive:resource"],
      "timeoutInMinutes": 120
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-30T00:28:02.819Z"
  }
}'
```

### **cURL Command 2: Complete Set of Fields**

```bash
curl -X POST http://localhost:4000/v1/resources \
-H "Content-Type: application/json" \
-d '{
  "typeName": "drs::dataroom:farm240",
  "name": "CompleteResource",
  "ari": "ari:drs:us:12812121-1:dataroom:MyUniqueId",
  "description": "Comprehensive description of the resource",
  "sourceUrl": "https://example.com/resource-source",
  "documentationUrl": "https://example.com/resource-docs",
  "replacementStrategy": "create_then_delete",
  "tagging": {
    "taggable": true,
    "tagOnCreate": true,
    "tagUpdatable": true,
    "tagProperty": "/properties/Tags"
  },
  "properties": {
    "key1": "value1",
    "key2": "value2"
  },
  "required": ["key1", "key2"],
  "primaryIdentifier": ["resourceId"],
  "additionalIdentifiers": ["additionalId1"],
  "rules": [
    {
      "actions": ["read", "write"],
      "effect": "EFFECT_ALLOW",
      "condition": {
        "match": {
          "all": {
            "of": [
              { "expr": "user.role == 'Admin'" }
            ]
          }
        }
      }
    }
  ],
  "variables": {
    "local": { "var1": "value1", "var2": "value2" },
    "import": ["globalVar1", "globalVar2"]
  },
  "handlers": {
    "create": {
      "permissions": ["create:resource"],
      "timeoutInMinutes": 120
    },
    "read": {
      "permissions": ["read:resource"],
      "timeoutInMinutes": 120
    },
    "update": {
      "permissions": ["update:resource"],
      "timeoutInMinutes": 120
    },
    "delete": {
      "permissions": ["delete:resource"],
      "timeoutInMinutes": 120
    },
    "search": {
      "permissions": ["search:resource"],
      "timeoutInMinutes": 120
    },
    "query": {
      "permissions": ["query:resource"],
      "timeoutInMinutes": 120
    },
    "list": {
      "permissions": ["list:resource"],
      "timeoutInMinutes": 120
    },
    "publish": {
      "permissions": ["publish:resource"],
      "timeoutInMinutes": 120
    },
    "subscribe": {
      "permissions": ["subscribe:resource"],
      "timeoutInMinutes": 120
    },
    "notify": {
      "permissions": ["notify:resource"],
      "timeoutInMinutes": 120
    },
    "receive": {
      "permissions": ["receive:resource"],
      "timeoutInMinutes": 120
    }
  },
  "readOnlyProperties": ["readOnlyProperty1"],
  "writeOnlyProperties": ["writeOnlyProperty1"],
  "createOnlyProperties": ["createOnlyProperty1"],
  "deprecatedProperties": ["deprecatedProperty1"],
  "conditionalCreateOnlyProperties": ["conditionalProperty1"],
  "privateProperties": ["privateProperty1"],
  "privateDefinitions": ["privateDefinition1"],
  "events": [
    {
      "eventType": "ALERT",
      "eventName": "UnauthorizedAccess",
      "description": "Triggered when unauthorized access is attempted."
    }
  ],
  "configuration": {
    "setting1": "value1",
    "setting2": "value2"
  },
  "resourceLink": {
    "templateUri": "https://example.com/template",
    "mappings": "https://example.com/mappings"
  },
  "attr": {
    "customAttr1": "customValue1"
  },
  "policies": [],
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-30T00:28:02.819Z"
  },
  "version": "1.0"
}'
```

These `cURL` commands will create a resource with either the required fields or the complete set of fields in your schema, ensuring compliance with your defined schema structure.
