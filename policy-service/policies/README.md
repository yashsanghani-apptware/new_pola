# Agsiri Pola Policy Examples Tutorial Guide

This guide will walk you through 17 policy examples defined in the Agsiri Pola framework. Each example illustrates a specific policy use case, highlighting how conditions and expressions can be used to control access within your system. The guide includes a brief description of each example and provides a corresponding `curl` command to run the example.

---

## **Example 1: Basic Resource Policy**

**Description:** 
This policy allows viewing a resource if the user's geography is "GB" and the resource status is "PENDING_APPROVAL."

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.1.json
```

---

## **Example 2: Principal Policy with Role Check**

**Description:** 
This policy allows access if the principal has the role "admin" and the resource is not in QA or Canary deployment.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.2.json
```

---

## **Example 3: Derived Role Policy**

**Description:** 
This policy assigns the "RestrictedAccess" role if the resource is neither in QA nor in Canary deployment.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.3.json
```

---

## **Example 4: Complex Resource Policy with Nested Conditions**

**Description:** 
This policy allows edits if the resource is a draft, marked as dev, or matches specific ID patterns, and is not marked for QA or Canary deployment.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.4.json
```

---

## **Example 5: Principal Policy with Geography Check**

**Description:** 
This policy checks if the principal's geography includes "GB" to allow viewing a resource.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.5.json
```

---

## **Example 6: Variable-Based Resource Policy**

**Description:** 
This policy uses a variable to determine if the principal is a member of a specific project and grants view/edit permissions accordingly.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.6.json
```

---

## **Example 7: JWT Claims in Principal Policy**

**Description:** 
This policy validates the principal's JWT claims, checking for a specific audience and issuer.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.7.json
```

---

## **Example 8: Complex Resource Policy with Multiple Conditions**

**Description:** 
This policy combines multiple conditions to allow actions on resources only if the conditions match, using `all`, `any`, and `none` operators.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.8.json
```

---

## **Example 9: Duration-Based Resource Policy**

**Description:** 
This policy allows actions only if more than 36 hours have passed since the last resource access.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.9.json
```

---

## **Example 10: Hierarchical Functions in Principal Policy**

**Description:** 
This policy checks if a department is an ancestor of another department using hierarchical functions.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.10.json
```

---

## **Example 11: List and Map Functions in Derived Role Policy**

**Description:** 
This policy assigns the "TeamViewer" role if the principal is part of the design or engineering teams.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.11.json
```

---

## **Example 12: Mathematical Functions in Export Variables Policy**

**Description:** 
This policy exports the greatest value from a list of numbers.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.12.json
```

---

## **Example 13: String Functions in Resource Policy**

**Description:** 
This policy allows actions if the department attribute of the resource starts with "mark."

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.13.json
```

---

## **Example 14: Time Functions in Resource Policy**

**Description:** 
This policy allows access if the resource was last accessed in 2021.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.14.json
```

---

## **Example 15: Export Variables for Derived Role Policy**

**Description:** 
This policy defines a variable `hasAccess` and checks for its value to determine role assignment.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.15.json
```

---

## **Example 16: Advanced Resource Policy with Custom Conditions**

**Description:** 
This policy uses custom conditions to allow or deny actions based on complex criteria.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.16.json
```

---

## **Example 17: Principal Policy with Custom JWT Verification**

**Description:** 
This policy verifies custom JWT claims to validate the principal and allows or denies access accordingly.

**Curl Command:**
```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d @example.17.json
```

---

# Conclusion

This tutorial guide provides a quick reference to 17 example policies defined in the Agsiri Pola framework. Each example demonstrates a different aspect of policy creation, from basic role checks to complex condition evaluations. Use the provided `curl` commands to test these examples on your Agsiri policy engine, helping you better understand and apply the concepts in your environment.
