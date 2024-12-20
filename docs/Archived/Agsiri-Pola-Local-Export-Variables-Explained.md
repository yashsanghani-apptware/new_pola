# Local and Exported Variables in Agsiri Policies

In the Agsiri Policy framework, variables are essential tools for reducing redundancy and enhancing the flexibility of policy condition expressions. By defining variables either locally within a policy or in a standalone `exportVariables` file, you can create reusable components that simplify policy management and ensure consistency across multiple policies. However, understanding the scope, precedence, and potential conflicts between local and exported variables is crucial for creating clear and effective policies.

This guide provides a comprehensive look at Local and Exported Variables in Agsiri policies, addressing key topics such as variable scope, precedence in case of conflicts, and handling type mismatches. It also includes practical examples and best practices to help policy implementors effectively use these features while maintaining clear and manageable policies.

## Understanding Local Variables

**Local Variables** are defined within a specific policy and are accessible only within that policy’s scope. These variables are particularly useful for encapsulating expressions that are unique to the policy, ensuring that they do not interfere with or depend on external variables.

# When to Use Local Variables

Local variables should be used when you need to define expressions that are specific to the logic of a single policy. For instance, if a policy governs access to a particular resource and requires a check on whether that resource has been flagged, a local variable can encapsulate this logic neatly within the policy itself.

# Example 1: Defining Local Variables

