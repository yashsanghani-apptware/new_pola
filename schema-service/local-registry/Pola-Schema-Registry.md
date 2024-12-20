
# Schema Catalog - Policy Schema Components

This repository contains a collection of schemas that have been extracted from a comprehensive **Policy Schema**. Each schema is designed to be modular and reusable across different policies and use cases. The repository allows the flexibility to use these components in isolation or as part of a larger composed schema.

All schemas conform to **JSON Schema Draft-07** standards and include metadata for tracking versions, authorship, licensing, and other important details.

## Table of Contents
1. [General Metadata for All Schemas](#general-metadata-for-all-schemas)
2. [Schemas Catalog](#schemas-catalog)
   - [AuditInfo](#1-auditinfo)
   - [Condition](#2-condition)
   - [DerivedRoles](#3-derivedroles)
   - [EventPolicy](#4-eventpolicy)
   - [EventRule](#5-eventrule)
   - [EventRuleAction](#6-eventruleaction)
   - [ExportVariables](#7-exportvariables)
   - [GroupPolicy](#8-grouppolicy)
   - [GroupRule](#9-grouprule)
   - [GroupRuleAction](#10-groupruleaction)
   - [Match](#11-match)
   - [Match.ExprList](#12-matchexprlist)
   - [Metadata](#13-metadata)
   - [Notify](#14-notify)
   - [NotifyWhen](#15-notifywhen)
   - [Output](#16-output)
   - [OutputWhen](#17-outputwhen)
   - [Policy](#18-policy)
   - [PrincipalPolicy](#19-principalpolicy)
   - [PrincipalRule](#20-principalrule)
   - [PrincipalRuleAction](#21-principalruleaction)
   - [ResourcePolicy](#22-resourcepolicy)
   - [ResourceRule](#23-resourcerule)
   - [RoleDef](#24-roledef)
   - [RolePolicy](#25-rolepolicy)
   - [RoleRule](#26-rolerule)
   - [RoleRuleAction](#27-roleruleaction)
   - [Schemas](#28-schemas)
   - [SchemasIgnoreWhen](#29-schemasignorewhen)
   - [SchemasSchema](#30-schemasschema)
   - [ServiceControlPolicy](#31-servicecontrolpolicy)
   - [SourceAttributes](#32-sourceattributes)
   - [Variables](#33-variables)

## General Metadata for All Schemas

Each schema in this catalog includes the following metadata:

```json
{
  "$id": "http://registry.agsiri.com:8080/v1/schemas/<SchemaName>/2.8",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$schemaName": "<SchemaName>",
  "$schemaVersion": "2.8",
  "$author": "Surendra Reddy",
  "$description": "<SchemaDescription>",
  "$license": "Confidential Property of 451 Labs"
}
```

---

## Schemas Catalog

### 1. AuditInfo
- **Description**: Contains audit information, including the creator, creation date, updater, and update date of the schema.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/AuditInfo/2.8`

### 2. Condition
- **Description**: Defines a condition that includes either a match or a script. A condition is satisfied if either the match or the script is provided and valid.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/Condition/2.8`

### 3. DerivedRoles
- **Description**: Defines a set of derived roles that can be assigned based on variables and predefined conditions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/DerivedRoles/2.8`

### 4. EventPolicy
- **Description**: Manages the policies that apply to specific events. Defines event-based rules and actions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/EventPolicy/2.8`

### 5. EventRule
- **Description**: Defines event-specific rules, including conditions that trigger actions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/EventRule/2.8`

### 6. EventRuleAction
- **Description**: Defines the action triggered by an event rule, including the type of action and its effect.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/EventRuleAction/2.8`

### 7. ExportVariables
- **Description**: Defines a set of variables that are exported from the policy for use in other systems or rules.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/ExportVariables/2.8`

### 8. GroupPolicy
- **Description**: Defines group-based policies that assign specific rules and actions to groups of users or entities.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/GroupPolicy/2.8`

### 9. GroupRule
- **Description**: Specifies rules that apply to a group of entities, including the actions and conditions to be met.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/GroupRule/2.8`

### 10. GroupRuleAction
- **Description**: Defines the actions taken when a group rule is triggered, including permissions, notifications, and conditions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/GroupRuleAction/2.8`

### 11. Match
- **Description**: Defines match conditions in a policy. Supports logical operations such as `all`, `any`, `none`, and direct expressions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/Match/2.8`

### 12. Match.ExprList
- **Description**: Defines a list of match expressions used in logical operations like `all`, `any`, or `none`.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/MatchExprList/2.8`

### 13. Metadata
- **Description**: Defines the metadata associated with a resource, including annotations, hash, and source attributes.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/Metadata/2.8`

### 14. Notify
- **Description**: Defines a notification mechanism, including configuration for web services, pub/sub topics, and queues.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/Notify/2.8`

### 15. NotifyWhen
- **Description**: Defines conditions for when a notification should be triggered, based on specific rules and events.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/NotifyWhen/2.8`

### 16. Output
- **Description**: Defines the output conditions of a policy, including expressions and when they should be triggered.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/Output/2.8`

### 17. OutputWhen
- **Description**: Defines conditions under which output is generated, based on specific rules being activated or conditions being met.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/OutputWhen/2.8`

### 18. Policy
- **Description**: The main policy schema that defines the structure and rules governing different policies.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/Policy/2.8`

### 19. PrincipalPolicy
- **Description**: Defines policies that apply to principals, such as users or services, and their associated rules.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/PrincipalPolicy/2.8`

### 20. PrincipalRule
- **Description**: Defines rules that apply to principals, such as users or services, and the conditions for those rules.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/PrincipalRule/2.8`

### 21. PrincipalRuleAction
- **Description**: Specifies the actions taken by principals when certain conditions are met.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/PrincipalRuleAction/2.8`

### 22. ResourcePolicy
- **Description**: Defines resource-based policies, including rules and conditions for accessing resources.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/ResourcePolicy/2.8`

### 23. ResourceRule
- **Description**: Defines rules that apply to resources, including actions and effects based on conditions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/ResourceRule/2.8`

### 24. RoleDef
- **Description**: Defines role-based definitions for assigning roles to entities.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/RoleDef/2.8`

### 25. RolePolicy
- **Description**: Defines policies that apply to roles, including the rules and actions associated with the role.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/RolePolicy/2.8`

### 26. RoleRule
-

 **Description**: Specifies rules for roles, including actions and conditions under which the rules apply.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/RoleRule/2.8`

### 27. RoleRuleAction
- **Description**: Defines actions taken by roles when rules are triggered.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/RoleRuleAction/2.8`

### 28. Schemas
- **Description**: A set of schemas used to define the structure and validation of other components in the system.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/Schemas/2.8`

### 29. SchemasIgnoreWhen
- **Description**: Defines conditions under which certain schemas should be ignored, depending on the actions performed.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/SchemasIgnoreWhen/2.8`

### 30. SchemasSchema
- **Description**: Defines the schema for referencing other schemas, including validation and conditions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/SchemasSchema/2.8`

### 31. ServiceControlPolicy
- **Description**: Defines service control policies, including permissions and entities bound to services.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/ServiceControlPolicy/2.8`

### 32. SourceAttributes
- **Description**: Defines the source attributes for a policy, including file and attribute details.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/SourceAttributes/2.8`

### 33. Variables
- **Description**: Defines variables that are used across different policies and schemas, including imports and local variables.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/Variables/2.8`

---

This catalog allows for easy integration and reuse of components across various policies and schemas. Each schema is designed to be independent, but can also be composed to create more complex policies.
