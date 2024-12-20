# Factbase Activity Gathering and Aggregation Algorithm
## Step-by-Step Algorithm

1. **Input Retrieval**:
   - Receive input parameters: `actorId` (representing the user or principal trying to access a resource) and `resourceId` (the resource being accessed).
   - Ensure both `actorId` and `resourceId` are present. If not, return an error indicating missing parameters.

2. **Fetch Facts from Database**:
   - Query the Factbase (database) to fetch all facts that are associated with either the `actorId` or the `resourceId`. 
   - Apply a filter to only retrieve facts that have not expired (`expiresAt` is greater than the current date).
   - The fetched facts should include all categories: **identity-based**, **intent-based**, **behavior-based**, **resource-based**, and **context-based**.

3. **Categorize the Facts**:
   - Initialize empty categories to hold facts:
     - `identityFacts` for facts related to the user's identity (e.g., roles, group memberships).
     - `intentFacts` for facts describing the user's intentions or planned actions.
     - `behaviorFacts` for facts about the user's past behavior or actions.
     - `resourceFacts` for facts about the resource being accessed.
     - `contextFacts` for facts about the broader context of the access request (e.g., environment, device, location).
   - Iterate over each fetched fact:
     - Categorize the fact based on its `type` attribute:
       - If `type` is `identity`, add it to `identityFacts`.
       - If `type` is `intent`, add it to `intentFacts`.
       - If `type` is `behavior`, add it to `behaviorFacts`.
       - If `type` is `resource`, add it to `resourceFacts`.
       - If `type` is `context`, add it to `contextFacts`.

4. **Risk Assessment**:
   - For each category of facts (identity, intent, behavior, resource, context), compute a `riskValue`.
   - Use different criteria and rules for each type of fact:
     - **Identity-Based**: Assess risk based on the user's roles and groups. For example, if the user belongs to a high-risk group (e.g., contractors), increase the risk.
     - **Intent-Based**: Determine risk based on the user's declared intentions. For example, actions such as "delete" or "modify" may have higher risk than "read."
     - **Behavior-Based**: Examine the user's past behaviors, such as frequency of access or unusual actions. Increase risk for anomalies or frequent access to sensitive data.
     - **Resource-Based**: Assess risk based on the sensitivity of the resource. For example, a "critical" dataroom has higher risk compared to a "general" document repository.
     - **Context-Based**: Analyze the environmental context (e.g., accessing from an untrusted network or an unusual geographic location). Adjust the risk accordingly.

5. **Filter Out Low-Risk Facts**:
   - Filter facts to retain only those with a `riskValue` above a certain threshold (e.g., 50).
   - Discard facts with lower risk values to optimize performance and focus on high-risk situations.

6. **Aggregate Facts**:
   - Aggregate the remaining facts into a unified data structure that can be easily consumed by the Policy Service.
   - For example, create a JSON object with keys for each category (`identity`, `intent`, `behavior`, `resource`, `context`) and populate them with the filtered, high-risk facts.

7. **Return Aggregated Facts to Policy Service**:
   - Send the aggregated facts back to the Policy Service.
   - The Policy Service will then use this enriched context to evaluate policies dynamically and make an informed decision about granting or denying access.

8. **Logging and Error Handling**:
   - Log the steps taken, especially any filtering or risk assessment results.
   - Handle potential errors gracefully, such as database connectivity issues or invalid data, and return meaningful error messages to the caller.

## Implementation Strategy
- **Use Efficient Data Structures**: Use hash maps or dictionaries to categorize and aggregate facts quickly.
- **Implement Modular Functions**: Break down the logic into smaller functions, such as `fetchFacts`, `categorizeFacts`, `computeRisk`, and `aggregateFacts`.
- **Optimize Database Queries**: Use indexes and optimized queries to ensure fast retrieval of facts from the Factbase.
- **Use Caching**: Consider caching frequently used facts or risk values to reduce repeated computations.

This algorithm ensures that only relevant, high-risk facts are used in policy evaluation, providing a dynamic and context-aware approach to access management.

Appendix A
Detailed Steps on Activity Classification and Risk Assessment
## Expanded and Elaborated Risk Assessment Algorithm

**Objective:**
The risk assessment algorithm aims to dynamically evaluate the risk associated with a user's attempt to access a resource by considering various facts about the user, their intent, behavior, the resource, and the context in which the access is requested. This allows for more informed, context-aware decisions in policy evaluation.

## Step-by-Step Explanation:

