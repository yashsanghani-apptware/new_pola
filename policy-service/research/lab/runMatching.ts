import mongoose from 'mongoose';
import PolicyModel, { Policy } from '../src/models/policy';
import { filterPolicies, RequestParams, runQuery } from '../src/utils/policyUtils'; // Import the utility functions

// Main function to handle MongoDB connection and run the query
async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/agsiri-iam', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

const requestParams: RequestParams = {
  principalId: 'analyst',
  resourceId: 'ari:agsiri:dataroom:us:123456789012:dataroom/reports/report002',
  actions: ['view', 'edit']
};

    // Run the query
    await runQuery(requestParams);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

main();

