# Policy Aggregation Algorithm with SCP

## MembershipResolver.aggregatePolicies()

This code is part of a system that aggregates and resolves policies for a specific principal (typically a user) in a policy-driven framework. The goal is to gather all relevant policies that apply to the principal based on their memberships in groups and roles, as well as their direct associations with policies. It also considers Service Control Policies (SCPs) that may restrict or enforce certain permissions.

### Step-by-Step Explanation

1. **Initialization and Logging:**
   ```typescript
   const policies = [];
   console.log(`Starting policy aggregation for principalId: ${principalId}`);
   ```
   - A new empty array `policies` is initialized to store the aggregated policies.
   - A log statement is printed to indicate the beginning of the policy aggregation process for the specified `principalId`.

2. **Resolve Groups for the Principal:**
   ```typescript
   const groups = await this.membershipResolver.resolvePrincipalGroups(principalId);
   console.log(`Resolved groups for principalId ${principalId}:`, groups);
   ```
   - The `resolvePrincipalGroups` method of the `membershipResolver` service is called to fetch the groups that the principal is a member of.
   - The result, `groups`, is an array of group IDs that the principal belongs to.
   - The resolved groups are logged for debugging purposes.

3. **Resolve Roles for the Principal:**
   ```typescript
   const roles = await this.membershipResolver.resolvePrincipalRoles(principalId);
   console.log(`Resolved roles for principalId ${principalId}:`, roles);
   ```
   - The `resolvePrincipalRoles` method is called to fetch the roles associated with the principal, either directly or through group memberships.
   - The result, `roles`, is an array of role IDs associated with the principal.
   - The resolved roles are logged.

4. **Resolve Directly Assigned Policies:**
   ```typescript
   const principalPolicies = await this.membershipResolver.resolvePrincipalPolicies(principalId);
   console.log(`Resolved principal policies for principalId ${principalId}:`, principalPolicies);
   ```
   - The `resolvePrincipalPolicies` method is called to fetch policies that are directly assigned to the principal.
   - The result, `principalPolicies`, is an array of policies directly associated with the principal.
   - These resolved principal policies are logged.

5. **Aggregate Principal Policies:**
   ```typescript
   if (principalPolicies.length > 0) {
       console.log(`Adding ${principalPolicies.length} principal policies to aggregation`);
       policies.push(...principalPolicies);
   } else {
       console.log(`No principal policies found for principalId ${principalId}`);
   }
   ```
   - If there are any directly assigned policies (`principalPolicies`), they are added to the `policies` array.
   - If no policies are found, a log statement is generated indicating this.

6. **Resolve and Aggregate Group Policies:**
   ```typescript
   for (const groupId of groups) {
       console.log(`Looking up policies for groupId: ${groupId}`);
       const groupPolicies = await PolicyModel.find({ 'groupPolicy.group': groupId });
       if (groupPolicies.length > 0) {
           console.log(`Adding ${groupPolicies.length} group policies for groupId ${groupId} to aggregation`);
           policies.push(...groupPolicies);
       } else {
           console.log(`No group policies found for groupId ${groupId}`);
       }
   }
   ```
   - For each group the principal is a member of, the code queries the `PolicyModel` to find policies associated with that group.
   - If policies are found for the group, they are added to the `policies` array; otherwise, it logs that no group policies were found.

7. **Resolve and Aggregate Role Policies:**
   ```typescript
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
   ```
   - Similar to group policies, the code iterates over each role associated with the principal and queries `PolicyModel` for policies tied to that role.
   - Found role policies are added to the `policies` array.

8. **Resolve and Apply Service Control Policies (SCPs):**
   ```typescript
   const scps = await PolicyModel.find({
       $or: [
           { 'serviceControlPolicy.boundEntities.users': principalId },
           { 'serviceControlPolicy.boundEntities.groups': { $in: groups } },
           { 'serviceControlPolicy.boundEntities.roles': { $in: roles } }
       ]
   }).exec();
   
   if (scps.length > 0) {
       console.log(`Found ${scps.length} SCPs applicable to principalId ${principalId}`);
       policies.forEach(policy => {
           scps.forEach(scp => {
               policy.maxPermissions = policy.maxPermissions.filter(permission => scp.serviceControlPolicy.maxPermissions.includes(permission));
           });
       });
   } else {
       console.log(`No SCPs found for principalId ${principalId}`);
   }
   ```
   - The code then searches for any Service Control Policies (SCPs) that are bound to the principal, the groups they are in, or their roles.
   - SCPs are a special type of policy that define the maximum permissions that can be granted, effectively limiting or overriding other policies.
   - If any SCPs are found, the code iterates over each policy already aggregated and filters its permissions according to the SCPs' constraints.
   - If no SCPs are found, a log statement is generated.

9. **Final Logging and Return:**
   ```typescript
   console.log(`Completed policy aggregation for principalId ${principalId}. Total policies found: ${policies.length}`);
   return policies;
   ```
   - The function logs the completion of the policy aggregation process, including the total number of policies found.
   - Finally, it returns the aggregated `policies` array, which now includes all relevant policies for the principal.

### Summary

This function performs a comprehensive aggregation of all policies that apply to a given principal, considering their memberships in groups, associations with roles, and any directly assigned policies. It also incorporates the constraints imposed by Service Control Policies (SCPs), ensuring that the final set of permissions respects the organization’s security requirements. This method is key in policy-driven systems where understanding and controlling access across multiple dimensions is essential for security and compliance.
