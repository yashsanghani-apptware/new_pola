# Concept Note: Performing Wildcard Matches in MongoDB

## Introduction
In MongoDB, wildcard matching is a common requirement when querying documents that contain patterns, especially when dealing with resource identifiers or strings that may include wildcards (e.g., `*`). This concept note outlines the principles, challenges, and strategies for effectively performing wildcard matches in MongoDB.

## Understanding Wildcards in MongoDB
MongoDB uses regular expressions (regex) for pattern matching. A common scenario is when a field in the database contains a wildcard (e.g., `*`), and you need to match this field against a specific string.

**Example Scenario:**
- **Stored Value:** `ari:service:region:account-id:dataroom/farm*`
- **Query String:** `ari:service:region:account-id:dataroom/farm4643`

The goal is to match the query string against the stored value, accounting for the wildcard.

## Challenges with Direct Regex Matching
Directly using MongoDB’s regex capabilities to match fields with wildcards presents a few challenges:
1. **Escaping Special Characters:** MongoDB regex requires careful handling of special characters like `/`, `\`, `.` which are common in resource identifiers.
2. **Wildcard Interpretation:** The `*` in MongoDB is not inherently understood as a wildcard (matching any sequence of characters). Instead, `.*` must be used in regex to achieve this behavior.

## Strategy for Wildcard Matching
To overcome these challenges, a two-step approach can be employed:
1. **Fetch Broadly Related Documents:**
   - Use a broad query to fetch documents that are potentially relevant. This query can loosely match the beginning of the resource identifier, ensuring that we don’t miss any potentially matching documents.

2. **Apply Manual Filtering in Application Logic:**
   - Once the potentially relevant documents are fetched, apply more precise matching using regex within the application logic. This involves:
     - Converting the stored wildcard patterns (`*`) into a regex pattern (`.*`).
     - Using this regex pattern to manually check if the query string matches the stored value.

## Implementation Example
Here’s how you can implement wildcard matching in MongoDB:

1. **MongoDB Query:**
   Use a basic query to fetch all documents where the resource identifier loosely matches the beginning of the query string.

   ```javascript
   const allPolicies = await PolicyModel.find({
     'resourcePolicy.resource': { $regex: 'ari:service:region:account-id:dataroom/farm', $options: 'i' }
   });
   ```

2. **Manual Filtering in Application Logic:**
   Convert the wildcard in the stored resource to a regex pattern and manually filter the results.

   ```javascript
   const matchingPolicies = allPolicies.filter(policy => {
     const resourcePattern = policy.resourcePolicy.resource.replace(/\*/g, '.*');
     const regex = new RegExp('^' + resourcePattern + '$', 'i');
     return regex.test(resourceId);
   });
   ```

3. **Full Code Implementation:**
   ```javascript
   import mongoose from 'mongoose';
   import PolicyModel from './models/policy';

   async function runQuery() {
     await mongoose.connect('mongodb://localhost:27017/agsiri', {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     });

     const principalId = 'u123';
     const resourceId = 'ari:service:region:account-id:dataroom/farm4643';

     const allPolicies = await PolicyModel.find({
       $or: [
         { 'principalPolicy.principal': principalId },
         { 'resourcePolicy.resource': { $regex: 'ari:service:region:account-id:dataroom/farm', $options: 'i' } }
       ]
     });

     const matchingPolicies = allPolicies.filter(policy => {
       const resourcePattern = policy.resourcePolicy.resource.replace(/\*/g, '.*');
       const regex = new RegExp('^' + resourcePattern + '$', 'i');
       return regex.test(resourceId) && policy.resourcePolicy.rules.some(rule => rule.actions.includes('read') && rule.effect === 'EFFECT_ALLOW');
     });

     console.log('Matching Policies:', JSON.stringify(matchingPolicies, null, 2));
     mongoose.connection.close();
   }

   runQuery().catch(err => {
     console.error('Error running query:', err);
     mongoose.connection.close();
   });
   ```

## Advantages of This Approach
- **Reliability:** Ensures that all potentially relevant documents are considered, and precise matching is performed in the application logic.
- **Flexibility:** Handles complex patterns and wildcards without being constrained by MongoDB’s regex capabilities alone.
- **Scalability:** This approach can be extended to handle more complex scenarios involving multiple wildcards or more intricate patterns.

## Conclusion
Performing wildcard matches in MongoDB can be challenging due to the need to correctly handle special characters and the limitations of regex within MongoDB. By using a combination of broad initial queries and manual filtering in application logic, you can achieve reliable and accurate wildcard matching, ensuring that your queries return the correct results. This approach provides a robust solution for scenarios where wildcards are commonly used in stored patterns.
