import * as acorn from 'acorn';

interface Principal {
  [key: string]: any;
}

interface Resource {
  [key: string]: any;
}

interface Condition {
  match?: {
    all?: { of: Condition[] };
    any?: { of: Condition[] };
    none?: { of: Condition[] };
  };
  expr?: string;
}

interface ActionRule {
  action: string;
  effect: 'EFFECT_ALLOW' | 'EFFECT_DENY';
  condition: Condition;
  notify?: {
    service: string;
    serviceConfig: { [key: string]: any };
    when: { [key: string]: any };
  };
  output?: {
    expr: string;
    when: { [key: string]: any };
  };
}

interface ResourceRule {
  resource: string;
  actions: ActionRule[];
}

interface PrincipalPolicy {
  apiVersion: string;
  name: string;
  principalPolicy: {
    principal: string;
    version: string;
    rules: ResourceRule[];
    scope: string;
    variables?: {
      import: string[];
    };
  };
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

  if (condition.expr) {
    return evaluateExpression(condition.expr, context);
  }

  throw new Error('Unsupported condition type');
}

// Function to check if an action is allowed based on the policy rules
function isActionAllowed(
  action: string,
  principal: Principal,
  resource: Resource,
  principalPolicy: PrincipalPolicy
): boolean {
  const context = { P: principal, R: resource };

  for (const resourceRule of principalPolicy.principalPolicy.rules) {
    if (resourceRule.resource === resource.id) {
      for (const actionRule of resourceRule.actions) {
        if (actionRule.action === action) {
          const conditionMet = evaluateCondition(actionRule.condition, context);

          if (conditionMet) {
            if (actionRule.effect === 'EFFECT_ALLOW') {
              console.log(`Action ${action} is allowed.`);
              return true;
            } else if (actionRule.effect === 'EFFECT_DENY') {
              console.log(`Action ${action} is denied.`);
              return false;
            }
          }
        }
      }
    }
  }

  console.log(`No matching rule found for action ${action}. Default deny.`);
  return false;
}

// Example usage
const principal: Principal = {
  id: 'user:1234567890',
  department: 'engineering',
  role: 'developer',
  apiQuota: 900,
};

const resource: Resource = {
  id: 'ari:service:region:account-id:resource/project-management',
  projectStatus: 'active',
  sensitivityLevel: 2,
  endpoint: '/v1/secure-data',
};

const principalPolicy: PrincipalPolicy = {
  apiVersion: 'api.pola.dev/v1',
  name: 'UserAccessControlPolicy',
  principalPolicy: {
    principal: 'user:1234567890',
    version: '1.0.0',
    rules: [
      {
        resource: 'ari:service:region:account-id:resource/project-management',
        actions: [
          {
            action: 'READ',
            effect: 'EFFECT_ALLOW',
            condition: {
              match: {
                all: {
                  of: [
                    { expr: "P.department === 'engineering'" },
                    { expr: "R.projectStatus === 'active'" },
                  ],
                },
              },
            },
            notify: {
              service: 'pubsub',
              serviceConfig: {
                topic: 'project-access-logs',
              },
              when: {
                ruleActivated: 'true',
              },
            },
          },
          {
            action: 'DELETE',
            effect: 'EFFECT_DENY',
            condition: {
              match: {
                any: {
                  of: [
                    { expr: "P.role !== 'admin'" },
                    { expr: 'R.sensitivityLevel > 3' },
                  ],
                },
              },
            },
            notify: {
              service: 'webservice',
              serviceConfig: {
                url: 'https://audit.example.com/logs',
                method: 'POST',
              },
              when: {
                conditionMet: 'true',
              },
            },
          },
        ],
      },
      {
        resource: 'ari:service:region:account-id:resource/api-endpoint',
        actions: [
          {
            action: 'INVOKE',
            effect: 'EFFECT_ALLOW',
            condition: {
              match: {
                all: {
                  of: [
                    { expr: 'P.apiQuota < 1000' },
                    { expr: "R.endpoint === '/v1/secure-data'" },
                  ],
                },
              },
            },
            output: {
              expr: "'Quota used: ' + P.apiQuota",
              when: {
                ruleActivated: 'true',
              },
            },
          },
        ],
      },
    ],
    scope: 'organization-wide',
    variables: {
      import: ['departmentName', 'roleName'],
    },
  },
};

const action = 'READ';

const allowed = isActionAllowed(action, principal, resource, principalPolicy);
console.log(`Is action allowed: ${allowed}`);

