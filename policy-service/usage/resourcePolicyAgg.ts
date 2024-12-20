import mongoose, { Types } from 'mongoose';
import { User } from '../models/user';
import { Group } from '../models/group';
import { Role } from '../models/role';
import PolicyModel from '../models/policy';
import { MembershipResolver } from '../services/MembershipResolver';
import { PolicyAggregator } from '../services/PolicyAggregator';

/**
 * This program demonstrates the creation of a user and associated policies within a MongoDB-based policy management system.
 * The goal is to define various policies for a user across different resources, roles, and groups, 
 * and then aggregate these policies to determine the user's access rights to a specific resource.
 */

async function main() {
    // Step 1: Connect to MongoDB
    // This step establishes a connection to the MongoDB instance where the policies and user data are stored.
    await mongoose.connect('mongodb://localhost:27017/PolicyDB');

    // Ensure the database is defined before trying to drop it
    // This step is crucial to start with a clean state for testing purposes.
    if (mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase();
    }

    // Step 2: Create a User
    // A new user is created with associated details such as name, contact information, and initial empty groups, roles, and policies.
    const user = new User({
        name: 'John Doe',
        givenName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com',
        telephone: '123-456-7890',
        username: 'johndoe',
        password: 'securepassword', // In a real application, ensure passwords are securely hashed
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
        attr: { version: '1.1' }, // Example of custom attributes
    });

    await user.save();
    console.log('User created:', user);

    // Step 3: Create Principal Policy
    // A principal policy is created that directly applies to the user, specifying access rules for specific resources.
    const principalPolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'PrincipalPolicy-JohnDoe',
        principalPolicy: {
            principal: user._id as Types.ObjectId, // Directly associates this policy with the user's ID
            version: '2024-08-01',
            rules: [
                {
                    action: 'read',
                    effect: 'EFFECT_ALLOW',
                    resource: 'document123', // Allows the user to read 'document123'
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

    await principalPolicy.save();
    console.log('Principal Policy created:', principalPolicy);

    // Step 4: Create Groups
    // Groups are created to categorize users with similar roles or access needs. 
    // Here, two groups are created: 'executive' and 'manager', both containing the user.
    const executiveGroup = new Group({
        name: 'executive',
        description: 'Executive level group',
        members: [user._id as Types.ObjectId], // Adds the user to the 'executive' group
        roles: [],
        policies: [],
    });
    await executiveGroup.save();
    console.log('Executive Group created:', executiveGroup);

    const managerGroup = new Group({
        name: 'manager',
        description: 'Manager level group',
        members: [user._id as Types.ObjectId], // Adds the user to the 'manager' group
        roles: [],
        policies: [],
    });
    await managerGroup.save();
    console.log('Manager Group created:', managerGroup);

    // Step 5: Create Group Policies
    // Policies specific to the groups are created, defining what actions members of each group can perform on certain resources.
    const executiveGroupPolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'ExecutiveGroupPolicy',
        groupPolicy: {
            group: executiveGroup._id as Types.ObjectId,
            version: '2024-08-01',
            rules: [
                {
                    action: 'edit',
                    effect: 'EFFECT_ALLOW',
                    resource: 'document123', // Allows members of the 'executive' group to edit 'document123'
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
    await executiveGroupPolicy.save();
    console.log('Executive Group Policy created:', executiveGroupPolicy);

    const managerGroupPolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'ManagerGroupPolicy',
        groupPolicy: {
            group: managerGroup._id as Types.ObjectId,
            version: '2024-08-01',
            rules: [
                {
                    action: 'view',
                    effect: 'EFFECT_ALLOW',
                    resource: 'document123', // Allows members of the 'manager' group to view 'document123'
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
    await managerGroupPolicy.save();
    console.log('Manager Group Policy created:', managerGroupPolicy);

    // Step 6: Create Roles
    // Roles are created to define specific permissions or responsibilities. 
    // In this case, two roles are created: 'investor' and 'analyst'.
    const investorRole = new Role({
        name: 'investor',
        description: 'Investor role',
        inheritsFrom: [], // This role doesn't inherit from any other role
        policies: [],
    });
    await investorRole.save();
    console.log('Investor Role created:', investorRole);

    const analystRole = new Role({
        name: 'analyst',
        description: 'Analyst role',
        inheritsFrom: [],
        policies: [],
    });
    await analystRole.save();
    console.log('Analyst Role created:', analystRole);

    // Step 7: Create Role Policies
    // Policies are associated with the roles, defining what actions members of each role can perform.
    const investorRolePolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'InvestorRolePolicy',
        rolePolicy: {
            role: investorRole._id as Types.ObjectId,
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
    await investorRolePolicy.save();
    console.log('Investor Role Policy created:', investorRolePolicy);

    const analystRolePolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'AnalystRolePolicy',
        rolePolicy: {
            role: analystRole._id as Types.ObjectId,
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
    await analystRolePolicy.save();
    console.log('Analyst Role Policy created:', analystRolePolicy);

    // Step 8: Assign groups and roles to user
    // The user is assigned to the previously created groups and roles, 
    // which will extend the user's permissions based on group and role policies.
    user.groups = [executiveGroup._id as Types.ObjectId, managerGroup._id as Types.ObjectId];
    user.roles = [investorRole._id as Types.ObjectId, analystRole._id as Types.ObjectId];
    await user.save();
    console.log('User updated with groups and roles:', user);

    // Step 9: Create Dataroom Resource and Define ARI
    // Define the ARI (Agsiri Resource Identifier) for the dataroom resource and its subcomponents (cabinet, file).
    const dataroomARI = 'ari:agsiri:dataroom:us:448912311299-1:dataroom';
    const cabinetARI = `${dataroomARI}/cabinet`;
    const fileARI = `${cabinetARI}/file`;

    // Step 10: Create Resource Policies for Dataroom, Cabinet, and File
    // Resource-specific policies are created for dataroom, cabinet, and file resources, 
    // specifying what actions can be performed by different roles.
    const dataroomPolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'DataroomPolicy',
        resourcePolicy: {
            resource: `${dataroomARI}/*`,
            version: '1.0',
            rules: [
                {
                    actions: ['read', 'view', 'share'],
                    effect: 'EFFECT_ALLOW',
                    condition: {
                        match: {
                            expr: "'investor' in principal.roles",
                        },
                    },
                },
                {
                    actions: ['create', 'update', 'delete'],
                    effect: 'EFFECT_ALLOW',
                    condition: {
                        match: {
                            expr: "'analyst' in principal.roles",
                        },
                    },
                },
            ],
        },
        auditInfo: {
            createdBy: 'admin',
            createdAt: new Date(),
        },
    });

    await dataroomPolicy.save();
    console.log('Dataroom Policy created:', dataroomPolicy);

    const cabinetPolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'CabinetPolicy',
        resourcePolicy: {
            resource: `${cabinetARI}/*`,
            version: '1.0',
            rules: [
                {
                    actions: ['upload', 'sign'],
                    effect: 'EFFECT_ALLOW',
                    condition: {
                        match: {
                            expr: "'analyst' in principal.roles",
                        },
                    },
                },
            ],
        },
        auditInfo: {
            createdBy: 'admin',
            createdAt: new Date(),
        },
    });

    await cabinetPolicy.save();
    console.log('Cabinet Policy created:', cabinetPolicy);

    const filePolicy = new PolicyModel({
        apiVersion: 'api.pola.dev/v1',
        name: 'FilePolicy',
        resourcePolicy: {
            resource: `${fileARI}/*`,
            version: '1.0',
            rules: [
                {
                    actions: ['download', 'share'],
                    effect: 'EFFECT_ALLOW',
                    condition: {
                        match: {
                            expr: "'investor' in principal.roles",
                        },
                    },
                },
                {
                    actions: ['delete'],
                    effect: 'EFFECT_DENY',
                    condition: {
                        match: {
                            expr: "resource.confidentiality == 'HIGH'",
                        },
                    },
                },
            ],
        },
        auditInfo: {
            createdBy: 'admin',
            createdAt: new Date(),
        },
    });

    await filePolicy.save();
    console.log('File Policy created:', filePolicy);

    // Step 11: Aggregate Policies for the User
    // Using the PolicyAggregator service, all relevant policies for the user and the specified dataroom resource are aggregated.
    // This aggregation will determine what actions the user is permitted to perform on the resource.
    const membershipResolver = new MembershipResolver();
    const policyAggregator = new PolicyAggregator(membershipResolver);
    const aggregatedPolicies = await policyAggregator.aggregateResourcePolicies(user._id as Types.ObjectId, dataroomARI);
    console.log('Aggregated Policies for Dataroom:', aggregatedPolicies);

    // Step 12: Cleanup: Drop the database before disconnecting
    // This step is used to clean up the database after running the program, ensuring that the test data is removed.
    if (mongoose.connection.db) {
        // await mongoose.connection.db.dropDatabase();
    }

    // Step 13: Disconnect from MongoDB
    // Finally, the program disconnects from the MongoDB instance.
    await mongoose.disconnect();
}

// Execute the main function and catch any errors.
main().catch(err => console.error('Error:', err));

