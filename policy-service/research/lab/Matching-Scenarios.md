
# Matching Scenarios - Tutorials

## Scenario 1: Investor Access to Specific Data Room Files

**Resource Policy 1: Access to Financial Files in Data Room**

This policy allows `read` access to financial files within a specific cabinet in the data room, but only to users with the `investor` role.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet123/financials/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read"],
        "effect": "EFFECT_ALLOW",
        "roles": ["investor"]
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

**Principal Policy 1: Investor Role Policy**

This principal policy grants the `investor` role the ability to `read` files within the specified financial cabinet.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "investor",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet123/financials/*",
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

**RequestParams for Scenario 1:**

```typescript
const requestParams1: RequestParams = {
  principalId: 'investor',
  resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/cabinet123/financials/file001',
  actions: ['read']
};
```

## Scenario 2: Administrator Full Access to Data Room

**Resource Policy 2: Full Access to Data Room for Administrators**

This policy allows all actions (`*`) on all resources within a data room for users with the `administrator` role.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["*"],
        "effect": "EFFECT_ALLOW",
        "roles": ["administrator"]
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

**Principal Policy 2: Administrator Role Policy**

This principal policy grants the `administrator` role full access to all resources within the data room.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "administrator",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/*",
        "actions": [
          {
            "action": "*",
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

**RequestParams for Scenario 2:**

```typescript
const requestParams2: RequestParams = {
  principalId: 'administrator',
  resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/cabinet456/files/file002',
  actions: ['edit', 'delete']
};
```

## Scenario 3: Compliance Officer Restricted Access

**Resource Policy 3: Read-Only Access for Compliance Officers**

This policy allows `read` access to compliance-related files in a specific cabinet within the data room for users with the `compliance officer` role, but explicitly denies `edit` and `delete` actions.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet789/compliance/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read"],
        "effect": "EFFECT_ALLOW",
        "roles": ["compliance officer"]
      },
      {
        "actions": ["edit", "delete"],
        "effect": "EFFECT_DENY",
        "roles": ["compliance officer"]
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

**Principal Policy 3: Compliance Officer Role Policy**

This principal policy grants the `compliance officer` role `read` access but denies `edit` and `delete` actions on compliance-related files.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "compliance officer",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet789/compliance/*",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "edit",
            "effect": "EFFECT_DENY"
          },
          {
            "action": "delete",
            "effect": "EFFECT_DENY"
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

**RequestParams for Scenario 3:**

```typescript
const requestParams3: RequestParams = {
  principalId: 'compliance officer',
  resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/cabinet789/compliance/file003',
  actions: ['read', 'edit']
};
```

## Scenario 4: Accountant Access to Financial Reports

**Resource Policy 4: Access to Financial Reports**

This policy allows `read`, `download`, and `edit` access to financial reports in a specific cabinet for the `accountant` role.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet001/financial_reports/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read", "download", "edit"],
        "effect": "EFFECT_ALLOW",
        "roles": ["accountant"]
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

**Principal Policy 4: Accountant Role Policy**

This principal policy grants the `accountant` role permissions to `read`, `download`, and `edit` financial reports.

```bash


curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "accountant",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet001/financial_reports/*",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "download",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "edit",
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

**RequestParams for Scenario 4:**

```typescript
const requestParams4: RequestParams = {
  principalId: 'accountant',
  resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/cabinet001/financial_reports/report001',
  actions: ['read', 'edit']
};
```

## Scenario 5: Analyst View-Only Access to Reports

**Resource Policy 5: View-Only Access for Analysts**

This policy allows `view` access to reports within a data room for the `analyst` role but denies `edit` access.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/reports/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view"],
        "effect": "EFFECT_ALLOW",
        "roles": ["analyst"]
      },
      {
        "actions": ["edit"],
        "effect": "EFFECT_DENY",
        "roles": ["analyst"]
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

**Principal Policy 5: Analyst Role Policy**

This principal policy grants the `analyst` role `view` access to reports while denying `edit` access.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "analyst",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/reports/*",
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
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**RequestParams for Scenario 5:**

```typescript
const requestParams5: RequestParams = {
  principalId: 'analyst',
  resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/reports/report002',
  actions: ['view', 'edit']
};
```

## Testing the Scenarios

With these scenarios in place, the matching algorithm should be able to process the `RequestParams` against the defined policies to determine whether the requested actions are allowed or denied based on the resource and principal policies. 

These scenarios cover a range of access control situations, ensuring that the system can handle exact matches, wildcards, role-based access, and combinations of allow/deny policies effectively.
