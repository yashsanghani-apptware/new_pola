import * as acorn from 'acorn';
import * as fs from 'fs';
import * as yaml from 'yaml';
import { Condition, Match, Action, DerivedRole } from '../models/types';
import DerivedRole from '../models/derivedRole';

interface Principal {
  [key: string]: any;
}


// Function to evaluate a parsed expression in a given context
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

// Function to evaluate conditions based on their type
function evaluateCondition(condition: Condition, context: { [key: string]: any }): boolean {
  if (condition.match?.all) {
    return condition.match.all.of.every(subCondition => evaluateCondition(subCondition, context));
  }

  if (condition.match?.any) {
    return condition.match.any.of.some(subCondition => evaluateCondition(subCondition, context));
  }

  if (condition.match?.none) {
    return !condition.match.none.of.some(subCondition => evaluateCondition(subCondition, context));
  }

  // Handle expr directly under match
  if (condition.match?.expr) {
    return evaluateExpression(condition.match.expr, context);
  }

  if (condition.expr) {
    return evaluateExpression(condition.expr, context);
  }

  // If we reach here, the condition doesn't match any of the expected structures.
  console.error('Unsupported condition structure:', JSON.stringify(condition, null, 2));
  throw new Error('Unsupported condition type');
}

// Function to determine which derived roles a principal qualifies for
function determineDerivedRole(principal: Principal, derivedRolePolicy: DerivedRole): string[] {
  const context = { P: principal };
  const qualifyingRoles: string[] = [];

  for (const roleDefinition of derivedRolePolicy.derivedRoles.definitions) {
    const conditionMet = evaluateCondition(roleDefinition.condition, context);
    if (conditionMet) {
      qualifyingRoles.push(roleDefinition.name);
    }
  }

  return qualifyingRoles;
}

// Function to load and parse the YAML file
function loadDerivedRoleFromFile(filePath: string): DerivedRole {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const derivedRolePolicy = yaml.parse(fileContent) as DerivedRole;
  return derivedRolePolicy;
}

// Example usage with YAML loading
const principal: Principal = {
  role: 'engineer',
  yearsOfExperience: 6,
  teamSize: 12,
  certifications: ['leadership-training', 'advanced-java'],
};

// Load the derived role policy from a YAML file
const derivedRolePolicy = loadDerivedRoleFromFile('./derivedRolePolicy.yaml');

const qualifyingRoles = determineDerivedRole(principal, derivedRolePolicy);
console.log('Qualifying roles:', qualifyingRoles);

