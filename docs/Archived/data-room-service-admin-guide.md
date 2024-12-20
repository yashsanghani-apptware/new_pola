### Detailed Description of the Dataroom Service

#### Overview

The Dataroom Service in the Agsiri ecosystem provides secure, role-based access to data rooms, cabinets, and files. This service is designed to facilitate collaboration, secure storage, and controlled access to sensitive information. The Dataroom Service supports multiple roles, each with specific permissions, and uses a fine-grained access control model to enforce security policies.

The service includes several resources:

1. **Data Rooms**: These are top-level containers that hold cabinets and files. They are often used for storing collections of related documents and data.
2. **Cabinets**: Sub-containers within data rooms that can further organize files.
3. **Files**: Individual documents or data files stored within cabinets or directly within data rooms.

---

### Roles and Permissions

The following roles are defined for the Dataroom Service, each with specific permissions regarding data rooms, cabinets, and files:

#### 1. **Administrator**
   - **Role Description**: Administrators have full control over all data rooms, cabinets, and files. They can view, create, update, delete, manage, and archive resources.
   - **Permissions**:
     - Full access to all actions on data rooms, cabinets, and files.

#### 2. **Compliance Manager**
   - **Role Description**: Compliance Managers can monitor and view activities within data rooms to ensure compliance with regulations but cannot modify any data.
   - **Permissions**:
     - View and monitor data rooms, cabinets, and files.
     - No creation, deletion, or modification rights.

#### 3. **Farm Manager**
   - **Role Description**: Farm Managers manage files related to farm operations. They can view, edit, and manage files within specific data rooms assigned to their department.
   - **Permissions**:
     - View, edit, and manage files in their assigned data rooms and cabinets.

#### 4. **Investor**
   - **Role Description**: Investors can view offerings and related documents within data rooms to evaluate potential investments.
   - **Permissions**:
     - View access to offerings and related files.
     - No edit or manage rights.

#### 5. **Campaign Manager**
   - **Role Description**: Campaign Managers can launch and manage marketing campaigns stored in data rooms.
   - **Permissions**:
     - View, launch, and manage campaigns in data rooms.
     - View files related to campaigns.

#### 6. **Farm SME**
   - **Role Description**: Farm SMEs conduct ESG assessments and review reports within data rooms.
   - **Permissions**:
     - View and assess ESG assessments and reports.
     - No modification rights.

#### 7. **External User**
   - **Role Description**: External Users can view only those resources explicitly marked for external access.
   - **Permissions**:
     - View public and externally accessible files and data rooms.

#### 8. **Temporary User**
   - **Role Description**: Temporary Users have time-limited access to resources.
   - **Permissions**:
     - View and access resources within a specified time window.

#### 9. **VIP User**
   - **Role Description**: VIP Users have special access privileges to bypass certain restrictions.
   - **Permissions**:
     - Full access to restricted resources when VIP status is active.

#### 10. **Contributor**
   - **Role Description**: Contributors can edit and manage content they have authored within data rooms.
   - **Permissions**:
     - View and edit files they have authored.

---

### Resource-Level Policies for Dataroom Service

Based on the role descriptions and permissions outlined above, the following resource-level policies are defined to enforce access control within the Dataroom Service.

Certainly! Below are the corrected resource policies and principal policies in the proper YAML format and wrapped in the `curl` commands as requested.

### Resource Policies in `curl` Format

#### 1. **Admin Full Access Policy**

