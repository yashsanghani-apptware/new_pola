# Policy Evaluation Process in the Agsiri Policy Schema

## Overview
The policy evaluation process in the Agsiri Policy Schema is a critical mechanism that determines whether a request to perform an action on a resource should be allowed or denied. This process involves several steps where the system evaluates Principal Policies, Resource Policies, Conditions, Variables, Derived Roles, Exported Variables, and Scoped Policies. The evaluation is done in real-time, ensuring that access control decisions are made dynamically and accurately based on the current context.

Here’s a detailed explanation of how policies are evaluated, incorporating all the components we've discussed so far:

### **1. Initial Request and Context Building**

When a user or system initiates a request, such as trying to access a resource or perform an action (e.g., reading a document, modifying a file, or executing a transaction), the Policy Service begins by building the context for the request. The context includes:
- **Principal Information**: Details about the user, group, or role making the request.
- **Resource Information**: Attributes and identifiers of the resource being accessed.
- **Environmental Variables**: Any relevant environmental data, such as time of day, location, or system status.
- **Imported and Exported Variables**: Variables that might impact the decision, such as business hours, maximum file sizes, or other global constants.

[@Amol]: Ensure that the list of Imported and Exported Variables is regularly updated to reflect changes in organizational policies or external conditions, as these can significantly impact decision-making.

### **2. Identifying Relevant Policies**

The Policy Service identifies which Principal and Resource Policies are applicable to the request. This step involves:
- **Matching the Principal**: The system checks the Principal Policies to see if there are any rules associated with the user, group, or role making the request.
- **Matching the Resource**: The system then looks at Resource Policies to determine if any rules apply to the resource in question.
- **Scope Consideration**: If Scoped Policies are defined, the system ensures that only policies relevant to the specific department, project, or organizational unit are considered.

[@Amol]: Clear and well-documented policy scope for each department or project to avoid unintended access permissions or denials.

### **3. Evaluating Conditions**

Once the relevant policies are identified, the next step is to evaluate any conditions that are part of those policies. Conditions add logic to policies, allowing for more granular control over whether an action should be allowed or denied. The evaluation process includes:
- **Simple Conditions**: The system checks straightforward conditions, such as whether a resource is in the "active" state or whether the user belongs to a specific role.
- **Complex Conditions**: For more intricate conditions, the system may evaluate a series of logical operations (e.g., `all`, `any`, `none`) to determine if the criteria are met. For example, a condition might require that a user be an "Admin" and that the resource is not classified as "sensitive."
- **Script-Based Conditions**: If a policy includes script-based conditions, the system executes the script to evaluate whether the condition is satisfied.
[@Amol]: With script-based conditions we need to be cautious, as they can introduce complexity and potential performance overhead. We need to make sure scripts are optimized and thoroughly tested.

### **4. Applying Derived Roles**

Derived Roles are considered during the evaluation process, particularly when roles are dependent on specific conditions. For instance:
- **Role Inheritance**: The system checks if the user has a derived role that grants them additional permissions based on certain criteria (e.g., a `SeniorManager` role that applies only if the user has been with the company for 10 years).
- **Role-Specific Conditions**: If the derived role includes conditions (e.g., the user’s location or experience level), these conditions are evaluated to determine if the derived role should be applied.

### **5. Referencing Exported Variables**

Exported Variables are also referenced during the policy evaluation process to ensure consistency and adherence to organizational standards. For example:
- **Global Constants**: Variables such as `maxFileSize` or `businessHours` are checked to enforce limits across different policies.
- **Thresholds and Limits**: The system uses these variables to determine if the action being requested falls within acceptable limits (e.g., ensuring a download does not exceed the `maxDownloadSize`).

### **6. Policy Decision and Resolution**

After all relevant policies, conditions, roles, and variables have been evaluated, the Policy Service makes a decision:
- **Allow or Deny**: The system decides whether the action should be allowed or denied based on the evaluation results.
- **Conflict Resolution**: If there are conflicting policies (e.g., one policy allows an action while another denies it), the system resolves the conflict according to predefined rules, such as prioritizing explicit deny policies over allow policies.
- **Precedence Rules**: The system may also apply precedence rules, such as prioritizing more specific policies (e.g., Scoped Policies) over general ones.

[@Amol]: Precedence rules need to be well-documented and understood by all stakeholders, as they play a critical role in resolving conflicts and ensuring consistent policy enforcement.

### **7. Action Enforcement**

Finally, based on the decision:
- **Allow**: If the action is allowed, the user or system is granted permission to proceed with the requested action.
- **Deny**: If the action is denied, the request is blocked, and the system may provide feedback on why the action was not permitted (e.g., due to a condition not being met or a policy explicitly denying the action).

## Example Scenarios of Policy Evaluation

**Scenario 1: Basic Document Access**
- **Request**: A user (`user001`) requests to read and edit `document123`.
- **Policy Evaluation**: The system checks the Principal Policy for `user001` and finds a policy that allows reading but denies editing of `document123`.
- **Decision**: The system allows the read action but denies the edit action.

**Scenario 2: Role-Based Resource Management**
- **Request**: A user with the role `Editor` requests to edit a document that is currently "active."
- **Policy Evaluation**: The Resource Policy for documents is checked, which allows users with the "Editor" role to edit documents that are active. The condition (document status is "active") is evaluated and met.
- **Decision**: The edit action is allowed.

**Scenario 3: Conditional Access Based on Derived Roles**
- **Request**: A `Manager` requests to approve a high-value transaction.
- **Policy Evaluation**: The system checks if the user qualifies for a derived `SeniorManager` role (requires 10 years of experience) and evaluates the condition that the transaction amount is below a certain threshold.
- **Decision**: If the user meets both the derived role condition and the transaction condition, the action is allowed; otherwise, it is denied.

## Conclusion

The policy evaluation process in the Agsiri Policy Schema is a sophisticated mechanism that ensures that all aspects of access control are considered before granting or denying a request. By evaluating Principal Policies, Resource Policies, Conditions, Derived Roles, Variables, and Scoped Policies, the system can make real-time decisions that are both precise and flexible. This process is essential for maintaining the security and integrity of resources within an organization, ensuring that only authorized actions are performed based on the current context and organizational rules.
