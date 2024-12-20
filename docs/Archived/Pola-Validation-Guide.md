# Pola Agent Validation Guide

## Table of Contents

1. **Introduction**
   - Overview of the Validation Process
   - Objectives of Validation

2. **Validation Environment Setup**
   - Prerequisites
   - Setting Up the Pola Agent Environment
   - Authentication Setup

3. **Validation Scenarios**
   - Scenario 1: User Management Validation
   - Scenario 2: Group Management Validation
   - Scenario 3: Role Management Validation
   - Scenario 4: Resource Management Validation
   - Scenario 5: Policy Management Validation
   - Scenario 6: Blacklist and Fact Management Validation
   - Scenario 7: Policy Evaluation and Conflict Resolution

4. **Validation Commands and Steps**
   - Detailed Steps for Each Scenario
   - Example curl Commands
   - Expected Outputs and Results

5. **Error Handling and Troubleshooting**
   - Common Issues
   - Debugging Techniques

6. **Conclusion**

---

## 1. Introduction

### Overview of the Validation Process

The Pola Agent Validation Guide provides a step-by-step walkthrough for validating the core functionalities of the Pola Generative Policy Agent. This guide includes detailed scenarios to ensure that each component of Pola works as expected, from user and group management to complex policy evaluations and conflict resolutions.

### Objectives of Validation

- **Ensure Functional Integrity**: Validate that all components of Pola operate according to the design specifications.
- **Identify and Resolve Issues**: Provide a framework to identify any discrepancies or issues during validation.
- **Simulate Real-World Use Cases**: Test scenarios that mimic real-world usage of the Pola Agent to ensure robustness and reliability.

---

## 2. Validation Environment Setup

### Prerequisites

- **Pola Agent Deployment**: Ensure that the Pola Agent is deployed and running on your environment. The API endpoint should be accessible (e.g., `https://pola.ai:4000/v1/`).
- **Authentication**: You need an authentication token (JWT) to interact with the Pola Agent. This token will be used in the `Authorization` header of each curl command.

### Setting Up the Pola Agent Environment

Ensure the following environment variables or configurations are in place:

- **API Endpoint**: `https://pola.ai:4000/v1/`
- **JWT Token**: Obtain a valid JWT token from the authentication service.

### Authentication Setup

Before running the validation steps, authenticate with the Pola Agent to obtain a JWT token:

```bash
curl -X POST https://pola.ai:4000/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
  "username": "admin",
  "password": "yourpassword"
}'
```

Save the `token` from the response, as it will be used in the `Authorization` header for subsequent requests.

---

## 3. Validation Scenarios

### Scenario 1: User Management Validation

**Objective**: Validate that the user management service handles user creation, updating, retrieval, and deletion correctly.

**Steps**:
1. Create a new user.
2. Retrieve the user details by ID.
3. Update the user details.
4. Assign policies to the user.
5. Delete the user.

### Scenario 2: Group Management Validation

**Objective**: Validate that the group management service correctly handles group creation, updating, retrieval, membership management, and policy assignments.

**Steps**:
1. Create a new group.
2. Add users to the group.
3. Assign policies to the group.
4. Retrieve group details by ID.
5. Delete the group.

### Scenario 3: Role Management Validation

**Objective**: Validate that the role management service manages roles, including creation, updating, retrieval, and policy assignments.

**Steps**:
1. Create a new role.
2. Assign policies to the role.
3. Retrieve role details by ID.
4. Delete the role.

### Scenario 4: Resource Management Validation

**Objective**: Validate that the resource management service manages resources, including creation, updating, retrieval, and policy assignments.

**Steps**:
1. Create a new resource.
2. Retrieve resource details by ID.
3. Update the resource.
4. Delete the resource.

### Scenario 5: Policy Management Validation

**Objective**: Validate that the policy management service handles the creation, updating, retrieval, and deletion of policies across various types (Principal, Resource, Group, Role).

**Steps**:
1. Create a principal policy.
2. Create a resource policy.
3. Create a group policy.
4. Create a role policy.
5. Retrieve policies by ID.
6. Update a policy.
7. Delete a policy.

### Scenario 6: Blacklist and Fact Management Validation

**Objective**: Validate the functionality of blacklist and fact management services, ensuring that entries can be created, updated, retrieved, and deleted.

**Steps**:
1. Create a blacklist entry.
2. Retrieve the blacklist entry by ID.
3. Update the blacklist entry.
4. Delete the blacklist entry.
5. Create a fact.
6. Retrieve the fact by ID.
7. Update the fact.
8. Delete the fact.

