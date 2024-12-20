// src/models/rolePolicy.ts

// Import necessary modules from mongoose
import { Schema, Document, model } from 'mongoose';

// Import types used within the RolePolicy model for strong typing
import { Variables, RoleRule } from './types';  // Import from the types file

// Define the RolePolicy interface that extends the Mongoose Document interface
// This interface provides strong typing for the RolePolicy model, ensuring that 
// each field is properly typed

interface RolePolicy extends Document {
  role: string;             // The role to which the policy applies (required)
  version: string;          // The version of the role policy (required)
  scope?: string;           // Optional scope defining the context or boundaries where 
                            // the policy is applicable
  variables?: Variables;    // Optional variables that may be used within the policy rules
  rules: RoleRule[];        // A list of rules that define permissions and conditions 
                            // for the role (required)
}

// Define the RolePolicy Schema for MongoDB, mapping the RolePolicy interface to the database
const RolePolicySchema = new Schema<RolePolicy>({
  role: { 
    type: String, 
    required: true          // The role field is mandatory, must be explicitly provided
  },
  version: { 
    type: String, 
    required: true          // The version field is mandatory, must be explicitly provided
  },
  scope: { 
    type: String, 
    required: false         // The scope field is optional, used to specify the context or domain of the policy
  },
  variables: { 
    type: Object, 
    required: false         // The variables field is optional, used to store any variables relevant to the policy
  },
  rules: { 
    type: [Object], 
    required: true          // The rules field is mandatory, containing an array of rules for the role
  },
});

// Create and export the RolePolicy model
// This model corresponds to the 'RolePolicy' collection in MongoDB and can be used to interact with role policy documents
const RolePolicyModel = model<RolePolicy>('RolePolicy', RolePolicySchema);

export default RolePolicyModel;

