# User Stories and Scenarios

## Introduction

This section provides a set of detailed user stories and scenarios to guide the implementation and evaluation of security policies within the Agsiri ecosystem. Each user story is followed by corresponding scenarios that describe the expected behavior of the system based on the policies defined earlier.

---

## User Story 1: Admin Managing Data Room Access

### Story

As an **Admin**, I want to have full control over all resources within the data rooms, including the ability to view, edit, manage, and archive data rooms, cabinets, and files, so that I can ensure the security and organization of the data.

### Scenarios

- **Scenario 1.1: Admin viewing a data room.**
  ```yaml
  - scenarioId: 1
    description: "Admin viewing a data room."
    user:
      attr:
        role: "Admin"
    resource:
      attr:
        status: "active"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "view"
  ```
  **Expected Outcome**: Allowed, as the Admin role grants full access to data rooms.

- **Scenario 1.2: Admin editing a file within a data room.**
  ```yaml
  - scenarioId: 2
    description: "Admin editing a file within a data room."
    user:
      attr:
        role: "Admin"
    resource:
      attr:
        type: "file"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "edit"
  ```
  **Expected Outcome**: Allowed, as the Admin role includes edit permissions on all files.

- **Scenario 1.3: Admin archiving a data room.**
  ```yaml
  - scenarioId: 3
    description: "Admin archiving a data room."
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
  **Expected Outcome**: Allowed, as only Admins are permitted to archive resources.

---

## User Story 2: Compliance Manager Monitoring Data Room Activities

### Story

As a **Compliance Manager**, I need to monitor all activities within the data rooms to ensure compliance with internal policies and external regulations, but I should not be able to modify any data.

### Scenarios

- **Scenario 2.1: Compliance Manager viewing monitoring logs.**
  ```yaml
  - scenarioId: 4
    description: "Compliance Manager viewing monitoring logs."
    user:
      attr:
        role: "ComplianceManager"
    resource:
      attr:
        type: "log"
        tags: ["monitor"]
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "view"
  ```
  **Expected Outcome**: Allowed, as the Compliance Manager role permits viewing monitoring logs.

- **Scenario 2.2: Compliance Manager attempting to edit a data room.**
  ```yaml
  - scenarioId: 5
    description: "Compliance Manager attempting to edit a data room."
    user:
      attr:
        role: "ComplianceManager"
    resource:
      attr:
        status: "active"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "edit"
  ```
  **Expected Outcome**: Denied, as the Compliance Manager role does not include edit permissions.

---

## User Story 3: Farm Manager Managing Files in the Data Room

### Story

As a **Farm Manager**, I want to manage files within specific data rooms to ensure that the data related to farm operations is accurate and up to date.

### Scenarios

- **Scenario 3.1: Farm Manager viewing a file in the data room.**
  ```yaml
  - scenarioId: 6
    description: "Farm Manager viewing a file in the data room."
    user:
      attr:
        role: "FarmManager"
    resource:
      attr:
        type: "file"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "view"
  ```
  **Expected Outcome**: Allowed, as the Farm Manager role includes view permissions on files.

- **Scenario 3.2: Farm Manager editing a file in the data room.**
  ```yaml
  - scenarioId: 7
    description: "Farm Manager editing a file in the data room."
    user:
      attr:
        role: "FarmManager"
    resource:
      attr:
        type: "file"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "edit"
  ```
  **Expected Outcome**: Allowed, as the Farm Manager role includes edit permissions on files.

- **Scenario 3.3: Farm Manager attempting to archive a data room.**
  ```yaml
  - scenarioId: 8
    description: "Farm Manager attempting to archive a data room."
    user:
      attr:
        role: "FarmManager"
    resource:
      attr:
        status: "active"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "archive"
  ```
  **Expected Outcome**: Denied, as only Admins are permitted to archive resources.

---

## User Story 4: Investor Viewing Offerings in the Data Room

### Story

As an **Investor**, I want to view available offerings within data rooms to evaluate potential investment opportunities.

### Scenarios

- **Scenario 4.1: Investor viewing a public offering in the data room.**
  ```yaml
  - scenarioId: 9
    description: "Investor viewing a public offering in the data room."
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
  **Expected Outcome**: Allowed, as the Investor role permits viewing public offerings.

