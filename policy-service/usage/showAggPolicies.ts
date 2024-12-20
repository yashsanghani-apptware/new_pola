import mongoose, { Types } from 'mongoose';
import PolicyModel from '../models/policy';

async function aggregatePolicies(
  principalId: Types.ObjectId,
  resourceARI: string
): Promise<any[]> {
  console.log(`Aggregating policies for Principal: ${principalId}, Resource: ${resourceARI}`);

  // Fetch resource policies
  const resourcePolicies = await PolicyModel.find({
    'resourcePolicy.resource': { $regex: new RegExp(`^${resourceARI.replace('*', '.*')}$`) }
  }).lean();

  if (resourcePolicies.length === 0) {
    console.warn(`No resource policies found for ARI: ${resourceARI}`);
  } else {
    console.log('Fetched Resource Policies:', JSON.stringify(resourcePolicies, null, 2));
  }

  // Fetch principal policies
  const principalPolicies = await PolicyModel.find({
    'principalPolicy.principal': principalId,
  }).lean();

  if (principalPolicies.length === 0) {
    console.warn(`No principal policies found for Principal ID: ${principalId}`);
  } else {
    console.log('Fetched Principal Policies:', JSON.stringify(principalPolicies, null, 2));
  }

  // Combine and return policies as needed for further evaluation
  const aggregatedPolicies = [...resourcePolicies, ...principalPolicies];
  console.log('Aggregated Policies:', JSON.stringify(aggregatedPolicies, null, 2));
  return aggregatedPolicies;
}

async function main() {
  // Connect to MongoDB
  await mongoose.connect('mongodb://localhost:27017/PolicyDB');

  const principalId = new Types.ObjectId('66ca4231c5efaed97f50fc32'); // Replace with actual principalId
  const resourceARI = 'ari:agsiri:dataroom:us:448912311299-1:dataroom/*'; // Replace with actual resource ARI

  // Aggregate policies
  const aggregatedPolicies = await aggregatePolicies(principalId, resourceARI);

  // Output the aggregated policies
  console.log('Final Aggregated Policies:', JSON.stringify(aggregatedPolicies, null, 2));

  // Disconnect from MongoDB
  await mongoose.disconnect();
}

main().catch(err => console.error('Error:', err));

