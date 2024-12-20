
# Agsiri ARI and Security Policy Document

This document provides a comprehensive overview of the Agsiri ARI (Agsiri Resource Identifiers) model, policy evaluation, condition management, and associated services. It details how to define, enforce, and evaluate security policies using Agsiri’s principalPolicies, derivedRoles, resourcePolicies, and exportVariables. The document also provides examples and scenarios, ranging from intermediate to very complex, to illustrate the application of these policies in real-world scenarios.

---

## Agsiri Resource Identifiers (ARIs)

Agsiri Resource Identifiers (ARIs) uniquely identify resources within the Agsiri ecosystem. They are critical in defining and enforcing security policies. ARIs follow a structured format:

```
ari:agsiri:{service}:{region}:{accountId}:{resourceType}/{resourceId}
```

### Examples:
- **Data Room**: `ari:agsiri:dataroom:us:123456789012:dataroom/Farm230`
- **Cabinet within a Data Room**: `ari:agsiri:dataroom:us:123456789012:cabinet/Cabinet123`
- **File within a Cabinet**: `ari:agsiri:dataroom:us:123456789012:file/File123`

---

## Policy Levels

Agsiri IAM policies are structured to provide granular control over user access, resource management, and role-based permissions. The policies are categorized into four distinct types:

1. **PrincipalPolicies**: Define user-specific permissions.
2. **DerivedRoles**: Specify dynamic role-based permissions.
3. **ResourcePolicies**: Control resource governance and admission.
4. **ExportVariables**: Variables that can be shared and used across multiple policies.

## Policy Evaluation and Precedence

When a user attempts to access a resource, Agsiri IAM evaluates all applicable policies to determine whether the action is allowed or denied. The process follows these general steps:

1. **Gather All Applicable Policies**: Collect all user-level, group-level, and role-level policies that apply to the user.
2. **Evaluate Policies**: Evaluate each policy to determine if the requested action on the resource is explicitly allowed or denied.
3. **Determine Effective Permissions**: Combine the results of the evaluations to determine the final set of permissions for the user.

### Precedence Rules

1. **Explicit Deny Overrides Allow**: If any policy explicitly denies an action, the deny takes precedence over any allows.
2. **Explicit Allow**: If no explicit deny is found, and at least one policy explicitly allows the action, the action is allowed.
3. **Implicit Deny**: If no policies explicitly allow the action, it is implicitly denied.

---

## Policy Matrix

The policy matrix is a structured representation of roles, services, and resources. It defines which roles have access to which services and resources, providing a clear overview of permissions across the Agsiri ecosystem.

### Example Policy Matrix

| Service / Resource              | Administrator                        | Compliance Manager      | Seller                          | Buyer                  | Farm SME               | Farm Manager          | Investor                        | Campaign Manager           | Executive                |
|---------------------------------|--------------------------------------|-------------------------|---------------------------------|-------------------------|------------------------|------------------------|---------------------------------|----------------------------|--------------------------|
| **Data Room Service**           |                                      |                         |                                 |                         |                        |                        |                                 |                            |                          |
| Data Rooms                      | Full                                 | View, Monitor           | -                               | View                    | -                      | Manage                 | View                            | -                          | View                     |
| Cabinets                        | Full                                 | View, Monitor           | -                               | View                    | -                      | Manage                 | View                            | -                          | View                     |
| Files                           | Full                                 | View, Monitor           | -                               | View                    | -                      | Manage                 | View                            | -                          | View                     |
| Mailboxes                       | Full                                 | View, Monitor           | -                               | View                    | -                      | Manage                 | View                            | -                          | View                     |

---

## Policy Document Components

### PrincipalPolicies

PrincipalPolicies are directly tied to users, specifying what actions they can perform on resources.

**Example PrincipalPolicy:**

```yaml
name: "JudySmithPolicy"
description: "Judy Smith can access data room cabinets and files."
principalPolicy:
  principal: "JudySmith"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:us:123456789012:cabinet/*"
      actions: ["view", "edit"]
      effect: "EFFECT_ALLOW"
    - resource: "ari:agsiri:dataroom:us:123456789012:file/*"
      actions: ["view"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

### DerivedRoles

DerivedRoles allow the definition of dynamic roles where permissions are calculated based on certain conditions or contexts.

**Example DerivedRole:**

```yaml
name: "ManagerRole"
description: "Dynamic role for managers to access and manage their department's resources."
derivedRole:
  definitions:
    - name: "Manager"
      conditions:
        - expr: "user.role === 'manager'"
      actions: ["manage"]
      resource: "ari:agsiri:dataroom:us:123456789012:cabinet/*"
      effect: "EFFECT_ALLOW"
variables:
  department: "user.department"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

### ResourcePolicies

ResourcePolicies control access to resources and enforce governance based on defined rules. These policies are attached directly to resources like data rooms, cabinets, or files.

**Example ResourcePolicy:**

```yaml
name: "DataRoomPolicy"
description: "Policies governing access to Data Rooms and their sub-resources."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/*"
  version: "1.0"
  rules:
    - actions: ["view", "edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'admin'"
            - expr: "resource.status !== 'archived'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

### ExportVariables

ExportVariables are shared across policies, enabling consistent and reusable expressions and conditions.

**Example ExportVariables:**

```yaml
name: "CommonVariables"
description: "Shared variables for various policies."
exportVariables:
  variables:
    currentTime: "context.currentTime"
    userDepartment: "user.department"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

---

## Policy Evaluation Process

