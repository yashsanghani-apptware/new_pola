
## **Chapter 1: Introduction**

### **1.1 Purpose of the Guide**

The Pola Schema User Guide is designed to provide a comprehensive and detailed understanding of the Pola Schema, a JSON-based schema used for defining and managing access control policies, event-driven actions, role definitions, and variable exports within the Agsiri Identity and Access Management (IAM) ecosystem. This guide aims to equip developers, security engineers, architects, and system administrators with the knowledge required to implement, manage, and maintain policies effectively using the Pola Schema.

The Pola Schema is a pivotal component in the Agsiri IAM platform, which enables organizations to enforce security, manage access, and automate responses to various events in a controlled and efficient manner. By providing a structured approach to defining policies using JSON, the Pola Schema ensures consistency, interoperability, and ease of integration across various systems and services within an organization. This guide delves deep into the syntax, semantics, and best practices for leveraging the Pola Schema to its fullest potential, ensuring that users can create robust, scalable, and maintainable policies.

### **1.2 Audience**

This guide is intended for a broad audience that spans multiple roles within an organization:

- **Developers**: For developers, the Pola Schema User Guide provides the necessary syntax and examples to implement policies directly within applications. Understanding how to define and manage policies using JSON schema enables developers to integrate security controls natively within their codebase, providing better security posture and compliance.

- **Security Engineers**: Security engineers are responsible for designing and implementing security measures across an organization's digital infrastructure. This guide helps them understand how to use the Pola Schema to create granular and fine-tuned access control policies that align with the organization's security policies and regulations.

- **System Architects**: For architects, this guide offers insights into designing IAM architectures that are scalable, secure, and aligned with business objectives. It discusses how to incorporate Pola policies into broader IAM strategies, leveraging Agsiri's capabilities to manage access control and automate responses to security events.

- **System Administrators**: System administrators tasked with managing day-to-day operations will find this guide useful for maintaining and auditing policies, ensuring that the organization adheres to internal and external security requirements.

- **Compliance Officers**: Compliance officers responsible for ensuring regulatory compliance will benefit from understanding how Pola policies help enforce data protection laws, such as GDPR, HIPAA, and CCPA, through automated and auditable access controls.

- **Product Managers and Business Analysts**: These professionals can use the guide to understand the policy capabilities that Agsiri offers, ensuring that business requirements are met in terms of security, data privacy, and user experience.

### **1.3 Overview of Pola Schema**

The Pola Schema is a JSON schema specification that defines various types of policies, rules, conditions, actions, and outputs that govern access control, resource management, and event-driven automation within the Agsiri IAM platform. The schema defines seven primary policy types:

1. **PrincipalPolicy**: Governs the permissions and actions available to users, roles, and groups.
2. **ResourcePolicy**: Defines the actions allowed on specific resources and the conditions under which these actions can be executed.
3. **EventPolicy**: Specifies actions to be taken when certain events occur, such as logging, notification, and approval workflows.
4. **RolePolicy**: Manages the permissions and actions associated with specific roles within an organization.
5. **GroupPolicy**: Defines access control and permissions for groups of users, providing a layer of abstraction for managing user access.
6. **DerivedRoles**: Allows for the creation of dynamic roles based on conditions and contexts, enabling more flexible access control.
7. **ExportVariables**: Provides a way to export variables and make them available for use across multiple policies or contexts.

The Pola Schema offers a highly flexible and extensible framework for defining complex policies that can adapt to the changing needs of modern organizations. It supports a range of features, including:

- **Conditions and Rules**: The schema allows for the definition of conditions that govern when certain rules should be applied. This provides a way to create context-aware policies that dynamically adapt to different scenarios.
- **Actions and Effects**: Each policy type can specify actions (such as allowing or denying access) and effects (such as notifications, logging, or alerting) that are executed when conditions are met.
- **Notifications and Outputs**: The schema supports notifying different services or systems when certain actions are triggered, as well as generating outputs that provide feedback or logging information.
- **Variables and Metadata**: Policies can incorporate variables to provide dynamic and context-aware policy evaluation. Metadata allows for tracking and managing policy changes over time, providing a robust auditing mechanism.

### **1.4 Importance of Pola Schema in Agsiri IAM**

The Agsiri IAM platform is designed to offer highly granular and fine-tuned access control, which is critical for modern organizations that manage sensitive data and must comply with stringent regulatory requirements. The Pola Schema plays a central role in this by providing a standardized way to define, enforce, and manage policies that dictate access control and automated responses to events across the organization’s digital ecosystem.

#### **1.4.1 Granular Access Control**

One of the most significant advantages of using the Pola Schema is its ability to provide granular access control. Unlike traditional access control models that rely on simple role-based access control (RBAC), the Pola Schema enables the creation of more sophisticated policies that consider various conditions and contexts. This flexibility allows organizations to implement a principle of least privilege (PoLP) more effectively, reducing the risk of unauthorized access or data breaches.

For example, a `PrincipalPolicy` can be defined to allow a user with the `admin` role to perform certain actions only if specific conditions, such as time of day or IP address, are met. Similarly, a `ResourcePolicy` can be used to restrict access to a resource based on its classification or sensitivity level, ensuring that only authorized users can perform actions like read, write, or delete.

#### **1.4.2 Dynamic and Context-Aware Policies**

The Pola Schema supports dynamic and context-aware policy definitions, which are crucial for organizations that operate in rapidly changing environments. By allowing policies to be defined with conditions that evaluate runtime variables, the schema enables policies to adapt to different scenarios dynamically. This feature is particularly valuable for managing complex environments, such as cloud-native applications, microservices architectures, and hybrid cloud deployments.

For example, an `EventPolicy` can be defined to trigger specific actions, such as notifying a security team or logging an event, when a critical event occurs, such as unauthorized access to a sensitive resource. This dynamic capability allows organizations to automate their response to potential security incidents, reducing the time to detection and response.

#### **1.4.3 Interoperability and Integration**

The Pola Schema is designed to be interoperable with various systems and services, making it an ideal choice for organizations looking to integrate their IAM solution with other platforms. By using a JSON-based schema, the Pola Schema ensures compatibility with a wide range of programming languages, libraries, and frameworks, enabling seamless integration with existing infrastructure and applications.

Moreover, the Agsiri IAM platform provides a comprehensive set of APIs that allow organizations to manage policies, roles, and resources programmatically. This API-driven approach enables organizations to integrate their security and access control policies into their CI/CD pipelines, ensuring that security is built into the development process from the ground up.

#### **1.4.4 Automation and Efficiency**

By defining policies as code using the Pola Schema, organizations can achieve a high degree of automation in their security and access control management processes. Policies can be versioned, reviewed, and audited like any other piece of code, allowing organizations to maintain a clear history of changes and ensure that policies remain aligned with business requirements and regulatory obligations.

The use of `ExportVariables` within the schema allows organizations to define reusable variables that can be shared across multiple policies. This reduces redundancy and ensures consistency in policy definitions, making it easier to manage policies at scale. Additionally, the use of `DerivedRoles` allows for the creation of roles that automatically adapt to changing conditions, reducing the administrative overhead associated with managing access control in large, complex environments.

