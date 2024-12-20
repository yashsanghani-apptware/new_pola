import mongoose, { Types } from 'mongoose';
import util from 'util';
import { UserService } from '../src/services/UserService';
import { GroupService } from '../src/services/GroupService'; // Import GroupService
import { IUser, User } from '../src/models/user';
import { Group } from '../src/models/group';
import { Role } from '../src/models/role';

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/UserDB';

async function runExample() {
  // Connect to MongoDB
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const userService = new UserService();
  const groupService = new GroupService(); // Initialize GroupService

  // Define a new user object
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
  };

  // Step 1: Create User
  const newUser = await userService.addUser(new User(userObj) as IUser);
  console.log('User created:', newUser);

  // Update the user
  await userService.updateUser((newUser._id as Types.ObjectId).toString(), { jobTitle: 'Senior Developer' });
  console.log('User updated with job title:', await userService.findUserById((newUser._id as Types.ObjectId).toString()));

  // Step 2: Create and assign a group
  const executiveGroup = await userService.createGroupIfNotExists('Executive', 'Executive Level Group');
  console.log('Group created:', executiveGroup);

  const executiveGroupId: Types.ObjectId = executiveGroup._id as Types.ObjectId;
  await userService.addGroupToUser((newUser._id as Types.ObjectId).toString(), executiveGroupId.toString());
  console.log('Group added to user:', await userService.findUserById((newUser._id as Types.ObjectId).toString()));

  // Step 3: Create and assign a role
  const investorRole = await userService.createRoleIfNotExists('investor', 'Investor role');
  console.log('Role created or fetched:', investorRole);

  const investorRoleId: Types.ObjectId = investorRole._id as Types.ObjectId;
  await userService.addRoleToUser((newUser._id as Types.ObjectId).toString(), investorRoleId.toString());
  console.log('Role added to user:', await userService.findUserById((newUser._id as Types.ObjectId).toString()));

  // Step 4: Grant a principal policy to the user
  await userService.grant((newUser._id as Types.ObjectId).toString(), 'resource-ari-1', [
    { action: 'read', effect: 'EFFECT_ALLOW' },
    { action: 'write', effect: 'EFFECT_DENY' }
  ]);
  console.log('Principal policy granted to user:', await userService.findUserById((newUser._id as Types.ObjectId).toString()));

  // Step 5: Grant a group policy using GroupService
  await groupService.grant(executiveGroupId.toString(), 'resource-ari-1', [
    { action: 'download', effect: 'EFFECT_ALLOW', condition: { match: { expr: "'internal' in R.tags" } } }
  ]);
  console.log('Policy granted to group:', await groupService.getGroupById(executiveGroupId.toString()));

  // Step 6: Revoke the group policy
  await groupService.revoke(executiveGroupId.toString(), 'resource-ari-1', ['download']);
  console.log('Policy revoked from group:', await groupService.getGroupById(executiveGroupId.toString()));

  // Step 7: Find the user with populated policies
  const usrPolicies = await userService.findUserByIdWithPolicies((newUser._id as Types.ObjectId).toString());
  console.log('User with populated policies:', util.inspect(usrPolicies, { showHidden: false, depth: null, colors: true }));

  // Step 8: Clean up: Remove group and role, then delete user
  await userService.removeGroupFromUser((newUser._id as Types.ObjectId).toString(), executiveGroupId.toString());
  console.log('Group removed from user:', await userService.findUserById((newUser._id as Types.ObjectId).toString()));

  await userService.removeRoleFromUser((newUser._id as Types.ObjectId).toString(), investorRoleId.toString());
  console.log('Role removed from user:', await userService.findUserById((newUser._id as Types.ObjectId).toString()));

  await userService.deleteUser((newUser._id as Types.ObjectId).toString());
  console.log('User deleted:', newUser._id);

  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

// Run the example
runExample().catch((error) => console.error('Error in example:', error));