- **Scenario 4.2: Investor attempting to edit an offering in the data room.**
  ```yaml
  - scenarioId: 10
    description: "Investor attempting to edit an offering in the data room."
    user:
      attr:
        role: "Investor"
    resource:
      attr:
        visibility: "public"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "edit"
  ```
  **Expected Outcome**: Denied, as the Investor role does not include edit permissions on offerings.

---

## User Story 5: Buyer Assessing Farm Listings in the Data Room

### Story

As a **Buyer**, I want to assess farm listings within data rooms to make informed purchasing decisions.

### Scenarios

- **Scenario 5.1: Buyer viewing a farm listing in the data room.**
  ```yaml
  - scenarioId: 11
    description: "Buyer viewing a farm listing in the data room."
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
  **Expected Outcome**: Allowed, as the Buyer role permits viewing farm listings.

- **Scenario 5.2: Buyer attempting to manage a farm listing in the data room.**
  ```yaml
  - scenarioId: 12
    description: "Buyer attempting to manage a farm listing in the data room."
    user:
      attr:
        role: "Buyer"
    resource:
      attr:
        category: "farm"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "manage"
  ```
  **Expected Outcome**: Denied, as the Buyer role does not include management permissions.

---

## User Story 6: Campaign Manager Launching Campaigns from the Data Room

### Story

As a **Campaign Manager**, I want to launch marketing campaigns from data rooms to promote various offerings and properties.

### Scenarios

- **Scenario 6.1: Campaign Manager launching a campaign from a data room.**
  ```yaml
  - scenarioId: 13
    description: "Campaign Manager launching a campaign from a data room."
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

- **Scenario 6.2: Campaign Manager viewing campaign data in the data room.**
  ```yaml
  - scenarioId: 14
    description: "Campaign Manager viewing campaign data in the data room."
    user:
      attr:
        role: "CampaignManager"
    resource:
      attr:
        type: "campaign"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "view"
  ```
  **Expected Outcome**: Allowed, as the Campaign Manager role includes view permissions on campaign data.

---

## User Story 7: Farm SME Conducting ESG Assessments in the Data Room

### Story

As a **Farm SME

**, I need to conduct ESG (Environmental, Social, and Governance) assessments within data rooms to evaluate farm operations and compliance.

### Scenarios

