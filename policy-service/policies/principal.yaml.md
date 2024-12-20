# Principal Policies
## PrincipalPolicy 1: JudySmithAdminFullAccess
```yaml
name: "JudySmithAdminFullAccess"
description: "Judy Smith, an admin, has full access to all resources in the internal network. This policy ensures that Judy can perform any action on any resource when connected to the internal network."
principalPolicy:
  principal: "JudySmith"
  version: "1.0"
  rules:
    - resource: "*"
      actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'admin'"
            - expr: "user.network === 'internal'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T12:00:00.000Z"
version: "1.0"
```

## PrincipalPolicy 2: TomJonesGuestReadOnly
```yaml
name: "TomJonesGuestReadOnly"
description: "Tom Jones is a guest user with read-only access to public resources. This policy restricts Tom to only reading resources that have been marked as public."
principalPolicy:
  principal: "TomJones"
  version: "1.0"
  rules:
    - resource: "*"
      actions: ["read"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'guest'"
            - expr: "resource.visibility === 'public'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T12:01:00.000Z"
version: "1.0"
```

## PrincipalPolicy 3: LisaWilliamsManagerModerateAccess
```yaml
name: "LisaWilliamsManagerModerateAccess"
description: "Lisa Williams, a manager, can edit resources within her department as long as the resources are not archived. This policy ensures she can maintain the necessary resources under her jurisdiction."
principalPolicy:
  principal: "LisaWilliams"
  version: "1.0"
  rules:
    - resource: "*"
      actions: ["edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'manager'"
            - expr: "user.department === resource.department"
            - expr: "resource.status !== 'archived'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T12:02:00.000Z"
version: "1.0"
```

## PrincipalPolicy 4: SarahMillerExternalUserLimitedAccess
```yaml
name: "SarahMillerExternalUserLimitedAccess"
description: "Sarah Miller is an external user with limited access to resources. This policy allows her to read only those resources that are specifically marked for external access."
principalPolicy:
  principal: "SarahMiller"
  version: "1.0"
  rules:
    - resource: "*"
      actions: ["read"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.network === 'external'"
            - expr: "resource.externalAccess === true"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T12:03:00.000Z"
version: "1.0"
```

## PrincipalPolicy 5: MikeBrownDenyAllDeletes
```yaml
name: "MikeBrownDenyAllDeletes"
description: "This policy explicitly denies Mike Brown from deleting any resources, regardless of his role or the resource's status. This serves as a safeguard against accidental or malicious deletion of critical resources."
principalPolicy:
  principal: "MikeBrown"
  version: "1.0"
  rules:
    - resource: "*"
      actions: ["delete"]
      effect: "EFFECT_DENY"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T12:04:00.000Z"
version: "1.0"
```

## PrincipalPolicy 6: EmilyDavisContributorEditAccess
```yaml
name: "EmilyDavisContributorEditAccess"
description: "Emily Davis, a contributor, is allowed to edit only those resources that she has authored. This policy ensures that Emily can update and manage her contributions without affecting others' work."
principalPolicy:
  principal: "EmilyDavis"
  version: "1.0"
  rules:
    - resource: "*"
      actions: ["edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'contributor'"
            - expr: "resource.authorId === user.id"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T12:05:00.000Z"
version: "1.0"
```

## PrincipalPolicy 7: RobertTaylorTemporaryUserAccess
```yaml
name: "RobertTaylorTemporaryUserAccess"
description: "Robert Taylor, a temporary user, has access to resources for a limited time period. This policy restricts his access to only within the timeframe specified in his user profile."
principalPolicy:
  principal: "RobertTaylor"
  version: "1.0"
  rules:
    - resource: "*"
      actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'temporary'"
            - expr: "context.currentTime < user.accessExpiry"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T12:06:00.000Z"
version: "1.0"
```

## PrincipalPolicy 8: KarenMooreVIPUserSpecialAccess
```yaml
name: "KarenMooreVIPUserSpecialAccess"
description: "Karen Moore, a VIP user, can bypass all access restrictions when her VIP status is active. This policy provides Karen with special privileges, ensuring she can access all resources under certain conditions."
principalPolicy:
  principal: "KarenMoore"
  version: "1.0"
  rules:
    - resource: "*"
      actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'vip'"
            - expr: "user.vipStatus === 'active'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T12:07:00.000Z"
version: "1.0"
```

## PrincipalPolicy 9: JamesWilsonArchiveOnlyByAdmin
```yaml
name: "JamesWilsonArchiveOnlyByAdmin"
description: "James Wilson, an admin, is the only one allowed to archive resources. This policy ensures that only admin users like James can perform the archive action, safeguarding important data."
principalPolicy:
  principal: "JamesWilson"
  version: "1.0"
  rules:
    - resource: "*"
      actions: ["archive"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'admin'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T12:08:00.000Z"
version: "1.0"
```

## PrincipalPolicy 10: DavidJohnsonRestrictedResourceAccess
```yaml
name: "DavidJohnsonRestrictedResourceAccess"
description: "David Johnson has special clearance that allows him to access restricted resources. This policy grants David access to resources that require a certain clearance level, ensuring that only authorized personnel can view or modify sensitive data."
principalPolicy:
  principal: "DavidJohnson"
  version: "1.0"
  rules:
    - resource: "ari:resource:restricted"
      actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.clearanceLevel >= resource.requiredClearance"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T12:09:00.000Z"
version: "1.0"
```

