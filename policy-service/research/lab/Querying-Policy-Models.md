# Concept Note: Accessing Principal and Resource Policies, Export Variables, and Derived Roles from the Policy Model Collection in MongoDB

## Overview

In the context of the Agsiri Policy Service, policies that govern access control are stored in MongoDB as documents within a `Policy` collection. Each policy document may contain various subcomponents such as `ResourcePolicy`, `PrincipalPolicy`, `ExportVariables`, and `DerivedRoles`. These subcomponents define the permissions, conditions, and variables that apply to different principals (e.g., users, groups, roles) and resources (e.g., files, data rooms, services).

This concept note explains how to query MongoDB to access and manipulate the different parts of the policy model: `PrincipalPolicy`, `ResourcePolicy`, `ExportVariables`, and `DerivedRoles`. It outlines how these policies are structured within a single collection and provides guidelines for extracting and working with each subcomponent.

## Policy Structure in MongoDB

In MongoDB, the `Policy` collection holds documents that can include fields for:
- **PrincipalPolicy**: Defines permissions for principals (users, groups, or roles) concerning various resources.
- **ResourcePolicy**: Specifies actions that can be performed on resources and the conditions under which they are allowed or denied.
- **ExportVariables**: A set of variables that can be used in conditions or shared across multiple policies.
- **DerivedRoles**: Roles that inherit permissions based on conditions or the context of a request.

Each document in the `Policy` collection may contain one or more of these fields, but not every document will necessarily include all of them.

Example Document Structure in the `Policy` Collection:
```json
{
  "_id": "uniquePolicyId",
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/farm*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read", "edit"],
        "effect": "EFFECT_ALLOW"
      }
    ]
  },
  "principalPolicy": {
    "principal": "admin",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/farm001",
        "actions": [
          {
            "action": "delete",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "exportVariables": {
    "name": "businessHours",
    "definitions": {
      "open": "09:00",
      "close": "17:00"
    }
  },
  "derivedRoles": {
    "name": "SeniorManager",
    "definitions": [
      {
        "name": "Manager",
        "parentRoles": ["Admin"],
        "condition": {
          "match": {
            "expr": "context.experience > 10"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}
```

## Accessing Policies from MongoDB

To access the various subcomponents of the `Policy` collection in MongoDB, you will need to perform targeted queries on the collection. Since `PrincipalPolicy`, `ResourcePolicy`, `ExportVariables`, and `DerivedRoles` are stored within the same document but under different fields, it is important to construct queries that can isolate and extract the required data.

### 1. Accessing **Resource Policies**

`ResourcePolicy` defines the permissions that apply to resources such as files, cabinets, and data rooms. Each resource policy contains rules specifying actions (e.g., `read`, `edit`, `delete`) and their corresponding effects (`EFFECT_ALLOW`, `EFFECT_DENY`).

To fetch all resource policies:
```typescript
const resourcePolicies = await PolicyModel.find({ 'resourcePolicy': { $exists: true } }, 'resourcePolicy').lean();
console.log('Resource Policies:', JSON.stringify(resourcePolicies, null, 2));
```

In this query:
- We are searching for documents in the `Policy` collection where the `resourcePolicy` field exists.
- The projection (`'resourcePolicy'`) ensures that only the `resourcePolicy` field is returned.

### 2. Accessing **Principal Policies**

`PrincipalPolicy` defines the actions that principals (users, groups, roles) can perform on resources. These policies are associated with specific principals and may include conditions and rules for specific actions.

To fetch all principal policies:
```typescript
const principalPolicies = await PolicyModel.find({ 'principalPolicy': { $exists: true } }, 'principalPolicy').lean();
console.log('Principal Policies:', JSON.stringify(principalPolicies, null, 2));
```

Here:
- The query filters for documents that contain the `principalPolicy` field and returns only that field.

### 3. Accessing **Export Variables**

`ExportVariables` are key-value pairs that can be shared across multiple policies. They are useful for defining global constraints such as business hours, file size limits, or other context-sensitive values.

To fetch all export variables:
```typescript
const exportVariables = await PolicyModel.find({ 'exportVariables': { $exists: true } }, 'exportVariables').lean();
console.log('Export Variables:', JSON.stringify(exportVariables, null, 2));
```

This query returns documents containing the `exportVariables` field, which holds definitions that can be referenced in other policies.

### 4. Accessing **Derived Roles**

`DerivedRoles` are roles that are dynamically assigned based on specific conditions, such as a user's seniority or experience level. These roles inherit permissions from parent roles but are applied conditionally.

To fetch all derived roles:
```typescript
const derivedRoles = await PolicyModel.find({ 'derivedRoles': { $exists: true } }, 'derivedRoles').lean();
console.log('Derived Roles:', JSON.stringify(derivedRoles, null, 2));
```

The query above isolates the `derivedRoles` field, which contains role definitions and conditions for role inheritance.

## Handling Complex Queries

In some cases, you may want to fetch policies that include multiple subcomponents, such as documents that contain both `ResourcePolicy` and `PrincipalPolicy`. Here’s how you can perform such a query:

```typescript
const policies = await PolicyModel.find({
  $or: [
    { 'resourcePolicy': { $exists: true } },
    { 'principalPolicy': { $exists: true } }
  ]
}).lean();

console.log('Policies:', JSON.stringify(policies, null, 2));
```

This query returns any documents that contain either `resourcePolicy` or `principalPolicy`.

## Policy Matching and Evaluation

Once you have fetched the relevant policies, the next step is to evaluate whether a specific action is allowed or denied based on the context of the request (e.g., principal, resource, conditions, variables).

For example:
- **Resource Policy Evaluation**: Determine if a resource policy allows or denies a specific action for a given resource.
- **Principal Policy Evaluation**: Check if a principal has the necessary permissions to perform the requested action on a resource.

This process involves evaluating conditions, applying derived roles, and resolving conflicts between policies.

## Conclusion

The `Policy` collection in MongoDB serves as a central repository for managing access control in the Agsiri Policy Service. By accessing subcomponents like `ResourcePolicy`, `PrincipalPolicy`, `ExportVariables`, and `DerivedRoles`, you can build a flexible and scalable access control system. Properly structured queries ensure that you can retrieve and evaluate the correct policies for any given request, helping to enforce the organization's access control rules dynamically and efficiently.
