// src/models/groupPolicy.ts

// Import necessary modules from mongoose
import { Schema, Document, model } from 'mongoose';

// Import types used within the GroupPolicy model for strong typing
import { Variables, GroupRule } from './types';  // Import from the types file

// Define the GroupPolicy interface that extends the Mongoose Document interface
// This interface provides strong typing for the GroupPolicy model, ensuring that 
// each field is properly typed

interface GroupPolicy extends Document {
  group: string;            // The group to which the policy applies (required)
  version: string;          // The version of the group policy (required)
  scope?: string;           // Optional scope defining the context or boundaries where 
                            // the policy is applicable
  variables?: Variables;    // Optional variables that may be used within the policy rules
  rules: GroupRule[];       // A list of rules that define permissions and conditions 
                            // for the group (required)
}

// Define the GroupPolicy Schema for MongoDB, mapping the GroupPolicy interface to the database
const GroupPolicySchema = new Schema<GroupPolicy>({
  group: { 
    type: String, 
    required: true          // The group field is mandatory, must be explicitly provided
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
    required: true          // The rules field is mandatory, containing an array of rules for the group
  },
});

// Create and export the GroupPolicy model
// This model corresponds to the 'GroupPolicy' collection in MongoDB and can be used to interact with group policy documents
const GroupPolicyModel = model<GroupPolicy>('GroupPolicy', GroupPolicySchema);

export default GroupPolicyModel;

