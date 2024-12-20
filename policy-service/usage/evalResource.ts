import * as acorn from 'acorn';

// Define the structure of the principal and resource
interface Principal {
  [key: string]: any;
}

interface Resource {
  [key: string]: any;
}

// Define the structure of the condition, ensuring that match is flexible
interface Condition {
  match?: {
    all?: { of: Condition[] };
    any?: { of: Condition[] };
    none?: { of: Condition[] };
  };
  expr?: string;
}

interface Rule {
  actions: string[];
  effect: 'EFFECT_ALLOW' | 'EFFECT_DENY';
  condition: Condition;
  notify?: {
    service: string;
    serviceConfig: { [key: string]: any };
    when: { conditionMet: string };
  };
}

interface ResourcePolicy {
  apiVersion: string;
  name: string;
  resourcePolicy: {
    resource: string;
    version: string;
    rules: Rule[];
  };
}

// Example resource policy object
const resourcePolicy: ResourcePolicy = {
  apiVersion: "api.pola.dev/v1",
  name: "DataRoomAccessControlPolicy",
  resourcePolicy: {
    resource: "ari:service:region:account-id:resource/data-room",
    version: "1.0.0",
    rules: [
      {
        actions: ["READ", "LIST"],
        effect: "EFFECT_ALLOW",
        condition: {
          match: {
            all: {
              of: [
                { expr: "R.status === 'active'" },
                { expr: "P.role === 'analyst'" },
                {
                  match: {
                    none: {
                      of: [
                        { expr: "P.suspension === true" }
                      ]
                    }
                  }
                }
              ]
            }
          }
        },
        notify: {
          service: "pubsub",
          serviceConfig: {
            topic: "data-room-access-attempts"
          },
          when: {
            conditionMet: "true"
          }
        }
      },
      {
        actions: ["DELETE"],
        effect: "EFFECT_DENY",
        condition: {
          match: {
            any: {
              of: [
                { expr: "P.role !== 'admin'" },
                { expr: "R.sensitivityLevel >= 5" }
              ]
            }
          }
        },
        notify: {
          service: "webservice",
          serviceConfig: {
            url: "https://audit.example.com/log",
            method: "POST"
          },
          when: {
            conditionMet: "true"
          }
        }
      }
    ]
  }
};

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
        const binaryNode = node as acorn.Node & {
          left: acorn.Node,
          right: acorn.Node,
          operator: string
        };
        const left = evaluate(binaryNode.left);
        const right = evaluate(binaryNode.right);
        switch (binaryNode.operator) {
          case '===':
            return left === right;
          case '!==':
            return left !== right;
          case '>=':
            return left >= right;
          case '<=':
            return left <= right;
          case '>':
            return left > right;
          case '<':
            return left < right;
          default:
            throw new Error(`Unsupported operator: ${binaryNode.operator}`);
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
function isActionAllowed(action: string, principal: Principal, resource: Resource): boolean {
  const context = { P: principal, R: resource };
  
  for (const rule of resourcePolicy.resourcePolicy.rules) {
    if (rule.actions.includes(action)) {
      const conditionMet = evaluateCondition(rule.condition, context);
      
      if (conditionMet) {
        if (rule.effect === "EFFECT_ALLOW") {
          console.log(`Action ${action} is allowed.`);
          return true;
        } else if (rule.effect === "EFFECT_DENY") {
          console.log(`Action ${action} is denied.`);
          return false;
        }
      }
    }
  }
  
  console.log(`No matching rule found for action ${action}. Default deny.`);
  return false;
}

// Example usage
const principal: Principal = {
  role: 'analyst',
  suspension: false
};

const resource: Resource = {
  status: 'active',
  sensitivityLevel: 3
};

const action = 'READ';

const allowed = isActionAllowed(action, principal, resource);
console.log(`Is action allowed: ${allowed}`);

