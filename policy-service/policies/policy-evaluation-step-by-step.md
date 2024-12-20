Certainly! Let's walk through each of the 10 resource policies in detail, explaining how the system processes them to enforce the specified rules.

### Policy 1: "Manager Moderate Access"

#### Policy Definition:

```yaml
name: "Manager Moderate Access"
description: "Managers can edit resources within their department if the resource is not archived."
resourcePolicy:
  resource: "*"
  version: "1.0"
  rules:
    - actions: ["edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'manager'"
            - expr: "user.department === resource.department"
            - expr: "resource.status !== 'archived'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

#### Step-by-Step Policy Enforcement:

**Step 1: User Action and Request**
- **User Action**: A user with the role "manager" attempts to edit a resource.
- **Request**: The system receives a request to perform the "edit" action on a resource.

**Step 2: Policy Retrieval**
- **Resource Matching**: The system checks if the resource ARI matches the wildcard "*" in the policy.
- **Policy Loading**: The system loads the "Manager Moderate Access" policy.

**Step 3: Scope Creation**
- **Scope Definition**:
  ```json
  {
    "user": {
      "role": "manager",
      "department": "finance"
    },
    "resource": {
      "department": "finance",
      "status": "active"
    }
  }
  ```

**Step 4: Rule Evaluation**
- **Action Matching**: The "edit" action matches the actions in the policy rule.
- **Condition Evaluation**:
  - **Condition 1**: `user.role === 'manager'` passes.
  - **Condition 2**: `user.department === resource.department` passes.
  - **Condition 3**: `resource.status !== 'archived'` passes.
- **Effect Application**: The effect `EFFECT_ALLOW` is applied.

**Step 5: Policy Decision**
- **Decision**: The "edit" action is allowed.
- **Response**: The user is allowed to edit the resource.

---

### Policy 2: "Admin Full Access"

#### Policy Definition:

```yaml
name: "Admin Full Access"
description: "Admin users can perform any action on any resource if they are part of the internal network."
resourcePolicy:
  resource: "*"
  version: "1.0"
  rules:
    - actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'admin'"
            - expr: "user.network === 'internal'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

#### Step-by-Step Policy Enforcement:

**Step 1: User Action and Request**
- **User Action**: An "admin" user attempts to perform an action.
- **Request**: The system receives a request to perform any action on any resource.

**Step 2: Policy Retrieval**
- **Resource Matching**: The resource ARI matches the wildcard "*" in the policy.
- **Policy Loading**: The "Admin Full Access" policy is loaded.

**Step 3: Scope Creation**
- **Scope Definition**:
  ```json
  {
    "user": {
      "role": "admin",
      "network": "internal"
    },
    "resource": {}
  }
  ```

**Step 4: Rule Evaluation**
- **Action Matching**: The action matches the wildcard "*" in the policy rule.
- **Condition Evaluation**:
  - **Condition 1**: `user.role === 'admin'` passes.
  - **Condition 2**: `user.network === 'internal'` passes.
- **Effect Application**: The effect `EFFECT_ALLOW` is applied.

**Step 5: Policy Decision**
- **Decision**: The action is allowed.
- **Response**: The user is allowed to perform the action.

---

### Policy 3: "Guest Read-Only"

#### Policy Definition:

