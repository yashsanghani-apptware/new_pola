import mongoose, { Types } from 'mongoose';
import util from 'util';
import { UserService } from '../src/services/UserService';
import { GroupService } from '../src/services/GroupService';
import { RoleService } from '../src/services/RoleService';
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
  const roleService = new RoleService();
  const groupService = new GroupService();

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
  // Add the new user to the database
  const newUser = await userService.addUser(new User(userObj) as IUser);
  console.log('User created:', newUser);

  // Update the user
  await userService.updateUser((newUser._id as Types.ObjectId), 
		{ jobTitle: 'Senior Developer' });
  console.log('User updated with job title:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

  // Step 2: Create and assign a group
  const executiveGroup = await groupService.createGroupIfNotExists('Executive', 'Executive Level Group');
  console.log('Group created:', executiveGroup);

  const executiveGroupId: Types.ObjectId = executiveGroup._id as Types.ObjectId;
  await userService.addGroupToUser((newUser._id as Types.ObjectId), 
				    executiveGroupId);

  console.log('Group added to user:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

  const investorRole = await roleService.createRoleIfNotExists('investor', 'Investor role');
  console.log('Role created or fetched:', investorRole);

  // Step 3: Create and assign a role
  // const investorRole = new Role({ name: 'investor', description: 'Investor role' });
  // await investorRole.save();
  console.log('Role created:', investorRole);

  const investorRoleId: Types.ObjectId = investorRole._id as Types.ObjectId;
  await userService.addRoleToUser((newUser._id as Types.ObjectId), 
		investorRoleId);
  console.log('Role added to user:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

  // Step 4: Grant a principal policy
  await userService.grant((newUser._id as Types.ObjectId), 'resource-ari-1', [
    { action: 'read', effect: 'EFFECT_ALLOW' },
    { action: 'write', effect: 'EFFECT_DENY' }
  ]);
  console.log('Principal policy granted to user:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

  // Step 5: Find the user with populated policies
  const usrPolicies = await userService.findUserByIdWithPolicies((newUser._id as Types.ObjectId));
  console.log('User with populated policies:', 
		util.inspect(usrPolicies, { showHidden: false, depth: null, colors: true }));

  // Step 6: Revoke the principal policy
  await userService.revoke((newUser._id as Types.ObjectId), 
		'resource-ari-1', [ 'write']);
  console.log('Principal policy revoked from user:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

  // Step 7: Clean up: Remove group and role, then delete user
/* 
  await userService.removeGroupFromUser((newUser._id as Types.ObjectId), 
		executiveGroupId);
  console.log('Group removed from user:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

  await userService.removeRoleFromUser((newUser._id as Types.ObjectId), 
		investorRoleId);
  console.log('Role removed from user:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

   Step 6: Revoke the principal policy
  await userService.revoke((newUser._id as Types.ObjectId), 
		'resource-ari-1', [ 'analyze']);
  console.log('Principal policy revoked from user (Analyze):', 
		await userService.findUserById((newUser._id as Types.ObjectId)));
*/
  await userService.grant((newUser._id as Types.ObjectId), 'resource-ari-1', [
    { action: 'view', effect: 'EFFECT_ALLOW' },
    { action: 'share', effect: 'EFFECT_DENY' }
  ]);
  await userService.revoke((newUser._id as Types.ObjectId), 
		'resource-ari-1', [ 'view']);
  console.log('Principal policy revoked from user:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

  await userService.revoke((newUser._id as Types.ObjectId), 
		'resource-ari-1', [ 'share']);
  console.log('Principal policy revoked from user:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

  await userService.revoke((newUser._id as Types.ObjectId), 
		'resource-ari-1', [ 'read']);
  console.log('Principal policy revoked from user:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

  await userService.addRoleToUser((newUser._id as Types.ObjectId), 
		investorRoleId);
  console.log('Role added to user:', 
		await userService.findUserById((newUser._id as Types.ObjectId)));

  // Step 8: Find the user with populated policies
  const populatedUser = await userService.findUserByIdWithPolicies((newUser._id as Types.ObjectId));
  console.log('User with populated policies:', 
	util.inspect(populatedUser, { showHidden: false, depth: null, colors: true }));

  const userId = newUser._id;

  //  await userService.deleteUser((newUser._id as Types.ObjectId));
  console.log('User deleted:', userId);

  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

// Run the example
runExample().catch((error) => console.error('Error in example:', error));