In this example, we define a resource policy that uses local variables to encapsulate logic specific to the policy. The policy checks if a resource is flagged, assigns labels, and identifies teams that are allowed access.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "ari:resource:example:document/123456",
    "variables": {
      "local": {
        "flagged_resource": "request.resource.attr.flagged",
        "label": "\"latest\"",
        "teams": "[\"red\", \"blue\"]"
      }
    },
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "V.flagged_resource == false" },
                { "expr": "P.attr.department in V.teams" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

## Key Components:

- **flagged_resource**: A local variable to check if the resource is flagged.
- **label**: A string literal `"latest"` assigned to label the document.
- **teams**: An array of team names (`"red"` and `"blue"`) that are allowed access to the document.

**Curl Command to Test:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @variables.1.json
```

By defining these variables locally, the policy remains self-contained and easier to manage, as the logic is specific to this policy alone and does not risk affecting other policies.

## Exploring Exported Variables

**Exported Variables** are designed for reuse across multiple policies. By defining common expressions in a standalone `exportVariables` file, you can create a shared resource that other policies can import as needed. This approach ensures consistency across policies and reduces the need for repetitive declarations.

# When to Use Exported Variables

Exported variables are ideal for expressions that are commonly used across different policies. For example, if several policies need to check whether a resource is flagged or determine the label associated with a resource, these checks can be defined once and exported for reuse.

# Example 2: Defining Exported Variables

This example defines exported variables that can be reused across multiple policies. These variables include a check for flagged resources, common labels, and team names.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "exportVariables": {
    "name": "apatr_common_variables",
    "definitions": {
      "flagged_resource": "request.resource.attr.flagged",
      "label": "\"latest\"",
      "teams": "[\"red\", \"blue\"]"
    }
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

## Key Components:

- **name**: The identifier `apatr_common_variables` for the exported variables.
- **definitions**: Common expressions defined for reuse across multiple policies.

**Curl Command to Test:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @variables.2.json
```

## Importing and Using Exported Variables

Once you’ve defined and exported variables, you can import them into other policies using the `import` directive. This mechanism allows policies to access and use common variables without redefining them.

# Example 3: Importing Exported Variables in a Resource Policy

In this example, the policy imports the `apatr_common_variables` defined earlier and uses them to enforce access control. The policy checks that the resource is not flagged and that the user's department matches one of the predefined teams.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "ari:resource:example:document/123456",
    "variables": {
      "import": ["apatr_common_variables"]
    },
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "V.flagged_resource == false" },
                { "expr": "P.attr.department in V.teams" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

## Key Components:

- **import**: The policy imports `apatr_common_variables`, making its variables available within this policy.
- **rules**: The policy checks that the resource is not flagged and that the user's department is in the list of allowed teams.

**Curl Command to Test:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @variables.3.json
```

## Scope, Precedence, and Conflict Resolution

Understanding the scope, precedence, and potential conflicts between local and exported variables is crucial for maintaining clear and effective policies.

# Scope of Variables

- **Local Variables**: These are confined to the policy in which they are defined and cannot be accessed or referenced by other policies. They are best used for policy-specific logic that does not need to be shared.
  
- **Exported Variables**: These are defined in a standalone file and can be imported by any policy that needs them. They have a broader scope, making them suitable for common expressions that are used across multiple policies.

# Precedence in Case of Conflicts

When both local and exported variables are used in a policy, conflicts can arise if the same variable is defined in both contexts. In such cases, **local variables take precedence** over exported variables. This means that if a variable is defined both locally and in an imported set, the local definition will override the imported one.

# Example 4: Conflict Resolution Between Local and Exported Variables

In this example, the policy imports `apatr_common_variables` but also defines a local variable `flagged_resource`, which overrides the imported one. The policy ensures that a user can view or edit the document only if the local `flagged_resource` condition (set to `false`) is met and the user belongs to one of the specified teams.

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "ari:resource:example:document/123456",
    "variables": {
      "import": ["apatr_common_variables"],
      "local": {
        "flagged_resource": "false"
      }
    },
    "rules": [
      {
        "actions": ["view", "edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "V.flagged_resource == false" },
                { "expr": "P.attr.department in V.teams" }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

## Key Components:

- **flagged_resource**: The local variable `flagged_resource` set to `false` takes precedence over the imported one.
- **teams**: The imported array of team names, `"red"` and `"blue"`, is used for department checks.

**Curl Command to Test:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @variables.4.json
```

# Handling Type Mismatches


Another potential issue arises when the same variable is defined with different types in local and exported contexts. For instance, a variable might be defined as an integer in one context and as a boolean in another. This type mismatch can lead to evaluation errors or unexpected behavior.

## Best Practices for Avoiding Type Mismatches

1. **Consistent Type Definitions**: Ensure that variables are consistently defined with the same type across all contexts. If a variable is expected to be a boolean, it should be defined as a boolean both locally and in any exported sets.

2. **Validation and Testing**: Implement validation checks to ensure that variable types match expected types in all contexts. This can be part of your policy compilation process, catching errors before they cause issues in production.

3. **Clear Documentation**: Document the expected type of each variable, particularly in exported sets, to ensure that policy implementors understand how these variables should be used and what types they should conform to.

## Merging Local and Exported Variables

When local and exported variables are used together in a policy, they are merged into a single set of variables during the policy evaluation process. Each variable is evaluated before any rule conditions are processed. However, as mentioned, local variables take precedence over exported ones in case of conflicts.

# Best Practices for Merging Variables

1. **Consistency**: Use exported variables for any expressions that need to be consistent across multiple policies. This ensures that updates are centralized and reduces the risk of discrepancies.

2. **Encapsulation**: Reserve local variables for policy-specific logic. This keeps policies self-contained and minimizes the risk of unintended interactions between policies.

3. **Clarity**: Clearly document whether a variable is local or imported. This helps maintain transparency in your policies and makes it easier for others to understand the scope and purpose of each variable.

4. **Avoiding Collisions**: Be mindful of naming collisions. If a variable is defined in both local and imported contexts, the local definition will take precedence. However, be cautious of potential type mismatches and ensure that variables are consistently defined.

5. **Type Safety**: Ensure that variables are consistently typed across all contexts. Avoid scenarios where a variable might be defined as one type in a local context and another type in an exported context, as this can lead to evaluation errors or unexpected behavior.

## Conclusion

Local and Exported Variables in Agsiri policies offer a powerful means of managing policy logic, providing both flexibility and reusability. By understanding the scope, precedence, and potential conflicts between these variables, policy implementors can create clear, consistent, and effective policies.

This guide has provided detailed insights into the use of Local and Exported Variables, including best practices for avoiding conflicts and handling type mismatches. By keeping variables well-organized and scoped correctly, you can leverage the full power of the Agsiri Policy framework to create robust and adaptable access control solutions.

With the included working examples, you now have a practical foundation to start defining and implementing your own policies.
