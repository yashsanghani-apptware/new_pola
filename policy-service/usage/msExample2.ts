
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
async function main() {
 try {
  await connectToDatabase();

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
  console.log('User created:', newUser);

  const resourceObj = {
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
    required: [],
  };

  const resource1 = await resourceService.addResource(new Resource(resourceObj));
  console.log('Resource created:', resource1);

const newGroup = await groupService.createGroup({
  name: 'Developers',
  description: 'Group for software developers',
  members: [{ _id: newUser._id, onModel: 'User' }],  // Properly structure members
  // Other fields...
});


  console.log('Group created:', newGroup);
const newRole = await roleService.createRole({
  name: 'Admin',
  description: 'Administrator role with all permissions',
  // If roles have members, ensure they are also ObjectId arrays
  // members: [newUser._id], // If applicable
});



  console.log('Role created:', newRole);

  const adminPolicy = await policyService.createPolicy({
    apiVersion: 'v1',
    principalPolicy: {
      principal: newUser._id.toHexString(),  // Convert ObjectId to string
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

  const groupPolicy = await policyService.createPolicy({
    apiVersion: 'v1',
    groupPolicy: {
      group: newGroup._id.toHexString(),  // Convert ObjectId to string
      version: '1.0',
      rules: [
        {
          actions: [
            { action: 'read', effect: 'EFFECT_ALLOW' },
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

  newUser.policies?.push(adminPolicy._id as Types.ObjectId);  // Ensure correct type
  newGroup.policies?.push(groupPolicy._id as Types.ObjectId);  // Ensure correct type

  await userService.updateUser(newUser._id, { policies: newUser.policies });
await groupService.updateGroup(newGroup._id.toHexString(), { policies: newGroup.policies });


  const memberService = new MemberService(newUser._id.toHexString());
  await memberService.initializeContext();

  console.log('Permitted Actions:', memberService.getPermittedActions());
  console.log('Policies:', memberService.getPolicies());
  console.log('Groups:', memberService.getGroups());
  console.log('Roles:', memberService.getRoles());
  console.log('Resources:', await memberService.getResources());

  // Clean up
await userService.deleteUser(new Types.ObjectId(newUser._id));

  await resourceService.deleteResource(resource1._id.toHexString());
  await groupService.deleteGroup(newGroup._id.toHexString());
  await roleService.deleteRole(newRole._id.toHexString());

 } finally {
  await mongoose.connection.dropDatabase();
  mongoose.connection.close();
}
}

main().catch(err => console.error('An error occurred:', err));

