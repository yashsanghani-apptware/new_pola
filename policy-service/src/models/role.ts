// src/models/role.ts

import mongoose, { Schema, Document, Types, model } from 'mongoose';

// The IRole interface defines the structure of a role document within
// the system. A role represents a set of permissions or access rights
// that can be assigned to users or groups within an organization.
export interface IRole extends Document {
  _id: mongoose.Types.ObjectId,
  name: string;                                      // Name of the role
  description: string;                               // Description of the role's purpose and responsibilities
  inheritsFrom?: mongoose.Types.ObjectId[];          // Optional list of parent roles this role inherits from
  policies: mongoose.Types.ObjectId[];               // List of associated policy IDs (references to Policy documents)
  organization: mongoose.Types.ObjectId | null;      // Reference to the organization that this role belongs to
}

// Schema definition for the IRole interface. Defines how role
// information is structured and stored in the database.
const RoleSchema: Schema = new Schema({
  name: { type: String, required: true },                           // Role name is required
  description: { type: String },                                    // Description is optional
  inheritsFrom: [{ type: Schema.Types.ObjectId, ref: 'Role' }],     // References to parent roles (optional)
  policies: [{ type: Schema.Types.ObjectId, ref: 'Policy' }],       // References to associated Policy documents
  organization: { type: Schema.Types.ObjectId, ref: 'Organization' } // Organization reference (nullable)
});

// Indexing for Role text searching
RoleSchema.index({
  name: 'text',
  description: 'text'
});

// Export the mongoose model for the IRole schema, allowing interaction
// with the 'Role' collection in MongoDB.
export const Role = model<IRole>('Role', RoleSchema);

