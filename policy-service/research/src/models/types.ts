// src/models/types.ts

// Define the Metadata interface
// This interface encapsulates metadata associated with policies or resources, providing additional context or identifiers.
export interface Metadata {
  annotations?: { [key: string]: string };  // Optional key-value pairs for storing annotations or labels
  hash?: number | string;                   // Optional hash value, can be used for integrity checks or versioning
  sourceAttributes?: object;                // Optional object containing attributes related to the source of the policy or resource
  sourceFile?: string;                      // Optional string indicating the file path or identifier of the source file
  storeIdentifier?: string;                 // Optional identifier used to link or reference storage information
}

// Define the Variables interface
// This interface handles variable imports and local variable definitions within a policy.
export interface Variables {
  import?: string[];                        // Optional array of strings indicating which variables to import
  local?: { [key: string]: string };        // Optional key-value pairs for defining local variables specific to the policy
}

// Define the MatchExprList interface
// This interface represents a list of match expressions, which are logical conditions used in policy evaluation.
export interface MatchExprList {
  of: Match[];                              // An array of Match objects that define the conditions to evaluate
}

// Define the Match interface
// This interface defines the logical structure of a condition, allowing for complex expressions like 'all', 'any', or 'none'.
export interface Match {
  all?: MatchExprList;                      // Optional field representing a list of conditions that must all be true
  any?: MatchExprList;                      // Optional field representing a list of conditions where at least one must be true
  none?: MatchExprList;                     // Optional field representing a list of conditions that must all be false
  expr?: string;                            // Optional string expression representing a custom condition to evaluate
}

// Define the Condition interface
// This interface encapsulates conditions used within actions, supporting both match-based and script-based conditions.
export interface Condition {
  match?: Match;                            // Optional Match object that defines logical conditions for the action
  script?: string;                          // Optional script string that can be executed to determine the condition's outcome
}

// Define the Action interface
// This interface represents an action within a policy, including its effect, conditions, and potential output.
export interface Action {
  action: string;                           // The specific action being authorized or denied by the policy (e.g., 'read', 'write')
  effect: 'EFFECT_ALLOW' | 'EFFECT_DENY';   // The effect of the action, either allowing or denying the operation
  condition?: Condition;                    // Optional condition that must be met for the action to be executed
  name?: string;                            // Optional name for the action, useful for identification or documentation purposes
  output?: Output;                          // Optional output definition specifying how the result of the action is handled
  notify?: Notify;                          // Optional notify object to handle notifications for the action
}

// Define the Output interface
// This interface handles the output or result of an action, specifying how to process or respond to different conditions.
export interface Output {
  expr?: string;                            // Optional expression to evaluate for generating the output
  when?: OutputWhen;                        // Optional conditions under which specific outputs should be triggered
}

// Define the OutputWhen interface
// This interface specifies different conditions that trigger specific outputs, useful for handling various outcomes of actions.
export interface OutputWhen {
  conditionNotMet?: string;                 // Optional message or action to trigger when the condition is not met
  ruleActivated?: string;                   // Optional message or action to trigger when a rule is activated
}

// Define the Notify interface
// This interface represents the structure for delivering notifications to specified services.
export interface Notify {
  service: 'webservice' | 'pubsub' | 'queue';  // The type of service used for notifications
  serviceConfig: ServiceConfig;                // Configuration details for the specified notification service
  payloadSchema?: SchemaRef;                   // Optional schema reference for the notification payload
  when?: NotifyWhen;                           // Optional conditions under which notifications should be sent
}

// Define the ServiceConfig interface
// This interface contains the configuration details for the notification service.
export interface ServiceConfig {
  url?: string;                                // The URL for web service notifications
  method?: 'POST' | 'PUT';                     // The HTTP method to use for web service notifications
  headers?: { [key: string]: string };         // Optional headers to include in the HTTP request
  topic?: string;                              // The topic for pub/sub notifications
  queueName?: string;                          // The name of the queue for queuing services
  messageGroupId?: string;                     // Optional message group ID for FIFO queues
}

