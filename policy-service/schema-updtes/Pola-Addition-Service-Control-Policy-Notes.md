# Service Control Policies

## Introduction
In the evolving landscape of enterprise IT and cloud computing, the need for precise and robust access control mechanisms is more critical than ever. Service Control Policies (SCPs) emerge as a vital tool in this context, offering a powerful and flexible approach to managing permissions and ensuring security across complex systems. Here's why SCPs are so important and how they contribute to a modern, policy-driven application design:

### 1. **Centralized Control Over Permissions**

SCPs provide a centralized mechanism to define and enforce the maximum permissions that can be granted to any user, group, role, or resource within an organization. Unlike traditional policies, which may be scattered across various entities and services, SCPs allow organizations to impose a consistent and overarching set of rules that govern access across the board. This centralized control simplifies policy management and ensures that critical security constraints are uniformly applied, reducing the risk of misconfigurations and vulnerabilities.

### 2. **Granular Access Management**

One of the most powerful features of SCPs is their ability to offer granular control over what actions can be performed by whom, on what resources. By defining the upper limits of permissions, SCPs prevent unauthorized or risky actions that could compromise the security of the system. This granular control is especially important in environments where multiple users or services interact with sensitive data or critical infrastructure, ensuring that access is tightly regulated and aligned with the organization’s security policies.

### 3. **Scalability and Flexibility in Policy Enforcement**

As organizations grow, their IT environments become increasingly complex, with multiple services, applications, and users interacting across different platforms. SCPs are designed to scale with this complexity, providing a flexible framework that can adapt to the needs of large, distributed systems. Whether deployed in cloud environments, on-premises, or in hybrid setups, SCPs can be easily integrated and applied across different contexts, ensuring consistent policy enforcement regardless of the scale or complexity of the environment.

### 4. **Enhanced Security and Compliance**

In today's regulatory environment, compliance with data protection and security standards is not just a best practice—it's a legal requirement. SCPs play a crucial role in helping organizations meet these compliance obligations by enforcing strict access controls that align with industry standards and regulations. By limiting permissions to only what is necessary, SCPs help minimize the attack surface, reduce the likelihood of data breaches, and ensure that sensitive information is protected according to the highest security standards.

### 5. **Simplified Policy Management**

Managing permissions across a large organization can be a daunting task, particularly when different teams or departments have varying access needs. SCPs simplify this process by allowing administrators to define high-level policies that automatically apply to all relevant entities within the system. This not only reduces the administrative overhead associated with managing individual permissions but also ensures that policies are consistently applied, reducing the risk of human error.

### 6. **Future-Proofing Applications**

As the IT landscape continues to evolve, so too do the threats and challenges associated with managing access and security. SCPs provide a future-proof solution that can adapt to new technologies, platforms, and security requirements. By defining broad, yet flexible, policies that can be updated and expanded as needed, SCPs ensure that organizations are always prepared to meet the demands of the future, without the need for a complete overhaul of their security and access management infrastructure.

### 7. **Support for Modern, Policy-Driven Architectures**

In a modern, policy-driven architecture, SCPs act as the foundation upon which all other policies are built. They provide a clear, enforceable framework that defines the boundaries within which all other policies must operate. This makes it easier to develop, deploy, and manage applications in a way that is secure by design, with policies that are both coherent and aligned with the organization's overall security strategy. SCPs enable organizations to build applications that are not only functional but also resilient to threats and compliant with security best practices.

## 1. **Schema Definition for Service Control Policy**

We'll integrate the SCP directly into the existing policy schema by adding a new `serviceControlPolicy` field. This field will hold the SCP configuration and will be treated similarly to other policy types such as `principalPolicy`, `resourcePolicy`, etc.

### **Updated Policy Schema**

Here is how the schema would look with the inclusion of SCP:

