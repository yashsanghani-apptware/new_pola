# README: Policy Deployment and Evaluation Experiments

## Overview

This document provides a comprehensive guide to the experiments conducted regarding policy deployment and evaluation, covering all steps from user creation to group and role assignment, derived role calculation, and resource policy evaluation. These experiments are critical for understanding how various policy types and models interact within the system, and they showcase the aggregation and evaluation of policies applied to users, groups, roles, and resources.

## Table of Contents

1. [Introduction](#introduction)
2. [Experiments](#experiments)
   - [crResPolicy](#crrespolicy)
   - [crResPolicies](#crrespolicies)
   - [userPolicyAgg](#userpolicyagg)
   - [resourcePolicyAgg](#resourcepolicyagg)
   - [listResources](#listresources)
   - [showAggPolicies](#showaggpolicies)
   - [aggPolicies](#aggpolicies)
   - [showResourcePolicies](#showresourcepolicies)
3. [Policy Types](#policy-types)
   - [Principal Policy](#principal-policy)
   - [Resource Policy](#resource-policy)
   - [Derived Role Policy](#derived-role-policy)
   - [Service Control Policy](#service-control-policy)
   - [Tagging Policy](#tagging-policy)
   - [Audit Policy](#audit-policy)
4. [Models](#models)
   - [User Model](#user-model)
   - [Group Model](#group-model)
   - [Role Model](#role-model)
   - [Resource Model](#resource-model)
5. [Conclusion](#conclusion)

## Introduction

In our experiments, we explored the complex interactions between users, groups, roles, derived roles, and resources in the context of policy deployment and evaluation. The goal was to understand how policies are aggregated, applied, and evaluated at different levels of the system. This README provides a detailed explanation of each experiment, including the steps involved, the purpose, and the expected outcomes.

## Experiments

### crResPolicy

**Purpose:**  
The `crResPolicy` experiment tests the creation of a single resource policy. This serves as the foundational step in establishing resource-level permissions.

**Steps:**
- Define a resource with its unique ARI.
- Create a policy that applies to this resource, specifying actions (e.g., `read`, `update`), conditions, and effects.
- Deploy the policy to ensure it is correctly configured and enforceable.

**Attributes:**
- **Mandatory:** `resource`, `actions`, `effect`, `condition`
- **Optional:** `description`, `version`

### crResPolicies

**Purpose:**  
The `crResPolicies` experiment extends the `crResPolicy` by creating a diverse set of resource policies. This is crucial for testing how multiple policies coexist and interact.

**Steps:**
- Define a set of resources, each with a unique ARI.
- Create distinct policies for each resource, including different actions, conditions, and effects.
- Deploy and validate the policies, ensuring they do not conflict and are properly enforced.

**Attributes:**
- **Mandatory:** `resources[]`, `actions[]`, `effect`, `condition`
- **Optional:** `description`, `version`

### userPolicyAgg

**Purpose:**  
The `userPolicyAgg` experiment demonstrates the aggregation of direct and indirect policies applied to a user (principal). This includes policies attached to the user directly and those inherited from groups and roles.

**Steps:**
- Assign direct policies to a user.
- Assign the user to one or more groups/roles, each with its own policies.
- Aggregate the policies, showcasing how inherited permissions are combined.

**Attributes:**
- **Mandatory:** `user`, `groups[]`, `roles[]`, `policies[]`
- **Optional:** `aggregationType` (e.g., `intersection`, `union`)

### resourcePolicyAgg

**Purpose:**  
The `resourcePolicyAgg` experiment showcases the aggregation of policies applied to a resource. This helps understand how resource-level policies from various sources are combined.

**Steps:**
- Define a resource and attach multiple policies from different sources.
- Aggregate the policies to determine the effective permissions.
- Evaluate the aggregated policies to ensure proper enforcement.

**Attributes:**
- **Mandatory:** `resource`, `policies[]`
- **Optional:** `aggregationType`

### listResources

**Purpose:**  
The `listResources` experiment lists all resources in the system, providing an overview of the resources and their associated policies.

**Steps:**
- Query the system for all resources.
- Display each resource with its ARI, type, and associated policies.
- Validate that all resources are correctly listed.

**Attributes:**
- **Mandatory:** None
- **Optional:** `filters[]`, `pagination`

### showAggPolicies

**Purpose:**  
The `showAggPolicies` experiment displays or checks the aggregated policies of a user or resource. This is essential for debugging and ensuring the correctness of policy aggregation.

**Steps:**
- Aggregate policies for a user or resource.
- Display the aggregated policies in a readable format.
- Verify that the aggregation matches the expected results.

**Attributes:**
- **Mandatory:** `entityType` (e.g., `user`, `resource`), `entityId`
- **Optional:** `aggregationType`

### aggPolicies

**Purpose:**  
The `aggPolicies` experiment is a broader showcase of policy aggregation, demonstrating how policies from various sources (e.g., user, group, resource) are combined and enforced.

**Steps:**
- Aggregate policies across different levels (e.g., user, group, resource).
- Display the results, showing how policies interact and are enforced.
- Validate that the aggregation logic is correctly implemented.

**Attributes:**
- **Mandatory:** `entityTypes[]`, `entityIds[]`
- **Optional:** `aggregationType`

### showResourcePolicies

**Purpose:**  
The `showResourcePolicies` experiment lists all resource policies in the system, providing a detailed view of resource-level permissions.

**Steps:**
- Query the system for all resource policies.
- Display each policy with its associated resource, actions, and conditions.
- Validate the correctness of the policies and their associations.

**Attributes:**
- **Mandatory:** None
- **Optional:** `filters[]`, `pagination`

## Policy Types

### Principal Policy

**Description:**  
A Principal Policy defines permissions directly associated with a user or group. It governs what actions a principal (user or group) can perform on specific resources.

**Mandatory Attributes:**
- `principal`: The user or group to whom the policy applies.
- `actions`: The list of actions allowed or denied.
- `effect`: The effect of the policy (`ALLOW` or `DENY`).
- `resources`: The resources the policy applies to.

**Optional Attributes:**
- `conditions`: Conditions under which the policy is applied.

### Resource Policy

**Description:**  
A Resource Policy defines permissions directly on a resource, specifying who can perform what actions on the resource.

**Mandatory Attributes:**
- `resource`: The resource to which the policy applies.
- `actions`: The list of actions allowed or denied.
- `effect`: The effect of the policy (`ALLOW` or `DENY`).

**Optional Attributes:**
- `conditions`: Conditions under which the policy is applied.

### Derived Role Policy

**Description:**  
A Derived Role Policy defines permissions based on derived roles, which are dynamically calculated based on attributes of the principal or resource.

**Mandatory Attributes:**
- `derivedRole`: The derived role calculated for the principal.
- `actions`: The list of actions allowed or denied.
- `effect`: The effect of the policy (`ALLOW` or `DENY`).

**Optional Attributes:**
- `conditions`: Conditions under which the policy is applied.

### Service Control Policy

**Description:**  
A Service Control Policy (SCP) governs the maximum permissions available to accounts within an organization. SCPs restrict what actions principals in the organization can perform.

**Mandatory Attributes:**
- `target`: The organization or organizational unit.
- `actions`: The list of actions allowed or denied.
- `effect`: The effect of the policy (`ALLOW` or `DENY`).

**Optional Attributes:**
- `conditions`: Conditions under which the policy is applied.

### Tagging Policy

**Description:**  
A Tagging Policy governs the use of tags on resources, specifying what tags can be applied and by whom.

**Mandatory Attributes:**
- `resource`: The resource to which the policy applies.
- `tags`: The allowed or disallowed tags.
- `effect`: The effect of the policy (`ALLOW` or `DENY`).

**Optional Attributes:**
- `conditions`: Conditions under which the policy is applied.

### Audit Policy

**Description:**  
An Audit Policy specifies what actions and resources are subject to auditing, ensuring compliance and security monitoring.

**Mandatory Attributes:**
- `resource`: The resource to which the audit policy applies.
- `actions`: The actions that trigger auditing.
- `effect`: The effect of the policy (`ALLOW` or `DENY`).

**Optional Attributes:**
- `conditions`: Conditions under which the policy is applied.

## Models

### User Model

**Description:**  
The User Model represents a user in the system, capturing all relevant attributes and relationships.

**Attributes:**
- **Mandatory:** `name`, `email`, `roles[]`, `groups[]`
- **Optional:** `telephone`, `address`, `contactPoint`, `attr[]`

### Group Model

**Description:**  
The Group Model represents a group of users, often used to assign common policies or roles.

**Attributes:**
- **Mandatory:** `name`, `users[]`
- **Optional:** `description`, `roles[]`, `attr[]`

### Role Model

**Description:**  
The Role Model defines a role within the system, specifying a set of permissions

 that can be assigned to users or groups.

**Attributes:**
- **Mandatory:** `name`, `policies[]`
- **Optional:** `description`, `attr[]`

### Resource Model

**Description:**  
The Resource Model represents a resource in the system, which can have policies applied to it.

**Attributes:**
- **Mandatory:** `type`, `identifier`, `attributes`
- **Optional:** `description`, `tags[]`, `attr[]`

## Conclusion

The experiments documented in this README provide a detailed exploration of policy deployment and evaluation within the system. By understanding the interactions between users, groups, roles, derived roles, and resources, you can effectively design and implement policies that ensure secure and compliant access control. This guide should serve as a reference for implementing, testing, and evaluating policies across different scenarios.
