import mongoose from 'mongoose';
import fs from 'fs/promises';
import PolicyService from '../src/services/PolicyService';

async function loadJsonFile(filePath: string) {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}

async function runPolicyServiceExamples() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/agsiri-iam', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Load policies from file and create them in the database
        const policies = await loadJsonFile('./policies.json');
        console.log('--- Creating Policies from File ---');
        for (const policy of policies) {
            const createdPolicy = await PolicyService.createPolicy(policy);
            console.log('Created Policy:', JSON.stringify(createdPolicy, null, 2));
        }

        // Load scenarios from file and evaluate them
        const scenarios = await loadJsonFile('./scenarios.json');
        console.log('--- Running Scenarios from File ---');
        for (const scenario of scenarios) {
            const evaluationResult = await PolicyService.evaluate(scenario);
            const outcome = evaluationResult === scenario.expectedResult ? 'PASS' : 'FAIL';
            console.log(`Scenario: ${scenario.explanation}`);
            console.log(`Expected: ${scenario.expectedResult}, Actual: ${evaluationResult} => ${outcome}`);
        }

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