- **Scenario 7.1: Farm SME conducting an ESG assessment in the data room.**
  ```yaml
  - scenarioId: 15
    description: "Farm SME conducting an ESG assessment in the data room."
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

- **Scenario 7.2: Farm SME managing ESG assessment data in the data room.**
  ```yaml
  - scenarioId: 16
    description: "Farm SME managing ESG assessment data in the data room."
    user:
      attr:
        role: "FarmSME"
    resource:
      attr:
        status: "under review"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "manage"
  ```
  **Expected Outcome**: Allowed, as the Farm SME role includes management permissions for assessment data.

---

## User Story 8: External User Accessing Public Resources

### Story

As an **External User**, I want to access only the resources that are explicitly marked for external access to ensure data security and integrity.

### Scenarios

- **Scenario 8.1: External user viewing a public resource.**
  ```yaml
  - scenarioId: 17
    description: "External user viewing a public resource."
    user:
      attr:
        role: "ExternalUser"
    resource:
      attr:
        visibility: "public"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "view"
  ```
  **Expected Outcome**: Allowed, as the resource is public and the External User role permits viewing public resources.

- **Scenario 8.2: External user attempting to edit a public resource.**
  ```yaml
  - scenarioId: 18
    description: "External user attempting to edit a public resource."
    user:
      attr:
        role: "ExternalUser"
    resource:
      attr:
        visibility: "public"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "edit"
  ```
  **Expected Outcome**: Denied, as the External User role does not include edit permissions.

---

## User Story 9: Temporary User with Time-Limited Access

### Story

As a **Temporary User**, I need to access certain resources within a specific time window, after which my access should be revoked to maintain security.

### Scenarios

- **Scenario 9.1: Temporary user accessing a resource within the allowed time.**
  ```yaml
  - scenarioId: 19
    description: "Temporary user accessing a resource within the allowed time."
    user:
      attr:
        role: "TemporaryUser"
        accessExpiry: "2024-08-25T00:00:00Z"
    resource:
      attr:
        status: "active"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "access"
  ```
  **Expected Outcome**: Allowed, as the Temporary User role is active and within the allowed time frame.

- **Scenario 9.2: Temporary user attempting to access a resource after the expiry time.**
  ```yaml
  - scenarioId: 20
    description: "Temporary user attempting to access a resource after the expiry time."
    user:
      attr:
        role: "TemporaryUser"
        accessExpiry: "2024-08-15T00:00:00Z"
    resource:
      attr:
        status: "active"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "access"
  ```
  **Expected Outcome**: Denied, as the Temporary User role has expired and access should be revoked.

---

## User Story 10: VIP User with Special Access Privileges

### Story

As a **VIP User**, I want to have special access privileges that allow me to bypass certain restrictions, provided my VIP status is active.

### Scenarios

- **Scenario 10.1: VIP user accessing a restricted resource.**
  ```yaml
  - scenarioId: 21
    description: "VIP user accessing a restricted resource."
    user:
      attr:
        role: "VIPUser"
        vipStatus: "active"
    resource:
      attr:
        status: "restricted"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "access"
  ```
  **Expected Outcome**: Allowed, as the VIP User role grants special access privileges when VIP status is active.

- **Scenario 10.2: VIP user attempting to access a restricted resource with inactive VIP status.**
  ```yaml
  - scenarioId: 22
    description: "VIP user attempting to access a restricted resource with inactive VIP status."
    user:
      attr:
        role: "VIPUser"
        vipStatus: "inactive"
    resource:
      attr:
        status: "restricted"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "access"
  ```
  **Expected Outcome**: Denied, as the VIP status is inactive, and access should be restricted.

---

## User Story 11: Contributor Managing Their Authored Content

### Story

As a **Contributor**, I want to manage the content I have authored, ensuring that only I have edit access to it while others can only view it.

### Scenarios

- **Scenario 11.1: Contributor editing their authored content.**
  ```yaml
  - scenarioId: 23
    description: "Contributor editing their authored content."
    user:
      attr:
        role: "Contributor"
        id: "user123"
    resource:
      attr:
        authorId: "user123"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "edit"
  ```
  **Expected Outcome**: Allowed, as the Contributor role includes edit permissions for content they authored.

- **Scenario 11.2: Contributor attempting to edit content authored by another user.**
  ```yaml
  - scenarioId: 24
    description: "Contributor attempting to edit content authored by another user."
    user:
      attr:
        role: "Contributor"
        id: "user123"
    resource:
      attr:
        authorId: "user456"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "edit"
  ```
  **Expected Outcome**: Denied, as the Contributor role does not allow editing content authored by others.

---

## User Story 12: Manager Accessing Department-Specific Resources

### Story

As a **Manager**, I want to access and manage resources specific to my department, ensuring that I can perform necessary tasks while maintaining control over departmental data.

### Scenarios

- **Scenario 12.1: Manager managing resources within their department.**
  ```yaml
  - scenarioId: 25
    description: "Manager managing resources within their department."
    user:
      attr:
        role: "Manager"
        department: "Sales"
    resource:
      attr:
        department: "Sales"
        status: "active"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "manage"
  ```
  **Expected Outcome**: Allowed, as the Manager role includes management permissions for resources within their department.

- **Scenario 12.2: Manager attempting to manage resources outside their department.**
  ```yaml
  - scenarioId: 26
    description: "Manager attempting to manage resources outside their department."
    user:
      attr:
        role: "Manager"
        department: "Sales"
    resource:
      attr:
        department: "Marketing"
        status: "active"
    context:
      currentTime: "2024-08-20T12:00:00Z"
    action: "manage"
  ```
  **Expected Outcome**: Denied, as the Manager role does not include management permissions for resources outside their department.

---

These detailed user stories and scenarios provide a comprehensive guide for implementing and validating the policy evaluation engine within the Agsiri ecosystem. Each scenario is crafted to test specific aspects of the policy framework, ensuring that the system behaves as expected under various conditions and user roles.
