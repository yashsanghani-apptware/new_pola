import PolicyModel from '../../../models/policy';
import PrincipalPolicyModel from '../../../models/principalPolicy';
import { ResourcePolicy, Action, Condition, Match, DerivedRole, PrincipalPolicy, ResourceRule } from '../../../models/types';
import mongoose from 'mongoose';


interface RequestParams {
  principalId: string;
  resourceId: string;
  actions: string[];
  environment?: any; // Environmental variables like time of day, location, etc.
  variables?: { [key: string]: any }; // Imported and Exported Variables
}

class PolicyExecutor {
  constructor() {
    // Initialization, if needed
  }

  private async buildContext(requestParams: RequestParams) {
    const context = {
      principalId: requestParams.principalId,
      resourceId: requestParams.resourceId,
      actions: requestParams.actions,
      environment: requestParams.environment || {},
      variables: requestParams.variables || {},
    };

    console.log('Context Built:', JSON.stringify(context, null, 2)); // Debugging context
    return context;
  }

  private async getRelevantPolicies(principalId: string, resourceId: string): Promise<{ principalPolicies: PrincipalPolicy[], resourcePolicies: ResourcePolicy[] }> {
    console.log(`Fetching relevant policies for Principal: ${principalId}, Resource: ${resourceId}`);

    const principalPolicies = await PrincipalPolicyModel.find({}).lean();
    //  'principalPolicy.principal': principalId,
    //}).lean();

    const policyDocuments = await PolicyModel.find({
      'resourcePolicy.resource': { $regex: new RegExp(`^${resourceId.replace('*', '.*')}$`) },
    }).lean();

    const resourcePolicies: ResourcePolicy[] = policyDocuments
      .filter(doc => doc.resourcePolicy)
      .map(doc => doc.resourcePolicy as ResourcePolicy);

    console.log('Fetched Principal Policies:', JSON.stringify(principalPolicies, null, 2)); // Debugging
    console.log('Fetched Resource Policies:', JSON.stringify(resourcePolicies, null, 2)); // Debugging

    return { principalPolicies, resourcePolicies };
  }

  private evaluateCondition(condition: Condition, context: any): boolean {
    console.log('Evaluating Condition:', JSON.stringify(condition, null, 2)); // Debugging
    if (condition.match) {
      return this.evaluateMatch(condition.match, context);
    }
    if (condition.script) {
      return this.evaluateScript(condition.script, context);
    }
    return false;
  }

  private evaluateMatch(match: Match, context: any): boolean {
    console.log('Evaluating Match:', JSON.stringify(match, null, 2)); // Debugging
    if (match.all) {
      return match.all.of.every((subMatch) => this.evaluateMatch(subMatch, context));
    }
    if (match.any) {
      return match.any.of.some((subMatch) => this.evaluateMatch(subMatch, context));
    }
    if (match.none) {
      return !match.none.of.some((subMatch) => this.evaluateMatch(subMatch, context));
    }
    if (match.expr) {
      console.log('Evaluating Expression:', match.expr); // Debugging
      return eval(match.expr); // Be cautious with eval, or use a safer evaluation method
    }
    return false;
  }

  private evaluateScript(script: string, context: any): boolean {
    console.log('Evaluating Script:', script); // Debugging
    return eval(script);
  }

  private applyDerivedRoles(derivedRoles: DerivedRole[], context: any): boolean {
    console.log('Applying Derived Roles:', JSON.stringify(derivedRoles, null, 2)); // Debugging
    return derivedRoles.some((role) => {
      if (role.definitions) {
        return role.definitions.some(def => this.evaluateCondition(def.condition!, context));
      }
      return false;
    });
  }

  private evaluateAction(action: Action, context: any): boolean {
    console.log('Evaluating Action:', JSON.stringify(action, null, 2)); // Debugging
    if (action.condition) {
      return this.evaluateCondition(action.condition, context);
    }
    return true; // If no condition, assume action is allowed
  }

  private resolveResourcePolicyConflicts(policies: ResourcePolicy[], context: any): string {
    let decision = 'DENY';
    console.log('Resolving Resource Policy Conflicts...');

    policies.forEach((policy) => {
      const resourcePolicy: ResourcePolicy = policy;
      resourcePolicy.rules.forEach((rule: ResourceRule) => {
        console.log(`Evaluating Rule for Actions: ${JSON.stringify(rule.actions)}`); // Debugging
        if (rule.actions.some((action) => context.actions.includes(action))) {
          const allow = rule.effect === 'EFFECT_ALLOW' && this.evaluateAction({ action: rule.actions[0], ...rule }, context);
          const deny = rule.effect === 'EFFECT_DENY' && this.evaluateAction({ action: rule.actions[0], ...rule }, context);
          console.log(`Allow: ${allow}, Deny: ${deny}`); // Debugging
          if (allow) decision = 'ALLOW';
          if (deny) decision = 'DENY';
        }
      });
    });

    console.log(`Final Decision after resolving conflicts: ${decision}`); // Debugging
    return decision;
  }

  public async evaluate(requestParams: RequestParams): Promise<string> {
    const context = await this.buildContext(requestParams);
    const { principalPolicies, resourcePolicies } = await this.getRelevantPolicies(requestParams.principalId, requestParams.resourceId);
    
    if (principalPolicies.length === 0 && resourcePolicies.length === 0) {
      console.log('No matching policies found. Denying by default.'); // Debugging
      return 'DENY'; // No matching policies, deny by default
    }

    // Resolve Resource Policy Conflicts
    const resourceDecision = this.resolveResourcePolicyConflicts(resourcePolicies, context);

    // Further implementation could handle principalPolicies if needed

    return resourceDecision;
  }
}

// Example usage
async function runQuery(requestParams: RequestParams) {
  await mongoose.connect('mongodb://localhost:27017/agsiri-iam');

  const evaluator = new PolicyExecutor();
  const decision = await evaluator.evaluate(requestParams);


  console.log('Final Decision:', decision);

  mongoose.connection.close();
}

// Example request parameters
const requestParams: RequestParams = {
  principalId: 'user123',
  resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/cabinet001/files/file001',
  actions: ['edit', 'delete'],
};

// Run the query
runQuery(requestParams).catch(console.error);

