# Chapter 8: Schemas in Pola Policies

## 8.1 Understanding and Defining Schemas

Schemas play a crucial role in the Agsiri Pola policy framework by ensuring that the data used in policy evaluations adheres to predefined structures and validation rules. By defining schemas for principal and resource attributes, you can enforce consistency, validate incoming data, and maintain a standardized approach to policy management across your organization.

### The Role of Schemas in Data Validation Within Policies

In the context of Pola policies, schemas are used to define the expected structure, data types, and validation rules for the attributes associated with principals (e.g., users, roles) and resources (e.g., files, databases). This ensures that any data passed to the policy engine is consistent and conforms to the required standards, thereby reducing the likelihood of errors and improving the predictability of policy outcomes.

Schemas serve several key purposes:

- **Consistency**: By enforcing schemas, you ensure that data structures are consistent across different policies, making it easier to manage and update policies as your system evolves.
- **Validation**: Schemas provide a mechanism for validating incoming requests against predefined rules, allowing you to catch and address errors before they affect policy decisions.
- **Portability**: Schemas standardize data formats, making it easier to migrate policies between different environments or systems without encountering data compatibility issues.
- **Documentation**: Schemas act as a form of documentation, clearly defining the data structures expected by your policies. This makes it easier for developers and administrators to understand and work with your policies.

### Examples of Defining and Using Schemas in Resource Policies

Defining schemas in Pola policies involves creating JSON Schema documents that describe the structure and validation rules for your data. These schemas can then be referenced in your resource policies to ensure that incoming data is validated before it is used in policy evaluations.

**Example 1: Defining a Basic Schema for a Customer Resource**

Consider a scenario where you need to define a schema for a customer resource that includes information such as the customer's name, email address, and shipping address. Here’s how you might define this schema:

**Customer Schema (`customer.json`):**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "first_name": { "type": "string" },
    "last_name": { "type": "string" },
    "email": {
      "type": "string",
      "format": "email"
    },
    "shipping_address": {
      "type": "object",
      "properties": {
        "street": { "type": "string" },
        "city": { "type": "string" },
        "state": { "type": "string" },
        "postal_code": { "type": "string" }
      },
      "required": ["street", "city", "state", "postal_code"]
    }
  },
  "required": ["first_name", "last_name", "email", "shipping_address"]
}
```

**Explanation:**

- **Basic Structure**: The schema defines a customer object with properties for the customer's first name, last name, email, and shipping address. Each property is associated with a specific data type (e.g., string, object).
- **Validation Rules**: The schema includes validation rules such as requiring the email to be in a valid email format and mandating that all specified fields are present in the data.

Once the schema is defined, it can be referenced in a resource policy to validate any customer data passed to the policy engine.

**Example 2: Using a Schema in a Resource Policy**

Consider a resource policy that applies to customer data. The policy might require that any customer data passed to it is validated against the `customer.json` schema:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "customer:data",
    "schemas": {
      "resourceSchema": {
        "ref": "agsiri:///customer.json"
      }
    },
    "rules": [
      {
        "actions": ["create", "update"],
        "effect": "EFFECT_ALLOW",
        "roles": ["admin"]
      },
      {
        "actions": ["view"],
        "effect": "EFFECT_ALLOW",
        "roles": ["employee"],
        "condition": {
          "match": {
            "expr": "P.attr.department == 'Sales'"
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

**Explanation:**

- **Schema Reference**: The `resourceSchema` field in the policy references the `customer.json` schema, ensuring that any customer data passed in requests is validated against this schema.
- **Rules**: The policy includes rules that allow administrators to create and update customer data, and allows employees in the Sales department to view customer data.

This approach ensures that only valid customer data is processed by the policy, reducing the risk of errors and inconsistencies.

### Modular and Reusable Schemas

One of the key benefits of using JSON Schema in Pola policies is the ability to create modular and reusable schemas. By defining common data structures (e.g., addresses, contact information) in separate schema files, you can reference these schemas across multiple policies, reducing duplication and making your policies easier to maintain.

**Example 3: Modular Schema for Addresses**

Suppose you have a common address structure used across multiple resource types (e.g., customers, vendors). Instead of repeating the address schema in each resource schema, you can define it once and reference it as needed:

**Address Schema (`address.json`):**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "street": { "type": "string" },
    "city": { "type": "string" },
    "state": { "type": "string" },
    "postal_code": { "type": "string" }
  },
  "required": ["street", "city", "state", "postal_code"]
}
```

