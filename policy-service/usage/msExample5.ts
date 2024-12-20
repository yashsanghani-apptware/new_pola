import mongoose, { Types } from 'mongoose';
import { connectToDatabase } from './database';
import { UserService } from '../src/services/UserService';
import { GroupService } from '../src/services/GroupService';
import { RoleService } from '../src/services/RoleService';
import { ResourceService } from '../src/services/ResourceService';
import { PolicyService } from '../src/services/PolicyService';
import { MemberService } from '../src/services/MembershipService';
import { User, IUser } from '../src/models/user';
import { Group, IGroup } from '../src/models/group';
import { Role, IRole } from '../src/models/role';
import { Resource, IResource } from '../src/models/resource';
import { Policy } from '../src/models/policy';
import { Logger as logger } from '../src/utils/logger';

async function main() {
  try {
    await connectToDatabase();
    logger.info('Connected to MongoDB');
    await mongoose.connection.dropDatabase();

    const userService = new UserService();
    const groupService = new GroupService();
    const roleService = new RoleService();
    const resourceService = new ResourceService();
    const policyService = new PolicyService();

    // Create a new user object
    const userObj = {
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
      address: {
        streetAddress: '123 Main St',
        addressLocality: 'Anytown',
        addressRegion: 'Anystate',
        postalCode: '12345',
        addressCountry: 'USA',
      },
      groups: [],
      roles: [],
      policies: [],
    };

    const newUser = await userService.addUser(new User(userObj) as IUser);
    logger.info('User created', newUser);

    // Create a new resource object
    const resourceObj: Partial<IResource> = {
      name: 'Project A',
      description: 'Resource for Project A',
      typeName: '451::labs::coretical',  // Ensure this typeName matches your schema validation
      ari: 'ari:project-a',
      properties: new Map<string, any>(),
      documentationUrl: 'https://docs.example.com/project-a',
      handlers: {
        create: { permissions: ['admin'], timeoutInMinutes: 60 },
        read: { permissions: ['admin'], timeoutInMinutes: 60 },
        update: { permissions: ['admin'], timeoutInMinutes: 60 },
        delete: { permissions: ['admin'], timeoutInMinutes: 60 },
        list: { permissions: ['admin'], timeoutInMinutes: 60 },
      },
      primaryIdentifier: ['project-a-id'],
      required: ['project-a-id'], // Add required identifiers or properties here
      attr: { version: '1.0' }, // Example custom attributes
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      },
      version: '1.0', // Initial version of the resource
    };

    const resource1 = await resourceService.addResource(new Resource(resourceObj));
    logger.info('Resource created', resource1);

    const newGroup = await groupService.createGroup({
      name: 'Developers',
      description: 'Group for software developers',
      members: [{ _id: newUser._id, onModel: 'User' }],
    });
    logger.info('Group created', newGroup);

    const newRole = await roleService.createRole({
      name: 'Admin',
      description: 'Administrator role with all permissions',
    });
    logger.info('Role created', newRole);

    const adminPolicy = await policyService.createPolicy({
      apiVersion: 'v1',
      principalPolicy: {
        principal: newUser._id.toHexString(),
        version: '1.0',
        rules: [
          {
            actions: [
              { action: 'read', effect: 'EFFECT_ALLOW' },
              { action: 'write', effect: 'EFFECT_ALLOW' },
            ],
            resource: 'ari:project-a',
          },
        ],
      },
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      },
    });
    logger.info('Admin Policy created', adminPolicy);

    const groupPolicy = await policyService.createPolicy({
      apiVersion: 'v1',
      groupPolicy: {
        group: newGroup._id.toHexString(),
        version: '1.0',
        rules: [
          {
            actions: [{ action: 'read', effect: 'EFFECT_ALLOW' }],
            resource: 'ari:project-a',
          },
        ],
      },
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      },
    });
    logger.info('Group Policy created', groupPolicy);

    // Attaching policies to the user and group
    newUser.policies?.push(adminPolicy._id as Types.ObjectId);
    newGroup.policies?.push(groupPolicy._id as Types.ObjectId);

    await userService.updateUser(newUser._id, { policies: newUser.policies });
    logger.info('User policies updated', { userId: newUser._id, policies: newUser.policies });

    await groupService.updateGroup(newGroup._id.toHexString(), { policies: newGroup.policies });
    logger.info('Group policies updated', { groupId: newGroup._id, policies: newGroup.policies });

    // Debugging policies after they should be attached
    const updatedUser = await userService.findUserById(newUser._id);
    logger.debug('Updated User with policies:', updatedUser?.policies);

    const updatedGroup = await groupService.getGroupById(newGroup._id.toHexString());
    logger.debug('Updated Group with policies:', updatedGroup?.policies);

    // Initialize membership context and debug information
    const memberService = new MemberService(newUser._id.toString());
    await memberService.initializeContext();
    logger.info('Membership context initialized');

    logger.info('Permitted Actions:', memberService.getPermittedActions());
    logger.info('Policies:', memberService.getPolicies());
    logger.info('Groups:', memberService.getGroups());
    logger.info('Roles:', memberService.getRoles());
    logger.info('Resources:', await memberService.getResources());

    // Clean up
    // await userService.deleteUser(new Types.ObjectId(newUser._id));
    // logger.info('User successfully deleted', newUser._id);

    // await resourceService.deleteResource(resource1._id.toHexString());
    // logger.info('Resource successfully deleted', resource1._id);

    // await groupService.deleteGroup(newGroup._id.toHexString());
    // logger.info('Group successfully deleted', newGroup._id);

    // await roleService.deleteRole(newRole._id.toHexString());
    // logger.info('Role successfully deleted', newRole._id);

  } finally {
    // await mongoose.connection.dropDatabase();
    // logger.info('Database dropped');
    mongoose.connection.close();
    logger.info('MongoDB connection closed');
  }
}

main().catch(err => logger.error('An error occurred:', err));