### Scenario 7: Policy Evaluation and Conflict Resolution

**Objective**: Validate the policy evaluation process, including conflict resolution when multiple policies apply.

**Steps**:
1. Simulate a policy evaluation.
2. Test policy evaluation with conflicting rules.
3. Validate the conflict resolution mechanism.

---

## 4. Validation Commands and Steps

### Scenario 1: User Management Validation

#### Step 1: Create a New User

```bash
curl -X POST https://pola.ai:4000/v1/users \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "givenName": "John",
  "familyName": "Doe",
  "email": "john.doe@example.com",
  "telephone": "123-456-7890",
  "username": "johndoe",
  "password": "securepassword",
  "address": {
    "streetAddress": "123 Main St",
    "addressLocality": "Anytown",
    "addressRegion": "CA",
    "postalCode": "90210",
    "addressCountry": "USA"
  },
  "contactPoint": {
    "telephone": "123-456-7890",
    "contactType": "work",
    "email": "john.doe@example.com"
  },
  "organization": "60c72b2f4f1a2567c9d3e0ff",
  "attr": {
    "customAttr1": "value1",
    "customAttr2": "value2"
  }
}'
```

**Expected Output**: A JSON object containing the new user's details, including their unique ID.

#### Step 2: Retrieve the User by ID

```bash
curl -X GET https://pola.ai:4000/v1/users/<user_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A JSON object containing the user's details.

#### Step 3: Update the User's Details

```bash
curl -X PUT https://pola.ai:4000/v1/users/<user_id> \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "email": "john.doe@newdomain.com",
  "telephone": "987-654-3210"
}'
```

**Expected Output**: A JSON object containing the updated user's details.

#### Step 4: Assign Policies to the User

```bash
curl -X POST https://pola.ai:4000/v1/users/<user_id>/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "policies": ["60c72b2f4f1a2567c9d3e1ff", "60c72b2f4f1a2567c9d3e2ff"]
}'
```

**Expected Output**: A confirmation message indicating that the policies were successfully assigned.

#### Step 5: Delete the User

```bash
curl -X DELETE https://pola.ai:4000/v1/users/<user_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A confirmation message indicating that the user was successfully deleted.

### Scenario 2: Group Management Validation

#### Step 1: Create a New Group

```bash
curl -X POST https://pola.ai:4000/v1/groups \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "name": "Developers",
  "description": "Group of software developers",
  "organization": "60c72b2f4f1a2567c9d3e0ff"
}'
```

**Expected Output**: A JSON object containing the new group's details, including their unique ID.

#### Step 2: Add Users to the Group

```bash
curl -X POST https://pola.ai:4000/v1/groups/<group_id>/users \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "members": ["60c72b2f4f1a2567c9d3e3ff", "60c72b2f4f1a2567c9d3e4ff"]
}'
```

**Expected Output**: A confirmation message indicating that the users were successfully added to the group.

#### Step 3: Assign Policies to the Group

```bash
curl -X POST https://pola.ai:4000/v1/groups/<

group_id>/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "policies": ["60c72b2f4f1a2567c9d3e5ff", "60c72b2f4f1a2567c9d3e6ff"]
}'
```

**Expected Output**: A confirmation message indicating that the policies were successfully assigned.

#### Step 4: Retrieve Group Details by ID

```bash
curl -X GET https://pola.ai:4000/v1/groups/<group_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A JSON object containing the group's details.

#### Step 5: Delete the Group

```bash
curl -X DELETE https://pola.ai:4000/v1/groups/<group_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A confirmation message indicating that the group was successfully deleted.

### Scenario 3: Role Management Validation

#### Step 1: Create a New Role

```bash
curl -X POST https://pola.ai:4000/v1/roles \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "name": "Admin",
  "description": "Administrator role with full access",
  "organization": "60c72b2f4f1a2567c9d3e0ff"
}'
```

**Expected Output**: A JSON object containing the new role's details, including their unique ID.

#### Step 2: Assign Policies to the Role

```bash
curl -X POST https://pola.ai:4000/v1/roles/<role_id>/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "policies": ["60c72b2f4f1a2567c9d3e7ff", "60c72b2f4f1a2567c9d3e8ff"]
}'
```

**Expected Output**: A confirmation message indicating that the policies were successfully assigned.

#### Step 3: Retrieve Role Details by ID

