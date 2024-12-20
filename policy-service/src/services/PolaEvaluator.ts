import acorn from 'acorn';  // Import the Acorn library for parsing JavaScript expressions
import axios from 'axios';  // Import Axios for making HTTP requests
import fs from 'fs';  // Import the file system module for reading files
import yaml from 'js-yaml';  // Import the js-yaml library for parsing YAML files
import Ajv, { ValidateFunction } from 'ajv';  // Import Ajv for JSON schema validation
import config from '../config/config';  // Import the configuration
import { customOperators } from './CustomOperators';  // Import custom operators for evaluation context
import { RequestParams, Condition, Match, ParsedExpression, 
         DerivedRole, PrincipalPolicy, ResourcePolicy, 
         RolePolicy, GroupPolicy, ExportVariable,
     	 EvaluationDetail, Scenario } 
         from '../models/types';
import PolicyModel, { Policy }  from '../models/policy';
   
// Initialize the JSON Schema validator with Ajv
const ajv = new Ajv();
const schema = {
  type: 'object',
  properties: {
    match: { type: 'object' },
    script: { type: 'string' }
  },
  additionalProperties: false
};
const validate = ajv.compile<Condition>(schema);  // Compile the schema for validation

/**
 * PolaEvaluator class
 * This class is responsible for evaluating scenarios based on conditions and expressions defined in Pola policies.
 * It includes methods for parsing, evaluating, and analyzing expressions and scenarios.
 */
export class PolaEvaluator {
  private validate: ValidateFunction<Condition>;
  private analysisEnabled: boolean;

  constructor() {
    this.validate = validate;  // Initialize the validate function using the compiled schema
    this.analysisEnabled = config.POLA_ANALYSIS;  // Set the analysis flag from config
  }

  /**
   * Parses a given expression into an Abstract Syntax Tree (AST) using Acorn.
   * 
   * @param expression - The expression to parse.
   * @returns A ParsedExpression object containing the AST and the original expression string.
   */
  private parseExpression(expression: string): ParsedExpression {
    return {
      ast: acorn.parseExpressionAt(expression, 0, { ecmaVersion: 2020 }),
      expr: expression
    };
  }