The evaluation of policies involves determining whether a principal (user) can perform a specific action on a resource. This process considers all applicable policies—principal, derived, resource, and variable definitions.

### Step-by-Step Evaluation

1. **Gather Applicable Policies**: Identify all policies related to the principal and the resource.
2. **Evaluate PrincipalPolicies**: Check if the user's principalPolicy allows the requested action.
3. **Evaluate DerivedRoles**: Assess any derived roles the user may have and how they impact access.
4. **Evaluate ResourcePolicies**: Determine if the resourcePolicy grants or denies access.
5. **Apply ExportVariables**: Use shared variables to evaluate conditions and rules.
6. **Resolve Conflicts**: If there is a conflict between allow and deny, apply the precedence rules.

---

## Example Scenarios

These scenarios illustrate the application of principalPolicies, derivedRoles, resourcePolicies, and exportVariables in evaluating access requests. Each scenario is presented in a structured YAML format, including scenario ID, description, resource ARIs, principal details, context, action, and the expected outcome.

### Scenario 1: Admin accessing data room and cabinets.

```yaml
- scenarioId: 1
  description: "Admin accessing data room and cabinets."
  user:
    attr:
      role: "Admin"
      department: "IT"
  resource:
    attr:
      status: "active"
  context:
    currentTime: "2024-08-20T12:00:00Z"
  action: "view"
```

**Expected Outcome**: Allowed, as the admin role grants full access to data rooms and cabinets.

### Scenario 2: Compliance manager monitoring data room activities.

```yaml
- scenarioId: 2
  description: "Compliance manager monitoring data room activities."
  user:
    attr:
      role: "ComplianceManager"
  resource:
    attr:
      tags: ["monitor"]
  context:
    currentTime: "2024-08-20T12:00:00Z"
  action: "monitor"
```

**Expected Outcome**: Allowed, as the Compliance Manager role permits monitoring activities.

### Scenario 3: Farm manager attempting to manage files in the data room.

```yaml
- scenarioId: 3
  description: "Farm manager attempting to manage files in the data room."
  user:
    attr:
      role: "FarmManager"
  resource:
    attr:
      status: "

active"
  context:
    currentTime: "2024-08-20T12:00:00Z"
  action: "manage"
```

**Expected Outcome**: Allowed, as the Farm Manager role is designed to manage files within data rooms.

### Scenario 4: Seller trying to create a listing within a data room.

```yaml
- scenarioId: 4
  description: "Seller trying to create a listing within a data room."
  user:
    attr:
      role: "Seller"
  resource:
    attr:
      status: "new"
  context:
    currentTime: "2024-08-20T12:00:00Z"
  action: "create"
```

**Expected Outcome**: Denied, as the Seller role does not have permissions to create listings within data rooms.

### Scenario 5: Investor viewing offerings in the data room.

```yaml
- scenarioId: 5
  description: "Investor viewing offerings in the data room."
  user:
    attr:
      role: "Investor"
  resource:
    attr:
      visibility: "public"
  context:
    currentTime: "2024-08-20T12:00:00Z"
  action: "view"
```

**Expected Outcome**: Allowed, as the Investor role permits viewing public offerings in the data room.

### Scenario 6: Executive reviewing financial data in the data room.

```yaml
- scenarioId: 6
  description: "Executive reviewing financial data in the data room."
  user:
    attr:
      role: "Executive"
  resource:
    attr:
      tags: ["financial", "confidential"]
  context:
    currentTime: "2024-08-20T12:00:00Z"
  action: "view"
```

**Expected Outcome**: Allowed, as the Executive role grants access to review financial data.

### Scenario 7: Buyer assessing farm listings in the data room.

```yaml
- scenarioId: 7
  description: "Buyer assessing farm listings in the data room."
  user:
    attr:
      role: "Buyer"
  resource:
    attr:
      category: "farm"
  context:
    currentTime: "2024-08-20T12:00:00Z"
  action: "view"
```

**Expected Outcome**: Allowed, as the Buyer role is permitted to assess farm listings.

### Scenario 8: Farm SME conducting ESG assessments in the data room.

```yaml
- scenarioId: 8
  description: "Farm SME conducting ESG assessments in the data room."
  user:
    attr:
      role: "FarmSME"
  resource:
    attr:
      status: "under review"
  context:
    currentTime: "2024-08-20T12:00:00Z"
  action: "assess"
```

**Expected Outcome**: Allowed, as the Farm SME role is designed for conducting assessments.

### Scenario 9: Campaign Manager launching a campaign from the data room.

```yaml
- scenarioId: 9
  description: "Campaign Manager launching a campaign from the data room."
  user:
    attr:
      role: "CampaignManager"
  resource:
    attr:
      status: "ready"
  context:
    currentTime: "2024-08-20T12:00:00Z"
  action: "launch"
```

**Expected Outcome**: Allowed, as the Campaign Manager role is designed for launching campaigns.

### Scenario 10: Admin user attempting to archive a data room.

```yaml
- scenarioId: 10
  description: "Admin user attempting to archive a data room."
  user:
    attr:
      role: "Admin"
  resource:
    attr:
      status: "active"
  context:
    currentTime: "2024-08-20T12:00:00Z"
  action: "archive"
```

**Expected Outcome**: Allowed, as only admin users can archive resources.

---

These scenarios provide a detailed representation of how the Agsiri IAM policies, combined with ARIs and role definitions, can be used to enforce complex access control rules within the Agsiri ecosystem. Each scenario illustrates the interaction between different roles, resources, and actions, providing a comprehensive guide for policy enforcement and evaluation.