```bash
curl -X GET https://pola.ai:4000/v1/roles/<role_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A JSON object containing the role's details.

#### Step 4: Delete the Role

```bash
curl -X DELETE https://pola.ai:4000/v1/roles/<role_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A confirmation message indicating that the role was successfully deleted.

### Scenario 4: Resource Management Validation

#### Step 1: Create a New Resource

```bash
curl -X POST https://pola.ai:4000/v1/resources \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "typeName": "AWS::S3::Bucket",
  "description": "S3 bucket resource",
  "properties": {
    "BucketName": "example-bucket"
  },
  "required": ["BucketName"],
  "primaryIdentifier": ["BucketName"]
}'
```

**Expected Output**: A JSON object containing the new resource's details, including their unique ID.

#### Step 2: Retrieve Resource Details by ID

```bash
curl -X GET https://pola.ai:4000/v1/resources/<resource_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A JSON object containing the resource's details.

#### Step 3: Update the Resource

```bash
curl -X PUT https://pola.ai:4000/v1/resources/<resource_id> \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "description": "Updated S3 bucket resource"
}'
```

**Expected Output**: A JSON object containing the updated resource's details.

#### Step 4: Delete the Resource

```bash
curl -X DELETE https://pola.ai:4000/v1/resources/<resource_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A confirmation message indicating that the resource was successfully deleted.

### Scenario 5: Policy Management Validation

#### Step 1: Create a Principal Policy

```bash
curl -X POST https://pola.ai:4000/v1/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "user123",
    "version": "2024-08-23",
    "rules": [
      {
        "resource": "arn:aws:s3:::example_bucket",
        "actions": ["s3:GetObject", "s3:ListBucket"],
        "effect": "EFFECT_ALLOW"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin_user"
  }
}'
```

**Expected Output**: A JSON object containing the new principal policy's details, including its unique ID.

#### Step 2: Create a Resource Policy

```bash
curl -X POST https://pola.ai:4000/v1/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "arn:aws:s3:::example_bucket",
    "version": "2024-08-23",
    "rules": [
      {
        "actions": ["s3:GetObject", "s3:ListBucket"],
        "effect": "EFFECT_ALLOW"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin_user"
  }
}'
```

**Expected Output**: A JSON object containing the new resource policy's details, including its unique ID.

#### Step 3: Create a Group Policy

```bash
curl -X POST https://pola.ai:4000/v1/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "groupPolicy": {
    "group": "group123",
    "version": "2024-08-23",
    "rules": [
      {
        "resource": "arn:aws:s3:::example_bucket",
        "actions": ["s3:GetObject"],
        "effect": "EFFECT_ALLOW"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin_user"
  }
}'
```

**Expected Output**: A JSON object containing the new group policy's details, including its unique ID.

#### Step 4: Create a Role Policy

```bash
curl -X POST https://pola.ai:4000/v1/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "rolePolicy": {
    "role": "role123",
    "version": "2024-08-23",
    "rules": [
      {
        "resource": "arn:aws:s3:::example_bucket",
        "actions": ["s3:GetObject"],
        "effect": "EFFECT_ALLOW"
      }
    ]
  },
  "auditInfo": {
    "createdBy": "admin_user"
  }
}'
```

**Expected Output**: A JSON object containing the new role policy's details, including its unique ID.

#### Step 5: Retrieve Policy by ID

```bash
curl -X GET https://pola.ai:4000/v1/policies/<policy_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A JSON object containing the policy's details.

#### Step 6: Update a Policy

```bash
curl -X PUT https://pola.ai:4000/v1/policies/<policy_id> \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "description": "Updated policy description"
}'
```

**Expected Output**: A JSON object containing the updated policy's details.

#### Step 7: Delete a Policy

```bash
curl -X DELETE https://pola.ai:4000/v1/policies/<policy_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A confirmation message indicating that the policy was successfully deleted.

### Scenario 6: Blacklist and Fact Management Validation

#### Step 1: Create a Blacklist Entry

```bash
curl -X POST https://pola.ai:4000/v1/blacklists \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "description": "Block user123 from accessing S3 buckets",
  "conditions": {
    "principal": "user123",
    "resource": "arn:aws:s3:::*"
  }
}'
```

**Expected Output**: A JSON object containing the new blacklist entry's details, including its unique ID.

#### Step 2: Retrieve the Blacklist Entry by ID

