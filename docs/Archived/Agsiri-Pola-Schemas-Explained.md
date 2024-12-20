# Pola Schemas in Agsiri Policies: A Comprehensive Guide

Agsiri Pola policies leverage the flexibility of free-form context data about the principal and resource(s) provided through the `attr` fields in API requests. While this approach offers unparalleled flexibility in policy creation, it can lead to challenges in maintaining consistency, enforcing system-wide standards, and ensuring that policies work as intended across different environments. This is where Pola Schemas come into play.

By incorporating JSON Schema support, Agsiri Pola allows you to define and enforce schemas for principal and resource attributes, ensuring that the data adheres to predefined structures and standards. This guide will explore the intricacies of Pola Schemas, from defining and validating schemas to managing enforcement levels and addressing common challenges.

## Introduction to Pola Schemas

Pola Schemas are based on the JSON Schema standard (specifically draft 2020-12) and provide a way to define the structure, types, and validation rules for the data used in Agsiri Pola policies. By enforcing schemas, you can ensure that the context data passed in API requests meets the required standards, reducing the risk of errors and making policies more predictable and easier to manage.

### Why Use Schemas?

- **Consistency**: Schemas enforce consistent data structures across policies, making it easier to maintain and update policies as your system evolves.
- **Validation**: By validating incoming requests against schemas, you can catch errors early and ensure that only valid data is processed.
- **Portability**: Schemas help standardize data formats, making it easier to migrate policies between different environments or systems.
- **Documentation**: Schemas serve as a form of documentation, clearly defining what data is expected and how it should be structured.

## Defining Pola Schemas

Agsiri Pola schemas are standard JSON Schemas that can be defined for any principal or resource attributes on a per-resource basis. These schemas are stored in a special directory named `_schemas`, located at the root of the storage directory or bucket, depending on your chosen storage driver (`disk`, `git`, or `blob`). If you are using a database storage driver, schemas can be managed via the Admin API.

### Creating a Schema

To define a schema, create a JSON file that describes the expected structure and types of the data. You can use JSON Schema’s features like `$defs` for reusable fragments and `$ref` for referencing other schemas to avoid repetition and make your schemas more modular and maintainable.

#### Example 1: Customer Schema with Address Reference

Consider a scenario where you need to define a schema for customer data that includes shipping and billing addresses. To avoid repeating the address structure, you can define it in a separate schema file and reference it in the customer schema.

**Customer Schema (`customer.json`):**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "first_name": { "type": "string" },
    "last_name": { "type": "string" },
    "shipping_address": { "$ref": "agsiri:///address.json" },
    "billing_address": { "$ref": "agsiri:///address.json" }
  },
  "required": ["first_name", "last_name", "shipping_address", "billing_address"]
}
```

**Address Schema (`address.json`):**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "street_address": { "type": "string" },
    "city": { "type": "string" },
    "state": { "type": "string" }
  },
  "required": ["street_address", "city", "state"]
}
```

**Explanation:**

- **Modularity**: The `customer.json` schema references the `address.json` schema for both the `shipping_address` and `billing_address` properties. This avoids duplication and ensures that any changes to the address structure are reflected in all schemas that reference it.
- **Reusability**: The use of `$ref` allows you to reuse schema fragments across multiple schemas, making your overall schema architecture more maintainable.

## Validating Requests Using Schemas

Once you have defined your schemas, you need to associate them with the appropriate resource policies. This is done by specifying the schemas in the resource policy definition. Agsiri Pola will then validate incoming requests against these schemas, either logging warnings or rejecting requests based on the enforcement configuration.

### Associating Schemas with Resource Policies

To validate requests for a specific resource kind, update the resource policy to include references to the schemas for both the principal and resource attributes. This ensures that all incoming data for that resource type adheres to the defined structure.

#### Example 2: Resource Policy with Schema Validation

