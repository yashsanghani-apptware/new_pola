import mongoose from 'mongoose';
import { connectToDatabase } from './database';
import { ResourceService } from '../src/services/ResourceService';
import { Resource } from '../src/models/resource';
import { Policy } from '../src/models/policy';
import { Logger as logger } from '../src/utils/logger';

async function main() {
  try {
    logger.debug(' ** Step 1: Connecting to the database ..');
    await connectToDatabase();
    logger.info('Connected to MongoDB');

    // Instantiate the ResourceService
    const resourceService = new ResourceService();

    logger.debug(' ** Step 2: Creating a new resource ..');
    const resourceObj = {
      name: 'Project A',
      description: 'Resource for Project A',
      typeName: '451::labs::coretical',
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
      auditInfo: {  // Make sure to include the auditInfo field here
        createdBy: 'admin',  // Who created the resource
        createdAt: new Date(),  // When the resource was created
      },
    };

    const newResource = await resourceService.addResource(new Resource(resourceObj));
    logger.debug('Resource created:', newResource);

    // Step 3: Add a new policy to the resource
    const policyObj: Partial<Policy> = {
      apiVersion: 'api.pola.dev/v1',
      resourcePolicy: {
        resource: newResource.ari,
        version: '1.0',
        rules: [
          {
            actions: ['view'],  // Use an array of strings
            effect: 'EFFECT_ALLOW',
          },
        ],
      },
      auditInfo: {
        createdBy: 'admin',  // Required field
        createdAt: new Date(),
      },
    };

    const addedPolicy = await resourceService.addPolicy(newResource._id.toString(), policyObj as Policy);
    logger.info('Policy added to resource ', addedPolicy);

    // Step 4: Update the policy on the resource
    if (addedPolicy) {
      const updatedPolicyObj: Partial<Policy> = {
        resourcePolicy: {
          resource: newResource.ari,
          version: '1.1', // Update version
          rules: [
            {
              actions: ['view', 'edit'],  // Update to include 'edit'
              effect: 'EFFECT_ALLOW',
            },
          ],
        },
        auditInfo: {
          createdBy: addedPolicy.auditInfo?.createdBy ?? 'admin', // Preserve original creator
          createdAt: addedPolicy.auditInfo?.createdAt ?? new Date(), // Preserve original creation time
          updatedBy: 'admin',  // New updater
          updatedAt: new Date(),  // New update time
        },
      };

      const updatedPolicy = await resourceService.updatePolicy((addedPolicy._id as mongoose.Types.ObjectId).toString(), updatedPolicyObj as Policy);
      logger.info('Policy updated on resource:', updatedPolicy);
    }

    // Step 5: List policies on the resource
    const resourceWithPolicies = await resourceService.findResourceById(newResource._id.toString());
    logger.info('Policies on resource:', resourceWithPolicies?.policies);

    // Step 6: Remove the policy from the resource
    if (addedPolicy) {
      const removedPolicy = await resourceService.removePolicy(newResource._id.toString(), (addedPolicy._id as mongoose.Types.ObjectId).toString());
      logger.info('Policy removed from resource:', removedPolicy);
    }

    // Step 7: List the resource details to confirm the policy removal
    const updatedResource = await resourceService.findResourceById(newResource._id.toString());
    logger.info('Updated resource details:', updatedResource);

  } finally {
    // Clean up and close the database connection
    mongoose.connection.close();
    logger.info('MongoDB connection closed');
  }
}

main().catch(err => logger.error('An error occurred:', err));

