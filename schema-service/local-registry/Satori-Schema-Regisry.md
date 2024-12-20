# Satori JSON Schema Catalog - Version 2.20

This repository contains a collection of 41 component schemas that have been extracted from the **Satori JSON Schema**. Each schema is designed to be modular and reusable across various processes within Satori's workflow and service orchestration system.

All schemas conform to **JSON Schema Draft-07** standards and include metadata for tracking versions, authorship, and licensing information.

## General Metadata for All Schemas

Each schema in this catalog includes the following metadata:

```json
{
  "$id": "http://registry.agsiri.com:8080/v1/schemas/<SchemaName>/2.20",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$schemaName": "<SchemaName>",
  "$schemaVersion": "2.20",
  "$author": "Surendra Reddy",
  "$description": "<SchemaDescription>",
  "$license": "Confidential Property of 451 Labs"
}
```

---

## Table of Contents
1. [process](#1-process)
2. [services](#2-services)
3. [service](#3-service)
4. [variables](#4-variables)
5. [activities](#5-activities)
6. [activity](#6-activity)
7. [invoke](#7-invoke)
8. [whenThen](#8-whenthen)
9. [condition](#9-condition)
10. [match](#10-match)
11. [matchExprList](#11-matchexprlist)
12. [receive](#12-receive)
13. [reply](#13-reply)
14. [assign](#14-assign)
15. [throw](#15-throw)
16. [wait](#16-wait)
17. [empty](#17-empty)
18. [sequence](#18-sequence)
19. [flow](#19-flow)
20. [if](#20-if)
21. [while](#21-while)
22. [repeatUntil](#22-repeatuntil)
23. [pick](#23-pick)
24. [forEach](#24-foreach)
25. [scope](#25-scope)
26. [faultHandlers](#26-faulthandlers)
27. [eventHandlers](#27-eventhandlers)
28. [policyBindings](#28-policybindings)
29. [resourcePolicy](#29-resourcepolicy)
30. [rolePolicy](#30-rolepolicy)
31. [audit](#31-audit)
32. [notify](#32-notify)
33. [notifyWhen](#33-notifywhen)
34. [output](#34-output)
35. [outputWhen](#35-outputwhen)
36. [schemas](#36-schemas)
37. [schemasSchema](#37-schemasschema)
38. [schemasIgnoreWhen](#38-schemasignorewhen)
39. [metadata](#39-metadata)
40. [humanTask](#40-humantask)
41. [workflow](#41-workflow)

---

## Schema Catalog

### 1. **process**
- **Description**: Defines the structure of a Satori process, including services, variables, activities, and handlers.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/process/2.20`

### 2. **services**
- **Description**: A collection of services used in the workflow.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/services/2.20`

### 3. **service**
- **Description**: Defines a single service within the Satori workflow, including operations, authentication, and retry policies.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/service/2.20`

### 4. **variables**
- **Description**: Defines variables used in the process with type, message type, element, description, and source.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/variables/2.20`

### 5. **activities**
- **Description**: A collection of activities performed within the workflow.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/activities/2.20`

### 6. **activity**
- **Description**: Describes individual activities, including notifications, output, and priority.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/activity/2.20`

### 7. **invoke**
- **Description**: Defines an activity that invokes a service operation, including fault handlers and compensation handlers.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/invoke/2.20`

### 8. **whenThen**
- **Description**: Describes a conditional `when` activity with actions to perform when the condition is met.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/whenThen/2.20`

### 9. **condition**
- **Description**: A condition that evaluates match expressions (all, any, none) or scripts.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/condition/2.20`

### 10. **match**
- **Description**: Defines matching rules, including `all`, `any`, `none`, and `expr` for JSONPath expressions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/match/2.20`

### 11. **matchExprList**
- **Description**: A list of match expressions for logical operations.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/matchExprList/2.20`

### 12. **receive**
- **Description**: Defines an activity to receive messages from a service operation.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/receive/2.20`

### 13. **reply**
- **Description**: An activity for replying to a service operation.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/reply/2.20`

### 14. **assign**
- **Description**: Assigns values to variables from source to destination using JSONPath.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/assign/2.20`

### 15. **throw**
- **Description**: Describes an activity that throws a fault or error.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/throw/2.20`

### 16. **wait**
- **Description**: Waits for a specific duration or until a specific time.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/wait/2.20`

### 17. **empty**
- **Description**: An activity that performs no action but is used for workflow transitions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/empty/2.20`

### 18. **sequence**
- **Description**: Describes a sequence of activities executed in order.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/sequence/2.20`

### 19. **flow**
- **Description**: A parallel execution of activities with optional links between them.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/flow/2.20`

### 20. **if**
- **Description**: An activity that executes a set of actions if a condition is met, with optional `else` and `elseif` clauses.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/if/2.20`

### 21. **while**
- **Description**: Repeats an activity while a condition is met.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/while/2.20`

### 22. **repeatUntil**
- **Description**: Repeats an activity until a condition is met.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/repeatUntil/2.20`

### 23. **pick**
- **Description**: Waits for one of several messages or alarms to arrive and triggers corresponding activities.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/pick/2.20`

### 24. **forEach**
- **Description**: Executes an activity for each item in a collection, with optional parallel execution.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/forEach/2.20`

### 25. **scope**
- **Description**: Encapsulates a set of activities, variables, and services within a scoped execution.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/scope/2.20`

### 26. **faultHandlers**
- **Description**: Defines fault handlers for activities that may fail.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/faultHandlers/2.20`

### 27. **eventHandlers**
- **Description**: Describes handlers for events and alarms within a process.
- **$id**: `http://registry.ags

iri.com/v1/schemas/eventHandlers/2.20`

### 28. **policyBindings**
- **Description**: Binds resource and role policies to the process or workflow.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/policyBindings/2.20`

### 29. **resourcePolicy**
- **Description**: Defines policies applied to resources, including actions and effects.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/resourcePolicy/2.20`

### 30. **rolePolicy**
- **Description**: Defines policies and permissions associated with roles in the system.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/rolePolicy/2.20`

### 31. **audit**
- **Description**: Tracks audit information such as creation and modification timestamps.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/audit/2.20`

### 32. **notify**
- **Description**: Defines notifications within activities, including delivery methods and payload schemas.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/notify/2.20`

### 33. **notifyWhen**
- **Description**: Specifies the conditions and escalation policies for triggering notifications.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/notifyWhen/2.20`

### 34. **output**
- **Description**: Defines the output of an activity, including transformations and conditions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/output/2.20`

### 35. **outputWhen**
- **Description**: Specifies the conditions under which the output should be generated.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/outputWhen/2.20`

### 36. **schemas**
- **Description**: A collection of schemas used within the workflow.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/schemas/2.20`

### 37. **schemasSchema**
- **Description**: Defines the schema used for referencing other schemas.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/schemasSchema/2.20`

### 38. **schemasIgnoreWhen**
- **Description**: Specifies when certain schemas should be ignored based on conditions.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/schemasIgnoreWhen/2.20`

### 39. **metadata**
- **Description**: Metadata associated with workflows, including annotations and source files.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/metadata/2.20`

### 40. **humanTask**
- **Description**: Describes a task performed by a human, including assignee, due date, and form references.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/humanTask/2.20`

### 41. **workflow**
- **Description**: Defines the top-level structure of a workflow, including processes, services, and activities.
- **$id**: `http://registry.agsiri.com:8080/v1/schemas/workflow/2.20`