You can then reference this address schema in other schemas:

**Vendor Schema (`vendor.json`):**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "vendor_name": { "type": "string" },
    "contact_number": { "type": "string" },
    "address": { "$ref": "agsiri:///address.json" }
  },
  "required": ["vendor_name", "contact_number", "address"]
}
```

**Explanation:**

- **Reusability**: The `vendor.json` schema references the `address.json` schema for the `address` property, ensuring that the same address structure is used consistently across different resource types.

This modular approach simplifies schema management and ensures consistency across your policies.

### Enforcing and Validating Schemas

Once schemas are defined, they can be enforced within your policies by associating them with specific resource types. Agsiri Pola provides mechanisms for validating incoming data against these schemas, allowing you to catch errors early and enforce data standards across your system.

**Example 4: Enforcing Schema Validation**

Consider a resource policy for a project management system that requires strict validation of project data:

```json
{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "version": "1.0",
    "resource": "project:data",
    "schemas": {
      "resourceSchema": {
        "ref": "agsiri:///project.json"
      }
    },
    "rules": [
      {
        "actions": ["create", "update"],
        "effect": "EFFECT_ALLOW",
        "roles": ["project_manager"],
        "condition": {
          "match": {
            "expr": "P.attr.department == 'Project Management'"
          }
        }
      }
    ],
    "schemaEnforcementLevel": "reject"
  },
  "auditInfo": {
    "createdBy": "pm_admin",
    "createdAt": "2024-08-19T14:00:00Z"
  }
}
```

**Explanation:**

- **Strict Enforcement**: The `schemaEnforcementLevel` is set to `reject`, meaning that any request that does not conform to the `project.json` schema will be denied outright.
- **Conditional Access**: The policy only allows project managers in the Project Management department to create or update project data, ensuring that data is managed by the appropriate personnel.

## 8.2 Schema Management

Schema management is a critical aspect of maintaining a robust and scalable policy framework in Agsiri Pola. As your system evolves, you may need to update schemas, reference them across multiple policies, or handle schema versioning. Effective schema management practices help ensure that your policies remain consistent, maintainable, and aligned with your organization's data standards.

### Best Practices for Maintaining and Referencing Schemas Across Policies

1. **Modular Schema Design**

   - **Modularity**: Design your schemas to be modular and reusable. Define common data structures (e.g., addresses, contact information, identifiers) in separate schema files and reference them across multiple policies. This reduces duplication and simplifies updates.
   - **Example**: The address schema in the previous section is an example of a modular schema that can be reused across different resource types.

2. **Schema Versioning**

   - **Versioning**: When updating schemas, use versioning to manage changes. This ensures that

 existing policies continue to work with the older schema versions, while new policies can adopt the updated schemas.
   - **Example**: If you need to update the `customer.json` schema to include a new field (e.g., `phone_number`), create a new version (`customer_v2.json`) and update the policies that need the new field accordingly.

   **Customer Schema Version 2 (`customer_v2.json`):**

   ```json
   {
     "$schema": "https://json-schema.org/draft/2020-12/schema",
     "type": "object",
     "properties": {
       "first_name": { "type": "string" },
       "last_name": { "type": "string" },
       "email": {
         "type": "string",
         "format": "email"
       },
       "phone_number": { "type": "string" },
       "shipping_address": {
         "type": "object",
         "properties": {
           "street": { "type": "string" },
           "city": { "type": "string" },
           "state": { "type": "string" },
           "postal_code": { "type": "string" }
         },
         "required": ["street", "city", "state", "postal_code"]
       }
     },
     "required": ["first_name", "last_name", "email", "shipping_address", "phone_number"]
   }
   ```

   - **Backward Compatibility**: Ensure that your system can handle requests that conform to older schema versions. This may involve maintaining multiple versions of schemas and policies that reference them.

3. **Centralized Schema Storage**

   - **Centralization**: Store your schemas in a centralized location that is easily accessible to all relevant policies. In Agsiri Pola, this is typically the `_schemas` directory in your storage system.
   - **Example**: If you are using a Git-based storage driver, ensure that all schemas are stored in a dedicated branch or directory, making it easy to reference and manage them across different environments.

4. **Schema Documentation**

   - **Documentation**: Document your schemas thoroughly, including explanations of each field, validation rules, and examples of valid data. This documentation is invaluable for developers and administrators who need to understand and work with your schemas.
   - **Example**: Create a Markdown file for each schema that explains its purpose, the data structures it defines, and how it should be used in policies.

   **Customer Schema Documentation (`customer.md`):**

   ```markdown
   # Customer Schema Documentation

   ## Overview

   The `customer.json` schema defines the structure and validation rules for customer data in our system. It includes fields for the customer's name, email, and shipping address.

   ## Fields

   - **first_name**: The customer's first name (string, required).
   - **last_name**: The customer's last name (string, required).
   - **email**: The customer's email address (string, required, must be in email format).
   - **shipping_address**: The customer's shipping address (object, required).
     - **street**: The street address (string, required).
     - **city**: The city (string, required).
     - **state**: The state (string, required).
     - **postal_code**: The postal code (string, required).

   ## Usage

   This schema is used in the `customer:data` resource policy to validate customer data before it is processed.
   ```

5. **Testing and Validation**

   - **Testing**: Before deploying schemas in a production environment, thoroughly test them with sample data to ensure they work as expected. This includes validating the schemas against various data scenarios, including edge cases.
   - **Example**: Use tools like `ajv-cli` or online JSON Schema validators to test your schemas with sample data.

6. **Automated Schema Validation**

   - **Automation**: Implement automated validation of schemas during the CI/CD process. This ensures that any changes to schemas are automatically validated before they are deployed, reducing the risk of introducing errors.
   - **Example**: Set up a CI pipeline that runs schema validation tests whenever a schema file is modified.

   **CI Pipeline Example (GitHub Actions):**

   ```yaml
   name: Schema Validation

   on:
     push:
       paths:
         - '_schemas/**.json'

   jobs:
     validate-schemas:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Install Dependencies
           run: npm install ajv-cli -g
         - name: Validate Schemas
           run: ajv validate -s _schemas/customer.json -d examples/customer_data.json
   ```

   - **Error Reporting**: Configure the CI pipeline to report any schema validation errors, allowing developers to address issues before the changes are merged or deployed.

7. **Version Control for Schemas**

   - **Version Control**: Use version control systems (e.g., Git) to manage changes to your schemas. This allows you to track changes over time, revert to previous versions if necessary, and collaborate with other developers.
   - **Example**: Store your schemas in a dedicated Git repository, with clear commit messages describing each change.

   **Commit Message Example:**

   ```
   Updated customer schema to include phone_number field (v2)
   ```

8. **Handling Deprecation**

   - **Deprecation Strategy**: When deprecating a schema or schema version, communicate the changes clearly to all stakeholders and provide a migration path for policies that rely on the deprecated schema.
   - **Example**: If you plan to deprecate `customer.json` in favor of `customer_v2.json`, provide documentation and tools to help administrators update their policies accordingly.

9. **Schema Governance**

   - **Governance**: Establish a governance framework for managing schemas across your organization. This includes defining roles and responsibilities for schema creation, review, and approval.
   - **Example**: Create a schema review board that meets regularly to review new schema proposals and approve changes to existing schemas.

10. **Continuous Improvement**

    - **Iterative Improvement**: Continuously refine and improve your schemas based on feedback from users, developers, and administrators. As your system evolves, ensure that your schemas evolve with it to meet new requirements and challenges.
    - **Example**: Set up regular review sessions with stakeholders to gather feedback on your schemas and identify areas for improvement.

# Conclusion

Schemas are a foundational element of the Agsiri Pola policy framework, providing the structure and validation necessary to ensure that your policies are consistent, reliable, and maintainable. By understanding how to define, manage, and enforce schemas effectively, you can create a robust policy environment that supports your organization's goals and adapts to changing requirements.

This chapter has provided an in-depth exploration of Pola Schemas, from the basics of schema definition and validation to advanced management practices. By following the best practices outlined here and leveraging the full capabilities of JSON Schema, you can build powerful and flexible policies that meet the complex needs of modern applications.

With the examples and guidelines provided, you are now equipped to start defining and implementing your own schemas, ensuring that your policies are built on a solid foundation of validated and consistent data.
