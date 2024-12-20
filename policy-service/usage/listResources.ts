import mongoose from 'mongoose';
import PolicyModel from '../models/policy';

async function listPoliciesByARI(resourceARI: string) {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/ResourceDB');

    try {
        // Query to find all policies that match the resource ARI
        const resourcePolicies = await PolicyModel.find({
            'resourcePolicy.resource': { $regex: new RegExp(`^${resourceARI.replace('*', '.*')}$`) },
        }).lean();

        console.log(`Policies for Resource ARI (${resourceARI}):`);
        console.log(JSON.stringify(resourcePolicies, null, 2));
    } catch (error) {
        console.error('Error fetching policies:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
}

// Example usage
const resourceARI = 'ari:agsiri:dataroom:us:1234567890:dataroom/*';
listPoliciesByARI(resourceARI).catch(err => console.error('Error:', err));

