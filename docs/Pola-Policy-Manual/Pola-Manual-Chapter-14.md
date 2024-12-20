# Chapter 14: Appendices

---

The appendices section of this manual serves as a comprehensive reference point for policy writers, security administrators, and developers who are working with Pola policies. This chapter includes a glossary of key terms used throughout the manual, a detailed reference of the JSON schema that underpins Pola policies, a library of fully written and tested example policies, and a list of additional resources for those looking to deepen their understanding of policy writing.

---

## 14.1 Glossary of Terms

Understanding the terminology used in Pola policies is crucial for effective policy writing and management. This glossary provides definitions for key terms that are frequently used in this manual and in Pola policy discussions.

- **Access Control**: The process of restricting access to resources based on the identity or attributes of the requester.

- **Action**: In Pola policies, an action refers to the operation being controlled by the policy (e.g., `read`, `write`, `delete`).

- **ARI (Agsiri Resource Identifier)**: A unique identifier used to specify a resource within the Agsiri platform. The ARI format is similar to an ARN (Amazon Resource Name) but is specific to the Agsiri ecosystem.

- **Audit Info**: Metadata that tracks the creation, modification, and management of a policy, including details about who created the policy and when.

- **Condition**: A logical expression within a policy that determines whether a particular action should be allowed or denied. Conditions are evaluated based on attributes of the principal, resource, or environment.

- **Derived Role**: A role that is dynamically assigned to a principal based on conditions defined in a policy. Derived roles provide flexibility by allowing role assignments to change based on the current context.

- **Effect**: The outcome of a policy rule, which can either be `EFFECT_ALLOW` (permitting the action) or `EFFECT_DENY` (prohibiting the action).

- **Expression**: In Pola policies, an expression is a logical statement that evaluates to `true` or `false`. Expressions are used in conditions to enforce fine-grained access control.

- **Export Variable**: A variable defined in one policy that can be imported and used in other policies. Export variables are used to avoid redundancy and to standardize certain checks across multiple policies.

- **JSON Schema**: A vocabulary that allows you to annotate and validate JSON documents. In Pola policies, JSON Schema is used to define the structure and constraints of principal and resource attributes.

- **Match Object**: A component of a condition that defines the logical structure of expressions within the policy. The match object can contain operators such as `all`, `any`, and `none`.

- **Policy**: A document that defines access rules for resources within the Agsiri platform. Policies control which actions are allowed or denied based on the attributes of the principal, resource, and context.

- **Principal**: The entity (e.g., user, group, service) that is requesting access to a resource. Policies are often written to define what actions a principal can perform on specific resources.

- **Resource**: The object of an action in a policy, such as a file, database, or API endpoint. Policies define what actions can be performed on resources and under what conditions.

- **Role**: A collection of permissions that can be assigned to a principal. Roles are used to simplify the management of access controls by grouping permissions into logical sets.

- **Scope**: The context within which a policy is applied, often defined by the resource or resource type. Scope can be used to limit the applicability of a policy to certain areas of the platform.

- **Variable**: A value that is used within a policy to simplify expressions or to introduce dynamic behavior. Variables can be defined locally within a policy or imported from other policies.

---

## 14.2 Policy Schema Reference

The Pola policy framework relies on a well-defined JSON schema to ensure that policies are structured correctly and that they behave as expected. This section provides a detailed reference of the JSON schema used in Pola policies, including the key elements and constraints that must be adhered to when writing policies.

### Overview of the JSON Schema

The Pola JSON schema is designed to enforce consistency and reliability across all policies. It defines the required fields, data types, and validation rules that each policy must conform to. By adhering to this schema, policy writers can ensure that their policies are compatible with the Agsiri platform and that they will be correctly evaluated by the Policy Decision Point (PDP).

- **`apiVersion`**: This field specifies the version of the Pola API that the policy conforms to. It ensures that the policy is compatible with the features and capabilities of the specified API version.

    *Example*:
    ```json
    "apiVersion": "api.agsiri.dev/v1"
    ```

- **`principalPolicy`**: This object defines a set of rules that apply to a specific principal (e.g., a user or a group). The principalPolicy object must include the principal's identifier, the version of the policy, and one or more rules.

    *Example*:
    ```json
    "principalPolicy": {
      "principal": "user",
      "version": "1.0",
      "rules": [ ... ]
    }
    ```

- **`resourcePolicy`**: Similar to principalPolicy, this object defines rules that apply to a specific resource. The resourcePolicy object must include the resource's identifier, the version of the policy, and the associated rules.

    *Example*:
    ```json
    "resourcePolicy": {
      "resource": "ari:agsiri:document:us:123456789012:files/*",
      "version": "1.0",
      "rules": [ ... ]
    }
    ```

