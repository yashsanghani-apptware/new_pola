import mongoose, { Types }  from 'mongoose';
import { MembershipResolver } from '../src/services/MembershipResolver';  // Adjust the import path as needed
import { User }  from '../src/models/user';
import { Group }  from '../src/models/group';
import { Role }  from '../src/models/role';
import PolicyModel from '../src/models/policy';

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/PolicyDB';

async function exampleUsage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

     // Drop the database to start fresh
    if (mongoose.connection.db) {
    	await mongoose.connection.db.dropDatabase();
    }

// Create some users, groups, roles, and policies
    const user = new User({
      name: 'John Doe',
      givenName: 'John',
      familyName: 'Doe',
      email: 'john.doe@example.com',
      telephone: '123-456-7890',
      username: 'johndoe',
      password: 'password',
      contactPoint: {
        telephone: '123-456-7890',
        contactType: 'personal',
        email: 'john.doe@example.com',
      },
      attr: { version: '1.1' },
    });
    await user.save();
    console.log('User created:', user);

    // Create a principal policy for the user
    const principalPolicy = new PolicyModel({
      apiVersion: 'api.pola.dev/v1',
      name: 'PrincipalPolicy-JohnDoe',
      principalPolicy: {
        principal: user._id as Types.ObjectId,
        version: '2024-08-01',
        rules: [{
          resource: 'resource-ari-1',
          actions: [{ action: 'read', effect: 'EFFECT_ALLOW' }],
        }],
        auditInfo: { createdBy: 'admin', createdAt: new Date() },
      },
      auditInfo: { createdBy: 'admin', createdAt: new Date() },
    });
    await principalPolicy.save();
    console.log('Principal Policy created:', principalPolicy);

    // Create groups and group policies
    const executiveGroup = new Group({
      name: 'executive',
      description: 'Executive level group',
      members: [user._id as Types.ObjectId],
    });
    await executiveGroup.save();
    console.log('Executive Group created:', executiveGroup);

    const managerGroup = new Group({
      name: 'manager',
      description: 'Manager level group',
      members: [user._id as Types.ObjectId],
    });
    await managerGroup.save();
    console.log('Manager Group created:', managerGroup);

    const executiveGroupPolicy = new PolicyModel({
      apiVersion: 'api.pola.dev/v1',
      name: 'ExecutiveGroupPolicy',
      groupPolicy: {
        group: executiveGroup._id as Types.ObjectId,
        version: '2024-08-01',
        rules: [{
          resource: 'resource-ari-1',
          actions: [{ action: 'write', effect: 'EFFECT_ALLOW' }],
        }],
        auditInfo: { createdBy: 'admin', createdAt: new Date() },
      },
      auditInfo: { createdBy: 'admin', createdAt: new Date() },
    });
    await executiveGroupPolicy.save();
    console.log('Executive Group Policy created:', executiveGroupPolicy);

    const managerGroupPolicy = new PolicyModel({
      apiVersion: 'api.pola.dev/v1',
      name: 'ManagerGroupPolicy',
      groupPolicy: {
        group: managerGroup._id as Types.ObjectId,
        version: '2024-08-01',
        rules: [{
          resource: 'resource-ari-1',
          actions: [{ action: 'delete', effect: 'EFFECT_ALLOW' }],
        }],
        auditInfo: { createdBy: 'admin', createdAt: new Date() },
      },
      auditInfo: { createdBy: 'admin', createdAt: new Date() },
    });
    await managerGroupPolicy.save();
    console.log('Manager Group Policy created:', managerGroupPolicy);

    // Create roles and role policies
    const investorRole = new Role({
      name: 'investor',
      description: 'Investor role',
    });
    await investorRole.save();
    console.log('Investor Role created:', investorRole);

    const analystRole = new Role({
      name: 'analyst',
      description: 'Analyst role',
    });
    await analystRole.save();
    console.log('Analyst Role created:', analystRole);

    const investorRolePolicy = new PolicyModel({
      apiVersion: 'api.pola.dev/v1',
      name: 'InvestorRolePolicy',
      rolePolicy: {
        role: investorRole._id as Types.ObjectId,
        version: '2024-08-01',
        rules: [{
          resource: 'resource-ari-1',
          actions: [{ action: 'read', effect: 'EFFECT_ALLOW' }],
        }],
        auditInfo: { createdBy: 'admin', createdAt: new Date() },
      },
      auditInfo: { createdBy: 'admin', createdAt: new Date() },
    });
    await investorRolePolicy.save();
    console.log('Investor Role Policy created:', investorRolePolicy);

    const analystRolePolicy = new PolicyModel({
      apiVersion: 'api.pola.dev/v1',
      name: 'AnalystRolePolicy',
      rolePolicy: {
        role: analystRole._id as Types.ObjectId,
        version: '2024-08-01',
        rules: [{
          resource: 'resource-ari-1',
          actions: [{ action: 'analyze', effect: 'EFFECT_ALLOW' }],
        }],
        auditInfo: { createdBy: 'admin', createdAt: new Date() },
      },
      auditInfo: { createdBy: 'admin', createdAt: new Date() },
    });
    await analystRolePolicy.save();
    console.log('Analyst Role Policy created:', analystRolePolicy);

    // After creating and saving the role policies, explicitly associate them with the roles
    //investorRole.policies = [investorRolePolicy._id as Types.ObjectId];
    //await investorRole.save();

    //analystRole.policies = [analystRolePolicy._id as Types.ObjectId];
    //await analystRole.save();


    // Add user to groups and roles
    user.groups = [executiveGroup._id as Types.ObjectId, managerGroup._id as Types.ObjectId];
    user.roles = [investorRole._id as Types.ObjectId, analystRole._id as Types.ObjectId];
    await user.save();

    // Resolve permitted actions
    const membershipResolver = new MembershipResolver();

    const permittedActions = await membershipResolver.resolvePermittedActions(user._id as Types.ObjectId, 'resource-ari-1');
    console.log('Permitted actions:', permittedActions);

  } catch (error) {
    console.error('Error during example usage:', error);
  } finally {
    // Drop the database and disconnect from MongoDB
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB and dropped the database');
  }
}

// Run the example
exampleUsage();