```bash
curl -X GET https://pola.ai:4000/v1/blacklists/<blacklist_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A JSON object containing the

 blacklist entry's details.

#### Step 3: Update the Blacklist Entry

```bash
curl -X PUT https://pola.ai:4000/v1/blacklists/<blacklist_id> \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "description": "Updated blacklist description"
}'
```

**Expected Output**: A JSON object containing the updated blacklist entry's details.

#### Step 4: Delete the Blacklist Entry

```bash
curl -X DELETE https://pola.ai:4000/v1/blacklists/<blacklist_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A confirmation message indicating that the blacklist entry was successfully deleted.

#### Step 5: Create a Fact

```bash
curl -X POST https://pola.ai:4000/v1/facts \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "description": "Fact about user123",
  "attributes": {
    "user": "user123",
    "lastLogin": "2024-08-20T12:34:56Z"
  }
}'
```

**Expected Output**: A JSON object containing the new fact's details, including its unique ID.

#### Step 6: Retrieve the Fact by ID

```bash
curl -X GET https://pola.ai:4000/v1/facts/<fact_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A JSON object containing the fact's details.

#### Step 7: Update the Fact

```bash
curl -X PUT https://pola.ai:4000/v1/facts/<fact_id> \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "description": "Updated fact description"
}'
```

**Expected Output**: A JSON object containing the updated fact's details.

#### Step 8: Delete the Fact

```bash
curl -X DELETE https://pola.ai:4000/v1/facts/<fact_id> \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A confirmation message indicating that the fact was successfully deleted.

### Scenario 7: Policy Evaluation and Conflict Resolution

#### Step 1: Simulate a Policy Evaluation

```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "user123",
  "resourceId": "arn:aws:s3:::example_bucket",
  "actions": ["s3:GetObject"]
}'
```

**Expected Output**: A JSON object with the evaluation result, indicating whether the action is allowed or denied.

#### Step 2: Test Policy Evaluation with Conflicting Rules

```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "user123",
  "resourceId": "arn:aws:s3:::example_bucket",
  "actions": ["s3:GetObject"]
}'
```

**Expected Output**: A JSON object with the evaluation result, showing how the conflict between policies is resolved.

#### Step 3: Validate Conflict Resolution Mechanism

```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "user123",
  "resourceId": "arn:aws:s3:::example_bucket",
  "actions": ["s3:GetObject", "s3:DeleteObject"]
}'
```

**Expected Output**: A detailed JSON object showing the resolution of conflicting policies, with explanations for each decision.

---

## 5. Error Handling and Troubleshooting

### Common Issues

- **Authentication Errors**: Ensure that the JWT token is valid and not expired. Check the authentication service if issues persist.
- **404 Not Found**: Verify that the resource or entity exists before making the request. Ensure that IDs and paths are correct.
- **500 Internal Server Error**: Review the server logs for detailed error messages. This usually indicates an issue with the Pola backend.

### Debugging Techniques

- **Verbose curl Output**: Use `curl -v` to see the request and response details.
- **Check Logs**: Review the Pola Agent logs for any errors or warnings during API calls.
- **Test with Postman**: Use Postman for interactive testing of APIs to visualize requests and responses easily.

---

## 6. Conclusion

This validation guide provides a comprehensive approach to validating the functionality of the Pola Generative Policy Agent. By following these steps, you can ensure that each component of Pola operates as intended, with clear examples and expected outputs for each validation scenario. The detailed curl commands and troubleshooting tips help streamline the validation process, ensuring that any issues encountered can be quickly identified and resolved.
# Pola - Generative Policy Agent Validation Manual: Part 2

## Story-Based Scenarios: Securing Agsiri Ventures' New Fintech App with Pola

### Introduction

Agsiri Ventures is a company preparing to launch a new fintech app. Security and proper access control are paramount, especially given the sensitive nature of financial data. They have chosen Pola to protect their resources and applications from malicious users and ensure compliance with regulatory standards. This part of the manual explores various story-based scenarios to demonstrate how Agsiri Ventures can leverage Pola to secure their fintech app. Each scenario will guide you through the process of implementing and validating security policies using Pola.

### Scenario 1: Restricting Access to Financial Data

#### Background
Agsiri Ventures needs to ensure that only authorized personnel can access the financial data stored in their S3 buckets. Unauthorized access to this data could lead to severe legal and financial repercussions.

#### Step 1: Define a Resource Policy to Protect Financial Data