```json
{
  "$id": "https://api.pola.dev/v2.3/agsiri/policy/v2.3/policy.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "pola.policy.v2.3.Condition": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.Match": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.Match.ExprList": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.Metadata": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.Output": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.Output.When": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.Notify": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.Notify.When": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.EventPolicy": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.Schemas.Schema": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.Schemas.IgnoreWhen": { /*... existing definitions ...*/ },
    "pola.policy.v2.3.AuditInfo": { /*... existing definitions ...*/ },
    
    "pola.policy.v2.3.ServiceControlPolicy": {
      "type": "object",
      "required": [
        "maxPermissions",
        "version"
      ],
      "additionalProperties": false,
      "properties": {
        "maxPermissions": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1
        },
        "boundEntities": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "users": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "groups": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "roles": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            },
            "resources": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uuid"
              }
            }
          }
        },
        "version": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)*$"
        },
        "auditInfo": {
          "$ref": "#/definitions/pola.policy.v2.3.AuditInfo"
        }
      }
    }
  },
  "allOf": [
    {
      "type": "object",
      "required": [
        "apiVersion"
      ],
      "additionalProperties": false,
      "properties": {
        "$schema": {
          "type": "string"
        },
        "apiVersion": {
          "type": "string",
          "const": "api.pola.dev/v2.3"
        },
        "derivedRoles": {
          "$ref": "#/definitions/pola.policy.v2.3.DerivedRoles"
        },
        "description": {
          "type": "string"
        },
        "name": {
          "type": "string",
          "pattern": "^[\\-\\.0-9A-Z_a-z]+$"
        },
        "disabled": {
          "type": "boolean"
        },
        "exportVariables": {
          "$ref": "#/definitions/pola.policy.v2.3.ExportVariables"
        },
        "metadata": {
          "$ref": "#/definitions/pola.policy.v2.3.Metadata"
        },
        "principalPolicy": {
          "$ref": "#/definitions/pola.policy.v2.3.PrincipalPolicy"
        },
        "resourcePolicy": {
          "$ref": "#/definitions/pola.policy.v2.3.ResourcePolicy"
        },
        "rolePolicy": {
          "$ref": "#/definitions/pola.policy.v2.3.RolePolicy"
        },
        "groupPolicy": {
          "$ref": "#/definitions/pola.policy.v2.3.GroupPolicy"
        },
        "eventPolicy": {
          "$ref": "#/definitions/pola.policy.v2.3.EventPolicy"
        },
        "serviceControlPolicy": {
          "$ref": "#/definitions/pola.policy.v2.3.ServiceControlPolicy"
        },
        "auditInfo": {
          "$ref": "#/definitions/pola.policy.v2.3.AuditInfo"
        },
        "variables": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      }
    },
    {
      "oneOf": [
        {
          "type": "object",
          "required": [
            "resourcePolicy"
          ]
        },
        {
          "type": "object",
          "required": [
            "principalPolicy"
          ]
        },
        {
          "type": "object",
          "required": [
            "rolePolicy"
          ]
        },
        {
          "type": "object",
          "required": [
            "groupPolicy"
          ]
        },
        {
          "type": "object",
          "required": [
            "derivedRoles"
          ]
        },
        {
          "type": "object",
          "required": [
            "exportVariables"
          ]
        },
        {
          "type": "object",
          "required": [
            "eventPolicy"
          ]
        },
        {
          "type": "object",
          "required": [
            "serviceControlPolicy"
          ]
        }
      ]
    }
  ]
}
```

## 2. **Understanding the Updated Schema**

### **New Properties:**
- **`serviceControlPolicy`**: This property has been introduced to define the rules and constraints that SCPs will impose. It includes:
  - **`maxPermissions`**: An array that defines the maximum allowed actions.
  - **`boundEntities`**: Specifies which users, groups, roles, or resources the SCP is applied to.
  - **`version`**: The version of the SCP.
  - **`auditInfo`**: To track the creation and updates of the SCP.

### **Schema Structure:**
- The schema enforces that at least one policy type is defined (`resourcePolicy`, `principalPolicy`, `rolePolicy`, `groupPolicy`, `serviceControlPolicy`, etc.).
- **`serviceControlPolicy`** is treated as a first-class citizen alongside other policy types like `principalPolicy`, `resourcePolicy`, etc.

## 3. **Binding Scenarios**

### **User-Level SCPs:**
- These SCPs restrict actions that a specific user can perform, regardless of other policies.
- Bound by adding user `ObjectId` to `boundEntities.users`.