- **`rules`**: The core of any policy, the rules object defines the actions that are allowed or denied for a specific principal or resource. Each rule includes the actions, effect, and conditions that must be met for the rule to apply.

    *Example*:
    ```json
    "rules": [
      {
        "actions": ["read", "write"],
        "effect": "EFFECT_ALLOW",
        "condition": { ... }
      }
    ]
    ```

- **`condition`**: This object defines the criteria that must be met for a rule to apply. Conditions are expressed using the Pola Expression Language (PXL) and can include logical operators, expressions, and variables.

    *Example*:
    ```json
    "condition": {
      "match": {
        "all": {
          "of": [
            {"expr": "P.attr.role == 'admin'"},
            {"expr": "R.attr.classification == 'confidential'"}
          ]
        }
      }
    }
    ```

- **`effect`**: The effect of a rule determines whether the specified actions are allowed or denied. The effect must be either `EFFECT_ALLOW` or `EFFECT_DENY`.

    *Example*:
    ```json
    "effect": "EFFECT_ALLOW"
    ```

- **`auditInfo`**: This object contains metadata about the policy, including information about who created the policy and when it was created. This information is essential for auditing and tracking the history of policies.

    *Example*:
    ```json
    "auditInfo": {
      "createdBy": "admin",
      "createdAt": "2024-08-19T12:00:00Z"
    }
    ```

### Detailed Schema Elements

Below is a more detailed breakdown of the JSON schema elements that are critical to Pola policy structure:

- **`apiVersion`**: A string that specifies the version of the Pola API that the policy is compatible with. This ensures that the policy leverages the correct features and behaviors defined by that API version.

- **`principalPolicy` and `resourcePolicy`**: Objects that encapsulate rules specific to either principals or resources. These objects are mutually exclusive; a policy can define either a principalPolicy or a resourcePolicy, but not both in the same document.

- **`rules`**: An array of rule objects, each of which must include:
  - `actions`: An array of strings representing the actions that the rule applies to (e.g., "read", "write").
  - `effect`: A string indicating the effect of the rule, either `EFFECT_ALLOW` or `EFFECT_DENY`.
  - `condition`: An optional object that defines the criteria that must be met for the rule to apply.

- **`condition`**: An object that contains:
  - `match`: An object that specifies the logical structure of the condition. It can contain operators like `all`, `any`, or `none`, and expressions that are evaluated against the attributes of the principal, resource, or environment.

- **`effect`**: A string that determines the outcome of the rule (`EFFECT_ALLOW` or `EFFECT_DENY`). The effect is enforced if the condition evaluates to true.

- **`auditInfo`**: An object that contains metadata about the policy, including:
  - `createdBy`: A string representing the user or system that created the policy.
  - `createdAt`: A timestamp indicating when the policy was created.

- **`variables`**: An optional object that defines local variables used in the policy. These variables can be referenced in condition expressions to simplify complex logic and avoid redundancy.

    *Example*:
    ```json
    "variables": {
      "local": {
        "is_sensitive": "R.attr.classification == 'confidential'"
      }
    }
    ```

- **`schemas`**: An optional object that references JSON schemas used to validate principal or resource attributes. This ensures that data conforms to expected structures before the policy is evaluated.

    *

Example*:
    ```json
    "schemas": {
      "principalSchema": {
        "ref": "agsiri:///schemas/principal.json"
      },
      "resourceSchema": {
        "ref": "agsiri:///schemas/resource.json"
      }
    }
    ```

---

## 14.3 Example Policy Library

This section provides a collection of fully written and tested example policies. Each policy is accompanied by an explanation of the scenario it addresses, making it easier to understand how the policy works and how it can be adapted to your specific needs.

### Example 1: Basic Access Control Policy

This policy allows users with the `admin` role to read and write documents within a specified directory.

*Scenario*: An organization wants to ensure that only administrators can access sensitive documents stored in a specific directory.

