// src/models/group.ts

import mongoose, { Schema, Types, Document, model } from 'mongoose';

/**
 * The IGroup interface defines the structure of a group document within the system.
 * A group represents a collection of users or other groups that share common roles or policies within an organization.
 * This interface extends Mongoose's Document interface, which includes fields like _id.
 */
export interface IGroup extends Document {
  _id: mongoose.Types.ObjectId,
  name: string;                                      // Name of the group (required)
  description: string;                               // Description of the group's purpose (optional)
  memberOf: mongoose.Types.ObjectId | null;          // Reference to the parent group (nullable)
  members: Array<{
    _id: mongoose.Types.ObjectId;
    onModel: 'User' | 'Group';
    ref?: 'User' | 'Group';
    type?: mongoose.Types.ObjectId;
  }>;
  roles?: mongoose.Types.ObjectId[];                 // Optional list of associated role IDs (references to Role documents)
  policies: mongoose.Types.ObjectId[];               // List of associated policy IDs (references to Policy documents)
  organization: mongoose.Types.ObjectId | null;      // Reference to the organization that this group belongs to (nullable)
}

/**
 * Schema definition for the IGroup interface.
 * This defines how group information is structured and stored in the MongoDB database.
 */
const GroupSchema: Schema = new Schema({
  name: { type: String, required: true },                       // Group name is required
  description: { type: String },                                // Description is optional
  memberOf: { type: Schema.Types.ObjectId, ref: 'Group', required: false },  // Reference to parent group (nullable)
  members: [{ type: Schema.Types.ObjectId, refPath: 'onModel',  required: true }],  // Reference to users or sub-groups
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role', required: false }], // Optional references to associated roles
  policies: [{ type: Schema.Types.ObjectId, ref: 'Policy' }],   // References to associated Policy documents
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: false } // Reference to the organization (nullable)
});

/**
 * Indexing on various fields to optimize query performance.
 * These indices ensure that queries filtering by these fields can be executed efficiently.
 */
GroupSchema.index({ name: 1 });                         // Index on the 'name' field for fast lookup by name
GroupSchema.index({ organization: 1 });                 // Index on the 'organization' field for fast lookup by organization
GroupSchema.index({ name: 1, organization: 1 });        // Compound index on 'name' and 'organization' for combined lookups

/**
 * Export the Mongoose model for the IGroup schema.
 * This model corresponds to the 'Group' collection in MongoDB and can be used to interact with group documents.
 */
export const Group = model<IGroup>('Group', GroupSchema);

