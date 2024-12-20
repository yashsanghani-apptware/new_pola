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

        // --- Creating Complex Policies ---
        console.log('--- Creating Complex Policies ---');

        const complexPolicy1 = await PolicyService.createPolicy({
            apiVersion: 'api.agsiri.dev/v1',
            resourcePolicy: {
                resource: 'ari:agsiri:dataroom:us:123456789012:dataroom/projectAlpha/*',
                version: '1.0',
                rules: [
                    {
                        actions: ['read', 'edit', 'share'],
                        effect: 'EFFECT_ALLOW',
                        condition: {
                            match: {
                                all: {
                                    of: [
                                        { expr: 'yearsExperience > 5' }
                                    ]
                                }
                            }
                        }
                    }
                ]
            },
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            }
        });

        const complexPolicy2 = await PolicyService.createPolicy({
            apiVersion: 'api.agsiri.dev/v1',
            resourcePolicy: {
                resource: 'ari:agsiri:dataroom:us:123456789012:dataroom/projectAlpha/cabinet001/files/fileA',
                version: '1.0',
                rules: [
                    {
                        actions: ['delete'],
                        effect: 'EFFECT_DENY',
                        condition: {
                            match: {
                                all: {
                                    of: [
                                        { expr: "timeOfDay === 'night'" }
                                    ]
                                }
                            }
                        }
                    }
                ]
            },
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            }
        });

        const principalPolicy = await PolicyService.createPolicy({
            apiVersion: 'api.agsiri.dev/v1',
            principalPolicy: {
                principal: 'Manager',
                version: '1.0',
                rules: [
                    {
                        resource: 'ari:agsiri:dataroom:us:123456789012:dataroom/projectAlpha/cabinet001/files/fileB',
                        actions: [
                            {
                                action: 'read',
                                effect: 'EFFECT_ALLOW',
                                condition: {
                                    match: {
                                        all: {
                                            of: [
                                                { expr: "fileClassification !== 'sensitive'" }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                action: 'edit',
                                effect: 'EFFECT_ALLOW',
                                condition: {
                                    match: {
                                        all: {
                                            of: [
                                                { expr: "fileClassification !== 'sensitive'" }
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
            }
        });

        const derivedRolePolicy = await PolicyService.createPolicy({
            apiVersion: 'api.agsiri.dev/v1',
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
                                        { expr: 'yearsExperience > 10' }
                                    ]
                                }
                            }
                        }
                    }
                ]
            },
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            }
        });

        const exportVariablePolicy = await PolicyService.createPolicy({
            apiVersion: 'api.agsiri.dev/v1',
            exportVariables: {
                name: 'maxFileSize',
                definitions: {
                    maxFileSize: '100MB'
                }
            },
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            }
        });

        console.log('Complex Policies Created');

	// Example 1: Retrieve all Resource Policies
        console.log('--- Retrieving All Resource Policies ---');
        const resourcePolicies = await PolicyService.getAllResourcePolicies();
        console.log('Resource Policies:', JSON.stringify(resourcePolicies, null, 2));

        // Example 2: Retrieve all Principal Policies
        console.log('--- Retrieving All Principal Policies ---');
        const principalPolicies = await PolicyService.getAllPrincipalPolicies();
        console.log('Principal Policies:', JSON.stringify(principalPolicies, null, 2));


        // --- Evaluating a Complex Policy ---
        console.log('--- Evaluating a Complex Policy ---');

        const requestParams = {
            principalId: 'Manager',
            resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/projectAlpha/cabinet001/files/fileB',
            actions: ['read'],
            environment: { timeOfDay: 'day' },  // Scenario specific environment variable
            variables: { fileClassification: 'public' }  // Scenario specific variables
        };

        const evaluationResult = await PolicyService.evaluatePolicy(requestParams);
        console.log(`Policy Evaluation Result for 'read' action: ${evaluationResult}`);

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


