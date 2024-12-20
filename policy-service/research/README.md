# Pola Evaluator 

## Overview

The `PolaEvaluator` is a TypeScript-based system designed to evaluate different types of access control policies in a MongoDB-backed environment. This system allows you to define and enforce various policies, such as principal-based, resource-based, role-based, and derived role policies, ensuring that only authorized users can perform specific actions on resources.

## Key Features

- **Principal Policy Evaluation**: Define rules for specific users or groups, specifying what actions they can perform on particular resources.
- **Resource Policy Evaluation**: Enforce rules on resources, controlling who can access or modify them based on specific conditions.
- **Role Policy Evaluation**: Define and enforce access control based on user roles within the organization.
- **Derived Role Evaluation**: Automatically determine user roles based on a hierarchy of conditions and parent roles.
- **Comprehensive Logging**: Detailed logging of policy evaluations helps in debugging and understanding policy enforcement.

## Setup

### Prerequisites

- Node.js and npm installed
- MongoDB instance running locally or remotely
- TypeScript installed globally (`npm install -g typescript`)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Compile TypeScript to JavaScript:

   ```bash
   npx tsc
   ```

## Configuration

Before running the system, configure the MongoDB connection in the `config/db.ts` file. Ensure that the MongoDB instance is running and accessible.

## Usage

### Loading Test Data

To load the test data (policies) into MongoDB:

1. Modify `src/loadPolicies.ts` to match your environment and desired policy data.
2. Run the script to load the policies into the `Policy` collection:

   ```bash
   node dist/loadPolicies.js
   ```

### Evaluating Policies

To evaluate the policies:

1. Modify `src/index.ts` with the correct input parameters to test against the loaded policies.
2. Run the evaluation script:

   ```bash
   node dist/index.js
   ```

### Sample Policy Data

The system uses various types of policies, including `PrincipalPolicy`, `ResourcePolicy`, `RolePolicy`, and `DerivedRole`. Below is a brief overview of each policy type and the data used to test the system.

#### Principal Policy

Defines rules for specific users (principals) specifying what actions they can perform on particular resources.

```json
{
  "principal": "user:1234567890",
  "version": "1.0.0",
  "rules": [
    {
      "resource": "ari:service:region:account-id:resource/project-management",
      "actions": [
        {
          "action": "READ",
          "effect": "EFFECT_ALLOW",
          "condition": {
            "match": {
              "all": {
                "of": [
                  { "expr": "P.department === 'engineering'" },
                  { "expr": "R.projectStatus === 'active'" }
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
```

#### Resource Policy

Defines rules on resources, specifying who can access or modify them under certain conditions.

```json
{
  "resource": "ari:service:region:account-id:resource/api-endpoint",
  "version": "1.0.0",
  "rules": [
    {
      "actions": ["INVOKE"],
      "effect": "EFFECT_ALLOW",
      "condition": {
        "match": {
          "all": {
            "of": [
              { "expr": "P.apiQuota < 1000" },
              { "expr": "R.endpoint === '/v1/secure-data'" }
            ]
          }
        }
      }
    }
  ]
}
```

#### Role Policy

Defines access control based on roles within the organization.

```json
{
  "role": "manager",
  "version": "1.0.0",
  "rules": [
    {
      "resource": "ari:service:region:account-id:resource/financial-reports",
      "actions": [
        {
          "action": "READ",
          "effect": "EFFECT_ALLOW",
          "condition": {
            "match": {
              "all": {
                "of": [
                  { "expr": "P.role === 'manager'" },
                  { "expr": "R.isPublic === true" }
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
```

#### Derived Role Hierarchy

Automatically assigns roles based on conditions and parent roles.

```json
{
  "name": "ProjectRoleHierarchy",
  "definitions": [
    {
      "name": "SeniorManager",
      "parentRoles": ["Manager"],
      "condition": {
        "match": {
          "all": {
            "of": [
              { "expr": "P.yearsOfExperience >= 10" },
              { "expr": "P.teamSize > 50" }
            ]
          }
        }
      }
    },
    {
      "name": "Engineer",
      "parentRoles": [],
      "condition": {
        "match": {
          "expr": "P.role === 'engineer'"
        }
      }
    }
  ]
}
```

### Running Evaluations

The system evaluates each policy type and logs the results to the console. If the conditions specified in the policies match the input parameters, the system will confirm that the action is allowed or denied.

Here’s an example of running evaluations:

```bash
node dist/index.js
```

### Expected Output

- **Derived Role Evaluations**: The system should output the qualified roles based on the conditions specified in the `DerivedRoleHierarchy`.
- **Principal, Resource, and Role Policy Evaluations**: The expected result should indicate whether the actions are allowed or denied based on the conditions defined.

### Common Issues

- **Empty Evaluation Results**: If you get empty evaluation results, ensure that the input parameters correctly match the conditions specified in the policies.
- **Debugging**: Use the detailed log output to trace where the condition evaluation may not be matching the input data.

## Contributions

Feel free to submit issues or pull requests to improve the functionality or fix any bugs you encounter.
if you have any questions on this contact @sureddy