*Policy*:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "principalPolicy": {
    "principal": "user",
    "version": "1.0",
    "rules": [
      {
        "resource": "ari:agsiri:document:us:123456789012:sensitive/*",
        "actions": ["read", "write"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "P.attr.role == 'admin'"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "security_admin",
    "createdAt": "2024-08-19T14:00:00Z"
  }
}
```

*Explanation*: This policy applies to all documents in the `sensitive` directory and allows only users with the `admin` role to read or write those documents.

### Example 2: Time-Based Access Control

This policy restricts access to a system resource to working hours only (9 AM to 5 PM).

*Scenario*: A company wants to limit access to a critical system resource to normal business hours to prevent unauthorized use during off-hours.

*Policy*:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:system:us:123456789012:resource/critical",
    "version": "1.0",
    "rules": [
      {
        "actions": ["access"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "now().getHours() >= 9 && now().getHours() <= 17"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "it_admin",
    "createdAt": "2024-08-19T14:30:00Z"
  }
}
```

*Explanation*: This policy allows access to the `critical` system resource only if the current time is between 9 AM and 5 PM.

### Example 3: Role-Based Data Access

This policy ensures that only users with a clearance level of 4 or higher can access confidential data.

*Scenario*: An organization needs to ensure that only highly trusted personnel can access confidential information stored in their database.

*Policy*:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:database:us:123456789012:confidential/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "P.attr.clearance_level >= 4"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "data_protection_officer",
    "createdAt": "2024-08-19T15:00:00Z"
  }
}
```

*Explanation*: This policy applies to all confidential data in the specified database and restricts access to users with a clearance level of 4 or higher.

### Example 4: Regulatory Compliance Policy (GDPR)

This policy enforces GDPR compliance by ensuring that personal data can only be accessed by data controllers who have obtained explicit consent.

*Scenario*: A company operating in the EU needs to ensure that access to personal data complies with GDPR requirements.

*Policy*:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:document:us:123456789012:personal_data/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.role == 'data_controller'"},
                {"expr": "P.attr.consent == true"}
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "compliance_officer",
    "createdAt": "2024-08-19T15:30:00Z"
  }
}
```

*Explanation*: This policy ensures that personal data is accessed only by data controllers who have obtained explicit consent from the data subject, in compliance with GDPR.

### Example 5: Nested Conditions for Complex Scenarios

This policy allows resource access only if multiple nested conditions are met, such as being in a specific location, during a certain time window, and with the appropriate role.

*Scenario*: A multinational company wants to enforce strict access control to sensitive systems based on location, time, and user role.

*Policy*:
```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:system:us:123456789012:resource/secure_area",
    "version": "1.0",
    "rules": [
      {
        "actions": ["access"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                {"expr": "P.attr.role == 'security_officer'"},
                {"expr": "P.attr.location == 'headquarters'"},
                {
                  "any": {
                    "of": [
                      {"expr": "now().getHours() >= 8 && now().getHours() <= 18"},
                      {"expr": "P.attr.override == true"}
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "security_admin",
    "createdAt": "2024-08-19T16:00:00Z"
  }
}
```

*Explanation*: This policy allows access to a secure area only if the user is a security officer located at the headquarters and the access occurs during working hours, unless an override is granted.

---

## 14.4 Additional Resources

For policy writers looking to further enhance their skills and knowledge, this section provides links to additional resources, including further reading, online courses, and certifications.

### Further Reading

- **"Advanced Access Control with Agsiri Pola"**: A comprehensive guide that delves deeper into advanced topics like role-based access control, condition expressions, and policy optimization.

- **"Mastering JSON Schema"**: A detailed book on JSON Schema, providing a strong foundation for anyone looking to enforce data validation in Pola policies.

- **"Pola Expression Language: A Deep Dive"**: An in-depth exploration of the Pola Expression Language (PXL), including tips and tricks for writing efficient and powerful expressions.

### Online Courses

- **Pola Policy Writing Essentials**: A beginner-friendly course that covers the basics of writing Pola policies, including an introduction to the Pola framework and practical examples.

- **Advanced Pola Policy Techniques**: This course is aimed at experienced policy writers and covers advanced topics like nested conditions, derived roles, and optimization strategies.

- **JSON Schema for Policy Writers**: An online course focused on understanding and using JSON Schema in the context of Pola policies.

### Certifications

- **Certified Pola Policy Expert (CPPE)**: This certification is designed for professionals who want to demonstrate their expertise in writing and managing Pola policies. It includes an exam that tests knowledge of the Pola framework, policy structure, and best practices.

- **Certified JSON Schema Professional (CJSP)**: A certification that focuses on mastering JSON Schema, an essential skill for creating and enforcing structured data in Pola policies.

### Useful Links

- **Official Pola Documentation**: The official documentation site for Pola, offering detailed explanations of all aspects of the framework, including policy writing, API usage, and integration tips.

- **Pola GitHub Repository**: The open-source repository for Pola, where you can access the latest code, contribute to the project, and engage with the community.

- **Pola Community Forum**: A forum where users can discuss Pola-related topics, ask questions, and share best practices with other members of the community.

---

# Conclusion

The appendices provided in this chapter are designed to serve as a comprehensive resource for anyone involved in writing or managing Pola policies. Whether you are a seasoned policy writer or new to the framework, the glossary, schema reference, example policy library, and additional resources will help you to create effective, compliant, and optimized policies for your organization.

By leveraging these tools and resources, you can ensure that your Pola policies are not only robust and secure but also aligned with industry standards and best practices.
