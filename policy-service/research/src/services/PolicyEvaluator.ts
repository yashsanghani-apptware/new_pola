// src/services/derivedRoleEvaluator.ts

import * as acorn from 'acorn';
import { RequestParams, Condition, Match, DerivedRole, PrincipalPolicy, ResourcePolicy, RolePolicy, GroupPolicy, ExportVariable } from '../models/types';
import PolicyModel, { Policy }  from '../models/policy';

// Function to evaluate an expression using Acorn
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

// Function to evaluate a match condition
function evaluateMatch(match: Match, context: { [key: string]: any }): boolean {
  console.log('Evaluating match:', JSON.stringify(match, null, 2));
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

// Function to evaluate a condition
function evaluateCondition(condition: Condition, context: { [key: string]: any }): boolean {
  console.log('Evaluating condition:', JSON.stringify(condition, null, 2));
  if (condition.match) {
    return evaluateMatch(condition.match, context);
  }
  if (condition.script) {
    return evaluateExpression(condition.script, context);
  }
  throw new Error('Unsupported condition type');
}

// Function to evaluate derived roles
function evaluateDerivedRoles(derivedRoles: DerivedRole, context: { [key: string]: any }): string[] {
  const qualifyingRoles: string[] = [];

  for (const def of derivedRoles.definitions) {
    console.log('Evaluating derived role:', def.name);
    if (!def.condition || evaluateCondition(def.condition, context)) {
      console.log('Derived role qualified:', def.name);
      qualifyingRoles.push(def.name);
    } else {
      console.log('Derived role not qualified:', def.name);
    }
  }

  return qualifyingRoles;
}

// Function to evaluate principal policies
function evaluatePrincipalPolicy(principalPolicy: PrincipalPolicy, context: { [key: string]: any }, params: RequestParams): string | null {
  console.log('Evaluating principal policy');
  for (const rule of principalPolicy.rules) {
    const resourceMatches = rule.resource === params.resourceId;
    const actionAllowed = rule.actions.some(action => params.actions.includes(action.action));
    if (resourceMatches && actionAllowed && rule.actions.every(action => !action.condition || evaluateCondition(action.condition, context))) {
      return `Principal policy matched for resource: ${rule.resource}`;
    }
  }
  return null;
}

// Function to evaluate resource policies
function evaluateResourcePolicy(resourcePolicy: ResourcePolicy, context: { [key: string]: any }, params: RequestParams): string | null {
  console.log('Evaluating resource policy');
  for (const rule of resourcePolicy.rules) {
    const actionAllowed = rule.actions.includes(params.actions[0]);
    if (actionAllowed && (!rule.condition || evaluateCondition(rule.condition, context))) {
      return `Resource policy matched for action: ${params.actions[0]}`;
    }
  }
  return null;
}

// Function to evaluate role policies
function evaluateRolePolicy(rolePolicy: RolePolicy, context: { [key: string]: any }, params: RequestParams): string | null {
  console.log('Evaluating role policy');
  for (const rule of rolePolicy.rules) {
    const resourceMatches = rule.resource === params.resourceId;
    const actionAllowed = rule.actions.some(action => params.actions.includes(action.action));
    if (resourceMatches && actionAllowed && rule.actions.every(action => !action.condition || evaluateCondition(action.condition, context))) {
      return `Role policy matched for resource: ${rule.resource}`;
    }
  }
  return null;
}

// Function to evaluate group policies
function evaluateGroupPolicy(groupPolicy: GroupPolicy, context: { [key: string]: any }, params: RequestParams): string | null {
  console.log('Evaluating group policy');
  for (const rule of groupPolicy.rules) {
    const resourceMatches = rule.resource === params.resourceId;
    const actionAllowed = rule.actions.some(action => params.actions.includes(action.action));
    if (resourceMatches && actionAllowed && rule.actions.every(action => !action.condition || evaluateCondition(action.condition, context))) {
      return `Group policy matched for resource: ${rule.resource}`;
    }
  }
  return null;
}

// Function to evaluate export variables
function evaluateExportVariables(exportVariables: ExportVariable, context: { [key: string]: any }): string | null {
  console.log('Evaluating export variables');
  // Implement the logic to handle export variables
  return null;
}

// Function to evaluate all policies
export async function evaluatePolicies(params: RequestParams): Promise<string[]> {
  const context = {
    P: params.variables,
    R: params.resourceId,
  };

  const policies = await PolicyModel.find({ disabled: { $ne: true } });
  const qualifyingEntities: string[] = [];

  for (const policy of policies) {
    console.log(`Evaluating policy: ${policy.name}`);

    if (policy.principalPolicy) {
      const principalResult = evaluatePrincipalPolicy(policy.principalPolicy, context, params);
      if (principalResult) qualifyingEntities.push(principalResult);
    }

    if (policy.resourcePolicy) {
      const resourceResult = evaluateResourcePolicy(policy.resourcePolicy, context, params);
      if (resourceResult) qualifyingEntities.push(resourceResult);
    }

    if (policy.derivedRoles) {
      const rolesResult = evaluateDerivedRoles(policy.derivedRoles, context);
      qualifyingEntities.push(...rolesResult);
    }

    if (policy.rolePolicy) {
      const roleResult = evaluateRolePolicy(policy.rolePolicy, context, params);
      if (roleResult) qualifyingEntities.push(roleResult);
    }

    if (policy.groupPolicy) {
      const groupResult = evaluateGroupPolicy(policy.groupPolicy, context, params);
      if (groupResult) qualifyingEntities.push(groupResult);
    }

    if (policy.exportVariables) {
      const exportVarsResult = evaluateExportVariables(policy.exportVariables, context);
      if (exportVarsResult) qualifyingEntities.push(exportVarsResult);
    }
  }

  return qualifyingEntities;
}