### **Group-Level SCPs:**
- SCPs can apply to all users within a group, restricting the group’s maximum permissions.
- Bound by adding group `ObjectId` to `boundEntities.groups`.

### **Role-Level SCPs:**
- SCPs limit the maximum permissions of all users assigned a specific role.
- Bound by adding role `ObjectId` to `boundEntities.roles`.

### **Resource-Level SCPs:**
- SCPs that restrict actions on specific resources, ensuring that the resource remains protected regardless of the requesting entity’s permissions.
- Bound by adding resource `ObjectId` to `boundEntities.resources`.

## 4. **Handling SCPs in Policy Aggregation**

SCPs must be integrated into the policy aggregation process to ensure that no entity exceeds the permissions defined by the SCPs. Below is how you might modify the policy aggregation logic:

```typescript
async aggregatePolicies(principalId: mongoose.Types.ObjectId): Promise<any[]> {
    const policies = [];

    console.log(`Starting policy aggregation for principalId: ${principalId}`);

    // Resolve groups for the principal
    const groups = await this.membershipResolver.resolvePrincipalGroups(principalId);
    console.log(`Resolved groups for principalId ${principalId}:`, groups);

    // Resolve roles for the principal
    const roles = await this.membershipResolver.resolvePrincipalRoles(principalId);
    console.log(`Resolved roles for principalId ${principalId}:`, roles);

    // Resolve policies for the principal
    const principalPolicies = await this.membershipResolver.resolvePrincipalPolicies(principalId);
    console.log(`Resolved principal policies for principalId ${principalId}:`, principalPolicies);

    if (principalPolicies.length > 0) {
        console.log(`Adding ${principalPolicies.length} principal policies to aggregation`);
        policies.push(...principalPolicies);
    } else {
        console.log(`No principal policies found for principalId ${principalId}`);
    }

    // Resolve policies associated with groups
    for (const groupId of groups

) {
        console.log(`Looking up policies for groupId: ${groupId}`);
        const groupPolicies = await PolicyModel.find({ 'groupPolicy.group': groupId });
        if (groupPolicies.length > 0) {
            console.log(`Adding ${groupPolicies.length} group policies for groupId ${groupId} to aggregation`);
            policies.push(...groupPolicies);
        } else {
            console.log(`No group policies found for groupId ${groupId}`);
        }
    }

    // Resolve policies associated with roles
    for (const roleId of roles) {
        console.log(`Looking up policies for roleId: ${roleId}`);
        const rolePolicies = await PolicyModel.find({ 'rolePolicy.role': roleId });
        if (rolePolicies.length > 0) {
            console.log(`Adding ${rolePolicies.length} role policies for roleId ${roleId} to aggregation`);
            policies.push(...rolePolicies);
        } else {
            console.log(`No role policies found for roleId ${roleId}`);
        }
    }

    // Resolve Service Control Policies (SCPs)
    const scps = await PolicyModel.find({
        $or: [
            { 'serviceControlPolicy.boundEntities.users': principalId },
            { 'serviceControlPolicy.boundEntities.groups': { $in: groups } },
            { 'serviceControlPolicy.boundEntities.roles': { $in: roles } }
        ]
    }).exec();

    if (scps.length > 0) {
        console.log(`Found ${scps.length} SCPs applicable to principalId ${principalId}`);
        // Apply SCPs to restrict the aggregated policies
        policies.forEach(policy => {
            scps.forEach(scp => {
                policy.maxPermissions = policy.maxPermissions.filter(permission => scp.serviceControlPolicy.maxPermissions.includes(permission));
            });
        });
    } else {
        console.log(`No SCPs found for principalId ${principalId}`);
    }

    console.log(`Completed policy aggregation for principalId ${principalId}. Total policies found: ${policies.length}`);
    return policies;
}
```

## Conclusion

By integrating SCPs into the Pola schema and making them part of the same collection as other policies, you gain a powerful tool for enforcing maximum permission limits across various entities. SCPs can be bound to users, groups, roles, and resources, providing fine-grained control over what actions are permissible, regardless of other policies that might grant broader permissions. This approach ensures that your security and compliance needs are consistently met across your infrastructure.
