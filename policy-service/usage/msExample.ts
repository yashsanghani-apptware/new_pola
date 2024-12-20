import mongoose from 'mongoose';  // Import mongoose to manage the connection
import { connectToDatabase } from './database';  // Adjust the path as necessary
import { MemberService } from '../src/services/MembershipService';

async function main() {
    // First, connect to the database
    await connectToDatabase();

    // Example user identifier, could be email, username, or ObjectId as a string
    const userIdentifier = 'john.doe@example.com';

    // Instantiate the MembershipService with the user identifier
    const membershipService = new MemberService(userIdentifier);

    try {
        // Initialize the context for the user
        await membershipService.initializeContext();

        // Get permitted actions for the user
        const permittedActions = membershipService.getPermittedActions();
        console.log('Permitted Actions:', permittedActions);

        // Get aggregated policies for the user
        const policies = membershipService.getPolicies();
        console.log('Aggregated Policies:', policies);

        // Get groups the user belongs to
        const groups = membershipService.getGroups();
        console.log('User Groups:', groups);

        // Get roles assigned to the user
        const roles = membershipService.getRoles();
        console.log('User Roles:', roles);

        // (Optional) Get resources the user has access to
        const resources = await membershipService.getResources();
        console.log('Accessible Resources:', resources);

    } catch (error) {
        console.error('Error using MembershipService:', error);
    } finally {
        // Optionally, close the MongoDB connection if you're done with the database
        mongoose.connection.close();
    }
}

// Run the main function
main();

