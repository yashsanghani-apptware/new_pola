
import mongoose from 'mongoose';
import PolicyService from '../src/services/PolicyService';  // Adjust the path if needed
import fs from 'fs';

async function runPolicyServiceExamples() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/agsiri-iam', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Load policies and scenarios from files
        const policies = JSON.parse(fs.readFileSync('policies.json', 'utf8'));
        const scenarios = JSON.parse(fs.readFileSync('scenarios.json', 'utf8'));

        // Insert the policies into the database
        for (const policy of policies) {
            await PolicyService.createPolicy(policy);
        }

        // Run each scenario
        for (const scenario of scenarios) {
            console.log(`--- Running Scenario: ${scenario.description} ---`);
            const result = await PolicyService.evaluate(scenario.requestParams);
            const expectedResult = scenario.expectedResult;
            const passFail = result === expectedResult ? 'PASS' : 'FAIL';
            console.log(`Expected: ${expectedResult}, Actual: ${result} => ${passFail}`);
            console.log(`Explanation: ${scenario.explanation}`);
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

