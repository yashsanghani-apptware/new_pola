import mongoose from 'mongoose';
import PolicyService from '../src/services/PolicyService';  // Adjust the path if needed

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

        // Example 6: Create a New Policy
        console.log('--- Creating a New Policy ---');
        const newPolicy = await PolicyService.createPolicy({
            apiVersion: 'api.agsiri.dev/v1',
            resourcePolicy: {
                resource: 'ari:agsiri:dataroom:us:123456789012:dataroom/farm001',
                version: '1.0',
                rules: [
                    {
                        actions: ['read', 'edit'],
                        effect: 'EFFECT_ALLOW'
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
                                effect: 'EFFECT_ALLOW'
                            }
                        ]
                    }
                ]
            },
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            }
        });
        console.log('New Policy Created:', JSON.stringify(newPolicy, null, 2));

        // Example 7: Evaluate a Policy
        console.log('--- Evaluating a Policy ---');
        const evaluationResult = await PolicyService.evaluatePolicy(
            { id: 'user123', attributes: {} },  // Principal
            { id: 'ari:agsiri:dataroom:us:123456789012:dataroom/farm001', attributes: {} },  // Resource
            'read'  // Action
        );
        console.log(`Policy Evaluation Result for 'read' action: ${evaluationResult ? 'ALLOW' : 'DENY'}`);

        // Example 8: Evaluate using the full PolicyService evaluate method
        console.log('--- Evaluating with Full Context ---');
        const fullEvaluationResult = await PolicyService.evaluate({
            principalId: 'user123',
            resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/farm001',
            actions: ['read'],
            environment: {},  // Optional environment variables
            variables: {}  // Optional variables
        });
        console.log(`Full Policy Evaluation Result: ${fullEvaluationResult}`);

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

