# Agsiri Pola Scenario Manual v2
Creating a comprehensive policy framework using the Agsiri Pola's `resourcePolicy` structure allows us to manage access control effectively across various resources, such as data rooms, cabinets, and files, within an organization. This detailed Policy Scenarios Manual will provide 10 distinct policy scenarios, each aligned with real-world use cases, and demonstrate how to create these policies using `curl` commands compliant with the provided JSON schema. The scenarios will explore hierarchical, conditional, regex-based, tag-based, composite, deny, delegated, context-aware, time-limited, and role-conditioned policies.

## Table of Contents

1. **Introduction**
2. **Scenario 1: Hierarchical Resource Policies**
3. **Scenario 2: Conditional Resource Policies**
4. **Scenario 3: Regex-Based Resource Policies**
5. **Scenario 4: Tag-Based Resource Policies**
6. **Scenario 5: Composite Resource Policies**
7. **Scenario 6: Negative Policies (Deny Policies)**
8. **Scenario 7: Delegated Resource Policies**
9. **Scenario 8: Context-Aware Resource Policies**
10. **Scenario 9: Time-Limited Resource Policies**
11. **Scenario 10: Role-Conditioned Resource Policies**
12. **Conclusion**

---

## 1. Introduction

In complex organizational environments, managing access to resources such as data rooms, cabinets, and files requires a flexible and robust policy framework. The Agsiri Pola's `resourcePolicy` framework provides the tools needed to create fine-grained access control policies that cater to a wide variety of scenarios. This document outlines 10 different scenarios that leverage the power of `resourcePolicy` combined with advanced condition logic to address common and complex access control needs.

Each scenario is accompanied by a detailed explanation and a `curl` command to create the corresponding policy. These policies are compliant with the provided JSON schema, ensuring they integrate seamlessly into the Agsiri Pola environment.

---

## 2. Scenario 1: Hierarchical Resource Policies

**Scenario Description:**
In this scenario, we manage access to resources organized hierarchically. For instance, within a data room, there are multiple cabinets, and within each cabinet, there are multiple files. We want to create policies that apply to an entire data room hierarchy or specific levels within that hierarchy.

**Policy 1.1: Access to Entire Data Room Hierarchy**

This policy grants `view` and `read` access to the entire data room, including all cabinets and files within it.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view", "read"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Viewer"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Policy 1.2: Access to Specific Cabinet**

