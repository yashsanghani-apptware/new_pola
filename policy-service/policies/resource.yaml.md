# Example Resource Policies
## 1. **Data Scientist Data Access**
This policy allows data scientists to access and analyze datasets that are marked as available for analysis and not archived.
```yaml
name: "Data Scientist Data Access"
description: "Data scientists can read and analyze datasets that are marked as available for analysis and not archived."
resourcePolicy:
  resource: "ari:resource:dataset/*"
  version: "1.0"
  rules:
    - actions: ["read", "analyze"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'data_scientist'"
            - expr: "resource.isAvailableForAnalysis === true"
            - expr: "resource.status !== 'archived'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 2. **Finance Department Confidential Access**
This policy allows members of the finance department to view confidential financial reports, provided they have appropriate clearance.
```yaml
name: "Finance Department Confidential Access"
description: "Members of the finance department can view confidential financial reports if they have the appropriate clearance."
resourcePolicy:
  resource: "ari:resource:finance_reports/*"
  version: "1.0"
  rules:
    - actions: ["view"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.department === 'finance'"
            - expr: "user.clearanceLevel >= resource.requiredClearance"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 3. **Researcher Extended Access**
Researchers are allowed to edit and review research papers they authored, but only during the review phase.
```yaml
name: "Researcher Extended Access"
description: "Researchers can edit and review research papers they authored, but only during the review phase."
resourcePolicy:
  resource: "ari:resource:research_papers/*"
  version: "1.0"
  rules:
    - actions: ["edit", "review"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'researcher'"
            - expr: "resource.authorId === user.id"
            - expr: "resource.phase === 'review'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 4. **Executive Dashboard Access**
Executives can access the executive dashboard, but only if the company’s stock price is above a certain threshold.
```yaml
name: "Executive Dashboard Access"
description: "Executives can access the executive dashboard if the company’s stock price is above a certain threshold."
resourcePolicy:
  resource: "ari:resource:executive_dashboard"
  version: "1.0"
  rules:
    - actions: ["view"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'executive'"
            - expr: "context.stockPrice > 100"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 5. **Developer Code Repository Access**
Developers can push to repositories they own or have been assigned as maintainers.
```yaml
name: "Developer Code Repository Access"
description: "Developers can push to repositories they own or have been assigned as maintainers."
resourcePolicy:
  resource: "ari:resource:code_repositories/*"
  version: "1.0"
  rules:
    - actions: ["push"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          any:
            - expr: "resource.ownerId === user.id"
            - expr: "resource.maintainers.includes(user.id)"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 6. **Content Manager Special Approval**
Content managers can publish content if it’s marked as ready for publication and has passed all required approvals.
```yaml
name: "Content Manager Special Approval"
description: "Content managers can publish content if it’s marked as ready for publication and has passed all required approvals."
resourcePolicy:
  resource: "ari:resource:content/*"
  version: "1.0"
  rules:
    - actions: ["publish"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'content_manager'"
            - expr: "resource.status === 'ready_for_publication'"
            - expr: "resource.approvals.length >= resource.requiredApprovals"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 7. **Security Officer Sensitive Log Access**
Security officers can access sensitive logs, but only if they are investigating a security incident.
```yaml
name: "Security Officer Sensitive Log Access"
description: "Security officers can access sensitive logs, but only if they are investigating a security incident."
resourcePolicy:
  resource: "ari:resource:logs/sensitive/*"
  version: "1.0"
  rules:
    - actions: ["read"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'security_officer'"
            - expr: "context.incidentUnderInvestigation === true"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 8. **Legal Department Document Access**
Legal staff can access documents relevant to ongoing cases within their jurisdiction.
```yaml
name: "Legal Department Document Access"
description: "Legal staff can access documents relevant to ongoing cases within their jurisdiction."
resourcePolicy:
  resource: "ari:resource:legal_documents/*"
  version: "1.0"
  rules:
    - actions: ["view", "edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.department === 'legal'"
            - expr: "resource.caseId === user.caseAssignment"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 9. **Marketing Campaign Management**
Marketing managers can modify campaigns they are assigned to but cannot delete them unless they are the creator.
```yaml
name: "Marketing Campaign Management"
description: "Marketing managers can modify campaigns they are assigned to but cannot delete them unless they are the creator."
resourcePolicy:
  resource: "ari:resource:marketing_campaigns/*"
  version: "1.0"
  rules:
    - actions: ["edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'marketing_manager'"
            - expr: "resource.managerId === user.id"
    - actions: ["delete"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'marketing_manager'"
            - expr: "resource.creatorId === user.id"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 10. **IT Staff Maintenance Access**
IT staff can perform maintenance on servers, but only during scheduled maintenance windows.
```yaml
name: "IT Staff Maintenance Access"
description: "IT staff can perform maintenance on servers, but only during scheduled maintenance windows."
resourcePolicy:
  resource: "ari:resource:servers/*"
  version: "1.0"
  rules:
    - actions: ["restart", "update"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'it_staff'"
            - expr: "context.currentTime >= resource.maintenanceWindowStart"
            - expr: "context.currentTime <= resource.maintenanceWindowEnd"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 11. **Human Resources Confidential Records Access**
HR staff can view and update employee records marked as confidential, but only within their region.
```yaml
name: "Human Resources Confidential Records Access"
description: "HR staff can view and update employee records marked as confidential, but only within their region."
resourcePolicy:
  resource: "ari:resource:employee_records/*"
  version: "1.0"
  rules:
    - actions: ["view", "update"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.department === 'hr'"
            - expr: "user.region === resource.region"
            - expr: "resource.confidential === true"
auditInfo:
  createdBy: "admin"
  createdAt: "202

4-08-19T03:54:56.035Z"
version: "1.0"
```

## 12. **Customer Support Limited Edit Access**
Customer support representatives can edit customer tickets, but only if the ticket is in an open state and assigned to them.
```yaml
name: "Customer Support Limited Edit Access"
description: "Customer support representatives can edit customer tickets, but only if the ticket is in an open state and assigned to them."
resourcePolicy:
  resource: "ari:resource:customer_tickets/*"
  version: "1.0"
  rules:
    - actions: ["edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'customer_support'"
            - expr: "resource.status === 'open'"
            - expr: "resource.assignedTo === user.id"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 13. **Temporary Project Contributor Access**
Temporary project contributors can access project resources only if their contribution period has not expired.
```yaml
name: "Temporary Project Contributor Access"
description: "Temporary project contributors can access project resources only if their contribution period has not expired."
resourcePolicy:
  resource: "ari:resource:project_resources/*"
  version: "1.0"
  rules:
    - actions: ["view", "edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'project_contributor'"
            - expr: "context.currentTime < user.contributionExpiry"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 14. **Internal Audit Data Access**
Internal auditors can access all audit logs, but only if the audit is in progress.
```yaml
name: "Internal Audit Data Access"
description: "Internal auditors can access all audit logs, but only if the audit is in progress."
resourcePolicy:
  resource: "ari:resource:audit_logs/*"
  version: "1.0"
  rules:
    - actions: ["read"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'internal_auditor'"
            - expr: "context.auditInProgress === true"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 15. **Product Manager Beta Feature Access**
Product managers can enable beta features for testing, but only on test environments.
```yaml
name: "Product Manager Beta Feature Access"
description: "Product managers can enable beta features for testing, but only on test environments."
resourcePolicy:
  resource: "ari:resource:beta_features/*"
  version: "1.0"
  rules:
    - actions: ["enable"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'product_manager'"
            - expr: "resource.environment === 'test'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 16. **Vendor Limited Access**
Vendors can only view and update contracts that they are associated with and only if the contract is active.
```yaml
name: "Vendor Limited Access"
description: "Vendors can only view and update contracts that they are associated with and only if the contract is active."
resourcePolicy:
  resource: "ari:resource:contracts/*"
  version: "1.0"
  rules:
    - actions: ["view", "update"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'vendor'"
            - expr: "resource.vendorId === user.id"
            - expr: "resource.status === 'active'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 17. **VIP Access to Premium Resources**
VIP users can access premium resources, bypassing standard access controls, if they are in good standing.
```yaml
name: "VIP Access to Premium Resources"
description: "VIP users can access premium resources, bypassing standard access controls, if they are in good standing."
resourcePolicy:
  resource: "ari:resource:premium_content/*"
  version: "1.0"
  rules:
    - actions: ["view", "download"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'vip'"
            - expr: "user.status === 'good_standing'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 18. **Managerial Override for Approval**
Managers can override the approval process for specific resources in critical situations.
```yaml
name: "Managerial Override for Approval"
description: "Managers can override the approval process for specific resources in critical situations."
resourcePolicy:
  resource: "ari:resource:approvals/*"
  version: "1.0"
  rules:
    - actions: ["override"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'manager'"
            - expr: "context.situation === 'critical'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 19. **HR Manager Confidential Data Access**
HR managers can access confidential employee data, provided they have special clearance.
```yaml
name: "HR Manager Confidential Data Access"
description: "HR managers can access confidential employee data, provided they have special clearance."
resourcePolicy:
  resource: "ari:resource:confidential_employee_data/*"
  version: "1.0"
  rules:
    - actions: ["view"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'hr_manager'"
            - expr: "user.clearanceLevel >= resource.requiredClearance"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 20. **IT Admin Emergency Maintenance**
IT admins can perform emergency maintenance on systems if a critical alert is raised.
```yaml
name: "IT Admin Emergency Maintenance"
description: "IT admins can perform emergency maintenance on systems if a critical alert is raised."
resourcePolicy:
  resource: "ari:resource:systems/*"
  version: "1.0"
  rules:
    - actions: ["restart", "shutdown"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'it_admin'"
            - expr: "context.alertLevel === 'critical'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 21. **Engineering Team Source Code Access**
Engineers can modify source code in repositories they have been assigned to, but only during working hours.
```yaml
name: "Engineering Team Source Code Access"
description: "Engineers can modify source code in repositories they have been assigned to, but only during working hours."
resourcePolicy:
  resource: "ari:resource:code_repositories/*"
  version: "1.0"
  rules:
    - actions: ["edit", "commit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'engineer'"
            - expr: "resource.assignedEngineers.includes(user.id)"
            - expr: "context.currentTime >= '09:00' && context.currentTime <= '18:00'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 22. **Compliance Officer Sensitive Data Access**
Compliance officers can access sensitive financial records for auditing, but only if the audit is authorized.
```yaml
name: "Compliance Officer Sensitive Data Access"
description: "Compliance officers can access sensitive financial records for auditing, but only if the audit is authorized."
resourcePolicy:
  resource: "ari:resource:financial_records/*"
  version: "1.0"
  rules:
    - actions: ["view"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'compliance_officer'"
            - expr: "context.auditAuthorized === true"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 23. **Project Lead Resource Allocation**
Project leads can allocate resources to team members but only within their assigned projects.
```yaml
name: "Project Lead Resource Allocation"
description:

 "Project leads can allocate resources to team members but only within their assigned projects."
resourcePolicy:
  resource: "ari:resource:project_resources/*"
  version: "1.0"
  rules:
    - actions: ["allocate"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'project_lead'"
            - expr: "resource.projectId === user.projectAssignment"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 24. **Legal Department Sensitive Case Files**
Legal team members can access sensitive case files but must have special clearance and be assigned to the case.
```yaml
name: "Legal Department Sensitive Case Files"
description: "Legal team members can access sensitive case files but must have special clearance and be assigned to the case."
resourcePolicy:
  resource: "ari:resource:case_files/*"
  version: "1.0"
  rules:
    - actions: ["view", "edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.department === 'legal'"
            - expr: "user.clearanceLevel >= resource.requiredClearance"
            - expr: "resource.caseAssignment === user.caseAssignment"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

## 25. **Executive Level Resource Override**
Executives can override access restrictions on certain resources during a declared emergency.
```yaml
name: "Executive Level Resource Override"
description: "Executives can override access restrictions on certain resources during a declared emergency."
resourcePolicy:
  resource: "ari:resource:restricted_resources/*"
  version: "1.0"
  rules:
    - actions: ["override"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'executive'"
            - expr: "context.emergencyDeclared === true"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

These resource policies are designed to cover a variety of scenarios, ensuring proper access controls based on user roles, contexts, and specific resource attributes. Each policy is crafted to meet specific business needs, providing flexibility and security in resource management.