```bash
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

#### 2. **Compliance Manager View Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Compliance Manager View Only"
description: "Compliance Managers can view and monitor data rooms, cabinets, and files."
resourcePolicy:
  resource: "ari:agsiri:dataroom:*"
  version: "1.0"
  rules:
    - actions: ["view", "monitor"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 3. **Farm Manager Departmental Access Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Farm Manager Departmental Access"
description: "Farm Managers can view, edit, and manage files within their assigned data rooms."
resourcePolicy:
  resource: "ari:agsiri:dataroom:*"
  version: "1.0"
  rules:
    - actions: ["view", "edit", "manage"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === '\''FarmManager'\''"
            - expr: "user.department === resource.department"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 4. **Investor View Offerings Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Investor View Offerings"
description: "Investors can view offerings and related files in data rooms."
resourcePolicy:
  resource: "ari:agsiri:dataroom:*"
  version: "1.0"
  rules:
    - actions: ["view"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 5. **Campaign Manager Launch Campaign Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Campaign Manager Launch and View"
description: "Campaign Managers can launch and manage campaigns in data rooms."
resourcePolicy:
  resource: "ari:agsiri:dataroom:*"
  version: "1.0"
  rules:
    - actions: ["view", "launch", "manage"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 6. **Farm SME Assessment Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Farm SME Assess and View"
description: "Farm SMEs can view and assess ESG reports and related files."
resourcePolicy:
  resource: "ari:agsiri:dataroom:*"
  version: "1.0"
  rules:
    - actions: ["view", "assess"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 7. **External User View Public Resources Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "External User Public View"
description: "External Users can view public and externally accessible resources."
resourcePolicy:
  resource: "ari:agsiri:dataroom:*"
  version: "1.0"
  rules:
    - actions: ["view"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "resource.visibility === '\''public'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 8. **Temporary User Time-Limited Access Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Temporary User Time-Limited Access"
description: "Temporary Users have access to resources within a specified time window."
resourcePolicy:
  resource: "ari:agsiri:dataroom:*"
  version: "1.0"
  rules:
    - actions: ["view", "access"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "context.currentTime < user.accessExpiry"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 9. **VIP User Special Access Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "VIP User Special Access"
description: "VIP Users have special access to restricted resources when VIP status is active."
resourcePolicy:
  resource: "ari:agsiri:dataroom:*"
  version: "1.0"
  rules:
    - actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.vipStatus === '\''active'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 10. **Contributor Content Management Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Contributor Manage Authored Content"
description: "Contributors can edit and manage content they have authored within data rooms."
resourcePolicy:
  resource: "ari:agsiri:dataroom:*"
  version: "1.0"
  rules:
    - actions: ["view", "edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "resource.authorId === user.id"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### Principal Policies in `curl` Format

#### 1. **Admin Principal Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "JudySmith Admin Access"
description: "Judy Smith is granted full access to all data room resources as an Admin."
principalPolicy:
  principal: "JudySmith"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:*"
      actions: ["*"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 2. **Compliance Manager Principal Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "MarkJones Compliance Manager"
description: "Mark Jones is a Compliance Manager with view and monitor access to all data room resources."
principalPolicy:
  principal: "MarkJones"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:*"
      actions: ["view", "monitor"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 3. **Farm Manager Principal Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "AliceBrown Farm Manager"
description: "Alice Brown is a Farm Manager with access to manage resources in the Sales department."
principalPolicy:
  principal: "AliceBrown"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:*"
      actions: ["view", "edit", "manage"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.department === '\''Sales'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 4. **Investor Principal Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "DavidLee Investor"
description: "David Lee is an Investor with view access to offerings and related files."
principalPolicy:
  principal: "DavidLee"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:*"
      actions: ["view"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 5. **Campaign Manager

 Principal Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "EmmaClark Campaign Manager"
description: "Emma Clark is a Campaign Manager with access to launch and manage campaigns."
principalPolicy:
  principal: "EmmaClark"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:*"
      actions: ["view", "launch", "manage"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 6. **Farm SME Principal Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "JohnDoe Farm SME"
description: "John Doe is a Farm SME with access to assess and view ESG reports."
principalPolicy:
  principal: "JohnDoe"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:*"
      actions: ["view", "assess"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 7. **External User Principal Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "JaneSmith External User"
description: "Jane Smith is an External User with view access to public resources."
principalPolicy:
  principal: "JaneSmith"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:*"
      actions: ["view"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "resource.visibility === '\''public'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 8. **Temporary User Principal Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "SteveJohnson Temporary User"
description: "Steve Johnson is a Temporary User with time-limited access to resources."
principalPolicy:
  principal: "SteveJohnson"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:*"
      actions: ["view", "access"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "context.currentTime < user.accessExpiry"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 9. **VIP User Principal Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "SarahWilliams VIP User"
description: "Sarah Williams is a VIP User with special access privileges."
principalPolicy:
  principal: "SarahWilliams"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:*"
      actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.vipStatus === '\''active'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 10. **Contributor Principal Policy**

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "MichaelBrown Contributor"
description: "Michael Brown is a Contributor with access to edit and manage content he has authored."
principalPolicy:
  principal: "MichaelBrown"
  version: "1.0"
  rules:
    - resource: "ari:agsiri:dataroom:*"
      actions: ["view", "edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "resource.authorId === user.id"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

You're right, I missed covering those specific scenarios. Let's add policies that address more granular access controls, such as giving access to specific cabinets or files with certain naming conventions.

### Additional Resource Policies in `curl` Format

#### 11. **Cabinet-Specific Access Policy**

This policy allows Farm Managers to view and manage only the contents of a specific cabinet within a data room.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Farm Manager Cabinet-Specific Access"
description: "Farm Managers have access to manage the contents of the cabinet named FarmCabinet."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:cabinet/FarmCabinet"
  version: "1.0"
  rules:
    - actions: ["view", "manage"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 12. **File-Specific Access by Prefix Policy**

This policy allows Contributors to edit and manage files that start with "report_" within any cabinet in the data room.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Contributor File Prefix Access"
description: "Contributors can edit and manage files that start with report_ within any cabinet."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:file/report_*"
  version: "1.0"
  rules:
    - actions: ["edit", "manage"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 13. **Read-Only Access to Specific Data Room**

This policy allows External Users to only view a specific data room named "PublicDataRoom" and its contents.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "External User Public Data Room Access"
description: "External Users can only view the PublicDataRoom and its contents."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/PublicDataRoom"
  version: "1.0"
  rules:
    - actions: ["view"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 14. **VIP User Access to Files with Confidential Tag**

This policy grants VIP Users the ability to view and manage files tagged as "confidential" within any data room.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "VIP User Confidential File Access"
description: "VIP Users can view and manage files tagged as confidential within any data room."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:file/*"
  version: "1.0"
  rules:
    - actions: ["view", "manage"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "resource.tags.includes('\''confidential'\'')"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 15. **Manager Access to All Files in Specific Cabinets**

This policy allows Managers to view and manage all files within cabinets named "Operations" and "Finance".

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Manager Specific Cabinets Access"
description: "Managers can view and manage all files within the Operations and Finance cabinets."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:cabinet/Operations"
  version: "1.0"
  rules:
    - actions: ["view", "manage"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Manager Specific Cabinets Access"
description: "Managers can view and manage all files within the Operations and Finance cabinets."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:cabinet/Finance"
  version: "1.0"
  rules:
    - actions: ["view", "manage"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 16. **Read-Only Access to Files with Specific Tags**

This policy allows External Auditors to view files tagged with "audit" or "financial".

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "External Auditor File Tag Access"
description: "External Auditors can view files tagged with audit or financial."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:file/*"
  version: "1.0"
  rules:
    - actions: ["view"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          any:
            - expr: "resource.tags.includes('\''audit'\'')"
            - expr: "resource.tags.includes('\''financial'\'')"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 17. **Contributor Access to Files They Authored**

This policy grants Contributors edit and manage access to files they have authored.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Contributor Authored File Access"
description: "Contributors can edit and manage files they have authored within any data room."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:file/*"
  version: "1.0"
  rules:
    - actions: ["edit", "manage"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "resource.authorId === user.id"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 18. **Time-Limited Access to Specific Data Rooms**

This policy allows Temporary Users access to specific data rooms within a time-limited window.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Temporary User Data Room Time-Limited Access"
description: "Temporary Users can access specific data rooms within a defined time window."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/*"
  version: "1.0"
  rules:
    - actions: ["view", "access"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "context.currentTime < user.accessExpiry"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 19. **Admin Access to Archived Files**

This policy grants Admins the ability to view and manage archived files.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Admin Access to Archived Files"
description: "Admins can view and manage archived files within any data room."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:file/*"
  version: "1.0"
  rules:
    - actions: ["view", "manage"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "resource.status === '\''archived'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 20. **Investor Access to Files in Specific Data Rooms**

This policy allows Investors to view and manage files within specific data rooms related to offerings.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Investor Data Room Access"
description: "Investors can view and manage files within data rooms related to offerings."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/Offerings*"
  version: "1.0"
  rules:
    - actions: ["view", "manage"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 21. **Farm Manager Edit Access to Non-Archived Cabinets**

This policy grants Farm Managers the ability to edit contents within non-archived cabinets.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Farm Manager Non-Archived Cabinets Access"
description: "Farm Managers can edit contents within non-archived cabinets."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:cabinet/*

"
  version: "1.0"
  rules:
    - actions: ["edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "resource.status !== '\''archived'\''"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 22. **Seller Limited Access to Marketing Materials**

This policy allows Sellers to only view and manage marketing materials within a specific data room.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Seller Marketing Materials Access"
description: "Sellers can view and manage marketing materials within the MarketingDataRoom."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:dataroom/MarketingDataRoom"
  version: "1.0"
  rules:
    - actions: ["view", "manage"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 23. **Executive Access to Financial Reports**

This policy grants Executives the ability to view and manage financial reports stored in specific cabinets.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Executive Financial Reports Access"
description: "Executives can view and manage financial reports stored in Finance cabinets."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:cabinet/Finance"
  version: "1.0"
  rules:
    - actions: ["view", "manage"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 24. **Manager Access to Operations Files Only**

This policy allows Managers to view and edit files within the Operations cabinets but denies access to other cabinets.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Manager Operations Cabinet Access"
description: "Managers can view and edit files within the Operations cabinets."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:cabinet/Operations"
  version: "1.0"
  rules:
    - actions: ["view", "edit"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

#### 25. **VIP User Access to All Files**

This policy grants VIP Users full access to view and manage all files across all data rooms and cabinets.

```bash
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "VIP User All Files Access"
description: "VIP Users can view and manage all files across all data rooms and cabinets."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:*"
  version: "1.0"
  rules:
    - actions: ["*"]
      effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