Consider a resource policy for an `album:object` resource kind. The policy might require validation against a schema for the principal attributes (`principal.json`) and another schema for the resource attributes (`album/object.json`).

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "album:object",
    "importDerivedRoles": ["apatr_common_roles"],
    "schemas": {
      "principalSchema": {
        "ref": "agsiri:///principal.json"
      },
      "resourceSchema": {
        "ref": "agsiri:///album/object.json",
        "ignoreWhen": {
          "actions": ["create", "delete:*"]
        }
      }
    },
    "rules": [
      {
        "actions": ["create"],
        "effect": "EFFECT_ALLOW",
        "derivedRoles": ["owner"]
      },
      {
        "actions": ["view"],
        "effect": "EFFECT_ALLOW",
        "roles": ["user"],
        "condition": {
          "match": {
            "expr": "request.resource.attr.public == true"
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

**Explanation:**

- **Principal Schema**: The `principalSchema` field specifies the schema used to validate the principal’s attributes.
- **Resource Schema**: The `resourceSchema` field specifies the schema for validating the resource’s attributes.
- **Ignore When**: The `ignoreWhen` block allows you to specify actions for which schema validation should be skipped. This is particularly useful for actions like `create`, where all required attributes might not be present in the initial request.

**Curl Command to Test:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.2.json
```

## Configuring Schema Enforcement Levels

Agsiri Pola allows you to configure the enforcement level for schema validation. This determines how the Policy Decision Point (PDP) handles requests that do not conform to the defined schemas.

### Enforcement Levels

- **`warn`**: If the enforcement level is set to `warn`, the PDP will log a warning if a request fails schema validation but will still evaluate the policies and return the effects determined by the policy rules.
- **`reject`**: If the enforcement level is set to `reject`, the PDP will deny all actions associated with the request if it fails schema validation, returning an `EFFECT_DENY` for each action.

**Example 3: Configuring Schema Enforcement**

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "project:object",
    "schemas": {
      "principalSchema": {
        "ref": "agsiri:///principal.json"
      },
      "resourceSchema": {
        "ref": "agsiri:///project/object.json"
      }
    },
    "schemaEnforcementLevel": "reject",
    "rules": [
      {
        "actions": ["edit"],
        "effect": "EFFECT_ALLOW",
        "roles": ["editor"],
        "condition": {
          "match": {
            "expr": "request.resource.attr.status == 'in_progress'"
          }
        }
      },
      {
        "actions": ["view"],
        "effect": "EFFECT_ALLOW",
        "roles": ["viewer"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "system",
    "createdAt": "2024-08-19T12:34:56Z"
  }
}
```

**Explanation:**

- **Reject Level**: The schema enforcement level is set to `reject`, meaning any request that does not meet the schema requirements will be denied outright. This strict enforcement ensures that only valid data is processed.

**Curl Command to Test:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.3.json
```

## Handling Validation Errors

When schema validation is enforced, any request that does not conform to the schema will generate validation errors. These errors are included in the API response, allowing you to diagnose and address issues with the request data.

### Example 4: API Response with Validation Errors

Consider a scenario where a request fails schema validation due to incorrect department values:

```json
{
  "requestId": "test",
  "resourceInstances": {
    "XX125": {
      "actions": {
        "approve": "EFFECT_DENY",
        "create": "EFFECT_DENY",
        "defer": "EFFECT_ALLOW",
        "view:public":

 "EFFECT_ALLOW"
      },
      "validationErrors": [
        {
          "path": "/department",
          "message": "value must be one of \"marketing\", \"engineering\"",
          "source": "SOURCE_PRINCIPAL"
        },
        {
          "path": "/department",
          "message": "value must be one of \"marketing\", \"engineering\"",
          "source": "SOURCE_RESOURCE"
        }
      ]
    }
  }
}
```

**Explanation:**

- **Validation Errors**: The `validationErrors` field provides detailed information about which parts of the request failed schema validation, including the path to the invalid data, the error message, and whether the error originated from the principal or the resource.

## Conclusion

Pola Schemas are a critical component of the Agsiri Pola policy framework, enabling robust data validation and enforcement of system-wide standards. By defining, validating, and enforcing schemas for principal and resource attributes, you can ensure that your policies are consistent, predictable, and maintainable across different environments.

This guide has provided an in-depth exploration of Pola Schemas, from basic schema definition and validation to advanced usage scenarios such as modular and conditional schemas. By following best practices and leveraging the full capabilities of JSON Schema, you can create powerful and reliable policies that meet the complex needs of modern applications.

With the included working examples, you now have a practical foundation to start defining and implementing your own policies.
