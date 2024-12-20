### Pola Service Developer Guide

This guide provides comprehensive instructions on how to interact with the Pola Service, a powerful tool for creating, managing, and evaluating policies within the Agsiri ecosystem. The guide covers the CRUD operations for different policy types, as well as specific operations such as validation, simulation, and evaluation of policies.

### Table of Contents

1. [Introduction](#introduction)
2. [Policy Types Overview](#policy-types-overview)
3. [CRUD Operations](#crud-operations)
   - [Create Policy](#create-policy)
   - [Retrieve Policy](#retrieve-policy)
   - [Update Policy](#update-policy)
   - [Delete Policy](#delete-policy)
   - [List Policies](#list-policies)
4. [Search Policies](#search-policies)
5. [Simulate Policy](#simulate-policy)
6. [Evaluate Policy](#evaluate-policy)
7. [Validate Policy](#validate-policy)
8. [Conclusion](#conclusion)

---

### Introduction

Pola Service is designed to manage various types of policies, such as PrincipalPolicy, ResourcePolicy, DerivedRoles, and ExportVariables, within the Agsiri ecosystem. Each policy is encapsulated within a unified Policy model, which also includes metadata, versioning, and auditing information. This guide will walk you through the available operations and how to use them effectively.

### Policy Types Overview

Pola supports several types of policies:

- **PrincipalPolicy**: Defines the actions a specific user or group of users (identified as a principal) can perform on a resource.
- **ResourcePolicy**: Manages the actions that can be performed on specific resources.
- **DerivedRoles**: Dynamic roles that are computed based on conditions or context, allowing for more granular access control.
- **ExportVariables**: Defines variables that can be shared across different policies and imported into other policies as needed.

### CRUD Operations

#### Create Policy

Use the following `curl` command to create a new policy. Ensure that you include the required fields such as `version` and `auditInfo.createdBy`.

**Create PrincipalPolicy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "version": "1.0",
  "auditInfo": {
    "createdBy": "system_admin"
  },
  "principalPolicy": {
    "principal": "user123",
    "version": "1.0",
    "rules": [
      {
        "resource": "resource456",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  }
}'
```

**Create ResourcePolicy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "version": "1.0",
  "auditInfo": {
    "createdBy": "system_admin"
  },
  "resourcePolicy": {
    "resource": "resource789",
    "version": "1.0",
    "rules": [
      {
        "actions": ["delete"],
        "effect": "EFFECT_DENY"
      }
    ]
  }
}'
```

**Create DerivedRoles**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "version": "1.0",
  "auditInfo": {
    "createdBy": "system_admin"
  },
  "derivedRoles": {
    "name": "senior_manager",
    "definitions": [
      {
        "name": "senior_manager",
        "parentRoles": ["manager"]
      }
    ]
  }
}'
```

**Create ExportVariables**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "version": "1.0",
  "auditInfo": {
    "createdBy": "system_admin"
  },
  "exportVariables": {
    "name": "globalSettings",
    "definitions": {
      "timezone": "UTC",
      "currency": "USD"
    }
  }
}'
```

#### Retrieve Policy

To retrieve a specific policy, use the following `curl` command:

```bash
curl -X GET http://localhost:4000/api/policies/{policyId}
```

Replace `{policyId}` with the actual ID of the policy you want to retrieve.

#### Update Policy

To update an existing policy, use the following command. Ensure you include the `version` and `auditInfo.updatedBy` fields:

```bash
curl -X PUT http://localhost:4000/api/policies/{policyId} \
-H "Content-Type: application/json" \
-d '{
  "version": "1.1",
  "auditInfo": {
    "updatedBy": "admin_user"
  },
  "principalPolicy": {
    "principal": "user123",
    "version": "1.1",
    "rules": [
      {
        "resource": "resource456",
        "actions": [
          {
            "action": "write",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  }
}'
```

#### Delete Policy

To delete a specific policy, use the following command:

```bash
curl -X DELETE http://localhost:4000/api/policies/{policyId}
```

Replace `{policyId}` with the actual ID of the policy you want to delete.

#### List Policies

To list all policies, use the following `curl` command:

```bash
curl -X GET http://localhost:4000/api/policies
```

### Search Policies

To search for policies based on specific criteria, use the following command:

```bash
curl -X POST http://localhost:4000/api/policies/search \
-H "Content-Type: application/json" \
-d '{
  "principalPolicy.principal": "user123"
}'
```

This will return all policies where the principal is `user123`.

### Simulate Policy

To simulate the outcome of a policy, use the following command:

```bash
curl -X POST http://localhost:4000/api/policies/simulate \
-H "Content-Type: application/json" \
-d '{
  "principal": {
    "id": "user123",
    "attributes": {
      "role": "editor",
      "department": "finance"
    }
  },
  "resource": {
    "id": "resource456",
    "attributes": {
      "confidential": true,
      "status": "active"
    }
  },
  "action": "read"
}'
```

### Evaluate Policy

To evaluate a policy against a given set of inputs, use the following `curl` command:

```bash
curl -X POST http://localhost:4000/api/policies/evaluate \
-H "Content-Type: application/json" \
-d '{
  "principal": {
    "id": "user123",
    "attributes": {
      "role": "editor",
      "department": "finance"
    }
  },
  "resource": {
    "id": "resource456",
    "attributes": {
      "confidential": true,
      "status": "active"
    }
  },
  "action": "read"
}'
```

### Validate Policy

To validate the structure and integrity of a policy, use the following command:

```bash
curl -X POST http://localhost:4000/api/policies/validate \
-H "Content-Type: application/json" \
-d '{
  "version": "1.0",
  "auditInfo": {
    "createdBy": "system_admin"
  },
  "principalPolicy": {
    "principal": "user123",
    "version": "1.0",
    "rules": [
      {
        "resource": "resource456",
        "actions": [
          {
            "action": "read",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  }
}'
```

### Conclusion

This developer guide provides the necessary `curl` commands and explanations for interacting with the Pola Service. It covers the creation, retrieval, updating, and deletion of policies, as well as operations like validation, simulation, and evaluation. By following this guide, developers can effectively manage policies within the Agsiri ecosystem, ensuring robust and dynamic access control.