```yaml
name: "Guest Read-Only"
description: "Guest users can only read resources that are public."
resourcePolicy:
  resource: "*"
  version: "1.0"
  rules:
    - actions: ["read"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'guest'"
            - expr: "resource.visibility === 'public'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

#### Step-by-Step Policy Enforcement:

**Step 1: User Action and Request**
- **User Action**: A "guest" user attempts to read a resource.
- **Request**: The system receives a request to perform the "read" action on a resource.

**Step 2: Policy Retrieval**
- **Resource Matching**: The resource ARI matches the wildcard "*" in the policy.
- **Policy Loading**: The "Guest Read-Only" policy is loaded.

**Step 3: Scope Creation**
- **Scope Definition**:
  ```json
  {
    "user": {
      "role": "guest"
    },
    "resource": {
      "visibility": "public"
    }
  }
  ```

**Step 4: Rule Evaluation**
- **Action Matching**: The "read" action matches the actions in the policy rule.
- **Condition Evaluation**:
  - **Condition 1**: `user.role === 'guest'` passes.
  - **Condition 2**: `resource.visibility === 'public'` passes.
- **Effect Application**: The effect `EFFECT_ALLOW` is applied.

**Step 5: Policy Decision**
- **Decision**: The "read" action is allowed.
- **Response**: The user is allowed to read the resource.

---

### Policy 4: "External User Limited Access"

#### Policy Definition:

```yaml
name: "External User Limited Access"
description: "External users can only read resources marked for external access."
resourcePolicy:
  resource: "*"
  version: "1.0"
  rules:
    - actions: ["read"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.network === 'external'"
            - expr: "resource.externalAccess === true"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

#### Step-by-Step Policy Enforcement:

**Step 1: User Action and Request**
- **User Action**: An "external" user attempts to read a resource.
- **Request**: The system receives a request to perform the "read" action on a resource.

**Step 2: Policy Retrieval**
- **Resource Matching**: The resource ARI matches the wildcard "*" in the policy.
- **Policy Loading**: The "External User Limited Access" policy is loaded.

**Step 3: Scope Creation**
- **Scope Definition**:
  ```json
  {
    "user": {
      "network": "external"
    },
    "resource": {
      "externalAccess": true
    }
  }
  ```

**Step 4: Rule Evaluation**
- **Action Matching**: The "read" action matches the actions in the policy rule.
- **Condition Evaluation**:
  - **Condition 1**: `user.network === 'external'` passes.
  - **Condition 2**: `resource.externalAccess === true` passes.
- **Effect Application**: The effect `EFFECT_ALLOW` is applied.

**Step 5: Policy Decision**
- **Decision**: The "read" action is allowed.
- **Response**: The user is allowed to read the resource.

---

### Policy 5: "Deny All Deletes"

#### Policy Definition:

```yaml
name: "Deny All Deletes"
description: "No user can delete any resource."
resourcePolicy:
  resource: "*"
  version: "1.0"
  rules:
    - actions: ["delete"]
      effect: "EFFECT_DENY"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

#### Step-by-Step Policy Enforcement:

**Step 1: User Action and Request**
- **User Action**: A user attempts to delete a resource.
- **Request**: The system receives a request to perform the "delete" action on a resource.

**Step 2: Policy Retrieval**
- **Resource Matching**: The resource ARI matches the wildcard "*" in the policy.
- **Policy Loading**: The "Deny All Deletes" policy is loaded.

**Step 3: Scope Creation**
- **Scope Definition**:
  ```json
  {
    "user": {},
    "resource": {}
  }
  ```

**Step 4: Rule Evaluation**
- **Action Matching**: The "delete" action matches the actions in the policy rule.
- **Effect Application**: The effect `EFFECT_DENY` is applied.

**Step 5: Policy Decision**
- **Decision**: The "delete" action is denied.
- **

Response**: The user is not allowed to delete the resource.

---

### Policy 6: "Contributor Edit Access"

#### Policy Definition:

```yaml
name: "Contributor Edit Access"
description: "Contributors can edit resources they have authored."
resourcePolicy:
  resource: "*"
  version: "1.0"
  rules:
    - actions: ["edit"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'contributor'"
            - expr: "resource.authorId === user.id"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

#### Step-by-Step Policy Enforcement:

**Step 1: User Action and Request**
- **User Action**: A "contributor" user attempts to edit a resource they have authored.
- **Request**: The system receives a request to perform the "edit" action on the resource.

**Step 2: Policy Retrieval**
- **Resource Matching**: The resource ARI matches the wildcard "*" in the policy.
- **Policy Loading**: The "Contributor Edit Access" policy is loaded.

**Step 3: Scope Creation**
- **Scope Definition**:
  ```json
  {
    "user": {
      "role": "contributor",
      "id": "user123"
    },
    "resource": {
      "authorId": "user123"
    }
  }
  ```

**Step 4: Rule Evaluation**
- **Action Matching**: The "edit" action matches the actions in the policy rule.
- **Condition Evaluation**:
  - **Condition 1**: `user.role === 'contributor'` passes.
  - **Condition 2**: `resource.authorId === user.id` passes.
- **Effect Application**: The effect `EFFECT_ALLOW` is applied.

**Step 5: Policy Decision**
- **Decision**: The "edit" action is allowed.
- **Response**: The user is allowed to edit the resource.

---

### Policy 7: "Temporary User Access"

#### Policy Definition:

```yaml
name: "Temporary User Access"
description: "Temporary users can only access resources for a limited time period."
resourcePolicy:
  resource: "*"
  version: "1.0"
  rules:
    - actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'temporary'"
            - expr: "context.currentTime < user.accessExpiry"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

#### Step-by-Step Policy Enforcement:

**Step 1: User Action and Request**
- **User Action**: A "temporary" user attempts to access a resource.
- **Request**: The system receives a request to perform an action on the resource.

**Step 2: Policy Retrieval**
- **Resource Matching**: The resource ARI matches the wildcard "*" in the policy.
- **Policy Loading**: The "Temporary User Access" policy is loaded.

**Step 3: Scope Creation**
- **Scope Definition**:
  ```json
  {
    "user": {
      "role": "temporary",
      "accessExpiry": "2024-08-20T00:00:00Z"
    },
    "context": {
      "currentTime": "2024-08-19T12:00:00Z"
    }
  }
  ```

**Step 4: Rule Evaluation**
- **Action Matching**: The action matches the wildcard "*" in the policy rule.
- **Condition Evaluation**:
  - **Condition 1**: `user.role === 'temporary'` passes.
  - **Condition 2**: `context.currentTime < user.accessExpiry` passes.
- **Effect Application**: The effect `EFFECT_ALLOW` is applied.

**Step 5: Policy Decision**
- **Decision**: The action is allowed.
- **Response**: The user is allowed to access the resource.

---

### Policy 8: "VIP User Special Access"

#### Policy Definition:

```yaml
name: "VIP User Special Access"
description: "VIP users can bypass all access restrictions if their VIP status is active."
resourcePolicy:
  resource: "*"
  version: "1.0"
  rules:
    - actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'vip'"
            - expr: "user.vipStatus === 'active'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

#### Step-by-Step Policy Enforcement:

**Step 1: User Action and Request**
- **User Action**: A "VIP" user attempts to perform an action.
- **Request**: The system receives a request to perform an action on a resource.

**Step 2: Policy Retrieval**
- **Resource Matching**: The resource ARI matches the wildcard "*" in the policy.
- **Policy Loading**: The "VIP User Special Access" policy is loaded.

**Step 3: Scope Creation**
- **Scope Definition**:
  ```json
  {
    "user": {
      "role": "vip",
      "vipStatus": "active"
    },
    "resource": {}
  }
  ```

**Step 4: Rule Evaluation**
- **Action Matching**: The action matches the wildcard "*" in the policy rule.
- **Condition Evaluation**:
  - **Condition 1**: `user.role === 'vip'` passes.
  - **Condition 2**: `user.vipStatus === 'active'` passes.
- **Effect Application**: The effect `EFFECT_ALLOW` is applied.

**Step 5: Policy Decision**
- **Decision**: The action is allowed.
- **Response**: The user is allowed to perform the action.

---

### Policy 9: "Archive Only by Admin"

#### Policy Definition:

```yaml
name: "Archive Only by Admin"
description: "Only admin users can archive resources."
resourcePolicy:
  resource: "*"
  version: "1.0"
  rules:
    - actions: ["archive"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.role === 'admin'"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

#### Step-by-Step Policy Enforcement:

**Step 1: User Action and Request**
- **User Action**: A user attempts to archive a resource.
- **Request**: The system receives a request to perform the "archive" action on a resource.

**Step 2: Policy Retrieval**
- **Resource Matching**: The resource ARI matches the wildcard "*" in the policy.
- **Policy Loading**: The "Archive Only by Admin" policy is loaded.

**Step 3: Scope Creation**
- **Scope Definition**:
  ```json
  {
    "user": {
      "role": "admin"
    },
    "resource": {}
  }
  ```

**Step 4: Rule Evaluation**
- **Action Matching**: The "archive" action matches the actions in the policy rule.
- **Condition Evaluation**:
  - **Condition**: `user.role === 'admin'` passes.
- **Effect Application**: The effect `EFFECT_ALLOW` is applied.

**Step 5: Policy Decision**
- **Decision**: The "archive" action is allowed.
- **Response**: The user is allowed to archive the resource.

---

### Policy 10: "Restricted Resource Access"

#### Policy Definition:

```yaml
name: "Restricted Resource Access"
description: "Certain resources are restricted, and only users with special clearance can access them."
resourcePolicy:
  resource: "ari:agsiri:us:dataroom:89121232:dataroom/Farm230.cabinet.files"
  version: "1.0"
  rules:
    - actions: ["*"]
      effect: "EFFECT_ALLOW"
      condition:
        match:
          all:
            - expr: "user.clearanceLevel >= resource.requiredClearance"
auditInfo:
  createdBy: "admin"
  createdAt: "2024-08-19T03:54:56.035Z"
version: "1.0"
```

#### Step-by-Step Policy Enforcement:

**Step 1: User Action and Request**
- **User Action**: A user attempts to access a restricted resource.
- **Request**: The system receives a request to perform an action on the resource identified by `ari:agsiri:us:dataroom:89121232:dataroom/Farm230.cabinet.files`.

**Step 2: Policy Retrieval**
- **Resource Matching**: The resource ARI matches `ari:agsiri:us:dataroom:89121232:dataroom/Farm230.cabinet.files` in the policy.
- **Policy Loading**: The "Restricted Resource Access" policy is loaded.

**Step 3: Scope Creation**
- **Scope Definition**:
  ```json
  {
    "user": {
      "clearanceLevel": 5
    },
    "resource": {
      "requiredClearance": 3
    }
  }
  ```

**Step 4: Rule Evaluation**
- **Action Matching**: The action matches the

 wildcard "*" in the policy rule.
- **Condition Evaluation**:
  - **Condition**: `user.clearanceLevel >= resource.requiredClearance` passes.
- **Effect Application**: The effect `EFFECT_ALLOW` is applied.

**Step 5: Policy Decision**
- **Decision**: The action is allowed.
- **Response**: The user is allowed to access the restricted resource.

---

These detailed steps demonstrate how each resource policy is processed by the system, allowing for precise control over access to resources based on the conditions defined in the policies.