The financial data is stored in an S3 bucket named `agsiri-financial-data`. A resource policy will be created to allow only users with the role `Financial Analyst` to access this bucket.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "arn:aws:s3:::agsiri-financial-data",
    "version": "2024-08-23",
    "rules": [
      {
        "actions": ["s3:GetObject", "s3:ListBucket"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Financial Analyst"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "security_admin"
  }
}'
```

**Expected Output**: A JSON object confirming the creation of the resource policy.

#### Step 2: Validate Access by a Financial Analyst

A user with the `Financial Analyst` role attempts to access the S3 bucket.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "financial_analyst_user",
  "resourceId": "arn:aws:s3:::agsiri-financial-data",
  "actions": ["s3:GetObject"]
}'
```

**Expected Output**: A JSON object indicating that the action is allowed.

#### Step 3: Attempt Unauthorized Access by a Non-Analyst

A user without the `Financial Analyst` role attempts to access the S3 bucket.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "unauthorized_user",
  "resourceId": "arn:aws:s3:::agsiri-financial-data",
  "actions": ["s3:GetObject"]
}'
```

**Expected Output**: A JSON object indicating that the action is denied.

### Scenario 2: Implementing Data Deletion Restrictions

#### Background
To prevent accidental or malicious deletion of critical financial data, Agsiri Ventures decides that only users with a specific role (`Data Manager`) should be allowed to delete objects from the S3 bucket.

#### Step 1: Update Resource Policy to Restrict Delete Actions

The existing resource policy for `agsiri-financial-data` will be updated to include a rule that only allows `Data Manager` to delete objects.

**Command**:
```bash
curl -X PUT https://pola.ai:4000/v1/policies/<policy_id> \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "resourcePolicy": {
    "rules": [
      {
        "actions": ["s3:DeleteObject"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Data Manager"]
      }
    ]
  },
  "auditInfo": {
    "updatedBy": "security_admin"
  }
}'
```

**Expected Output**: A JSON object confirming the update to the resource policy.

#### Step 2: Validate Delete Access by a Data Manager

A user with the `Data Manager` role attempts to delete an object from the S3 bucket.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "data_manager_user",
  "resourceId": "arn:aws:s3:::agsiri-financial-data",
  "actions": ["s3:DeleteObject"]
}'
```

**Expected Output**: A JSON object indicating that the action is allowed.

#### Step 3: Attempt Unauthorized Deletion by a Non-Manager

A user without the `Data Manager` role attempts to delete an object from the S3 bucket.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "unauthorized_user",
  "resourceId": "arn:aws:s3:::agsiri-financial-data",
  "actions": ["s3:DeleteObject"]
}'
```

**Expected Output**: A JSON object indicating that the action is denied.

### Scenario 3: Enforcing Time-Based Access Restrictions

#### Background
Agsiri Ventures wants to enforce that certain sensitive actions, such as accessing financial reports, can only be performed during business hours (9 AM to 5 PM).

#### Step 1: Define a Principal Policy with Time-Based Conditions

A principal policy will be created to allow users in the `Financial Analyst` role to access the `agsiri-financial-reports` resource only during business hours.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "Financial Analyst",
    "version": "2024-08-23",
    "rules": [
      {
        "resource": "arn:aws:s3:::agsiri-financial-reports",
        "actions": ["s3:GetObject"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "script": "time.now().hour >= 9 && time.now().hour < 17"
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "security_admin"
  }
}'
```

**Expected Output**: A JSON object confirming the creation of the principal policy.

#### Step 2: Validate Access During Business Hours

A user with the `Financial Analyst` role attempts to access the financial reports during business hours.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "financial_analyst_user",
  "resourceId": "arn:aws:s3:::agsiri-financial-reports",
  "actions": ["s3:GetObject"]
}'
```

**Expected Output**: A JSON object indicating that the action is allowed if the current time is within business hours.

#### Step 3: Validate Access Outside Business Hours

The same user attempts to access the financial reports outside business hours.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "financial_analyst_user",
  "resourceId": "arn:aws:s3:::agsiri-financial-reports",
  "actions": ["s3:GetObject"]
}'
```

**Expected Output**: A JSON object indicating that the action is denied if the current time is outside business hours.

### Scenario 4: Managing Access to API Endpoints Based on User Role

#### Background
Agsiri Ventures has multiple API endpoints that need to be secured. Only users with the appropriate roles should be able to access certain API routes.

#### Step 1: Define a Resource Policy for API Access

