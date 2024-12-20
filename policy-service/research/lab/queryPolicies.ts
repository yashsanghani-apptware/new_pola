import mongoose from 'mongoose';
import PolicyModel from '../src/models/policy';
import PrincipalPolicyModel from '../src/models/principalPolicy';
import ResourcePolicyModel from '../src/models/resourcePolicy';

async function listAllPolicies() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/agsiri-iam', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');


		// Fetch all resource policies by querying the PolicyModel and extracting 
  	// resourcePolicy fields
		const resourcePolicies = await PolicyModel.find({ 'resourcePolicy': { $exists: true } }, 'resourcePolicy').lean();
		console.log('Resource Policies:', JSON.stringify(resourcePolicies, null, 2));

		// Fetch all principal policies similarly by querying the PolicyModel and 
		// extracting principalPolicy fields
		const principalPolicies = await PolicyModel.find({ 'principalPolicy': { $exists: true } }, 'principalPolicy').lean();
		console.log('Principal Policies:', JSON.stringify(principalPolicies, null, 2));

    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error listing policies:', error);
  }
}

// Run the function
listAllPolicies();

