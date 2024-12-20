# Integration of Agsiri Policy Engine with Data Room Service

## Overview
The Agsiri Policy Engine provides robust and granular access control for various resources within the Data Room Service. The service is designed to manage data rooms, cabinets, and files, each with comprehensive metadata. Different user roles have been defined to manage and interact with these resources. By integrating the Agsiri Policy Engine, we enforce access controls based on roles, resource attributes, and context, ensuring that only authorized users can interact with these resources.

## Data Room Service Components

1. **Data Rooms**: Secure locations where documents and files are stored, serving as the top-level container in the Data Room Service.
2. **Cabinets**: Organizational units within a data room used to group related files together.
3. **Files**: Individual documents or assets stored within cabinets, each with multiple versions and associated metadata.

### Metadata for Enhanced Access Control

- **Categories**: Organize data rooms, cabinets, and files by logical groupings.
- **Tags**: Keywords associated with resources for easy search and filtering.
- **Custom Attributes**: Flexible metadata fields tailored to specific organizational needs.
- **Audit Logs**: Track all actions performed on resources for compliance and auditing.

## User Roles and Access Requirements

### 1. Administrator
**Role Description**: 
- **Responsibilities**: Manages platform operations, approves critical actions, and has extensive access to all parts of the system.
- **Critical Operations**: Requires 4-eyes approval to prevent unauthorized activities.

**Example Scenario**:
- **User Story**: As an administrator, I need to approve a large fund transfer initiated by another administrator to ensure there are no unauthorized activities.
- **Action**: Administrator A initiates the transfer of funds. Administrator B reviews and approves the transfer to complete the transaction.