This policy allows the `Manager` role to `edit` and `share` files within a specific cabinet under a data room.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet123",
    "version": "1.0",
    "rules": [
      {
        "actions": ["edit", "share"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Manager"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Explanation:**
- **Hierarchical Structure:** Policies apply to different levels within the resource hierarchy. The first policy grants access to all resources within a data room, while the second targets a specific cabinet.
- **Roles and Permissions:** Specific roles are granted specific actions on the resources. The `Viewer` role can view and read, while the `Manager` role can edit and share files within a designated cabinet.

---

## 3. Scenario 2: Conditional Resource Policies

**Scenario Description:**
Conditional policies apply only when certain conditions are met. These conditions can be based on user attributes, time, location, or resource state.

**Policy 2.1: Time-Based Access**

This policy allows `read` access to files in a cabinet, but only during business hours (9 AM to 5 PM).

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet123/files/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "currentTime >= '09:00' && currentTime <= '17:00'" }
              ]
            }
          }
        },
        "roles": ["Employee"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Policy 2.2: Location-Based Access**

This policy restricts `edit` access to files in a data room to users who are accessing the system from the company's headquarters.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "user.location == 'headquarters'" }
              ]
            }
          }
        },
        "roles": ["Editor"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Explanation:**
- **Time-Based Access:** The policy applies only during specified hours, allowing businesses to enforce access control based on working hours.
- **Location-Based Access:** Ensures that certain actions can only be performed when the user is in a specific location, adding an additional layer of security.

---

## 4. Scenario 3: Regex-Based Resource Policies

**Scenario Description:**
Regex-based policies provide sophisticated pattern matching, allowing for more granular control over which resources are affected by the policy.

**Policy 3.1: Match Specific Files in a Cabinet**

This policy allows `download` access to files in a specific cabinet that have a three-digit identifier in their name (e.g., `file001`, `file123`).

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet123/files/file[0-9]{3}",
    "version": "1.0",
    "rules": [
      {
        "actions": ["download"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Viewer"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Policy 3.2: Match Archived Files**

This policy allows `delete` access to any files within a data room that are marked as archived.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/*_archive",
    "version": "1.0",
    "rules": [
      {
        "actions": ["

delete"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Admin"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Explanation:**
- **Regex Matching:** These policies use regular expressions to define which resources are covered, allowing for advanced pattern matching that is more flexible than simple wildcard (`*`) matching.
- **Granular Control:** Enables fine-tuned access control over specific resources based on their naming conventions or tags.

---

## 5. Scenario 4: Tag-Based Resource Policies

**Scenario Description:**
Tag-based policies grant or restrict access to resources based on metadata tags associated with them. This allows for dynamic and context-sensitive access control.

**Policy 4.1: Access to Confidential Files**

This policy grants `read` access to files tagged as `confidential` only to users with the `C-level` role.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["read"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "resource.tag == 'confidential'" }
              ]
            }
          }
        },
        "roles": ["C-level"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Policy 4.2: Access to Beta Version Files**

This policy allows `edit` access to files tagged with `beta` only for internal testers.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "resource.tag == 'beta'" }
              ]
            }
          }
        },
        "roles": ["Tester"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Explanation:**
- **Tag-Based Control:** These policies rely on the presence of specific tags to control access, allowing for dynamic and flexible resource management.
- **Context-Sensitive Access:** As resources are tagged with different metadata, the policies automatically adjust access permissions without needing to modify the ARI structure.

---

## 6. Scenario 5: Composite Resource Policies

**Scenario Description:**
Composite policies combine multiple conditions and roles in a single policy, allowing for complex access control decisions that involve multiple factors.

**Policy 5.1: Role and Time-Based Access**

This policy allows the `edit` action on files in a specific cabinet but only if the user has the `Editor` role and the action is performed during business hours.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet456/files/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "user.role == 'Editor'" },
                { "expr": "currentTime >= '09:00' && currentTime <= '17:00'" }
              ]
            }
          }
        },
        "roles": ["Editor"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Policy 5.2: Location and Role-Based Access**

This policy allows `share` access to any resource under a specific data room but only if the user is an `Admin` and is accessing from within the corporate network.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["share"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "user.role == 'Admin'" },
                { "expr": "user.network == 'corporate'" }
              ]
            }
          }
        },
        "roles": ["Admin"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Explanation:**
- **Composite Conditions:** These policies combine multiple conditions such as time, location, and role in a single policy, allowing for more nuanced access control decisions.
- **Complex Access Control:** By considering multiple factors, composite policies ensure that access is granted only under the right circumstances.

---

## 7. Scenario 6: Negative Policies (Deny Policies)

**Scenario Description:**
Deny policies explicitly prohibit certain actions on resources, regardless of other policies that might grant access.

**Policy 6.1: Deny Deletion of Backup Files**

This policy denies `delete` actions on any files tagged as `backup` for all users except the `Admin` role.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["delete"],
        "effect": "EFFECT_DENY",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "resource.tag == 'backup'" }
              ]
            }
          }
        },
        "roles": ["*"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Policy 6.2: Deny Access to Restricted Cabinets**

This policy denies all access (`*`) to cabinets tagged as `restricted` for all users except those with the `Security` role.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinets/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["*"],
        "effect": "EFFECT_DENY",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "resource.tag == 'restricted'" }
              ]
            }
          }
        },
        "roles": ["*"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Explanation:**
- **Explicit Denial:** These policies explicitly deny access or actions on certain resources, overriding any other policies that might allow them.
- **In

creased Security:** Deny policies are crucial for protecting sensitive resources or operations, ensuring that they are only accessible to highly trusted roles.

---

## 8. Scenario 7: Delegated Resource Policies

**Scenario Description:**
Delegated policies allow users with specific permissions to grant or revoke access to others, enabling decentralized access control management.

**Policy 7.1: Project Manager Delegates Access**

This policy allows a `Project Manager` to delegate `edit` and `share` access to files within a specific project cabinet to their team members.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/projectA/cabinet123/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["edit", "share"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Project Manager"],
        "output": {
          "expr": "delegateAccess('teamMembers', ['edit', 'share'])"
        }
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Policy 7.2: Department Head Delegates Temporary Access**

This policy allows a `Department Head` to grant temporary `view` access to resources within a department's data room for auditors.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/department/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Department Head"],
        "output": {
          "expr": "delegateAccess('auditors', ['view'], '2024-08-30T23:59:59Z')"
        }
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Explanation:**
- **Delegated Access:** These policies allow certain roles to grant or revoke access to others, providing flexibility in managing permissions.
- **Decentralized Management:** By empowering project managers and department heads to manage access, organizations can reduce the burden on central IT while maintaining control.

---

## 9. Scenario 8: Context-Aware Resource Policies

**Scenario Description:**
Context-aware policies adjust permissions based on the context of the request, such as the user's location, device type, or network conditions.

**Policy 8.1: Access Based on Network Location**

This policy allows `view` access to files within a data room only if the user is accessing the system from a secure corporate network.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "user.network == 'corporate'" }
              ]
            }
          }
        },
        "roles": ["Employee"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Policy 8.2: Restrict Access on Mobile Devices**

This policy denies `edit` access to files within a specific cabinet if the user is accessing the system via a mobile device.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet789/files/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["edit"],
        "effect": "EFFECT_DENY",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "user.deviceType == 'mobile'" }
              ]
            }
          }
        },
        "roles": ["*"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Explanation:**
- **Dynamic Control:** Context-aware policies adapt to the user's environment, providing dynamic and situational access control.
- **Enhanced Security:** By considering factors such as network location and device type, these policies add layers of security beyond static role or resource-based access.

---

## 10. Scenario 9: Time-Limited Resource Policies

**Scenario Description:**
Time-limited policies grant access for a specified period, useful for managing temporary access needs or scheduled tasks.

**Policy 9.1: Maintenance Window Access**

This policy grants `edit` access to files within a specific cabinet during a scheduled maintenance window.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet789/files/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["edit"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "currentTime >= '2024-08-20T01:00:00Z' && currentTime <= '2024-08-20T03:00:00Z'" }
              ]
            }
          }
        },
        "roles": ["Maintenance"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Policy 9.2: Temporary Access for Contractors**

This policy grants `view` access to specific files within a data room for contractors, but only until the project end date.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/projectB/files/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "all": {
              "of": [
                { "expr": "currentTime <= '2024-08-31T23:59:59Z'" }
              ]
            }
          }
        },
        "roles": ["Contractor"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Explanation:**
- **Temporary Access:** These policies allow access for a limited time, ensuring that permissions are automatically revoked after the specified period.
- **Controlled Access:** Time-limited policies are ideal for managing access for contractors, temporary workers, or during specific events like maintenance windows.

---

## 11. Scenario 10: Role-Conditioned Resource Policies

**Scenario Description:**
Role-conditioned policies apply different rules based on the user's role, allowing for tiered access control where higher-level roles have broader access.

**Policy 10.1: Tiered Access for Managers and Employees**

This policy allows `view` access to a specific file for all employees but restricts `edit` access to managers only.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d

 '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet123/files/file789",
    "version": "1.0",
    "rules": [
      {
        "actions": ["view"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Employee"]
      },
      {
        "actions": ["edit"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Manager"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Policy 10.2: Broader Access for Admins**

This policy allows `delete` access to any files in a cabinet, but only for users with the `Admin` role.

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.agsiri.dev/v1",
  "resourcePolicy": {
    "resource": "ari:agsiri:dataroom:us:123456789012:dataroom/cabinet123/files/*",
    "version": "1.0",
    "rules": [
      {
        "actions": ["delete"],
        "effect": "EFFECT_ALLOW",
        "roles": ["Admin"]
      }
    ]
  },
  "metadata": {
    "annotations": {
      "author": "admin@example.com"
    }
  },
  "auditInfo": {
    "createdBy": "admin",
    "createdAt": "2024-08-19T12:00:00Z"
  }
}'
```

**Explanation:**
- **Tiered Access:** These policies provide different levels of access based on the user's role, ensuring that higher-level roles have more control over resources.
- **Role-Based Security:** By conditioning access on the user's role, organizations can enforce strict security measures, allowing only authorized users to perform sensitive actions.

---

## 12. Conclusion

The Agsiri Pola's `resourcePolicy` framework, when combined with its powerful condition logic, provides a robust solution for managing access control in complex organizational environments. The 10 scenarios presented in this manual demonstrate the flexibility and depth of the policy framework, allowing for the implementation of sophisticated access control strategies that address a wide range of real-world requirements.

By using the `curl` commands provided, administrators can quickly implement these policies in their environments, ensuring that the right users have the right access at the right time. Whether dealing with hierarchical resources, conditional access, or role-based security, the Agsiri Pola's `resourcePolicy` framework is equipped to handle it all, making it an essential tool for any organization's security and compliance efforts.