A resource policy will be created to allow only users with the `API User` role to access the `/v1/accounts` endpoint.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "https://pola.ai:4000/v1/accounts",
    "version": "2024-08-23",
    "rules": [
      {
        "actions": ["GET", "POST"],
        "effect": "EFFECT_ALLOW",
        "roles": ["API User"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "api_admin"
  }
}'
```

**Expected Output**: A JSON object confirming the creation of the resource policy.

####

 Step 2: Validate Access by an API User

A user with the `API User` role attempts to access the `/v1/accounts` endpoint.

**Command**:
```bash
curl -X GET https://pola.ai:4000/v1/accounts \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A JSON object containing the list of accounts if the user is authorized.

#### Step 3: Attempt Unauthorized API Access

A user without the `API User` role attempts to access the `/v1/accounts` endpoint.

**Command**:
```bash
curl -X GET https://pola.ai:4000/v1/accounts \
-H "Authorization: Bearer <token>"
```

**Expected Output**: A JSON object indicating that access is denied.

### Scenario 5: Enforcing Compliance with Export Control Regulations

#### Background
Agsiri Ventures needs to comply with export control regulations, which require certain data to be restricted based on the geographic location of the user. Pola will be used to enforce these restrictions dynamically.

#### Step 1: Define a Principal Policy with Location-Based Conditions

A principal policy will be created to restrict access to the `export-controlled-data` resource to users who are not located in restricted countries.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "User",
    "version": "2024-08-23",
    "rules": [
      {
        "resource": "arn:aws:s3:::export-controlled-data",
        "actions": ["s3:GetObject"],
        "effect": "EFFECT_DENY",
        "condition": {
          "script": "geo.country in ['US', 'CA', 'UK']"
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "compliance_admin"
  }
}'
```

**Expected Output**: A JSON object confirming the creation of the principal policy.

#### Step 2: Validate Access from a Restricted Location

A user attempts to access the `export-controlled-data` resource from a restricted location.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "user123",
  "resourceId": "arn:aws:s3:::export-controlled-data",
  "actions": ["s3:GetObject"],
  "environment": {
    "geo": {
      "country": "US"
    }
  }
}'
```

**Expected Output**: A JSON object indicating that the action is denied.

#### Step 3: Validate Access from an Unrestricted Location

The same user attempts to access the `export-controlled-data` resource from an unrestricted location.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "user123",
  "resourceId": "arn:aws:s3:::export-controlled-data",
  "actions": ["s3:GetObject"],
  "environment": {
    "geo": {
      "country": "IN"
    }
  }
}'
```

**Expected Output**: A JSON object indicating that the action is allowed.

### Scenario 6: Preventing Unauthorized Data Export

#### Background
To further comply with export control regulations, Agsiri Ventures wants to ensure that only users with explicit permissions can export data from the system.

#### Step 1: Define a Derived Role with Export Permissions

A derived role will be created to encapsulate the permissions needed to export data.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "derivedRoles": {
    "name": "DataExporter",
    "definitions": [
      {
        "parentRoles": ["Data Manager"],
        "condition": {
          "script": "user.permissions.includes('export')"
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "export_admin"
  }
}'
```

**Expected Output**: A JSON object confirming the creation of the derived role.

#### Step 2: Validate Data Export by a User with the Derived Role

A user with the `DataExporter` derived role attempts to export data.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "data_exporter_user",
  "resourceId": "arn:aws:s3:::agsiri-data-exports",
  "actions": ["s3:GetObject"]
}'
```

**Expected Output**: A JSON object indicating that the action is allowed.

#### Step 3: Prevent Unauthorized Export Attempt

A user without the `DataExporter` role attempts to export data.

**Command**:
```bash
curl -X POST https://pola.ai:4000/v1/policies/simulate \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "principalId": "unauthorized_user",
  "resourceId": "arn:aws:s3:::agsiri-data-exports",
  "actions": ["s3:GetObject"]
}'
```

**Expected Output**: A JSON object indicating that the action is denied.

### Conclusion

This section of the Pola validation guide has provided story-based scenarios to demonstrate how Agsiri Ventures can secure their new fintech app using Pola. Each scenario addressed a specific security concern, from restricting access to financial data to enforcing compliance with export control regulations. By following these steps and using the provided curl commands, you can validate that Pola is correctly enforcing the policies and protecting your organization's resources. These scenarios highlight the flexibility and power of Pola in managing and securing access to critical resources within an enterprise environment.