// Define the NotifyWhen interface
// This interface specifies conditions under which a notification should be sent.
export interface NotifyWhen {
  conditionMet?: string;                      // Optional message or action to trigger when a condition is met
  ruleActivated?: string;                     // Optional message or action to trigger when a rule is activated
}

// Define the PrincipalRule interface
// This interface represents a rule for a principal (e.g., user, group), specifying resources and the actions they can perform.
export interface PrincipalRule {
  resource: string;                         // The resource to which this rule applies (e.g., 'document123')
  actions: Action[];                        // An array of actions that the principal can perform on the resource
}

// Define the ResourceRule interface
// This interface represents a rule for a resource, specifying actions, conditions, and associated roles.
export interface ResourceRule {
  actions: string[];                        // An array of actions that are authorized or denied for the resource
  condition?: Condition;                    // Optional condition that must be met for the actions to be executed
  derivedRoles?: string[];                  // Optional array of derived roles that can perform the actions
  effect: 'EFFECT_ALLOW' | 'EFFECT_DENY';   // The effect of the rule, either allowing or denying the actions
  name?: string;                            // Optional name for the rule, useful for identification or documentation purposes
  output?: Output;                          // Optional output definition specifying how the result of the actions is handled
  roles?: string[];                         // Optional array of roles that are authorized to perform the actions
}

// Define the RolePolicy interface
// This interface represents a policy for a role, specifying the role's permissions and associated rules.
export interface RolePolicy {
  role: string;                             // The role to which this policy applies (required)
  version: string;                          // The version of the role policy (required)
  scope?: string;                           // Optional scope defining the context or boundaries where the policy is applicable
  variables?: Variables;                    // Optional variables that may be used within the policy rules
  rules: RoleRule[];                        // A list of rules that define permissions and conditions for the role (required)
}

// Define the RoleRule interface
// This interface represents a rule for a role, specifying resources and the actions the role can perform.
export interface RoleRule {
  resource: string;                         // The resource to which this rule applies (e.g., 'service123')
  actions: Action[];                        // An array of actions that the role can perform on the resource
}

// Define the GroupPolicy interface
// This interface represents a policy for a group, specifying the group's permissions and associated rules.
export interface GroupPolicy {
  group: string;                            // The group to which this policy applies (required)
  version: string;                          // The version of the group policy (required)
  scope?: string;                           // Optional scope defining the context or boundaries where the policy is applicable
  variables?: Variables;                    // Optional variables that may be used within the policy rules
  rules: GroupRule[];                       // A list of rules that define permissions and conditions for the group (required)
}

// Define the GroupRule interface
// This interface represents a rule for a group, specifying resources and the actions the group can perform.
export interface GroupRule {
  resource: string;                         // The resource to which this rule applies (e.g., 'app123')
  actions: Action[];                        // An array of actions that the group can perform on the resource
}

// Define the RoleDef interface
// This interface represents a role definition, including its name, parent roles, and any conditions.
export interface RoleDef {
  name: string;                             // The name of the role being defined
  parentRoles: string[];                    // An array of parent roles that this role inherits permissions from
  condition?: Condition;                    // Optional condition that must be met for the role to be applied
}

// Define the Schemas interface
// This interface represents schema references, defining how to validate principal and resource policies.
export interface Schemas {
  principalSchema?: SchemaRef;              // Optional reference to a schema that validates principal policies
  resourceSchema?: SchemaRef;               // Optional reference to a schema that validates resource policies
}

// Define the SchemaRef interface
// This interface represents a reference to a schema, including conditions under which the schema should be ignored.
export interface SchemaRef {
  ref: string;                              // The reference to the schema (e.g., a URI or identifier)
  ignoreWhen?: IgnoreWhen;                  // Optional conditions specifying when the schema should be ignored
}