  /**
   * Evaluates a parsed AST node within a given context.
   * The context is a key-value store that provides values for identifiers in the expression.
   * 
   * @param node - The AST node to evaluate.
   * @param context - The context in which to evaluate the node.
   * @returns The result of the evaluation.
   */
  private evaluate(node: acorn.Node, context: Record<string, any>): any {
    try {
      switch (node.type) {
        case 'Literal':
          return (node as any).value;  // Return the value of a literal node
        case 'Identifier':
          return context[(node as any).name];  // Lookup and return the value of an identifier in the context
        case 'MemberExpression':
          const object = this.evaluate((node as any).object, context);
          const property = (node as any).property as any;
          if (object === undefined || object === null) {
            console.warn(`Warning: Attempted to access property '${property.name}' of undefined or null object.`);
            return undefined;
          }
          const value = object[property.name];
          if (typeof value === 'function') {
            return value.bind(object);  // Bind methods to their object context
          }
          return value;
        case 'BinaryExpression':
          const binaryNode = node as any;
          const left = this.evaluate(binaryNode.left, context);
          const right = this.evaluate(binaryNode.right, context);
          switch (binaryNode.operator) {
            case '===':
            case '==':
              return left == right;
            case '!==':
            case '!=':
              return left != right;
            case '>':
              return left > right;
            case '>=':
              return left >= right;
            case '<':
              return left < right;
            case '<=':
              return left <= right;
            case '+':
              return left + right;
            case '-':
              return left - right;
            case '*':
              return left * right;
            case '/':
              return left / right;
            case '%':
              return left % right;
            case 'in':
              if (right === undefined || right === null) {
                console.warn(`Warning: Attempted to use 'in' operator with undefined or null right-hand side.`);
                return false;
              }
              return Array.isArray(right) ? right.includes(left) : left in right;
            default:
              throw new Error('Unsupported binary operator: ' + binaryNode.operator);
          }
        case 'LogicalExpression':
          const logicalNode = node as any;
          const leftLogical = this.evaluate(logicalNode.left, context);
          const rightLogical = this.evaluate(logicalNode.right, context);
          switch (logicalNode.operator) {
            case '&&':
              return leftLogical && rightLogical;
            case '||':
              return leftLogical || rightLogical;
            default:
              throw new Error('Unsupported logical operator: ' + logicalNode.operator);
          }
        case 'UnaryExpression':
          const unaryNode = node as any;
          const argument = this.evaluate(unaryNode.argument, context);
          switch (unaryNode.operator) {
            case '!':
              return !argument;
            case '-':
              return -argument;
            default:
              throw new Error('Unsupported unary operator: ' + unaryNode.operator);
          }
        case 'ConditionalExpression':
          const conditionalNode = node as any;
          const test = this.evaluate(conditionalNode.test, context);
          return test ? this.evaluate(conditionalNode.consequent, context) : this.evaluate(conditionalNode.alternate, context);
        case 'CallExpression':
          const callNode = node as any;
          const callee = this.evaluate(callNode.callee, context);
          const args = callNode.arguments.map((arg: acorn.Node) => this.evaluate(arg, context));

          if (typeof callee === 'function') {
            try {
              return callee(...args);
            } catch (error) {
              console.error('Error during function call:', error);
              return undefined;
            }
          } else {
            console.error('Error: Unsupported function call or callee is not a function:', JSON.stringify(callNode.callee));
            return undefined;
          }
        case 'ArrayExpression':
          const arrayNode = node as any;
          return arrayNode.elements.map((element: acorn.Node) => this.evaluate(element, context));
        default:
          console.error('Unsupported node type:', node.type, JSON.stringify(node, null, 2));
          throw new Error('Unsupported node type: ' + node.type);
      }
    } catch (error) {
      console.error('Error during evaluation:', error);
      throw error;  // Re-throw the error to halt execution and review the detailed logs.
    }
  }

