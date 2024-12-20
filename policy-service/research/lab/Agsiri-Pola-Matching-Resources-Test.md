# Detailed Test Documentation: Policy-Based Access Control System

## Overview

This test aims to validate the functionality of a policy-based access control system built on Agsiri Resource Identifiers (ARIs). The system is designed to manage and enforce permissions on various resources within the Agsiri platform. The test will focus on verifying the correct matching of resources and actions against predefined policies, accounting for exact matches, wildcard patterns, and role-based access controls.

## Test Objectives

1. **Policy Creation:** 
   - Create three resource policies that define access control rules for specific resources and roles.
   - These policies will specify the allowed actions on resources and the roles or users to whom these actions are granted.

2. **Policy Matching and Evaluation:**
   - Assess the system’s ability to correctly match incoming requests to appropriate resource policies based on the resource identifier (ARI) and the requested actions.
   - Verify that the system correctly handles exact ARI matches, wildcard matches, and role-based access controls.

## Policy Definitions and Attributes

Before delving into the test scenarios, it’s crucial to understand the structure of the policy definitions and the attributes used within them. Below is a detailed explanation of each attribute in the policy definitions:

- **apiVersion (string):** 
  - Specifies the version of the API that the policy conforms to. This ensures compatibility between the policy and the API.
  - Example: `"apiVersion": "api.agsiri.dev/v1"`

- **resourcePolicy (object):**
  - Defines the resource and the rules that apply to that resource.
  - **resource (string):** 
    - The ARI of the resource to which this policy applies. It can be an exact resource identifier or include wildcards for broader matching.
    - Example: `"resource": "ari:agsiri:dataroom:us:123456789012:dataroom/farm240"`
  - **version (string):** 
    - The version of the policy. This allows for versioning of policies, making it easier to manage changes over time.
    - Example: `"version": "1.0"`
  - **rules (array):** 
    - An array of rules that define which actions are allowed or denied on the specified resource.
    - **actions (array of strings):** 
      - Specifies the actions (e.g., `read`, `write`, `view`, `share`) that are either allowed or denied by this rule.
      - Example: `"actions": ["read", "write"]`
    - **effect (string):** 
      - Defines whether the actions specified are allowed or denied. The possible values are `"EFFECT_ALLOW"` and `"EFFECT_DENY"`.
      - Example: `"effect": "EFFECT_ALLOW"`
    - **roles (array of strings):**
      - Specifies the roles (e.g., `Admin`, `Investor`, `Farm SME`) that are authorized to perform the specified actions on the resource.
      - Example: `"roles": ["Admin"]`
    - **condition (optional, object):**
      - Specifies any conditions that must be met for the rule to apply. This can include logical expressions or scripts.
      - Example: `"condition": { "match": { "all": { "expr": "user.age > 18" } } }`

- **metadata (object, optional):**
  - Provides additional information about the policy, such as annotations and identifiers.
  - **annotations (object, optional):**
    - Key-value pairs used to add metadata to the policy, such as the author or purpose.
    - Example: `"annotations": { "author": "admin@example.com" }`

- **auditInfo (object):**
  - Tracks the creation and modification of the policy for auditing purposes.
  - **createdBy (string):** 
    - The identifier of the user or system that created the policy.
    - Example: `"createdBy": "admin"`
  - **createdAt (date):** 
    - The timestamp when the policy was created.
    - Example: `"createdAt": "2024-08-19T12:00:00Z"`
  - **updatedBy (string, optional):** 
    - The identifier of the user or system that last updated the policy.
    - Example: `"updatedBy": "admin"`
  - **updatedAt (date, optional):** 
    - The timestamp when the policy was last updated.
    - Example: `"updatedAt": "2024-08-19T13:00:00Z"`

## Policy Creation: `curl` Commands

Below are the `curl` commands to create three resource policies that specify the access control rules for various resources and roles:

### 1. Policy for `ari:agsiri:dataroom:us:123456789012:dataroom/farm240`

This policy allows `read`, `write`, `view`, and `share` actions on the resource `ari:agsiri:dataroom:us:123456789012:dataroom/farm240` for the role `investor`.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/farm240",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read", "write", "view", "share"],
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

### 2. Policy for `ari:agsiri:dataroom:us:123456789012:dataroom/farm240/*`

This policy allows all actions (`*`) on any resource under the path `ari:agsiri:dataroom:us:123456789012:dataroom/farm240/*` for the role `Admin`.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/farm240/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["*"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Admin"]
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

### 3. Policy for `ari:agsiri:dataroom:us:123456789012:dataroom/farm*`

This policy allows `read`, `view`, and `edit` actions on any resource that matches the pattern `ari:agsiri:dataroom:us:123456789012:dataroom/farm*` for the role `Farm SME`.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/farm*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read", "view", "edit"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Farm SME"]
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

## Test Scenarios

To evaluate the effectiveness of the policy matching system, the following test scenario will be simulated:

### Request Parameters

A test request will be constructed using the following parameters:

```typescript
const requestParams: RequestParams = {
  principalId: 'role:Farm SME',  // This could be a role, user, or group ID
  resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/farm240',
  actions: ['read', 'view'] // Actions to be evaluated
};
```

### Expected Matching Results

1. **Exact Match (Policy 1):**
   - **Expectation:** The system should identify that `Policy 1` grants `read` and `view` permissions to the `investor` role on the specific resource `ari:agsiri:dataroom:us:123456789012:dataroom/farm240`.
   - **Result:** Since the request is for the `Farm SME` role, `Policy 1` will not apply.

2. **Wildcard Match (Policy 2):**
   - **Expectation:** `Policy 2` is expected to match any resource under the `farm240` path, granting all actions to the `Admin` role.
   - **Result:** Since the request is for the `Farm SME` role, this policy will not be triggered unless the request

 is from the `Admin` role.

3. **Pattern Match (Policy 3):**
   - **Expectation:** The system should correctly identify that `Policy 3` allows the `Farm SME` role to perform `read` and `view` actions on any resource matching the pattern `ari:agsiri:dataroom:us:123456789012:dataroom/farm*`.
   - **Result:** The resource in the request (`ari:agsiri:dataroom:us:123456789012:dataroom/farm240`) matches this pattern, and since the `Farm SME` role is included in the policy, this policy should grant the requested actions.

## Conclusion

This test is expected to demonstrate that the policy matching system can accurately determine the applicable policies for a given request based on ARIs, actions, and roles. The three policies cover a range of scenarios, including exact matches, wildcard matches, and pattern-based matches, ensuring the system's flexibility and robustness in handling various access control scenarios.