### **1.5 Benefits of Using Pola Schema**

The Pola Schema provides several key benefits that make it a powerful tool for managing access control and policy enforcement within the Agsiri IAM platform:

1. **Flexibility**: The schema allows for the definition of a wide range of policies, from simple role-based access control to complex, condition-based policies that govern actions based on context.

2. **Consistency**: By providing a standardized schema for policy definition, the Pola Schema ensures consistency across the organization’s IAM implementation, reducing the likelihood of misconfigurations or security gaps.

3. **Scalability**: The schema is designed to support large-scale deployments, allowing organizations to manage access control across thousands of users, roles, groups, and resources efficiently.

4. **Security**: The schema’s support for fine-grained access control, dynamic policy evaluation, and automated event responses helps organizations improve their security posture and reduce the risk of data breaches or unauthorized access.

5. **Compliance**: The schema’s auditing and metadata capabilities provide a robust framework for ensuring compliance with regulatory requirements, such as GDPR, HIPAA, and CCPA, by enforcing access controls and maintaining an auditable history of policy changes.

6. **Interoperability**: The use of JSON and support for RESTful APIs ensures that the Pola Schema can be easily integrated with existing systems and applications, enabling organizations to extend their IAM capabilities across their entire digital ecosystem.

7. **Ease of

 Use**: The schema provides a clear and well-defined structure for policy definition, making it easy for developers, security engineers, and administrators to create and manage policies without requiring deep expertise in IAM systems.

### **1.6 Guide Structure and How to Use This Guide**

The **Pola Schema User Guide** is structured to provide both a high-level overview and a deep dive into the technical details of the Pola Schema and its various components. Each chapter builds upon the previous one, providing a logical progression from basic concepts to advanced use cases and best practices.

- **Chapter 1: Introduction**: Sets the foundation by providing an overview of the Pola Schema, its purpose, audience, and significance in the Agsiri IAM ecosystem.
  
- **Chapter 2: Pola Schema Overview**: Discusses the key elements of the schema, including its structure, syntax, and core concepts such as conditions, actions, effects, notifications, and outputs.

- **Chapter 3: Structure of the Pola Schema**: Explores the JSON schema elements in detail, explaining the use of `$schema`, `$id`, `definitions`, `properties`, and more.

- **Chapters 4-7: Detailed Policy Definitions**: Each chapter provides an in-depth look at one of the seven policy types, explaining their structure, use cases, and examples.

- **Chapter 8: Core Components and Subschemas**: Discusses the reusable components within the schema, such as conditions, variables, derived roles, and metadata, and how they contribute to policy definitions.

- **Chapter 9: Advanced Policy Use Cases and Examples**: Provides real-world examples and use cases that illustrate how to combine multiple policy types, define complex conditions and actions, and implement best practices.

- **Chapter 10: Validation and Testing of Policies**: Covers the tools and techniques for validating and testing policies defined using the Pola Schema to ensure they behave as expected.

- **Chapter 11: Integration with Agsiri IAM and Other Systems**: Discusses how to integrate Pola policies with Agsiri IAM and other platforms, leveraging APIs for policy management and automation.

- **Chapter 12: Conclusion**: Summarizes the key takeaways and provides links to additional resources for further reading.

- **Appendices**: Provide supplementary information, such as a glossary of terms, a complete reference for the JSON schema, and a collection of example policies for various scenarios.

### **1.7 Conclusion**

The **Pola Schema User Guide** is an essential resource for anyone looking to leverage the power of the Agsiri IAM platform to implement robust, scalable, and maintainable access control policies. By providing a comprehensive overview of the Pola Schema and its various components, this guide empowers users to create policies that meet their organization’s security, compliance, and business requirements. Whether you are a developer, security engineer, system architect, or administrator, this guide will provide the knowledge and tools you need to succeed in managing access control and event-driven automation within your organization.

## **Chapter 2: Pola Schema Overview**

### **2.1 Understanding JSON Schema**

**JSON Schema** is a powerful and flexible way to describe the structure, validation rules, and documentation of JSON data. As a standard of the IETF (Internet Engineering Task Force), JSON Schema defines a format for specifying the properties and constraints of JSON objects. In the context of the Pola Schema, JSON Schema is employed to define policies that govern access control, event-driven actions, roles, groups, and derived roles within the Agsiri IAM (Identity and Access Management) platform.

The primary purpose of using JSON Schema in Pola is to ensure that all policy definitions are consistent, valid, and interoperable. By providing a structured schema that outlines what constitutes a valid policy, JSON Schema helps developers, security engineers, and system administrators avoid errors and ensure that policies conform to the expected format.

**Key Benefits of Using JSON Schema for Pola Schema:**

- **Validation**: JSON Schema provides a means to validate JSON objects against a defined schema. This ensures that all policy definitions adhere to the rules and constraints defined within the Pola Schema, preventing invalid or malformed policies from being deployed.
  
- **Consistency**: By defining policies through a standardized schema, the Pola Schema ensures consistency across policy definitions, reducing the chances of misconfigurations and errors.

- **Documentation**: JSON Schema serves as a self-documenting format, making it easier for developers and administrators to understand the structure and requirements of each policy type. The schema can include descriptions, examples, and constraints that help clarify the intended use of each policy element.

- **Interoperability**: JSON is a widely adopted data format, and JSON Schema builds upon this standard, making it easier to integrate Pola policies with various programming languages, frameworks, and tools.

- **Automation**: The structured nature of JSON Schema allows for automated tooling, such as policy generation, validation, testing, and deployment, within CI/CD pipelines. This automation enhances the efficiency of policy management.

### **2.2 Key Concepts in Pola Schema**

The Pola Schema defines several key concepts that form the foundation of the policy management system within Agsiri IAM. These concepts include various policy types, rules, actions, conditions, effects, variables, derived roles, notifications, and outputs. Understanding these core components is essential for defining robust, flexible, and dynamic policies that meet the organization's security and compliance needs.

#### **2.2.1 Policies**

Policies are the central entities within the Pola Schema. They define the rules, conditions, and actions that govern access control, resource management, and event-driven actions. The Pola Schema supports seven primary policy types:

1. **PrincipalPolicy**: This policy type governs the permissions and actions available to principals, such as users, roles, and groups. It defines what actions a principal can perform on specific resources under certain conditions. For example, a `PrincipalPolicy` may specify that a user with the role `Admin` can `READ` and `WRITE` on a resource `Document` but only if the `Document` is in an `ACTIVE` state.

2. **ResourcePolicy**: This policy type defines what actions are allowed on specific resources and under what conditions. `ResourcePolicy` focuses on the resource itself and specifies who can perform what actions. For instance, it could define that only users with the role `Manager` can delete a resource `Project` if it is marked as `COMPLETED`.

3. **EventPolicy**: `EventPolicy` specifies actions to be taken when certain events occur. This policy type is highly dynamic and supports automated responses to events such as unauthorized access attempts, changes in user roles, or modifications to sensitive data. Actions triggered by `EventPolicy` can include logging, notifications, alerts, or triggering workflows for further approval.