  /**
   * Evaluates a match condition within a given context.
   * The match condition may consist of multiple logical conditions (all, any, none).
   * 
   * @param match - The match condition to evaluate.
   * @param context - The context in which to evaluate the match condition.
   * @param details - An array to store detailed evaluation results for debugging or analysis.
   * @returns A boolean indicating whether the match condition is satisfied.
   */
  private evaluateMatch(match: Match, context: Record<string, any>, details: EvaluationDetail[]): boolean {
    if (match.all) {
      return match.all.of.every(cond => this.evaluateMatch(cond, context, details));  // Evaluate all conditions
    }
    if (match.any) {
      return match.any.of.some(cond => this.evaluateMatch(cond, context, details));  // Evaluate any condition
    }
    if (match.none) {
      return match.none.of.every(cond => !this.evaluateMatch(cond, context, details));  // Evaluate none of the conditions
    }
    if (match.expr) {
      const parsedExpression = this.parseExpression(match.expr);
      const result = this.evaluate(parsedExpression.ast, context);

      details.push({
        expression: match.expr,
        result,
        variables: JSON.parse(JSON.stringify(context))  // Deep copy to capture current state
      });

      return result;
    }
    throw new Error('Invalid match condition');
  }
/**
   * Evaluates a condition based on its structure, either using a match condition or a script.
   * 
   * @param condition - The condition to evaluate.
   * @param context - The context in which to evaluate the condition.
   * @returns A boolean indicating whether the condition is satisfied.
   */
  private evaluateCondition(condition: Condition, context: Record<string, any>): boolean {
    console.log('Evaluating condition:', JSON.stringify(condition, null, 2));

    // Validate the condition schema
    if (!this.validate(condition)) {
      console.error('Condition schema validation failed:', this.validate.errors);
      throw new Error('Condition schema validation failed');
    }

    // Evaluate the condition based on its structure
    if (condition.match) {
      return this.evaluateMatch(condition.match, context, []);
    }

    if (condition.script) {
      const parsedExpression = this.parseExpression(condition.script);
      return this.evaluate(parsedExpression.ast, context);
    }

    throw new Error('Unsupported condition type');
  }

  
  /**
   * Evaluates a single scenario based on its conditions and the provided context.
   * 
   * @param scenario - The scenario to evaluate.
   * @param context - The context in which to evaluate the scenario.
   * @returns A boolean indicating whether the scenario passed (matches the expected outcome).
   */
  async evaluateScenario(scenario: Scenario, context: Record<string, any>): Promise<boolean> {
    const extendedContext = {
      ...context,
      ...customOperators.withContext(context)  // Flatten custom functions
    };

    const details: EvaluationDetail[] = [];

    if (!this.validate(scenario.Condition)) {
      console.error(`Scenario ID ${scenario.scenarioID} failed schema validation:`, this.validate.errors);
      return false;
    }

    const result = scenario.Condition.match
      ? this.evaluateMatch(scenario.Condition.match, extendedContext, details)
      : scenario.Condition.script
      ? this.evaluate(this.parseExpression(scenario.Condition.script).ast, extendedContext)
      : false;

    if (result === scenario.Expected) {
      return result;
    }

    console.log(`\n======= Scenario Evaluation Report =======`);
    console.log(`Scenario ID: ${scenario.scenarioID}`);
    console.log(`Scenario: ${JSON.stringify(scenario.Condition, null, 2)}`);
    console.log(`Description: ${scenario.Description}`);
    console.log(`Explanation: ${scenario.Explanation}`);
    console.log(`Expected: ${scenario.Expected}, Actual: ${result}\n`);

    details.forEach((detail, index) => {
      console.log(`Evaluation Step ${index + 1}:`);
      console.log(`Expression: ${detail.expression}`);
      console.log(`Result: ${detail.result}`);
      console.log('----------------------------');
    });

    if (this.analysisEnabled) {
      const analysis = await this.analyzeEvaluationResult(scenario, context, result);
      console.log(`\nPola Scenario Analysis:\n${analysis}\n`);
    }

    return result;
  }

