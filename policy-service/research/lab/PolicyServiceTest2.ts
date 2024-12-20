import mongoose from 'mongoose';
import PolicyService from '../src/services/policyService'; // Adjust the path if needed
import { PrincipalPolicy, ResourcePolicy, DerivedRole, ExportVariable } from '../src/models/types'; // Import only the types that are defined in the types file
import Policy from '../src/models/policy'; // Import Policy from the policy model
import { RequestParams }  from '../src/models/types';

async function runPolicyServiceExamples() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/agsiri-iam', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Example 1: Retrieve all Resource Policies
        console.log('--- Retrieving All Resource Policies ---');
        const resourcePolicies = await PolicyService.getAllResourcePolicies();
        console.log('Resource Policies:', JSON.stringify(resourcePolicies, null, 2));

        // Example 2: Retrieve all Principal Policies
        console.log('--- Retrieving All Principal Policies ---');
        const principalPolicies = await PolicyService.getAllPrincipalPolicies();
        console.log('Principal Policies:', JSON.stringify(principalPolicies, null, 2));

        // Example 3: Retrieve all Export Variables
        console.log('--- Retrieving All Export Variables ---');
        const exportVariables = await PolicyService.getAllExportVariables();
        console.log('Export Variables:', JSON.stringify(exportVariables, null, 2));

        // Example 4: Retrieve all Derived Roles
        console.log('--- Retrieving All Derived Roles ---');
        const derivedRoles = await PolicyService.getAllDerivedRoles();
        console.log('Derived Roles:', JSON.stringify(derivedRoles, null, 2));

        // Example 5: Retrieve Combined Resource and Principal Policies
        console.log('--- Retrieving Combined Resource and Principal Policies ---');
        const combinedPolicies = await PolicyService.getCombinedResourceAndPrincipalPolicies();
        console.log('Combined Resource and Principal Policies:', JSON.stringify(combinedPolicies, null, 2));

        // Example 6: Create a New Policy with Conditions
        console.log('--- Creating a New Policy with Conditions ---');
        const newPolicyWithConditions = await PolicyService.createPolicy({
            apiVersion: 'api.agsiri.dev/v1',
            resourcePolicy: {
                resource: 'ari:agsiri:dataroom:us:123456789012:dataroom/farm001',
                version: '1.0',
                rules: [
                    {
                        actions: ['read', 'edit'],
                        effect: 'EFFECT_ALLOW',
                        condition: {
                            match: {
                                all: {
                                    of: [
                                        { expr: "userRole === 'admin'" },
                                        { expr: "yearsExperience > 5" }
                                    ]
                                }
                            }
                        }
                    }
                ]
            },
            principalPolicy: {
                principal: 'user123',
                version: '1.0',
                rules: [
                    {
                        resource: 'ari:agsiri:dataroom:us:123456789012:dataroom/farm001',
                        actions: [
                            {
                                action: 'read',
                                effect: 'EFFECT_ALLOW',
                                condition: {
                                    match: {
                                        all: {
                                            of: [
                                                { expr: "resource === 'ari:agsiri:dataroom:us:123456789012:dataroom/farm001'" },
                                                { expr: "timeOfDay === 'daytime'" }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            },
            exportVariables: {
                name: 'maxFileSize',
                definitions: {
                    maxFileSize: '50MB'
                }
            },
            derivedRoles: {
                name: 'SeniorAdmin',
                definitions: [
                    {
                        name: 'Admin',
                        parentRoles: ['admin'],
                        condition: {
                            match: {
                                all: {
                                    of: [
                                        { expr: "userRole === 'admin'" },
                                        { expr: "yearsExperience > 10" }
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        });
        console.log('New Policy with Conditions Created:', JSON.stringify(newPolicyWithConditions, null, 2));

        // Example 7: Evaluate a Policy with Conditions
        console.log('--- Evaluating a Policy with Conditions ---');
const requestParams: RequestParams = {
    principalId: 'user123',  // Match the principal in the policy
    resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/farm001',  // Match the resource in the policy
    actions: ['read'],
    environment: {
        timeOfDay: 'daytime'  // Match the time condition in the policy
    },
    variables: {
        userRole: 'admin',  // This should match the userRole condition
        yearsExperience: 6  // This should match the yearsExperience condition
    }
};

        const evaluationResult = await PolicyService.evaluatePolicy(
            { id: requestParams.principalId, attributes: {} },  // Principal
            { id: requestParams.resourceId, attributes: {} },   // Resource
            requestParams.actions[0]  // Action
        );
        console.log(`Policy Evaluation Result for 'read' action: ${evaluationResult ? 'ALLOW' : 'DENY'}`);

        // Example 8: Debugging and Evaluating Conditions
        console.log('--- Evaluating Conditions and Expressions ---');
        const relevantPolicies = await PolicyService.getRelevantPolicies(requestParams.principalId, requestParams.resourceId);
        const scopeVariables = requestParams.variables || {};
        relevantPolicies.resourcePolicies.forEach((policy, index) => {
            const conditions = policy.rules.map(rule => rule.condition);
            conditions.forEach((condition, conditionIndex) => {
                if (condition) {
                    const result = PolicyService.evaluateCondition(condition, scopeVariables);
                    console.log(`Condition ${index + 1}.${conditionIndex + 1} Evaluation Result:`, result);
                } else {
                    console.log(`Condition ${index + 1}.${conditionIndex + 1} is undefined and cannot be evaluated.`);
                }
            });
        });

    } catch (error) {
        console.error('Error during policy service examples:', error);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

// Run the examples
runPolicyServiceExamples();