4. **RolePolicy**: This policy type manages the permissions and actions associated with specific roles within an organization. It is used to define what resources a role can access and what actions can be performed. `RolePolicy` helps to centralize role-based access control (RBAC) and can be used to enforce least-privilege access principles.

5. **GroupPolicy**: `GroupPolicy` defines access control and permissions for groups of users. It provides a layer of abstraction for managing user access by grouping users into categories and applying policies to these groups. This type of policy is particularly useful in large organizations where managing individual user access would be cumbersome.

6. **DerivedRoles**: `DerivedRoles` allows the creation of dynamic roles based on conditions and contexts. Unlike static roles, which are predefined, derived roles can adapt to changing conditions and provide more flexible access control. For example, a derived role `TemporaryAdmin` could be created based on a user's current location, time, and other attributes.

7. **ExportVariables**: `ExportVariables` provides a way to export specific variables and make them available for use across multiple policies or contexts. This feature is useful when policies share common attributes or data points that need to be referenced consistently. Exported variables can be reused in multiple policy definitions, promoting consistency and reducing redundancy.

#### **2.2.2 Rules and Actions**

**Rules** are the building blocks of policies in the Pola Schema. They define the conditions under which certain actions can be taken on resources or in response to specific events. A rule typically consists of three main components: a `condition`, an `action`, and an `effect`.

- **Conditions**: Conditions define the criteria that must be met for a rule to be applied. Conditions can be based on attributes of users, resources, or environments. For example, a condition may specify that an action can only be taken if the user's role is `Admin` and the resource is in `ACTIVE` status.

- **Actions**: Actions specify what should happen when a rule is applied. Actions can include operations such as `READ`, `WRITE`, `DELETE`, `NOTIFY`, `LOG`, `APPROVE`, `REVIEW`, etc. Actions can vary depending on the type of policy (e.g., PrincipalPolicy, EventPolicy).

- **Effects**: Effects define the outcome of an action. The Pola Schema supports two primary effects: `EFFECT_ALLOW` and `EFFECT_DENY`. `EFFECT_ALLOW` permits the specified action, while `EFFECT_DENY` blocks it. By combining actions and effects, policies can enforce fine-grained access control and automate responses to events.

#### **2.2.3 Conditions and Effects**

**Conditions** are crucial components of the Pola Schema, providing the logic that determines when and how policies are applied. Conditions can be simple or complex, depending on the use case. The Pola Schema defines a variety of condition types that allow for granular control:

- **Match Conditions**: These conditions evaluate specific attributes and determine if they match predefined criteria. For example, a match condition could check if a user's department is `Finance` or if the request is coming from a specific IP range.

- **Script Conditions**: Script conditions use more complex logic, such as custom scripts written in a scripting language, to determine if the condition is met. This allows for highly customizable policies that can adapt to dynamic environments.

- **Composite Conditions**: Composite conditions combine multiple conditions using logical operators such as `AND` (`all`), `OR` (`any`), and `NOT` (`none`). These composite conditions provide more flexibility and power in defining complex policy rules.

**Effects** determine the outcome when a policy is applied. The Pola Schema primarily uses two effects:

- **EFFECT_ALLOW**: Allows the action specified in the policy.
- **EFFECT_DENY**: Denies the action specified in the policy.

By combining conditions and effects, the Pola Schema enables organizations to create policies that are both precise and flexible. For example, a `PrincipalPolicy` might allow a user with the `Manager` role to `EDIT` a `Report` resource only if the report is in `DRAFT` status and the user is in the `Finance` department.

#### **2.2.4 Variables and Derived Roles**

**Variables** play a key role in the Pola Schema by providing dynamic data that can be used to evaluate conditions and determine policy outcomes. Variables can be imported or defined locally within a policy. The use of variables makes policies more flexible and reusable by allowing them to adapt to different contexts and scenarios.

- **Import Variables**: These are variables imported from external sources or other policies. They provide a way to share common data points across multiple policies, ensuring consistency and reducing redundancy.

- **Local Variables**: Local variables are defined within a policy and are only applicable to that specific policy context. These variables can be used to store temporary or policy-specific data.

**Derived Roles** are another powerful feature of the Pola Schema that allows for the creation of roles based on dynamic conditions and contexts. Unlike static roles that are predefined and fixed, derived roles can adapt to changing conditions. For example, a derived role `EmergencyResponder` might be created based on a user's location, current time, and access to certain resources.

Derived roles provide a higher level of flexibility and can be used to implement complex access control scenarios that traditional role-based access control (RBAC) systems cannot handle. They enable organizations to dynamically adapt their access control policies based on the current context, reducing the administrative overhead and enhancing security.

#### **2.2.5 Notifications and Outputs**

**Notifications** are a key component of the Pola Schema, enabling policies to trigger actions that notify other systems or services when certain events

 occur. Notifications can be used to alert administrators, trigger workflows, or integrate with external systems for automated incident response.

- **Service Types**: The Pola Schema supports multiple notification service types, including `webservice`, `pubsub`, and `queue`. Each service type has its own configuration parameters, such as `url`, `method`, `headers`, `topic`, `queueName`, and `messageGroupId`.

- **Payload Schema**: The `payloadSchema` defines the structure of the data that will be sent in the notification. This ensures that notifications are consistent and conform to the expected format.

- **Conditions for Notifications**: Notifications can be triggered based on conditions, such as `conditionMet` or `ruleActivated`, providing flexibility in determining when and how notifications should be sent.

**Outputs** are another important feature of the Pola Schema that provides feedback or logging information when a policy is applied. Outputs can be defined to provide detailed information about the result of a policy action, helping with auditing, compliance, and troubleshooting.

- **Output Expressions**: The `expr` field defines the expression that determines the output content.
- **Output Conditions**: The `when` field specifies the conditions under which the output should be generated, such as `conditionNotMet` or `ruleActivated`.

By combining notifications and outputs, the Pola Schema enables organizations to automate responses to events, provide visibility into policy enforcement, and ensure compliance with security and regulatory requirements.

### **2.3 Overall Policy Definition**

The Pola Schema defines policies as JSON objects that encapsulate a variety of policy types, rules, conditions, actions, and effects, all contributing to a robust access control and event management system. The schema's design allows for the definition of complex and dynamic policies that can adapt to changing conditions and requirements, providing organizations with a flexible and scalable framework for managing security and compliance.

Each policy type in the Pola Schema—`PrincipalPolicy`, `ResourcePolicy`, `EventPolicy`, `RolePolicy`, `GroupPolicy`, `DerivedRoles`, and `ExportVariables`—serves a specific purpose and can be combined to create a comprehensive IAM strategy. For example:

- **Access Control**: Using `PrincipalPolicy`, `RolePolicy`, and `GroupPolicy`, organizations can define who has access to what resources and under what conditions.
- **Resource Management**: `ResourcePolicy` allows organizations to define how resources are managed, who can perform what actions, and under what conditions.
- **Event-Driven Automation**: `EventPolicy` enables organizations to automate responses to specific events, such as security incidents or changes in user roles, improving incident response times and reducing risk.
- **Dynamic Roles**: `DerivedRoles` provide a mechanism for creating roles that adapt to changing conditions, reducing administrative overhead and enhancing security.
- **Consistency and Reusability**: `ExportVariables` allow for the definition of reusable variables that can be shared across multiple policies, ensuring consistency and reducing redundancy.

By providing a structured and extensible framework for policy definition, the Pola Schema empowers organizations to create, manage, and enforce policies that are aligned with their business objectives, security requirements, and compliance obligations. The schema's flexibility, combined with its powerful features such as conditions, actions, notifications, outputs, and derived roles, makes it an ideal choice for managing access control and event-driven actions in modern, complex environments.


## **Chapter 3: Structure of the Pola Schema**

The Pola Schema is a JSON-based schema that provides a flexible and robust framework for defining and managing access control policies, event-driven actions, roles, groups, and dynamic roles within the Agsiri IAM platform. This chapter explores the fundamental structure of the Pola Schema, providing a detailed overview of its elements, policy types, common components, and relationships. We will also explore usage scenarios and examples to demonstrate the practical applications of the schema in real-world environments.

### **3.1 Schema Elements**

The Pola Schema is built on several core JSON schema elements that define the structure, validation rules, and properties of policies. These schema elements provide a foundation for ensuring consistency, interoperability, and validation across policy definitions.

#### **3.1.1 $schema**

The `$schema` element is a required property in every JSON schema that defines the version of the JSON Schema standard being used. It serves as a reference to the specification that governs the rules and constraints for the schema. In the Pola Schema, `$schema` is set to `http://json-schema.org/draft-07/schema#`, indicating that it follows the draft-07 version of the JSON Schema specification. This allows tools and validators to understand how to process and validate the JSON objects defined by the schema.

```json
"$schema": "http://json-schema.org/draft-07/schema#"
```

#### **3.1.2 $id**

The `$id` element provides a unique identifier for the schema. It acts as a URI (Uniform Resource Identifier) that defines the location or namespace of the schema. In the Pola Schema, `$id` is set to a URL that uniquely identifies the schema version and its context within the Agsiri IAM platform.

```json
"$id": "https://api.pola.dev/v1.3.2/agsiri/policy/v1/policy.schema.json"
```

#### **3.1.3 Definitions**

`Definitions` is a key element in JSON Schema that allows for the reuse of schema components across different parts of the schema. In the Pola Schema, `definitions` is used to define reusable subschemas for policy types, conditions, actions, notifications, roles, and other components. Each definition within the `definitions` element is a subschema that can be referenced elsewhere using the `$ref` keyword.

```json
"definitions": {
    "pola.policy.v1.Condition": { ... },
    "pola.policy.v1.PrincipalPolicy": { ... },
    ...
}
```

#### **3.1.4 Properties**

`Properties` define the expected fields within a JSON object. In the context of the Pola Schema, `properties` describe the fields that each policy type or subschema must contain. For example, the `PrincipalPolicy` subschema contains properties such as `principal`, `rules`, `scope`, `variables`, and `version`.

```json
"properties": {
    "principal": {
        "type": "string",
        "minLength": 1
    },
    "rules": {
        "type": "array",
        "items": { "$ref": "#/definitions/pola.policy.v1.PrincipalRule" }
    },
    ...
}
```

#### **3.1.5 Required**

The `required` element specifies the fields that must be present in a JSON object for it to be considered valid. This ensures that critical fields are always included in policy definitions. For example, the `PrincipalPolicy` requires `principal` and `version` fields.

```json
"required": ["principal", "version"]
```

### **3.2 Policy Types**

The Pola Schema defines seven distinct policy types, each serving a unique purpose in managing access control, event-driven actions, roles, and variables within an organization. Each policy type is a JSON object defined using the schema's `definitions` element.

#### **3.2.1 PrincipalPolicy**

**Overview**: `PrincipalPolicy` governs the permissions and actions available to principals, such as users, roles, and groups. It defines what actions a principal can perform on specific resources under certain conditions.

**Significance**: `PrincipalPolicy` is crucial for managing user access control in an organization. It allows for fine-grained control over who can perform what actions, ensuring compliance with security and regulatory requirements.

**Use Case Example**:

- **Scenario**: A company wants to enforce that only users with the role `HR_Manager` can `READ` and `UPDATE` employee records in the `EmployeeDB` resource.
- **Policy Definition**:
    ```json
    {
      "principal": "HR_Manager",
      "version": "1.0",
      "rules": [
        {
          "resource": "EmployeeDB",
          "actions": [
            {
              "action": "READ",
              "effect": "EFFECT_ALLOW"
            },
            {
              "action": "UPDATE",
              "effect": "EFFECT_ALLOW"
            }
          ]
        }
      ]
    }
    ```

#### **3.2.2 ResourcePolicy**

**Overview**: `ResourcePolicy` defines the actions allowed on specific resources and under what conditions. It focuses on the resource itself and specifies who can perform what actions.

**Significance**: `ResourcePolicy` is essential for managing resource access control and ensuring that sensitive resources are protected from unauthorized access.

**Use Case Example**:

- **Scenario**: A cloud service provider wants to allow only users with the role `DataAnalyst` to query (`EXECUTE_QUERY`) datasets in the `AnalyticsDB` resource when the data is marked as `public`.
- **Policy Definition**:
    ```json
    {
      "resource": "AnalyticsDB",
      "version": "1.1",
      "rules": [
        {
          "actions": ["EXECUTE_QUERY"],
          "effect": "EFFECT_ALLOW",
          "condition": {
            "match": {
              "expr": "data.classification == 'public'"
            }
          }
        }
      ]
    }
    ```

#### **3.2.3 EventPolicy**

**Overview**: `EventPolicy` specifies actions to be taken when certain events occur. This policy type is highly dynamic and supports automated responses to events such as unauthorized access attempts, role changes, or modifications to sensitive data.

**Significance**: `EventPolicy` enhances security posture by automating incident response and integrating with SIEM (Security Information and Event Management) systems for proactive threat detection.

**Use Case Example**:

- **Scenario**: An organization wants to notify the security team when an unauthorized access attempt occurs on the `FinancialReports` resource.
- **Policy Definition**:
    ```json
    {
      "event": "UnauthorizedAccessAttempt",
      "version": "1.0",
      "rules": [
        {
          "resource": "FinancialReports",
          "conditions": {
            "match": {
              "expr": "user.role != 'Auditor'"
            }
          },
          "actions": [
            {
              "action": "NOTIFY",
              "effect": "EFFECT_ALLOW",
              "notify": {
                "service": "webservice",
                "serviceConfig": {
                  "url": "https://securityteam.example.com/notify",
                  "method": "POST"
                }
              }
            }
          ]
        }
      ]
    }
    ```

#### **3.2.4 RolePolicy**

**Overview**: `RolePolicy` manages the permissions and actions associated with specific roles within an organization. It centralizes role-based access control (RBAC) and enforces least-privilege access principles.

