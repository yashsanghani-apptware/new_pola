import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { PolaEvaluator } from '../../utils/PolaEvaluator';

connectDB().then(async () => {
  // Test Principal Policy


  const evaluator = new PolaEvaluator();
  const principalParams = {
    principalId: 'user:1234567890',
    resourceId: 'ari:service:region:account-id:resource/project-management',
    actions: ['READ', 'DELETE'],
    variables: {
      department: 'engineering', // Should match P.department === 'engineering'
      role: 'admin', // To test DELETE with role !== 'admin'
      projectStatus: 'active', // Should match R.projectStatus === 'active'
      sensitivityLevel: 2, // Should NOT exceed 3 to pass DELETE condition
    },
  };
  const principalResults = await evaluator.evaluatePolicies(principalParams);
  console.log('Principal Policy Evaluation Results:', principalResults);

  // Test Resource Policy
  const resourceParams = {
    principalId: 'user:1234567890',
    resourceId: 'ari:service:region:account-id:resource/api-endpoint',
    actions: ['INVOKE'],
    variables: {
      apiQuota: 900, // Should be less than 1000
      endpoint: '/v1/secure-data', // Should match R.endpoint === '/v1/secure-data'
    },
  };
  const resourceResults = await evaluator.evaluatePolicies(resourceParams);
  console.log('Resource Policy Evaluation Results:', resourceResults);

  // Test Role Policy
  const roleParams = {
    principalId: 'user:1234567890',
    resourceId: 'ari:service:region:account-id:resource/financial-reports',
    actions: ['READ'],
    variables: {
      role: 'manager', // Should match P.role === 'manager'
      isPublic: true, // Should match R.isPublic === true
    },
  };
  const roleResults = await evaluator.evaluatePolicies(roleParams);
  console.log('Role Policy Evaluation Results:', roleResults);

  // Test Derived Role Policy
  const derivedRoleParams = {
    principalId: 'user:1234567890',
    resourceId: 'ari:service:region:account-id:resource/some-resource',
    actions: ['ANY_ACTION'], // Actions aren't as relevant for derived roles directly
    variables: {
      yearsOfExperience: 12, // Should qualify for SeniorManager
      teamSize: 60, // Should qualify for SeniorManager
      role: 'engineer',
      certifications: ['leadership-training'], // Should qualify for TeamLead
    },
  };
  const derivedRoleResults = await evaluator.evaluatePolicies(derivedRoleParams);
  console.log('Derived Role Evaluation Results:', derivedRoleResults);

  // Close the DB connection when done
  mongoose.connection.close();
}).catch((err) => {
  console.error('Error:', err);
  mongoose.connection.close();
});

