import mongoose, { Types } from 'mongoose';
import { connectToDatabase } from './database'; // Assuming you have a database connection utility
import { ResourceService } from '../src/services/ResourceService'; // Import the ResourceService
import { Logger as logger } from '../src/utils/logger'; // Import a logger utility
import { Resource } from '../src/models/resource';

async function main() {
  try {
    // Connect to the database
    await connectToDatabase();
    logger.info('Connected to MongoDB');

    // Instantiate the ResourceService
    const resourceService = new ResourceService();

    // Example: Add a new resource
    const resourceObj = new Resource({
      _id: new Types.ObjectId(),
      name: 'Project A',
      description: 'Resource for Project A',
      typeName: '451::labs::coretical', // Ensure this typeName matches your schema validation
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
      attr: { customAttr: 'customValue' },
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      },
      version: '1.0',
    });

    const newResource = await resourceService.addResource(resourceObj);
    logger.info('Resource created:', newResource);

    // Example: Find a resource by ID
    const foundResource = await resourceService.findResourceById(newResource._id.toHexString());
    if (foundResource) {
      logger.info('Resource found:', foundResource);
    } else {
      logger.warn('Resource not found');
    }

    // Example: Update the resource's description
    const updatedResource = await resourceService.updateResource(newResource._id.toHexString(), {
      description: 'Updated description for Project A',
    });
    if (updatedResource) {
      logger.info('Resource updated:', updatedResource);
    }

    // Example: List all resources
    const allResources = await resourceService.listAllResources();
    logger.info('All resources:', allResources);

    // Example: Grant a policy to the resource
    const actions = [{ action: 'view', effect: 'EFFECT_ALLOW' }];
    const grantedResource = await resourceService.grantActions(newResource._id.toHexString(), actions);
    if (grantedResource) {
      logger.info('Policy granted to resource:', grantedResource);
    }

    // Example: Revoke a policy from the resource
    const revokedResource = await resourceService.revokeActions(newResource._id.toHexString(), ['view']);
    if (revokedResource) {
      logger.info('Policy revoked from resource:', revokedResource);
    } else {
      logger.info(`No Policies for: ${newResource._id.toHexString()}`);

    }

    // Example: Query resources with filtering, sorting, skipping, and limiting
    const queriedResources = await resourceService.queryResources({ description: /Project/ }, { createdAt: -1 }, 0, 10);
    logger.info('Queried resources:', queriedResources);

    // Example: Count resources matching a query
    const resourceCount = await resourceService.countResources({ description: /Project/ });
    logger.info('Count of resources matching query:', resourceCount);

    // Example: Delete the resource
    // await resourceService.deleteResource(newResource._id.toHexString());
    // logger.info(`Resource deleted: ${newResource._id.toHexString()}`);

  } catch (error) {
    logger.error('An error occurred:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    logger.info('MongoDB connection closed');
  }
}

main().catch(err => logger.error('An error occurred:', err));