**Significance**: `RolePolicy` simplifies access control management by grouping permissions based on roles, making it easier to manage and audit access rights.

**Use Case Example**:

- **Scenario**: A healthcare provider wants to allow the role `Doctor` to access patient records in `PatientDB` only for `READ` operations.
- **Policy Definition**:
    ```json
    {
      "role": "Doctor",
      "version": "1.0",
      "rules": [
        {
          "resource": "PatientDB",
          "actions": [
            {
              "action": "READ",
              "effect": "EFFECT_ALLOW"
            }
          ]
        }
      ]
    }
    ```

#### **3.2.5 GroupPolicy**

**Overview**: `GroupPolicy` defines access control and permissions for groups of users. It provides a layer of abstraction for managing user access by grouping users into categories and applying policies to these groups.

**Significance**: `GroupPolicy` is especially useful in large organizations where managing individual user access would be impractical. It allows for scalable and efficient access control management.

**Use Case Example**:

- **Scenario**: A financial institution wants to restrict access to the `TradingPlatform` resource to the `TradersGroup` for `EXECUTE` actions during business hours.
- **Policy Definition**:
    ```json
    {
      "group": "TradersGroup",
      "version": "1.2",
      "rules": [
        {
          "resource": "TradingPlatform",
          "actions": [
            {
              "action": "EXECUTE",
              "effect": "EFFECT_ALLOW",
              "condition": {
                "match": {
                  "expr": "time.now.hour >= 9 && time.now.hour <= 17"
                }
              }
            }
          ]
       

 }
      ]
    }
    ```

#### **3.2.6 DerivedRoles**

**Overview**: `DerivedRoles` allows the creation of dynamic roles based on conditions and contexts. Derived roles are not statically defined but are generated based on specific conditions, providing more flexibility in access control.

**Significance**: `DerivedRoles` enables organizations to dynamically adapt access control policies based on runtime information, reducing administrative overhead and enhancing security.

**Use Case Example**:

- **Scenario**: An e-commerce platform wants to create a `TemporaryAdmin` role for users who are on-call duty during weekends.
- **Policy Definition**:
    ```json
    {
      "name": "TemporaryAdmin",
      "definitions": [
        {
          "name": "OnCallDuty",
          "parentRoles": ["Admin"],
          "condition": {
            "match": {
              "expr": "user.onCall == true && dayOfWeek.now in ['Saturday', 'Sunday']"
            }
          }
        }
      ],
      "variables": {
        "import": ["user.onCall", "dayOfWeek.now"]
      }
    }
    ```

#### **3.2.7 ExportVariables**

**Overview**: `ExportVariables` provides a way to export specific variables and make them available for use across multiple policies or contexts. This promotes consistency and reduces redundancy.

**Significance**: `ExportVariables` ensures that commonly used variables are defined in one place, making policy management more efficient and less error-prone.

**Use Case Example**:

- **Scenario**: A multinational corporation wants to define a variable `region` to specify user regions, which is used across multiple policies for regional access control.
- **Policy Definition**:
    ```json
    {
      "name": "RegionVariables",
      "definitions": {
        "region": "user.region"
      }
    }
    ```

### **3.3 Common Elements Across Policies**

The Pola Schema defines several common elements that are shared across different policy types, enabling a consistent and standardized approach to policy definition.

#### **3.3.1 Conditions**

**Conditions** determine when a policy rule should be applied. They are defined using `match`, `script`, or composite conditions (`all`, `any`, `none`). Conditions can be used to enforce context-aware policies based on user attributes, resource states, or environmental factors.

#### **3.3.2 Rules**

**Rules** are the core building blocks of each policy type, specifying what actions can be taken and under what conditions. Rules can include one or more actions, and each action has an associated effect (`EFFECT_ALLOW` or `EFFECT_DENY`).

#### **3.3.3 Actions**

**Actions** define the operations that can be performed when a rule is applied. They can range from simple CRUD operations (`READ`, `WRITE`, `DELETE`) to complex actions like `NOTIFY`, `LOG`, `APPROVE`, and `REVIEW`.

#### **3.3.4 Notify and Output**

**Notify** and **Output** components provide mechanisms for logging, alerting, and notifying external systems when policies are applied. These elements are essential for integrating with external incident response, monitoring, and audit systems.

### **3.4 Relationships and References**

The Pola Schema uses `$ref` references and `oneOf` constructs to define relationships between different schema elements. Understanding these constructs is crucial for navigating the schema and creating valid policies.

#### **3.4.1 Understanding $ref References**

`$ref` is a JSON Schema keyword that allows the reuse of schema components by referencing definitions. In the Pola Schema, `$ref` is widely used to reference subschemas for conditions, actions, notifications, and other components.

#### **3.4.2 Understanding oneOf Constructs**

`oneOf` is another JSON Schema construct used to specify that a given element must match exactly one of the provided subschemas. It is used in the Pola Schema to define mutually exclusive options, such as different types of actions or conditions.

### **3.5 Conclusion**

The structure of the Pola Schema provides a powerful, flexible, and extensible framework for defining and managing access control policies, event-driven actions, roles, and dynamic roles. By leveraging JSON Schema constructs, common elements, and robust referencing mechanisms, the Pola Schema enables organizations to create consistent, scalable, and secure policies that adapt to changing environments and business needs.

Let's continue with detailed and compliant examples for each policy type as per the JSON schema provided.

## **Chapter 4: Detailed Policy Definitions**

### **4.1 PrincipalPolicy**

#### **Overview**

`PrincipalPolicy` is used to define the permissions and actions that a specific user (principal) can perform on certain resources under defined conditions. This policy ensures users have appropriate permissions to perform actions on resources while adhering to organizational security and compliance requirements.

**Use Cases**:
- Grant specific users access to certain resources.
- Define conditions under which user access is allowed or denied.
- Provide fine-grained access control based on user attributes and context.

#### **Key Fields**

- **apiVersion** (mandatory): The version of the API (`api.pola.dev/v1`).
- **principal** (mandatory): The unique identifier for the principal (user) to whom the policy applies.
- **rules** (mandatory): An array of `PrincipalRule` objects defining the actions allowed or denied for the principal on specific resources.
- **scope** (optional): Defines the scope of the policy (e.g., organization, department).
- **variables** (optional): A set of variables that can be used within the policy for condition evaluation.
- **version** (mandatory): The version of the policy definition.
- **auditInfo** (mandatory): Information about who created or updated the policy and when.

#### **PrincipalRule Definition**

- **resource** (mandatory): The identifier for the resource to which the rule applies.
- **actions** (mandatory): An array of `PrincipalRule.Action` objects defining the actions allowed or denied for the resource.

#### **PrincipalRule.Action Definition**