// Define the IgnoreWhen interface
// This interface specifies conditions under which a schema should be ignored, useful for context-specific validation.
export interface IgnoreWhen {
  actions: string[];                        // An array of actions that, when present, cause the schema to be ignored
}

// Define the PrincipalPolicy interface
// This interface represents a policy for a principal, specifying the principal's permissions and associated rules.
export interface PrincipalPolicy {
  principal: string;                        // The principal (e.g., user, group, or role) to which the policy applies (required)
  version: string;                          // The version of the principal policy (required)
  scope?: string;                           // Optional scope defining the context or boundaries where the policy is applicable
  variables?: Variables;                    // Optional variables that may be used within the policy rules
  rules: PrincipalRule[];                   // A list of rules that define permissions and conditions for the principal (required)
}

// Define the ResourcePolicy interface
// This interface represents a policy for a resource, specifying the resource's permissions and associated rules.
export interface ResourcePolicy {
  resource: string;                         // The resource to which this policy applies (required)
  version: string;                          // The version of the resource policy (required)
  scope?: string;                           // Optional scope defining the context or boundaries where the policy is applicable
  importDerivedRoles?: string[];            // Optional array of derived roles that are imported into the policy
  variables?: Variables;                    // Optional variables that may be used within the policy rules
  schemas?: Schemas;                        // Optional schemas to validate the policy structure or content
  rules: ResourceRule[];                    // A list of rules that define permissions and conditions for the resource (required)
}

// Define the DerivedRole interface
// This interface represents a derived role, which is a role created from other roles based on specific conditions or definitions.
export interface DerivedRole {
  name: string;                             // The name of the derived role
  definitions: RoleDef[];                   // An array of role definitions that define the derived role's permissions
  variables?: Variables;                    // Optional variables that are associated with the derived role
}

// Define the ExportVariable interface
// This interface represents a variable that is exported from a policy, making it available for use in other contexts or policies.
export interface ExportVariable {
  name: string;                             // The name of the exported variable
  definitions?: { [key: string]: string };  // Optional key-value pairs defining the variable's contents or purpose
}

// Define the AuditInfo interface
// This interface represents audit information, tracking the creation and modification of policies or resources.
export interface AuditInfo {
  createdBy: string;                        // The identifier of the user or system that created the policy/resource
  createdAt: Date;                          // The date and time when the policy/resource was created
  updatedBy?: string;                       // Optional identifier of the user or system that last updated the policy/resource
  updatedAt?: Date;                         // Optional date and time when the policy/resource was last updated
}

// Define the RequestParams interface
export interface RequestParams {
  principalId: string;                  // The ID of the principal making the request
  resourceId: string;                   // The ID of the resource being accessed
  actions: string[];                    // The actions the principal is attempting to perform on the resource
  environment?: { [key: string]: any }; // Optional environmental variables like time of day, location, etc.
  variables?: { [key: string]: any };   // Optional variables including imported and exported variables
}

// Define the ParsedExpression interface
// This interface represents a parsed expression and its original string form.
export interface ParsedExpression {
  ast: any;  // The abstract syntax tree (AST) representation of the expression
  expr: string;  // The original expression as a string
}

// Define the EvaluationDetail interface
// This interface captures detailed information during the evaluation process.
export interface EvaluationDetail {
  expression: string;  // The expression being evaluated
  result: any;  // The result of the evaluation
  variables: Record<string, any>;  // The context variables at the time of evaluation
}

// Define the Scenario interface
// This interface represents a scenario to be evaluated, including its conditions, expected outcome, and explanation.
export interface Scenario {
  scenarioID: string;  // A unique identifier for the scenario
  Description: string;  // A description of the scenario
  Condition: Condition;  // The condition to be evaluated in the scenario
  Expected: boolean;  // The expected outcome of the scenario (true/false)
  Explanation: string;  // An explanation of the scenario's purpose and expectations
}


