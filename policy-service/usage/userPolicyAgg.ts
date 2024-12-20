import mongoose, { Types } from 'mongoose';
import { User } from '../models/user';
import { Group } from '../models/group';
import { Role } from '../models/role';
import PolicyModel from '../models/policy';
import { MembershipResolver } from '../services/MembershipResolver';
import { PolicyAggregator } from '../services/PolicyAggregator';

/**
 * This program demonstrates the process of creating a user, associating the user with groups and roles,
 * defining various policies related to the user, and then aggregating these policies to evaluate the user's
 * access rights to resources. The aggregation is performed using the PolicyAggregator service.
 */

async function main() {
    // Step 1: Connect to MongoDB
    // Establishes a connection to the MongoDB database where user and policy data is stored.
    await mongoose.connect('mongodb://localhost:27017/PolicyDB');

    // Ensure the database is defined before trying to drop it
    // This step is optional and used to start with a clean database for testing purposes.
    if (mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase();
    }

    // Step 2: Create a User
    // A new user is created with specific attributes such as name, email, contact information, and an empty list of groups, roles, and policies.
    const user = new User({
        name: 'John Doe',
        givenName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com',
        telephone: '123-456-7890',
        username: 'johndoe',
        password: 'securepassword', // In a real application, ensure this is hashed securely
        address: {
            streetAddress: '123 Main St',
            addressLocality: 'Springfield',
            addressRegion: 'IL',
            postalCode: '62701',
            addressCountry: 'US',
        },
        contactPoint: {
            telephone: '123-456-7890',
            contactType: 'personal',
            email: 'john.doe@example.com',
        },
        groups: [],
        roles: [],
        policies: [],
        attr: { version: '1.1' }, // Example custom attribute
    });

    await user.save(); // Saves the user to the database
    console.log('User created:', user);

    // Step 3: Create Principal Policy
    // A policy is created specifically for the user (principal) that grants the user permission to perform certain actions on specific resources.
    const principalPolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'PrincipalPolicy-JohnDoe',
        principalPolicy: {
            principal: user._id as Types.ObjectId, // Links the policy to the user's ID
            version: '2024-08-01',
            rules: [
                {
                    action: 'read',
                    effect: 'EFFECT_ALLOW',
                    resource: 'document123', // This policy allows the user to read 'document123'
                },
            ],
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            },
        },
        auditInfo: {
            createdBy: 'admin',
            createdAt: new Date(),
        },
    });

    await principalPolicy.save(); // Saves the principal policy to the database
    console.log('Principal Policy created:', principalPolicy);

    // Step 4: Create Groups
    // Two groups are created: 'executive' and 'manager'. Each group includes the user as a member.
    const executiveGroup = new Group({
        name: 'executive',
        description: 'Executive level group',
        members: [user._id as Types.ObjectId], // Adds the user to the 'executive' group
        roles: [],
        policies: [],
    });
    await executiveGroup.save(); // Saves the 'executive' group to the database
    console.log('Executive Group created:', executiveGroup);

    const managerGroup = new Group({
        name: 'manager',
        description: 'Manager level group',
        members: [user._id as Types.ObjectId], // Adds the user to the 'manager' group
        roles: [],
        policies: [],
    });
    await managerGroup.save(); // Saves the 'manager' group to the database
    console.log('Manager Group created:', managerGroup);

    // Step 5: Create Group Policies
    // Policies are created for each group, defining what actions members of these groups are allowed to perform on specific resources.
    const executiveGroupPolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'ExecutiveGroupPolicy',
        groupPolicy: {
            group: executiveGroup._id as Types.ObjectId, // Associates the policy with the 'executive' group
            version: '2024-08-01',
            rules: [
                {
                    action: 'edit',
                    effect: 'EFFECT_ALLOW',
                    resource: 'document123', // Allows 'executive' group members to edit 'document123'
                },
            ],
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            },
        },
        auditInfo: {
            createdBy: 'admin',
            createdAt: new Date(),
        },
    });
    await executiveGroupPolicy.save(); // Saves the 'executive' group policy to the database
    console.log('Executive Group Policy created:', executiveGroupPolicy);

    const managerGroupPolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'ManagerGroupPolicy',
        groupPolicy: {
            group: managerGroup._id as Types.ObjectId, // Associates the policy with the 'manager' group
            version: '2024-08-01',
            rules: [
                {
                    action: 'view',
                    effect: 'EFFECT_ALLOW',
                    resource: 'document123', // Allows 'manager' group members to view 'document123'
                },
            ],
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            },
        },
        auditInfo: {
            createdBy: 'admin',
            createdAt: new Date(),
        },
    });
    await managerGroupPolicy.save(); // Saves the 'manager' group policy to the database
    console.log('Manager Group Policy created:', managerGroupPolicy);

    // Step 6: Create Roles
    // Two roles are created: 'investor' and 'analyst'. Each role can later be assigned specific policies.
    const investorRole = new Role({
        name: 'investor',
        description: 'Investor role',
        inheritsFrom: [], // This role doesn't inherit permissions from any other role
        policies: [],
    });
    await investorRole.save(); // Saves the 'investor' role to the database
    console.log('Investor Role created:', investorRole);

    const analystRole = new Role({
        name: 'analyst',
        description: 'Analyst role',
        inheritsFrom: [], // This role doesn't inherit permissions from any other role
        policies: [],
    });
    await analystRole.save(); // Saves the 'analyst' role to the database
    console.log('Analyst Role created:', analystRole);

    // Step 7: Create Role Policies
    // Policies are created for the roles, defining what actions members of these roles can perform on specific resources.
    const investorRolePolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'InvestorRolePolicy',
        rolePolicy: {
            role: investorRole._id as Types.ObjectId, // Associates the policy with the 'investor' role
            version: '2024-08-01',
            rules: [
                {
                    action: 'invest',
                    effect: 'EFFECT_ALLOW',
                    resource: 'project123', // Allows 'investor' role members to invest in 'project123'
                },
            ],
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            },
        },
        auditInfo: {
            createdBy: 'admin',
            createdAt: new Date(),
        },
    });
    await investorRolePolicy.save(); // Saves the 'investor' role policy to the database
    console.log('Investor Role Policy created:', investorRolePolicy);

    const analystRolePolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'AnalystRolePolicy',
        rolePolicy: {
            role: analystRole._id as Types.ObjectId, // Associates the policy with the 'analyst' role
            version: '2024-08-01',
            rules: [
                {
                    action: 'analyze',
                    effect: 'EFFECT_ALLOW',
                    resource: 'marketData123', // Allows 'analyst' role members to analyze 'marketData123'
                },
            ],
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            },
        },
        auditInfo: {
            createdBy: 'admin',
            createdAt: new Date(),
        },
    });
    await analystRolePolicy.save(); // Saves the 'analyst' role policy to the database
    console.log('Analyst Role Policy created:', analystRolePolicy);

    // Step 8: Assign Groups and Roles to User
    // The user is assigned to the previously created groups and roles.
    // This assignment means the user will inherit the permissions defined by the associated group and role policies.
    user.groups = [executiveGroup._id as Types.ObjectId, managerGroup._id as Types.ObjectId];
    user.roles = [investorRole._id as Types.ObjectId, analystRole._id as Types.ObjectId];
    await user.save(); // Saves the updated user with group and role associations
    console.log('User updated with groups and roles:', user);

    // Step 9: Aggregate Policies for the User
    // Using the PolicyAggregator service, the user's aggregated policies are retrieved. This includes policies directly associated
    // with the user (principal), as well as those associated with the user's groups and roles.
    const membershipResolver = new MembershipResolver();
    const policyAggregator = new PolicyAggregator(membershipResolver);
    const aggregatedPolicies = await policyAggregator.aggregatePolicies(user._id as Types.ObjectId);
    console.log('Aggregated Policies:', aggregatedPolicies);

    // Step 10: Cleanup: Drop the database before disconnecting
    // This step is used to clean up the database after running the program, ensuring that the test data is removed.
    if (mongoose.connection.db) {
        // await mongoose.connection.db.dropDatabase();
    }

    // Step 11: Disconnect from MongoDB
    // Finally, the program disconnects from the MongoDB instance.
    await mongoose.disconnect();
}

// Execute the main function and catch any errors.
main().catch(err => console.error('Error:', err));