  /**
   * Analyzes the result of a scenario evaluation using OpenAI's API.
   * Generates a narrative that summarizes the scenario and explains the evaluation result.
   * 
   * @param scenario - The scenario being analyzed.
   * @param context - The context in which the scenario was evaluated.
   * @param actual - The actual result of the scenario evaluation.
   * @returns A string containing the analysis and narrative of the scenario evaluation.
   */
  private async analyzeEvaluationResult(scenario: Scenario, context: Record<string, any>, actual: boolean): Promise<string> {
    const prompt = `
    You are tasked with analyzing a scenario and providing a concise narrative and analysis. Below is a scenario along with its evaluation report.
    
    Your task is twofold:
    
    1. **Scenario Description:** Write a short paragraph summarizing what this scenario is supposed to test. Mention the key conditions and the intended behavior.
    
    2. **Results Analysis:** Provide a detailed analysis of the scenario’s results, including:
       - Whether the actual outcome matched the expected outcome.
       - The relevant context that influenced the scenario.
       - A summary explaining why the scenario passed or failed.
  
    Ensure that the response is concise, focused, and highlights the most critical aspects of the scenario and the evaluation results.
  
    Here is the scenario:
    ${JSON.stringify(scenario.Condition, null, 2)}
  
    Evaluation Report:
    - Scenario ID: ${scenario.scenarioID}
    - Description: ${scenario.Description}
    - Expected Outcome: ${scenario.Expected}
    - Actual Outcome: ${actual}
  
    Context Data:
    ${JSON.stringify(context, null, 2)}
    `;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a logical analyst." },
            { role: "user", content: prompt }
          ],
          max_tokens: 300,
          temperature: 0.5
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.OPENAI_API_KEY}`,
          },
        }
      );

      return response.data.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

  /**
   * Evaluates a set of scenarios loaded from a YAML file, using the provided context.
   * Prints a summary report of the evaluation results.
   * 
   * @param filePath - The path to the YAML file containing the scenarios.
   * @param context - The context in which to evaluate the scenarios.
   */
  async evaluateScenariosFromFile(filePath: string, context: Record<string, any>): Promise<void> {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const scenarios: Scenario[] = yaml.load(fileContents) as Scenario[];

    let passedCount = 0;
    let failedCount = 0;

    for (const scenario of scenarios) {
      const result = await this.evaluateScenario(scenario, context);
      const match = result === scenario.Expected;

      if (match) {
        passedCount++;
      } else {
        failedCount++;
      }
    }

    const totalScenarios = scenarios.length;
    const passPercentage = (passedCount / totalScenarios) * 100;
    const failPercentage = (failedCount / totalScenarios) * 100;

    console.log('======== Test Summary ========');
    console.log(`Total Scenarios: ${totalScenarios}`);
    console.log(`Passed: ${passedCount} (${passPercentage.toFixed(2)}%)`);
    console.log(`Failed: ${failedCount} (${failPercentage.toFixed(2)}%)`);
    console.log('==============================');
  }
  
  /**
   * Evaluates derived roles based on the provided context.
   * 
   * @private
   * @param {DerivedRole} derivedRoles - The derived roles to evaluate.
   * @param {Object} context - The context for evaluation, including variables and resource information.
   * @returns {string[]} - Returns an array of role names that the context qualifies for.
   */
  private evaluateDerivedRoles(derivedRoles: DerivedRole, context: { [key: string]: any }): string[] {
    const qualifyingRoles: string[] = [];

    for (const def of derivedRoles.definitions) {
      console.log('Evaluating derived role:', def.name);
      if (!def.condition || this.evaluateCondition(def.condition, context)) {
        console.log('Derived role qualified:', def.name);
        qualifyingRoles.push(def.name);
      } else {
        console.log('Derived role not qualified:', def.name);
      }
    }

    return qualifyingRoles;
  }

  /**
   * Evaluates principal policies.
   * @param {PrincipalPolicy} principalPolicy - The principal policy to evaluate.
   * @param {Object} context - The context in which to evaluate the policy.
   * @param {RequestParams} params - The request parameters.
   * @returns {string | null} - A message if the policy matches, otherwise null.
   */
  evaluatePrincipalPolicy(principalPolicy: PrincipalPolicy, context: { [key: string]: any }, params: RequestParams): string | null {
    console.log('Evaluating principal policy');
    for (const rule of principalPolicy.rules) {
      const resourceMatches = rule.resource === params.resourceId;
      const actionAllowed = rule.actions.some(action => params.actions.includes(action.action));
      if (resourceMatches && actionAllowed && rule.actions.every(action => !action.condition || this.evaluateCondition(action.condition, context))) {
        return `Principal policy matched for resource: ${rule.resource}`;
      }
    }
    return null;
  }

  /**
   * Evaluates resource policies.
   * @param {ResourcePolicy} resourcePolicy - The resource policy to evaluate.
   * @param {Object} context - The context in which to evaluate the policy.
   * @param {RequestParams} params - The request parameters.
   * @returns {string | null} - A message if the policy matches, otherwise null.
   */
  evaluateResourcePolicy(resourcePolicy: ResourcePolicy, context: { [key: string]: any }, params: RequestParams): string | null {
    console.log('Evaluating resource policy');
    for (const rule of resourcePolicy.rules) {
      const actionAllowed = rule.actions.includes(params.actions[0]);
      if (actionAllowed && (!rule.condition || this.evaluateCondition(rule.condition, context))) {
        return `Resource policy matched for action: ${params.actions[0]}`;
      }
    }
    return null;
  }

  /**
   * Evaluates role policies.
   * @param {RolePolicy} rolePolicy - The role policy to evaluate.
   * @param {Object} context - The context in which to evaluate the policy.
   * @param {RequestParams} params - The request parameters.
   * @returns {string | null} - A message if the policy matches, otherwise null.
   */
  evaluateRolePolicy(rolePolicy: RolePolicy, context: { [key: string]: any }, params: RequestParams): string | null {
    console.log('Evaluating role policy');
    for (const rule of rolePolicy.rules) {
      const resourceMatches = rule.resource === params.resourceId;
      const actionAllowed = rule.actions.some(action => params.actions.includes(action.action));
      if (resourceMatches && actionAllowed && rule.actions.every(action => !action.condition || this.evaluateCondition(action.condition, context))) {
        return `Role policy matched for resource: ${rule.resource}`;
      }
    }
    return null;
  }

  /**
   * Evaluates group policies.
   * @param {GroupPolicy} groupPolicy - The group policy to evaluate.
   * @param {Object} context - The context in which to evaluate the policy.
   * @param {RequestParams} params - The request parameters.
   * @returns {string | null} - A message if the policy matches, otherwise null.
   */
  evaluateGroupPolicy(groupPolicy: GroupPolicy, context: { [key: string]: any }, params: RequestParams): string | null {
    console.log('Evaluating group policy');
    for (const rule of groupPolicy.rules) {
      const resourceMatches = rule.resource === params.resourceId;
      const actionAllowed = rule.actions.some(action => params.actions.includes(action.action));
      if (resourceMatches && actionAllowed && rule.actions.every(action => !action.condition || this.evaluateCondition(action.condition, context))) {
        return `Group policy matched for resource: ${rule.resource}`;
      }
    }
    return null;
  }

  /**
   * Evaluates export variables.
   * @param {ExportVariable} exportVariables - The export variables to evaluate.
   * @param {Object} context - The context in which to evaluate the export variables.
   * @returns {string | null} - A message if the export variables match, otherwise null.
   */
  evaluateExportVariables(exportVariables: ExportVariable, context: { [key: string]: any }): string | null {
    console.log('Evaluating export variables');
    // Implement the logic to handle export variables
    return null;
  }

  /**
   * Evaluates all policies.
   * @param {RequestParams} params - The request parameters.
   * @returns {Promise<string[]>} - A list of qualifying entities based on the policies.
   */
  public async evaluatePolicies(params: RequestParams): Promise<string[]> {
    const context = {
      P: params.variables,
      R: params.resourceId,
    };

    const policies = await PolicyModel.find({ disabled: { $ne: true } });
    const qualifyingEntities: string[] = [];

    for (const policy of policies) {
      console.log(`Evaluating policy: ${policy.name}`);

      if (policy.principalPolicy) {
        const principalResult = this.evaluatePrincipalPolicy(policy.principalPolicy, context, params);
        if (principalResult) qualifyingEntities.push(principalResult);
      }

      if (policy.resourcePolicy) {
        const resourceResult = this.evaluateResourcePolicy(policy.resourcePolicy, context, params);
        if (resourceResult) qualifyingEntities.push(resourceResult);
      }

      if (policy.derivedRoles) {
        const rolesResult = this.evaluateDerivedRoles(policy.derivedRoles, context);
        qualifyingEntities.push(...rolesResult);
      }

      if (policy.rolePolicy) {
        const roleResult = this.evaluateRolePolicy(policy.rolePolicy, context, params);
        if (roleResult) qualifyingEntities.push(roleResult);
      }

      if (policy.groupPolicy) {
        const groupResult = this.evaluateGroupPolicy(policy.groupPolicy, context, params);
        if (groupResult) qualifyingEntities.push(groupResult);
      }

      if (policy.exportVariables) {
        const exportVarsResult = this.evaluateExportVariables(policy.exportVariables, context);
        if (exportVarsResult) qualifyingEntities.push(exportVarsResult);
      }
    }

    return qualifyingEntities;
  }

}

