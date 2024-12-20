// src/model/Organization.ts

import mongoose, { Schema, Document, Types } from 'mongoose';


// IVariable interface represents a key-value pair used for defining 
// dynamic variables within the organization. These variables can be 
// referenced in policies or derived roles.
interface IVariable extends Document {
  name: string;          // The name of the variable (e.g., "region")
  definition: string;    // The value or definition of the variable (e.g., "US-West")
}

// IDerivedRole interface defines roles that are dynamically derived 
// based on certain conditions. These roles inherit from parent roles 
// and apply only when specific conditions are met.
interface IDerivedRole extends Document {
  name: string;                  // Name of the derived role (e.g., "RegionalAdmin")
  parentRoles: string[];         // List of parent roles from which this role is derived
  condition: {                   // Condition under which this derived role is applicable
    match: {                     // The condition is defined as a matching expression
      expr: string;              // Expression used to determine if the condition is met
    };
  };
}

// IOrganization interface defines the structure of an organization 
// within the system. This includes basic details, contact information, 
// and references to policies, variables, and derived roles associated 
// with the organization.
export interface IOrganization extends Document {
  name: string;                  // Name of the organization (e.g., "Acme Corp")
  url: string;                   // URL to the organization's homepage
  logo: string;                  // URL to the organization's logo image
  sameAs: string;                // URL to a related or identical entity (e.g., social media profile)
  description: string;           // Brief description of the organization
  taxID: string;                 // Tax identification number of the organization
  telephone: string;             // Primary contact telephone number for the organization
  location: {                    // Physical location of the organization
    address: string;             // Street address
    city: string;                // City name
    state: string;               // State or province name
    postalCode: string;          // Postal or ZIP code
    country: string;             // Country name
  };
  legalName: string;             // Legal name of the organization
  contactPoint: {                // Contact point information
    telephone: string;           // Contact telephone number
    contactType: string;         // Type of contact (e.g., "Customer Support")
    email: string;               // Contact email address
  };
  policies: Types.ObjectId[];    // List of associated policy IDs (references to Policy documents)
  variables: Types.DocumentArray<IVariable>;  // List of variables defined for the organization
  derivedRoles: Types.DocumentArray<IDerivedRole>;  // List of derived roles associated with the organization
}

// Schema for IVariable interface. This schema defines how variables 
// are stored in the database.
const VariableSchema: Schema = new Schema({
  name: { type: String, required: true },        // Variable name is required
  definition: { type: String, required: true }   // Variable definition is required
});

// Schema for IDerivedRole interface. This schema defines how derived 
// roles are stored in the database.
const DerivedRoleSchema: Schema = new Schema({
  name: { type: String, required: true },        // Derived role name is required
  parentRoles: [{ type: String, required: true }],  // At least one parent role is required
  condition: {
    match: {
      expr: { type: String, required: true }     // Expression for matching the condition is required
    }
  }
});

// Schema for IOrganization interface. This schema defines how 
// organizations are stored in the database.
const OrganizationSchema: Schema = new Schema({
  name: { type: String, required: true },        // Organization name is required
  url: { type: String },                         // Organization's URL is optional
  logo: { type: String },                        // Organization's logo URL is optional
  sameAs: { type: String },                      // "Same as" URL is optional
  description: { type: String },                 // Description of the organization is optional
  taxID: { type: String },                       // Tax ID is optional
  telephone: { type: String },                   // Telephone number is optional
  location: {                                   // Location details are optional
    address: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  legalName: { type: String },                   // Legal name is optional
  contactPoint: {                               // Contact point details are optional
    telephone: { type: String },
    contactType: { type: String },
    email: { type: String }
  },
  policies: [{ type: Schema.Types.ObjectId }],  // References to Policy documents
  variables: [VariableSchema],                  // Array of variables defined by VariableSchema
  derivedRoles: [DerivedRoleSchema]             // Array of derived roles defined by DerivedRoleSchema
});

OrganizationSchema.index({
    name: 'text',
    description: 'text',
    'location.address': 'text',
    'contactPoint.email': 'text',
    'contactPoint.telephone': 'text'
});

// Export the mongoose model for the IOrganization schema, allowing 
// interaction with the 'Organization' collection in MongoDB.
export default mongoose.model<IOrganization>('Organization', OrganizationSchema);

