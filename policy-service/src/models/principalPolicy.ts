// src/models/principalPolicy.ts

// Import necessary modules from mongoose
import { Schema, Document, model } from 'mongoose';

// Import types used within the PrincipalPolicy model for strong typing
import { Variables, PrincipalRule } from './types';  // Import from the types file

// Define the PrincipalPolicy interface that extends the Mongoose Document interface
// This interface provides strong typing for the PrincipalPolicy model, ensuring that 
// each field is properly typed

interface PrincipalPolicy extends Document {
  principal: string;        // The principal (e.g., user, group, or role) to which the 
                            // policy applies (required)
  version: string;          // The version of the principal policy (required)
  scope?: string;           // Optional scope defining the context or boundaries where 
                            // the policy is applicable
  variables?: Variables;    // Optional variables that may be used within the policy rules
  rules: PrincipalRule[];   // A list of rules that define permissions and conditions 
                            // for the principal (required)
}

// Define the PrincipalPolicy Schema for MongoDB, mapping the PrincipalPolicy interface to the database
const PrincipalPolicySchema = new Schema<PrincipalPolicy>({
  principal: { 
    type: String, 
    required: true          // The principal field is mandatory, must be explicitly provided
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
    required: true          // The rules field is mandatory, containing an array of rules for the principal
  },
});

// Create and export the PrincipalPolicy model
// This model corresponds to the 'PrincipalPolicy' collection in MongoDB and can be used to interact with principal policy documents
const PrincipalPolicyModel = model<PrincipalPolicy>('PrincipalPolicy', PrincipalPolicySchema);

export default PrincipalPolicyModel;

