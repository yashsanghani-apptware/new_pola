import mongoose, { Types } from 'mongoose';
import PolicyModel from '../models/policy';
import { MembershipResolver } from '../services/MembershipResolver';

async function aggregatePolicies(
  principalId: Types.ObjectId,
  resourceARI: string
): Promise<any[]> {
  console.log(`Aggregating policies for Principal: ${principalId}, Resource: ${resourceARI}`);

  // Fetch resource policies
  const resourcePolicies = await PolicyModel.find({
    'resourcePolicy.resource': { $regex: new RegExp(`^${resourceARI.replace('*', '.*')}$`) }
  }).lean();

  console.log('Fetched Resource Policies:', JSON.stringify(resourcePolicies, null, 2));

  // Fetch principal policies
  const principalPolicies = await PolicyModel.find({
    'principalPolicy.principal': principalId,
  }).lean();

  console.log('Fetched Principal Policies:', JSON.stringify(principalPolicies, null, 2));

  // Membership Resolver to fetch group and role IDs
  const membershipResolver = new MembershipResolver();

  // Fetch group policies
  const groupIds = await membershipResolver.resolveGroupsForPrincipal(principalId);
  const groupPolicies = await PolicyModel.find({
    'groupPolicy.group': { $in: groupIds },
  }).lean();

  console.log('Fetched Group Policies:', JSON.stringify(groupPolicies, null, 2));

  // Fetch role policies
  const roleIds = await membershipResolver.resolveRolesForPrincipal(principalId);
  const rolePolicies = await PolicyModel.find({
    'rolePolicy.role': { $in: roleIds },
  }).lean();

  console.log('Fetched Role Policies:', JSON.stringify(rolePolicies, null, 2));
  const context = {
  principal: {
    id: '66ca3ac3bd8adf5ced94fde9',
    roles: ['investor'],
    attr: {
      geography: 'US'
    }
  },
  resource: {
    id: 'resource001',
    confidentiality: 'HIGH'
  }
};

  // Fetch derived role policies
  const derivedRoleIds = await membershipResolver.resolveDerivedRolesForPrincipal(principalId, context);
  const derivedRolePolicies = await PolicyModel.find({
    'derivedRoles.definitions.name': { $in: derivedRoleIds },
  }).lean();

  console.log('Fetched Derived Role Policies:', JSON.stringify(derivedRolePolicies, null, 2));

  // Combine all policies for further processing
  const aggregatedPolicies = [
    ...resourcePolicies,
    ...principalPolicies,
    ...groupPolicies,
    ...rolePolicies,
    ...derivedRolePolicies,
  ];

  console.log('Aggregated Policies:', JSON.stringify(aggregatedPolicies, null, 2));
  return aggregatedPolicies;
}

async function main() {
  // Connect to MongoDB
  await mongoose.connect('mongodb://localhost:27017/PolicyDB');

  const principalId = new Types.ObjectId('66ca3ac3bd8adf5ced94fde9'); // Replace with actual principalId
  const resourceARI = 'ari:agsiri:dataroom:us:448912311299-1:dataroom/cabinet/file/*'; // Replace with actual resource ARI

  // Aggregate policies
  const aggregatedPolicies = await aggregatePolicies(principalId, resourceARI);

  // Output the aggregated policies
  console.log('Final Aggregated Policies:', JSON.stringify(aggregatedPolicies, null, 2));

  // Disconnect from MongoDB
  await mongoose.disconnect();
}

main().catch(err => console.error('Error:', err));