1. **Input Retrieval:**
   - Begin by receiving the input parameters: `actorId` and `resourceId`.
   - **Validation:** Check if both `actorId` (representing the user or principal) and `resourceId` (the resource being accessed) are provided. If either is missing, return an error indicating missing parameters.

2. **Fetch Facts from Database:**
   - Query the Factbase to fetch all relevant facts associated with either `actorId` or `resourceId`.
   - **Filtering by Expiry:** Only retrieve facts that have not expired (where `expiresAt` is greater than the current date).
   - **Fact Categories:** Fetch all categories of facts:
     - **Identity-Based Facts** (e.g., user's role, group membership)
     - **Intent-Based Facts** (e.g., user's declared intent, such as "delete" or "modify")
     - **Behavior-Based Facts** (e.g., user's historical actions)
     - **Resource-Based Facts** (e.g., properties of the resource being accessed)
     - **Context-Based Facts** (e.g., environmental factors like location, device, network)

3. **Categorize the Facts:**
   - **Initialize Empty Containers:** Create empty arrays or lists to hold different categories of facts:
     - `identityFacts`, `intentFacts`, `behaviorFacts`, `resourceFacts`, `contextFacts`.
   - **Iterate Through Facts:**
     - For each fact retrieved from the database, examine its `type` attribute.
     - **Categorization Logic:**
       - If `type` is `identity`, add it to `identityFacts`.
       - If `type` is `intent`, add it to `intentFacts`.
       - If `type` is `behavior`, add it to `behaviorFacts`.
       - If `type` is `resource`, add it to `resourceFacts`.
       - If `type` is `context`, add it to `contextFacts`.

4. **Risk Assessment:**
   - For each category of facts, compute a `riskValue` based on specific rules:
     - **Identity-Based Risk Calculation:**
       - Analyze the user's roles and groups.
       - **Example:** If the user belongs to a high-risk group (e.g., "contractors"), increase the risk score.
     - **Intent-Based Risk Calculation:**
       - Assess the user's intent and the nature of the action.
       - **Example:** If the intent is to "delete" critical data, assign a higher risk value than for a "read" action.
     - **Behavior-Based Risk Calculation:**
       - Examine past user behaviors such as frequency, patterns, or anomalies.
       - **Example:** If a user frequently accesses sensitive data, especially at unusual times, increase the risk score.
     - **Resource-Based Risk Calculation:**
       - Assess the nature and sensitivity of the resource.
       - **Example:** Accessing a "critical" dataroom should have a higher risk value compared to a "public" resource.
     - **Context-Based Risk Calculation:**
       - Analyze the environmental context (e.g., location, device, network).
       - **Example:** Access attempts from untrusted networks or unknown devices should increase risk.

5. **Filter Out Low-Risk Facts:**
   - **Threshold Filtering:** Remove facts with a `riskValue` below a predefined threshold (e.g., less than 50).
   - **Focus on High-Risk Facts:** Retain only high-risk facts to optimize performance and focus on critical risk factors.

6. **Aggregate Facts:**
   - **Create a Unified Data Structure:** Compile the filtered facts into a structured format (e.g., JSON object) suitable for policy evaluation.
   - **Organize by Category:** Arrange the facts under their respective categories: `identity`, `intent`, `behavior`, `resource`, `context`.

7. **Return Aggregated Facts to Policy Service:**
   - Send the aggregated facts back to the Policy Service.
   - The Policy Service will then use this enriched context to evaluate policies dynamically and determine access.

8. **Logging and Error Handling:**
   - **Log All Actions:** Keep detailed logs of each step, including facts fetched, categorized, filtered, and aggregated.
   - **Handle Errors Gracefully:** Return meaningful error messages for any failures (e.g., database errors, invalid inputs).

## Risk Assessment Algorithm - Step-by-Step Elaboration:

1. **Identity-Based Risk Calculation:**
   - **Roles and Groups:**
     - Assign higher risk if the user is part of high-risk groups (e.g., "external consultants") or holds high-privilege roles (e.g., "admin").
     - Use a base risk value for each group and role, and adjust dynamically based on context (e.g., a high-risk role accessing a sensitive resource).
   - **Access History:**
     - Review how often the user has accessed sensitive resources. Frequent access might indicate malicious intent.
   - **Historical Anomalies:**
     - Analyze patterns like sudden spikes in access requests or deviations from normal behavior.

2. **Intent-Based Risk Calculation:**
   - **Action Type:**
     - Assign risk scores based on the action type. For example:
       - "delete" or "modify" actions = high risk.
       - "read" actions = low risk.
   - **Intent Frequency:**
     - Increase risk if the intent has been repeatedly declared or is unusual for the user.

3. **Behavior-Based Risk Calculation:**
   - **Frequency and Patterns:**
     - Determine how often specific actions have been performed by the user.
     - Example: Daily downloads of critical files could raise a red flag.
   - **Anomalous Behavior:**
     - Identify unusual activities (e.g., logging in from multiple locations in a short period).
   - **Behavior Comparisons:**
     - Compare the user's current behavior against baseline behaviors of their peers or past behaviors.

4. **Resource-Based Risk Calculation:**
   - **Resource Sensitivity:**
     - Assign risk values based on the resource's classification (e.g., "public" vs. "confidential").
   - **Critical Resource Identification:**
     - Increase risk for accessing critical infrastructure resources or databases.

5. **Context-Based Risk Calculation:**
   - **Environmental Analysis:**
     - Use facts like the user's IP address, device type, and geolocation to assess risk.
   - **Unusual Contexts:**
     - Increase risk for access from new or untrusted environments (e.g., foreign country, unknown IP).

## Gathering and Computing Behaviors and Intents:

1. **Behavior Gathering:**
   - **Logs and Analytics:**
     - Use logs from system access, network activities, and application usage to gather user behaviors.
   - **Pattern Recognition:**
     - Apply machine learning models to identify patterns or anomalies in user behavior (e.g., frequency of access, time of access).
   - **Behavior Metrics:**
     - Collect metrics like login frequency, resource usage frequency, and abnormal activity rates.

2. **Intent Gathering:**
   - **Explicit User Actions:**
     - Gather declared intents directly from user actions (e.g., submitting a request to "delete" a resource).
   - **User Communication:**
     - Extract intent from user communications (e.g., emails, tickets, or chat logs indicating a planned action).
   - **Inference Models:**
     - Develop inference models to predict intent based on historical behaviors (e.g., if the user often requests deletions after accessing a resource, the model can infer future intent).

## Implementation:

- **Algorithm in the Fact Service:**
  - Implement the above algorithm to categorize, filter, and compute risk values.
  - Ensure efficient processing and optimize for scalability by caching frequently accessed facts or computed risk values.

# Appendix B
User Behavior and Intent Discovery Algorithm
To assess user behavior and intent using activity data stored within the Factbase, we need to design an algorithm that effectively analyzes both current and historical facts related to a user. This algorithm will help determine the user's intent by identifying patterns and evaluating the user's actions over time.

## Algorithm for Assessing User Behavior and Intent

### 1. **Collect Relevant Facts**

- **Input**: `actorId` (User ID) and any specific parameters for the evaluation (e.g., specific types of activities or timeframes).
- **Step**:
  - Retrieve all facts from the Factbase associated with the `actorId`.
  - Filter these facts by the types relevant to behavior and intent:
    - **Behavioral Facts**: Activities like "login," "view," "edit," "delete," etc., which reflect user actions.
    - **Intent Facts**: Stated objectives like "manage resources," "update records," "access dataroom," etc., which reflect the user's declared goals.

### 2. **Categorize and Group Facts**

- **Input**: List of facts retrieved in the previous step.
- **Step**:
  - **Temporal Grouping**: Organize facts by their `timestamp` to observe sequences of actions.
  - **Contextual Grouping**: Cluster facts by their context (e.g., device, location, session ID) to find related activities.
  - **Type-Based Grouping**: Separate facts into `intent` and `behavior` categories to evaluate stated intentions against actual behaviors.

### 3. **Analyze Temporal Patterns**

- **Input**: Grouped facts.
- **Step**:
  - **Frequency Analysis**: Calculate the frequency of specific actions over time.
    - E.g., Determine how often the user accesses the "dataroom" or performs critical actions like "delete."
  - **Trend Analysis**: Identify trends in actions.
    - E.g., Has there been an increase in access frequency or a sudden change in behavior (e.g., from "read-only" to "delete")?
  - **Sequence Analysis**: Look for sequences of actions that indicate a pattern or intent.
    - E.g., "login" → "view" → "download" might suggest data access intent.

### 4. **Contextual Evaluation**

- **Input**: Contextual information within the facts (e.g., location, device, time of day).
- **Step**:
  - **Environmental Matching**: Check if the user's actions align with usual patterns, such as accessing the system from a known location or device.
  - **Anomaly Detection**: Identify actions that deviate from normal patterns.
    - E.g., Accessing from an unknown IP address or during unusual hours.

### 5. **Risk Assessment and Scoring**

- **Input**: Results from temporal and contextual analysis.
- **Step**:
  - **Assign Risk Scores**: Assign scores to each behavior based on predefined criteria.
    - E.g., Assign a higher score to actions like "delete" in the "dataroom" or actions from an unknown IP.
  - **Aggregate Risk Values**: Sum the risk scores to get an overall risk score for the user's current session or set of activities.

### 6. **Intent Matching and Prediction**

- **Input**: Risk assessment, behavior analysis, and intent facts.
- **Step**:
  - **Match Against Known Intents**: Compare the user's actions with known intents (e.g., managing resources, accessing sensitive information).
    - E.g., Frequent "edit" or "delete" actions on critical resources could match an intent to modify or remove data.
  - **Predict Future Actions**: Use machine learning models or statistical methods to predict the user's next likely actions based on observed patterns.
    - E.g., If a user has frequently downloaded documents after viewing them, the system could predict this behavior and prepare accordingly.

### 7. **Generate and Return Evaluation Results**

- **Output**: A comprehensive assessment report or object.
- **Step**:
  - Compile a report containing:
    - **Risk Score**: Overall risk score of the user's activities.
    - **Behavior Patterns**: Key patterns observed in the user's actions.
    - **Intent Inference**: Probable user intent based on actions and contextual data.
    - **Recommended Actions**: Suggested actions based on risk score (e.g., "Alert Security," "Allow Access," "Deny Access").
  - Return the compiled report to the requesting Policy Service.

## Example Algorithm Flow

1. **Collect Facts**:
   - Retrieve facts associated with the user (`actorId`).
   - Filter for facts related to behavior (`type = 'behavior'`) and intent (`type = 'intent'`).

2. **Categorize and Analyze**:
   - Group facts by `timestamp`, `context`, and `type`.
   - Analyze patterns like frequency of "dataroom" access and unusual actions like "delete" after a long period of inactivity.

3. **Compute Risk**:
   - Assign risk scores based on activity patterns, frequency, and context.
   - Aggregate risk scores for the final risk value.

4. **Evaluate Intent**:
   - Compare observed behaviors against known intents to infer the user's likely intent.

5. **Respond**:
   - Generate an evaluation report and provide feedback to the Policy Service, indicating whether to grant or deny access based on risk and intent.

## Benefits of this Approach

- **Efficiency**: By performing data processing in the Factbase, we reduce the load on the Policy Service.
- **Real-Time Decision-Making**: Enables dynamic and context-aware policy evaluations.
- **Security**: Allows early detection of potential security threats by evaluating unusual behavior patterns.
- **Scalability**: The modular nature of the algorithm makes it scalable to handle large datasets.

## Considerations

- **Machine Learning Integration**: For advanced predictions, consider incorporating machine learning models that adapt to new patterns over time.
- **Dynamic Thresholds**: Risk scoring thresholds should be dynamic and adjustable based on current security posture and risk tolerance.

By implementing this algorithm within the Factbase, you can provide a powerful mechanism for detecting and responding to potential threats while dynamically evaluating access policies.

# Factbase Expanded Aggregation Model
To assess user behavior and intent using the activity data available within the factbase, we need to define an algorithm that processes both current and historical data from the Fact Stream. The JSON Schema provided specifies the structure of activities related to actor interactions. Here's a step-by-step algorithm to analyze user behavior and intent based on this schema:

## **Step-by-Step Algorithm for Assessing User Behavior and Intent**

### Step 1: **Retrieve Relevant Activities from the Fact Stream**
- **Input:** User ID (`actor.id`), Resource ID (`resource.id`), and any specific context criteria.
- **Action:**
  1. Query the Fact Stream to retrieve all activities where the `actor.id` matches the user ID or `object.id` matches the resource ID.
  2. Include any activities with a context that matches the specific criteria, such as `environment.region` or `user.role`.
  3. Filter out activities with an expired context or those that fall outside the relevant time window.

### Step 2: **Categorize Activities**
- **Action:**
  1. **Categorize** activities by `type` (e.g., `Create`, `Update`, `Delete`, `Access`, `PolicyEvaluation`, `AnomalyDetection`).
  2. Group activities into different behavioral patterns, such as:
     - **Access Patterns**: Frequency and type of access to resources (`Access` activities).
     - **Modification Patterns**: Creation, update, or deletion of resources (`Create`, `Update`, `Delete` activities).
     - **Policy Interaction Patterns**: Interactions involving policy evaluations (`PolicyEvaluation` activities).
     - **Anomaly Detection Patterns**: Any detected anomalies related to actor interactions (`AnomalyDetection` activities).

### Step 3: **Compute Behavior Metrics**
- **Action:**
  1. For each categorized activity, compute various metrics:
     - **Frequency**: Number of times an activity type (e.g., `Access`) occurred within a specific time frame.
     - **Time Distribution**: Analyze the time intervals between consecutive activities to identify patterns (e.g., frequent access at certain hours).
     - **Location Consistency**: Check if the activities originate from a consistent geographic location or multiple locations (`environment.region` and `environment.ip`).
     - **Device Consistency**: Determine if the same device or multiple devices are used for accessing resources (`environment.device`).
     - **Success/Failure Rate**: Calculate the rate of successful versus failed actions (`result.type` in `Result` object).

### Step 4: **Identify Behavioral Anomalies**
- **Action:**
  1. Identify anomalies by comparing current behavior metrics with historical patterns:
     - Unusual access frequency or time (e.g., a spike in access attempts).
     - Access from uncommon locations or devices.
     - High failure rates for sensitive actions (e.g., multiple `Delete` failures).
  2. Tag anomalies for further investigation (e.g., flagging `AnomalyDetection`).

### Step 5: **Assess User Intent**
- **Action:**
  1. Extract intent-related activities from the Fact Stream (`type: "PolicyEvaluation"` or `type: "AnomalyDetection"`).
  2. Evaluate the `intent` context to understand the high-level objectives of the user:
     - For example, if multiple activities involve "manage-resources," the intent could be administrative or operational.
  3. Correlate intent with the actual behavior observed to validate or refute the user's stated purpose.

### Step 6: **Compute Risk Scores**
- **Action:**
  1. Compute a risk score for the user based on identified anomalies, intent mismatches, and behavioral inconsistencies:
     - Use predefined rules or machine learning models to calculate risk scores based on metrics such as access frequency, location consistency, etc.
  2. Adjust the risk score dynamically based on real-time activity.

### Step 7: **Generate Insights for Policy Evaluation**
- **Action:**
  1. Compile the computed metrics, identified anomalies, and risk scores into an actionable summary.
  2. Provide this summary to the Policy Service to support dynamic and context-aware policy decisions:
     - For example, deny access if the risk score is above a threshold or alert for suspicious behavior.

### Step 8: **Update Fact Stream**
- **Action:**
  1. Record the assessment results back into the Fact Stream for future reference:
     - Create new `Activity` entries of type `AnomalyDetection` or `PolicyEvaluation` to track outcomes and adjustments.

## **Example Algorithm Flow Using Fact Streams**

1. **Retrieve Relevant Activities:**
   - Fetch all `Access` activities by user `John Doe` to resource `dataroom123`.

2. **Categorize Activities:**
   - Identify that `John Doe` accessed `dataroom123` 10 times in the last 24 hours.

3. **Compute Behavior Metrics:**
   - Determine the access frequency is above the normal threshold.
   - Identify that `John Doe` accessed `dataroom123` from multiple geographic regions.

4. **Identify Behavioral Anomalies:**
   - Flag access attempts from unknown locations as anomalies.

5. **Assess User Intent:**
   - Evaluate activities with `intent: manage-resources` to verify the purpose of the accesses.

6. **Compute Risk Scores:**
   - Calculate a risk score of `75` based on the anomalies and inconsistent behavior.

7. **Generate Insights for Policy Evaluation:**
   - Provide the Policy Service with the risk score and identified anomalies.

8. **Update Fact Stream:**
   - Log new activities of `AnomalyDetection` type to track potential policy violations.

## **Benefits of This Algorithm**

- **Dynamic Policy Adjustment**: Allows policies to adapt in real-time based on current and historical user behavior.
- **Enhanced Security**: Detects and mitigates risks by identifying suspicious behavior patterns.
- **Context Awareness**: Incorporates various contextual factors, such as location and device usage, for more precise policy evaluations.
- **Scalable Solution**: Supports a large volume of activity data by leveraging the Fact Stream structure.

By applying this algorithm, the system can dynamically assess user behavior and intent, helping to enforce more nuanced and context-aware access policies.
