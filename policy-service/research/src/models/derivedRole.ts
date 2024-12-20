// src/models/derivedRole.ts

// Import necessary modules from mongoose
import { Schema, Document, model } from 'mongoose';

// Import types used within the DerivedRole model for strong typing
import { RoleDef, Variables } from './types';  // Import from the types file

// Define the DerivedRole interface that extends the Mongoose Document interface
// This interface provides strong typing for the DerivedRole model, ensuring that each field is properly typed

interface DerivedRole extends Document {
  name: string;           // The name of the derived role (required)
  definitions: RoleDef[]; // An array of role definitions that define the derived role's permissions (required)
  variables?: Variables;  // Optional variables that are associated with the derived role
}

// Define the DerivedRole Schema for MongoDB, mapping the DerivedRole interface to the database
const DerivedRoleSchema = new Schema<DerivedRole>({
  name: { 
    type: String, 
    required: true        // The name field is mandatory, specifying the name of the derived role
  },
  definitions: { 
    type: [Object], 
    required: true        // The definitions field is mandatory, containing an array of RoleDef 
                          // objects that define the permissions and conditions of the derived role
  },
  variables: { 
    type: Object, 
    required: false       // The variables field is optional, used to store any 
                          // variables relevant to the derived role
  },
});

// Create and export the DerivedRole model
// This model corresponds to the 'DerivedRole' collection in MongoDB and can 
// be used to interact with derived role documents

const DerivedRoleModel = model<DerivedRole>('DerivedRole', DerivedRoleSchema);

export default DerivedRoleModel;