## Complex Policy Definitions

Here are 5 complex data room policies that demonstrate the power of the Pola policy management system, focusing on various scenarios involving data rooms, cabinets, and files. These policies showcase fine-grained access control using complex conditions and multiple resources within the data room service.

### 26.  VIP User Full Access to Specific Cabinets and Files

```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "VIP Full Access to Cabinets and Files"
description: "VIP users have full access to all files within specific cabinets that are marked for VIP access."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:cabinet/vip-*"
  version: "1.0"
  variables:
    import:
      - "vip_access_variables"
    local:
      is_vip: "P.attr.role == '\''vip'\''"
  rules:
    - resource: "ari:agsiri:dataroom:us:123456789012:cabinet/vip-*"
      actions:
        - name: "view_vip_files"
          action: "view"
          condition:
            match:
              expr: "V.is_vip && request.resource.attr.vipOnly == true"
          effect: "EFFECT_ALLOW"
        - name: "edit_vip_files"
          action: "edit"
          condition:
            match:
              expr: "V.is_vip && request.resource.attr.vipOnly == true"
          effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### Explanation:
This policy grants VIP users full access to view and edit all files within specific cabinets that are marked for VIP access. The cabinets are identified with the prefix "vip-*", ensuring that only designated VIP cabinets are accessible under this policy.

---

### 27. Manager Limited Edit Access to Active Projects

```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Manager Limited Edit Access to Active Projects"
description: "Managers can edit files in active project cabinets, but cannot delete them."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:cabinet/project-*"
  version: "1.0"
  variables:
    import:
      - "project_variables"
    local:
      is_manager: "P.attr.role == '\''manager'\''"
  rules:
    - resource: "ari:agsiri:dataroom:us:123456789012:cabinet/project-*"
      actions:
        - name: "edit_project_files"
          action: "edit"
          condition:
            match:
              expr: "V.is_manager && request.resource.attr.status == '\''active'\''"
          effect: "EFFECT_ALLOW"
        - name: "delete_project_files"
          action: "delete"
          effect: "EFFECT_DENY"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### Explanation:
This policy allows managers to edit files within project cabinets that are currently active. However, it explicitly denies any delete actions, ensuring that important project files cannot be removed even by managers.

---

### 28.  Temporary User Restricted Access to Specific Files

```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Temporary User Restricted Access to Specific Files"
description: "Temporary users can only view files with a specific prefix and are restricted from editing."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:file/tmp-*"
  version: "1.0"
  variables:
    import:
      - "temp_user_variables"
    local:
      is_temp_user: "P.attr.role == '\''temporary'\''"
  rules:
    - resource: "ari:agsiri:dataroom:us:123456789012:file/tmp-*"
      actions:
        - name: "view_temp_files"
          action: "view"
          condition:
            match:
              expr: "V.is_temp_user && request.resource.attr.expiry > context.currentTime"
          effect: "EFFECT_ALLOW"
        - name: "edit_temp_files"
          action: "edit"
          effect: "EFFECT_DENY"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### Explanation:
Temporary users are allowed to view files that start with the prefix "tmp-", provided that the file has not expired. Editing of these files is strictly denied, ensuring that temporary users cannot modify content.

---

### 29. External Collaborator Access to Shared Cabinets

```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "External Collaborator Access to Shared Cabinets"
description: "External collaborators can only view and upload files to shared cabinets that are designated for external access."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:cabinet/shared-*"
  version: "1.0"
  variables:
    import:
      - "external_collab_variables"
    local:
      is_external_collab: "P.attr.role == '\''external_collaborator'\''"
  rules:
    - resource: "ari:agsiri:dataroom:us:123456789012:cabinet/shared-*"
      actions:
        - name: "view_shared_files"
          action: "view"
          condition:
            match:
              expr: "V.is_external_collab && request.resource.attr.externalAccess == true"
          effect: "EFFECT_ALLOW"
        - name: "upload_shared_files"
          action: "upload"
          condition:
            match:
              expr: "V.is_external_collab && request.resource.attr.externalAccess == true"
          effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### Explanation:
External collaborators are granted permission to view and upload files within shared cabinets that are specifically marked for external access. This policy ensures that external parties have controlled access to specific areas of the data room.

---

### 30. Contributor Limited Edit Access Based on Content Ownership

```yaml
curl -X POST http://localhost:4000/api/policies \
-H "Content-Type: application/x-yaml" \
-d '
name: "Contributor Limited Edit Access Based on Content Ownership"
description: "Contributors can edit only the files they have authored within the data room."
resourcePolicy:
  resource: "ari:agsiri:dataroom:us:123456789012:file/*"
  version: "1.0"
  variables:
    import:
      - "contributor_variables"
    local:
      is_contributor: "P.attr.role == '\''contributor'\''"
  rules:
    - resource: "ari:agsiri:dataroom:us:123456789012:file/*"
      actions:
        - name: "edit_owned_files"
          action: "edit"
          condition:
            match:
              expr: "V.is_contributor && request.resource.attr.authorId == P.attr.userId"
          effect: "EFFECT_ALLOW"
auditInfo:
  createdBy: "system"
version: "1.0"
'
```

### Explanation:
This policy ensures that contributors can only edit the files they have authored. It uses the `authorId` attribute of the resource to match with the `userId` of the principal, allowing for a fine-grained control of content ownership within the data room.

---

These policies demonstrate how complex conditions, specific resource identification, and tailored permissions can be used to enforce strict access control within the data room service. Each policy addresses unique scenarios that reflect real-world use cases, showcasing the flexibility and power of the Agsiri Policy Management system.
