// src/models/resourcePolicy.ts

// Import necessary modules from mongoose
import { Schema, Document, model } from 'mongoose';

// Import types used within the ResourcePolicy model for strong typing
import { Variables, ResourceRule, Schemas } from './types';  // Import from the types file

// Define the ResourcePolicy interface that extends the Mongoose Document interface
// This interface provides strong typing for the ResourcePolicy model, ensuring that 
// each field is properly typed

interface ResourcePolicy extends Document {
  resource: string;               // The resource to which this policy applies (required)
  version: string;                // The version of the resource policy (required)
  scope?: string;                 // Optional scope defining the context or boundaries where the policy is applicable
  importDerivedRoles?: string[];  // Optional array of derived roles that are imported into the policy
  variables?: Variables;          // Optional variables that may be used within the policy rules
  schemas?: Schemas;              // Optional schemas to validate the policy structure or content
  rules: ResourceRule[];          // A list of rules that define permissions and conditions for the resource (required)
}

// Define the ResourcePolicy Schema for MongoDB, mapping the ResourcePolicy interface to the database

const ResourcePolicySchema = new Schema<ResourcePolicy>({
  resource: { 
    type: String, 
    required: true      // The resource field is mandatory, specifying the resource to which this policy applies
  },
  version: { 
    type: String, 
    required: true      // The version field is mandatory, indicating the version of the policy
  },
  scope: { 
    type: String, 
    required: false     // The scope field is optional, used to specify the context or domain of the policy
  },
  importDerivedRoles: { 
    type: [String], 
    required: false     // Optional array of derived role names that are imported into this policy
  },
  variables: { 
    type: Object, 
    required: false     // Optional field for defining variables specific to the policy
  },
  schemas: { 
    type: Object, 
    required: false     // Optional field for specifying schemas that validate the policy's structure or rules
  },
  rules: { 
    type: [Object], 
    required: true      // The rules field is mandatory, containing an array of 
                        // ResourceRule objects that define the policy's permissions and conditions
  },
});

// Create and export the ResourcePolicy model
// This model corresponds to the 'ResourcePolicy' collection in MongoDB and can 
// be used to interact with resource policy documents

const ResourcePolicyModel = model<ResourcePolicy>('ResourcePolicy', ResourcePolicySchema);

export default ResourcePolicyModel;