- **action** (mandatory): The action to be performed (e.g., `READ`, `WRITE`).
- **effect** (mandatory): The effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`).
- **condition** (optional): The condition under which the action is allowed or denied.
- **output** (optional): Specifies any output or logging information.
- **notify** (optional): Defines notifications to be sent when the action is performed.

#### **Examples**

**Example 1: Allow a Specific User to Read and Write to EmployeeDB**

```json
{
  "apiVersion": "api.pola.dev/v1",
  "principalPolicy": {
    "principal": "user123",
    "version": "1.0",
    "rules": [
      {
        "resource": "EmployeeDB",
        "actions": [
          {
            "action": "READ",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "WRITE",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}
```

**Curl Command to Create PrincipalPolicy:**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v1",
  "principalPolicy": {
    "principal": "user123",
    "version": "1.0",
    "rules": [
      {
        "resource": "EmployeeDB",
        "actions": [
          {
            "action": "READ",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "WRITE",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}'
```

### **4.2 ResourcePolicy**

#### **Overview**

`ResourcePolicy` defines the actions that can be performed on a specific resource and under what conditions. This policy type is resource-centric and focuses on managing access to resources based on conditions and roles.

**Use Cases**:
- Restrict actions on sensitive resources like financial reports or patient data.
- Enforce access controls based on the state or attributes of the resource.
- Allow specific roles to perform certain actions on a resource.

#### **Key Fields**

- **apiVersion** (mandatory): The version of the API (`api.pola.dev/v1`).
- **resource** (mandatory): The identifier for the resource to which the policy applies.
- **rules** (mandatory): An array of `ResourceRule` objects defining the actions allowed or denied for the resource.
- **schemas** (optional): References to schemas that provide additional context for resource evaluation.
- **scope** (optional): Defines the scope of the policy.
- **variables** (optional): A set of variables that can be used within the policy.
- **version** (mandatory): The version of the policy definition.
- **auditInfo** (mandatory): Information about who created or updated the policy and when.

#### **ResourceRule Definition**

- **actions** (mandatory): An array of strings defining the actions allowed or denied on the resource (e.g., `READ`, `DELETE`).
- **condition** (optional): The condition under which the actions are allowed or denied.
- **derivedRoles** (optional): List of derived roles that are allowed or denied access.
- **effect** (mandatory): The effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`).
- **name** (optional): A name identifier for the rule.
- **output** (optional): Specifies any output or logging information.
- **notify** (optional): Defines notifications to be sent when the action is performed.
- **roles** (optional): List of roles allowed to perform the action.

#### **Examples**

**Example 2: Allow DataAnalyst Role to Execute Queries on AnalyticsDB When Data is Public**

```json
{
  "apiVersion": "api.pola.dev/v1",
  "resourcePolicy": {
    "resource": "AnalyticsDB",
    "version": "1.1",
    "rules": [
      {
        "actions": ["EXECUTE_QUERY"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "data.classification == 'public'"
          }
        },
        "roles": ["DataAnalyst"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}
```

**Curl Command to Create ResourcePolicy:**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v1",
  "resourcePolicy": {
    "resource": "AnalyticsDB",
    "version": "1.1",
    "rules": [
      {
        "actions": ["EXECUTE_QUERY"],
        "effect": "EFFECT_ALLOW",
        "condition": {
          "match": {
            "expr": "data.classification == '\''public'\''"
          }
        },
        "roles": ["DataAnalyst"]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}'
```

### **4.3 EventPolicy**

#### **Overview**

`EventPolicy` defines actions to be taken in response to specific events under defined conditions. This policy type is event-centric, focusing on triggering actions like notifications, logging, approvals, etc.

**Use Cases**:
- Automatically notify relevant stakeholders when a certain event occurs.
- Log events for auditing purposes based on certain conditions.
- Trigger approval workflows for sensitive actions.

#### **Key Fields**

- **apiVersion** (mandatory): The version of the API (`api.pola.dev/v1`).
- **event** (mandatory): The identifier for the event to which the policy applies.
- **rules** (mandatory): An array of `EventRule` objects defining the actions to be taken in response to the event.
- **scope** (optional): Defines the scope of the policy.
- **variables** (optional): A set of variables that can be used within the policy.
- **version** (mandatory): The version of the policy definition.
- **auditInfo** (mandatory): Information about who created or updated the policy and when.

#### **EventRule Definition**

- **resource** (mandatory): The identifier for the resource related to the event.
- **conditions** (optional): Conditions under which the actions are triggered.
- **actions** (mandatory): An array of `EventRule.Action` objects defining the actions to be performed.

#### **EventRule.Action Definition**

- **action** (mandatory): The action to be performed (`NOTIFY`, `LOG`, `ALERT`, `APPROVE`, `REVIEW`).
- **effect** (mandatory): The effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`).
- **notify** (optional): Defines notifications to be sent when the action is performed.
- **output** (optional): Specifies any output or logging information.

#### **Examples**

**Example 3: Notify Admins When High-Risk Transaction is Detected**

```json
{
  "apiVersion": "api.pola.dev/v1",
  "eventPolicy": {
    "event": "HighRiskTransaction",
    "version": "1.0",
    "rules": [
      {
        "

resource": "FinancialSystem",
        "conditions": {
          "match": {
            "expr": "transaction.amount > 10000"
          }
        },
        "actions": [
          {
            "action": "NOTIFY",
            "effect": "EFFECT_ALLOW",
            "notify": {
              "service": "webservice",
              "serviceConfig": {
                "url": "https://example.com/notify",
                "method": "POST"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}
```

**Curl Command to Create EventPolicy:**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v1",
  "eventPolicy": {
    "event": "HighRiskTransaction",
    "version": "1.0",
    "rules": [
      {
        "resource": "FinancialSystem",
        "conditions": {
          "match": {
            "expr": "transaction.amount > 10000"
          }
        },
        "actions": [
          {
            "action": "NOTIFY",
            "effect": "EFFECT_ALLOW",
            "notify": {
              "service": "webservice",
              "serviceConfig": {
                "url": "https://example.com/notify",
                "method": "POST"
              }
            }
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}'
```
### **4.4 RolePolicy**

#### **Overview**

`RolePolicy` is used to define access control policies for specific roles within an organization. This type of policy specifies what actions a role can perform on specific resources, ensuring that roles have only the necessary permissions to perform their duties.

**Use Cases**:
- Define access control policies for roles such as `Admin`, `Editor`, `Viewer`.
- Restrict certain actions for roles based on business requirements.
- Manage access to resources for users who belong to specific roles.

#### **Key Fields**

- **apiVersion** (mandatory): The version of the API (`api.pola.dev/v1`).
- **role** (mandatory): The unique identifier for the role to which the policy applies.
- **rules** (mandatory): An array of `RoleRule` objects defining the actions allowed or denied for the role on specific resources.
- **scope** (optional): Defines the scope of the policy.
- **variables** (optional): A set of variables that can be used within the policy for condition evaluation.
- **version** (mandatory): The version of the policy definition.
- **auditInfo** (mandatory): Information about who created or updated the policy and when.

#### **RoleRule Definition**

- **resource** (mandatory): The identifier for the resource to which the rule applies.
- **actions** (mandatory): An array of `RoleRule.Action` objects defining the actions allowed or denied for the resource.

#### **RoleRule.Action Definition**

- **action** (mandatory): The action to be performed (e.g., `READ`, `WRITE`).
- **effect** (mandatory): The effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`).
- **condition** (optional): The condition under which the action is allowed or denied.
- **output** (optional): Specifies any output or logging information.
- **notify** (optional): Defines notifications to be sent when the action is performed.

#### **Examples**

**Example 4: Allow Admin Role to Manage All Resources in Project Management System**

```json
{
  "apiVersion": "api.pola.dev/v1",
  "rolePolicy": {
    "role": "Admin",
    "version": "1.0",
    "rules": [
      {
        "resource": "ProjectManagementSystem",
        "actions": [
          {
            "action": "READ",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "WRITE",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "DELETE",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}
```

**Curl Command to Create RolePolicy:**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v1",
  "rolePolicy": {
    "role": "Admin",
    "version": "1.0",
    "rules": [
      {
        "resource": "ProjectManagementSystem",
        "actions": [
          {
            "action": "READ",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "WRITE",
            "effect": "EFFECT_ALLOW"
          },
          {
            "action": "DELETE",
            "effect": "EFFECT_ALLOW"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}'
```

### **4.5 GroupPolicy**

#### **Overview**

`GroupPolicy` is used to define access control policies for specific groups of users. It allows the management of permissions for groups, ensuring consistent and centralized control over group access.

**Use Cases**:
- Define access policies for departments or teams (e.g., `Engineering`, `HR`).
- Grant or restrict access to specific resources for groups.
- Simplify policy management by grouping users and defining collective rules.

#### **Key Fields**

- **apiVersion** (mandatory): The version of the API (`api.pola.dev/v1`).
- **group** (mandatory): The unique identifier for the group to which the policy applies.
- **rules** (mandatory): An array of `GroupRule` objects defining the actions allowed or denied for the group on specific resources.
- **scope** (optional): Defines the scope of the policy.
- **variables** (optional): A set of variables that can be used within the policy for condition evaluation.
- **version** (mandatory): The version of the policy definition.
- **auditInfo** (mandatory): Information about who created or updated the policy and when.

#### **GroupRule Definition**

- **resource** (mandatory): The identifier for the resource to which the rule applies.
- **actions** (mandatory): An array of `GroupRule.Action` objects defining the actions allowed or denied for the resource.

#### **GroupRule.Action Definition**

- **action** (mandatory): The action to be performed (e.g., `READ`, `WRITE`).
- **effect** (mandatory): The effect of the action (`EFFECT_ALLOW` or `EFFECT_DENY`).
- **condition** (optional): The condition under which the action is allowed or denied.
- **output** (optional): Specifies any output or logging information.
- **notify** (optional): Defines notifications to be sent when the action is performed.

#### **Examples**

**Example 5: Deny HR Group Access to Financial Reports Resource**

```json
{
  "apiVersion": "api.pola.dev/v1",
  "groupPolicy": {
    "group": "HR",
    "version": "1.0",
    "rules": [
      {
        "resource": "FinancialReports",
        "actions": [
          {
            "action": "READ",
            "effect": "EFFECT_DENY"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}
```

**Curl Command to Create GroupPolicy:**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v1",
  "groupPolicy": {
    "group": "HR",
    "version": "1.0",
    "rules": [
      {
        "resource": "FinancialReports",
        "actions": [
          {
            "action": "READ",
            "effect": "EFFECT_DENY"
          }
        ]
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}'
```

### **4.6 DerivedRoles**

#### **Overview**

`DerivedRoles` are dynamic roles that are created based on conditions and contexts. They provide flexibility in defining roles that depend on the current state, user attributes, or other contextual information.

**Use Cases**:
- Define roles that change based on time, location, or user attributes.
- Dynamically assign roles based on conditions like user clearance level.
- Simplify management of roles that depend on dynamic contexts.

#### **Key Fields**

- **apiVersion** (mandatory): The version of the API (`api.pola.dev/v1`).
- **name** (mandatory): The name identifier for the derived role.
- **definitions** (mandatory): An array of `RoleDef` objects defining the conditions under which roles are derived.
- **variables** (optional): A set of variables that can be used within the policy for condition evaluation.
- **auditInfo** (mandatory): Information about who created or updated the policy and when.

#### **RoleDef Definition**

- **condition** (mandatory): The condition under which the derived role is applied.
- **name** (mandatory): The name of the role derived.
- **parentRoles** (mandatory): The list of parent roles that this derived role depends on.

#### **Examples**

**Example 6: Define a Derived Role Based on User's Clearance Level**

```json
{
  "apiVersion": "api.pola.dev/v1",
  "derivedRoles": {
    "name": "HighClearanceUser",
    "definitions": [
      {
        "name": "HighClearance",
        "parentRoles": ["User"],
        "condition": {
          "match": {
            "expr": "user.clearance == 'high'"
          }
        }
      }
    ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}
```

**Curl Command to Create DerivedRoles:**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v1",
  "derivedRoles": {
    "name": "HighClearanceUser",
    "definitions": [
      {
        "name": "HighClearance",
        "parentRoles": ["User"],
        "condition": {
          "match": {
            "expr": "user.clearance == '\''high'\''"
          }
        }
      }
   

 ]
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}'
```

### **4.7 ExportVariables**

#### **Overview**

`ExportVariables` are used to export specific variables and make them available across different policies or contexts. This enables reusability and consistency of variable definitions throughout the policy ecosystem.

**Use Cases**:
- Define global variables that are used in multiple policies.
- Simplify policy management by centralizing variable definitions.
- Ensure consistency of variable values across different policies.

#### **Key Fields**

- **apiVersion** (mandatory): The version of the API (`api.pola.dev/v1`).
- **name** (mandatory): The name identifier for the export variable set.
- **definitions** (mandatory): An object defining the key-value pairs of variables to be exported.
- **auditInfo** (mandatory): Information about who created or updated the policy and when.

#### **Examples**

**Example 7: Export Variables for Common Usage Across Policies**

```json
{
  "apiVersion": "api.pola.dev/v1",
  "exportVariables": {
    "name": "CommonSettings",
    "definitions": {
      "maxRetries": "5",
      "timeout": "30s"
    }
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}
```

**Curl Command to Create ExportVariables:**

```bash
curl -X POST http://localhost:4000/v1/policies \
-H "Content-Type: application/json" \
-d '{
  "apiVersion": "api.pola.dev/v1",
  "exportVariables": {
    "name": "CommonSettings",
    "definitions": {
      "maxRetries": "5",
      "timeout": "30s"
    }
  },
  "auditInfo": {
    "createdBy": "adminUser",
    "createdAt": "2024-08-28T12:00:00Z"
  }
}'
```

### Chapter 5: Core Components and Subschemas

This chapter delves into the core components and subschemas of the Pola Schema. These components—such as conditions, variables, derived roles, notifications, output, and metadata—form the building blocks that define and enforce policies in a dynamic, flexible, and context-aware manner. Each component and subschema is explained in detail with valid, schema-compliant examples to provide a comprehensive understanding.

### **5.1 Conditions (`pola.policy.v1.Condition`)**

#### **Overview**

Conditions are crucial in policy evaluation as they determine whether a policy rule is applicable in a given context. They allow for flexible and dynamic policy definitions by enabling logic that decides when a rule should take effect. Conditions can be simple or highly complex, combining different logical operators like `all`, `any`, `none`, and `expr` to match different scenarios.

#### **Key Fields**

- **match** (optional): An object of type `pola.policy.v1.Match` that specifies conditions using logical constructs like `all`, `any`, `none`, or `expr`.
- **script** (optional): A string that can hold a script for complex condition evaluations. Either `match` or `script` is required.

#### **Condition Matching: all, any, none, expr**

- **all**: Requires all specified conditions to be true.
- **any**: Requires at least one specified condition to be true.
- **none**: Requires none of the specified conditions to be true.
- **expr**: Allows for a specific expression to be evaluated.

#### **Examples**

**Example 1: Combining Different Condition Types to Create Complex Rules**

In this example, a condition is defined where a user must have a role of "Manager", the resource must be in an "active" state, and the user's department must not include "Finance".

```json
{
  "condition": {
    "match": {
      "all": {
        "of": [
          { "expr": "user.role == 'Manager'" },
          { "expr": "resource.state == 'active'" },
          {
            "none": {
              "of": [
                { "expr": "user.department == 'Finance'" }
              ]
            }
          }
        ]
      }
    }
  }
}
```

This condition checks:
1. The user role is "Manager".
2. The resource state is "active".
3. The user's department is not "Finance".

**Example 2: Using Scripts for Complex Condition Evaluations**

```json
{
  "condition": {
    "script": "return user.age > 25 && resource.status === 'approved';"
  }
}
```

In this example, a script checks whether a user's age is greater than 25 and the resource status is "approved".

### **5.2 Variables (`pola.policy.v1.Variables`)**

#### **Overview**

Variables are used in defining dynamic policies that adapt to different contexts. They can be imported from other sources or defined locally within a policy. By parameterizing conditions and rules, variables make policies more reusable and easier to manage.

#### **Key Fields**

- **import** (optional): An array of strings that specify imported variables from other policies or contexts.
- **local** (optional): An object defining key-value pairs of locally defined variables.

#### **Examples**

**Example 3: Using Variables to Parameterize Policy Conditions**

```json
{
  "variables": {
    "import": ["CommonSettings"],
    "local": {
      "maxAttempts": "3",
      "timeoutDuration": "15m"
    }
  }
}
```

In this example:
- The `import` field brings in variables from `CommonSettings`.
- The `local` field defines specific variables like `maxAttempts` and `timeoutDuration`.

### **5.3 DerivedRoles (`pola.policy.v1.DerivedRoles`)**

#### **Overview**

`DerivedRoles` allow the dynamic creation of roles based on specific conditions and contexts. They help define roles that adapt to changing circumstances, such as user attributes or the environment, thereby enhancing the flexibility and control of access management.

#### **Key Fields**

- **name** (mandatory): The name of the derived role.
- **definitions** (mandatory): An array of `RoleDef` objects defining the conditions under which roles are derived.
- **variables** (optional): A set of variables that can be used within the policy for condition evaluation.

#### **Examples**

**Example 4: Defining and Applying Derived Roles in Policies**

```json
{
  "derivedRoles": {
    "name": "ProjectLeader",
    "definitions": [
      {
        "name": "Leader",
        "parentRoles": ["User"],
        "condition": {
          "match": {
            "expr": "user.projectAssigned && user.experience > 5"
          }
        }
      }
    ]
  }
}
```

This example defines a `ProjectLeader` role that is derived based on the user's project assignment and experience level.

### **5.4 Notifications (`pola.policy.v1.Notify`)**

#### **Overview**

Notifications are essential for policy enforcement, allowing systems to communicate policy-related actions to external services or users. They ensure that stakeholders are aware of important events, decisions, or actions taken by the policy engine.

#### **Key Fields**

- **service** (mandatory): The type of service to notify (`webservice`, `pubsub`, or `queue`).
- **serviceConfig** (mandatory): Configuration for the notification service.
- **payloadSchema** (optional): A schema defining the payload structure.
- **when** (optional): Specifies when the notification should be sent.

#### **Examples**

**Example 5: Defining Notifications for Different Events and Actions**

```json
{
  "notify": {
    "service": "webservice",
    "serviceConfig": {
      "url": "https://example.com/notify",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer token"
      }
    },
    "payloadSchema": {
      "ref": "https://api.pola.dev/v1/schemas/notify.schema.json"
    },
    "when": {
      "conditionMet": "user.isActive && action == 'loginAttempt'",
      "ruleActivated": "NotifyLoginAttempt"
    }
  }
}
```

This example defines a notification to be sent via a web service when a user attempts to log in and meets specific conditions.

### **5.5 Output (`pola.policy.v1.Output`)**

#### **Overview**

Output defines the results or actions to be taken when a policy condition is met. It allows the policy system to provide feedback, logging, or any other response mechanism after evaluating a policy rule.

#### **Key Fields**

- **expr** (optional): An expression to be evaluated for output generation.
- **when** (optional): Specifies when the output should be generated.

#### **Examples**

**Example 6: Generating Outputs Based on Policy Actions**

```json
{
  "output": {
    "expr": "generateAuditLog('UserLogin', user.id, 'success')",
    "when": {
      "ruleActivated": "AuditUserLogin"
    }
  }
}
```

In this example, an output is generated to create an audit log entry when a rule for user login is activated.

### **5.6 Metadata (`pola.policy.v1.Metadata`)**

#### **Overview**

Metadata provides additional context and information about a policy, including annotations, source attributes, and identifiers. It plays a crucial role in managing, auditing, and tracking policies over time, ensuring transparency and accountability.

#### **Key Fields**

- **annotations** (optional): Key-value pairs for additional information or tags.
- **hash** (optional): A unique hash value for the policy.
- **sourceAttributes** (optional): Information about the source or origin of the policy.
- **sourceFile** (optional): The file or document from which the policy was created.
- **storeIdentifier** (optional): An identifier for storage or retrieval purposes.

#### **Examples**

**Example 7: Using Metadata for Tracking and Auditing Purposes**

```json
{
  "metadata": {
    "annotations": {
      "createdBy": "SecurityAdmin",
      "purpose": "Access Control for Sensitive Resources"
    },
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "sourceAttributes": {
      "attributes": {
        "system": "PolicyManager"
      }
    },
    "sourceFile": "policies/sensitive-access-policy.json",
    "storeIdentifier": "policy_001"
  }
}
```

This example uses metadata to provide tracking information, a unique hash, and references to the source file for auditing.

### **Conclusion**

The core components and subschemas—such as Conditions, Variables, DerivedRoles, Notifications, Output, and Metadata—are fundamental in building a robust, flexible, and dynamic policy management system using the Pola Schema. By understanding and effectively utilizing these components, organizations can define granular, context-aware policies that cater to a wide range of scenarios and use cases. The examples provided are compliant with the Pola JSON schema, ensuring practical applicability and ease of integration.
