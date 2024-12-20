import * as acorn from 'acorn';
import DerivedRoleModel from '../models/derivedRole';
import {
  RequestParams,
  DerivedRole,
  Condition,
  Match,
  EvaluationDetail,
  ParsedExpression,
} from '../models/types';

// Function to parse and evaluate an expression
function evaluateExpression(expression: string, context: { [key: string]: any }): any {
  const ast = acorn.parse(expression, { ecmaVersion: 2020 }) as acorn.Node;
  
  function evaluate(node: acorn.Node): any {
    switch (node.type) {
      case 'Literal':
        return (node as any).value;
      case 'Identifier':
        return context[(node as any).name];
      case 'MemberExpression':
        const object = evaluate((node as any).object);
        const property = (node as any).property.name;
        return object[property];
      case 'BinaryExpression':
        const leftValue = evaluate((node as any).left);
        const rightValue = evaluate((node as any).right);
        switch ((node as any).operator) {
          case '===':
            return leftValue === rightValue;
          case '!==':
            return leftValue !== rightValue;
          case '>=':
            return leftValue >= rightValue;
          case '<=':
            return leftValue <= rightValue;
          case '>':
            return leftValue > rightValue;
          case '<':
            return leftValue < rightValue;
          default:
            throw new Error(`Unsupported operator: ${(node as any).operator}`);
        }
      case 'CallExpression':
        const calleeObject = evaluate((node as any).callee.object);
        const method = (node as any).callee.property.name;
        const args = (node as any).arguments.map(evaluate);

        if (typeof calleeObject[method] !== 'function') {
          throw new Error(`Callee ${method} is not a function`);
        }
        return calleeObject[method](...args);
      default:
        throw new Error(`Unsupported node type: ${node.type}`);
    }
  }

  return evaluate((ast as any).body[0].expression);
}

// Function to evaluate a match expression list
function evaluateMatch(match: Match, context: { [key: string]: any }): boolean {
  if (match.all) {
    return match.all.of.every(subMatch => evaluateMatch(subMatch, context));
  }
  if (match.any) {
    return match.any.of.some(subMatch => evaluateMatch(subMatch, context));
  }
  if (match.none) {
    return !match.none.of.some(subMatch => evaluateMatch(subMatch, context));
  }
  if (match.expr) {
    return evaluateExpression(match.expr, context);
  }
  throw new Error('Unsupported match structure');
}

// Function to evaluate conditions
function evaluateCondition(condition: Condition, context: { [key: string]: any }): boolean {
  if (condition.match) {
    return evaluateMatch(condition.match, context);
  }
  if (condition.script) {
    return evaluateExpression(condition.script, context);
  }
  throw new Error('Unsupported condition type');
}

// Function to determine qualifying derived roles for a principal
export async function determineDerivedRole(params: RequestParams): Promise<string[]> {
  const context = {
    P: params.principalId,
    R: params.resourceId,
    ...params.variables,
  };

  const derivedRoles = await DerivedRoleModel.find();
  const qualifyingRoles: string[] = [];

  for (const role of derivedRoles) {
    for (const def of role.definitions) {
      if (!def.condition || evaluateCondition(def.condition, context)) {
        qualifyingRoles.push(def.name);
      }
    }
  }

  return qualifyingRoles;
}

// Example usage
(async () => {
  const params: RequestParams = {
    principalId: 'user123',
    resourceId: 'resource456',
    actions: ['read', 'write'],
    variables: {
      yearsOfExperience: 5,
      teamSize: 20,
      certifications: ['leadership-training'],
    },
  };

  const roles = await determineDerivedRole(params);
  console.log('Qualifying roles:', roles);
})();