**Resource-Level Policy**:
```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Admin Full Access"
description: "Administrators have full access to all data rooms, cabinets, and files."
resourcePolicy:
  resource: "ari:agsiri:dataroom:*"
  version: "1.0"
  rules:
    - actions: ["*"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### 2. Investor
**Role Description**:
- **Responsibilities**: Buys and sells farmland ownership units after completing an onboarding process.
- **Onboarding Process**: Must meet specific criteria and provide necessary documentation.

**Example Scenario**:
- **User Story**: As an investor, I want to review the available farmland units and invest in those that match my portfolio requirements.
- **Action**: The investor logs in, reviews the listings, and selects a farmland unit to invest in.

**Resource-Level Policy**:
```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Investor Access to Data Rooms"
description: "Investors can view data rooms related to their investments."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/*"
  version: "1.0"
  rules:
    - actions: ["view"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "P.attr.role == '\''investor'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### 3. Buyer
**Role Description**:
- **Responsibilities**: Purchases entire farmland or assets after completing a suitability assessment.
  
**Example Scenario**:
- **User Story**: As a buyer, I want to purchase a specific piece of farmland outright and need to complete a detailed suitability assessment.
- **Action**: The buyer undergoes a suitability assessment, reviews the farm's details, and completes the purchase.

**Resource-Level Policy**:
```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Buyer Access to Specific Data Rooms"
description: "Buyers can view and interact with data rooms associated with farmland assets they intend to purchase."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/farm-*"
  version: "1.0"
  rules:
    - actions: ["view", "download"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "P.attr.role == '\''buyer'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### 4. Seller
**Role Description**:
- **Responsibilities**: Lists farmland or assets for sale, provides necessary documentation.

**Example Scenario**:
- **User Story**: As a seller, I want to list my farmland on the platform to attract potential buyers.
- **Action**: The seller provides detailed information and documentation about the farmland, which is then listed on the platform.

**Resource-Level Policy**:
```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Seller Access to Own Data Rooms"
description: "Sellers can manage data rooms associated with their listed assets."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/*"
  version: "1.0"
  rules:
    - actions: ["view", "upload", "edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "P.attr.role == '\''seller'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### 5. Farm SME (Subject Matter Expert)
**Role Description**:
- **Responsibilities**: Provides expert analysis and due diligence on listed properties.

**Example Scenario**:
- **User Story**: As a farm SME, I need to perform due diligence on a newly listed property and provide my expert analysis.
- **Action**: The farm SME accesses the data room for the property, reviews the documents, and submits their analysis.

**Resource-Level Policy**:
```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Farm SME Access to Data Rooms"
description: "Farm SMEs can view and analyze data rooms associated with properties they are assessing."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/*"
  version: "1.0"
  rules:
    - actions: ["view", "analyze"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "P.attr.role == '\''farm_sme'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### 6. Farm Manager
**Role Description**:
- **Responsibilities**: Manages day-to-day farm operations and updates performance metrics.

**Example Scenario**:
- **User Story**: As a farm manager, I need to update the farm's daily operational metrics and view performance reports.
- **Action**: The farm manager logs in, updates the metrics, and reviews performance reports.

**Resource-Level Policy**:
```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Farm Manager Access to Operational Data"
description: "Farm Managers can update and view operational data in data rooms."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/*"
  version: "1.0"
  rules:
    - actions: ["view", "update"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "P.attr.role == '\''farm_manager'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### 7. Financial Analyst
**Role Description**:
- **Responsibilities**: Analyzes financial data, manages distributions, collaborates with accountants.

**Example Scenario**:
- **User Story**: As a financial analyst, I need to prepare a financial performance report for the last quarter and ensure distributions are correctly allocated.
- **Action**: The financial analyst analyzes the data, prepares the report, and coordinates with the accountant for distributions.

**Resource-Level Policy**:
```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Financial Analyst Access to Financial Data Rooms"
description: "Financial Analysts can view and analyze financial data in specific data rooms."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/financial-*"
  version: "1.0"
  rules:
    - actions: ["view", "analyze"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "P.attr.role == '\''financial_analyst'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### 8. Accountant
**Role Description**:
- **Responsibilities**: Manages day-to-day accounting activities, ensuring accurate financial records and compliance.

**Example Scenario**:
- **User Story**: As an

 accountant, I need to reconcile the financial statements and ensure all transactions are accurately recorded.
- **Action**: The accountant logs in, reviews the transactions, reconciles the statements, and updates the records.

**Resource-Level Policy**:
```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Accountant Access to Financial Data Rooms"
description: "Accountants can view, reconcile, and update financial records in data rooms."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/financial-*"
  version: "1.0"
  rules:
    - actions: ["view", "reconcile", "update"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "P.attr.role == '\''accountant'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### 9. Campaign Manager
**Role Description**:
- **Responsibilities**: Creates and monitors marketing campaigns, targets investor profiles.

**Example Scenario**:
- **User Story**: As a campaign manager, I want to launch a marketing campaign for a new offering and monitor its performance.
- **Action**: The campaign manager creates the campaign, targets specific investors based on their profiles, and tracks the campaign's performance.

**Resource-Level Policy**:
```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Campaign Manager Access to Investor Data Rooms"
description: "Campaign Managers can view and analyze investor data in data rooms for targeting campaigns."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/investor-*"
  version: "1.0"
  rules:
    - actions: ["view", "analyze"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "P.attr.role == '\''campaign_manager'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

## Principal-Level Policies

Principal-level policies grant or restrict access based on the user's role. These policies ensure that the actions allowed by the resource-level policies align with the user's responsibilities and context. Here are some examples of principal-level policies:

1. **Administrator Override**: 
   - Allows an administrator to override a specific action if a critical operation requires immediate attention.

```yaml
curl -X POST http://localhost:4000/api/principalPolicies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Admin Override"
description: "Administrators can override any policy if immediate attention is required."
principalPolicy:
  version: "1.0"
  rules:
    - actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "P.attr.role == '\''admin'\'' && context.requiresImmediateAction == true"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

2. **Investor Limited Access**:
   - Restricts investors from accessing certain highly confidential data rooms unless explicitly granted.

```yaml
curl -X POST http://localhost:4000/api/principalPolicies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Investor Limited Access"
description: "Investors are restricted from accessing certain highly confidential data rooms."
principalPolicy:
  version: "1.0"
  rules:
    - actions: ["view"]
      effect: "EFFECT_DENY"
      condition:
        match:
          all:
            - expr: "P.attr.role == '\''investor'\'' && resource.attr.classification == '\''Highly Confidential'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

## Conclusion

The integration of the Agsiri Policy Engine into the Data Room Service allows for precise and secure management of access to sensitive resources. The system enforces access controls based on detailed roles, resource attributes, and contextual conditions, ensuring compliance with organizational policies and regulatory requirements. The scenarios described showcase the engine's ability to handle a wide range of real-world situations, providing a flexible and scalable solution for managing access to critical data.
