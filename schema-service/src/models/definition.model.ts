import mongoose, { Schema, Document, model } from "mongoose";

/**
 * @interface IAuditLogEntry
 * @description Interface for a single entry in the audit log.
 */
interface IAuditLogEntry {
  updatedBy: string;  // The user or system who made the change
  updatedAt: Date;    // Timestamp when the update was made
  changes: Record<string, any>; // A record of changes made during the update
  version: string;    // The version of the definition at the time of update
}

/**
 * @interface IDefinitionModel
 * @description Interface for the Definition model representing a reusable JSON definition stored in MongoDB.
 * It extends the base Mongoose Document interface.
 */
export interface IDefinitionModel extends Document {
  name: string;        // The name of the definition.
  version: string;     // The version of the definition.
  author?: string;     // Definition author
  description?: string; // An optional description of the definition.
  license?: string;    // Optional license string
  definition: Record<string, any>; // The actual JSON definition (stripped of metadata when served).
  tags?: string[];     // Optional tags for categorizing or labeling the definition.
  seeAlso?: string[];  // References to related definitions.
  category?: string;   // Category or domain of the definition.
  context?: string;    // Specific context in which this definition is used.
  story?: string;      // Explanation of how or why this definition came to be.
  auditLog?: IAuditLogEntry[]; // Log of changes and updates to the definition.
  createdAt: Date;     // The date the definition was created.
  updatedAt: Date;     // The date the definition was last updated.
  deprecated?: boolean; // Add this property
}

/**
 * @constant DefinitionSchema
 * @description Mongoose schema definition for storing reusable JSON definitions.
 */
const DefinitionSchema = new Schema<IDefinitionModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes leading and trailing whitespace.
    },
    version: {
      type: String,
      required: true, // Ensures version is required.
      trim: true, // Removes leading and trailing whitespace.
    },
    author: {
      type: String, // Optional author for the definition.
    },
    description: {
      type: String, // Optional description for the definition.
      trim: true,
    },
    license: {
      type: String, // Optional license info for the definition.
      trim: true,
    },
    definition: {
      type: Schema.Types.Mixed, // Use Mixed type for flexibility in storing any kind of reusable definition.
      required: true,
    },
    tags: {
      type: [String], // Array of strings for tags.
      default: [], // Defaults to an empty array if no tags are provided.
    },
    seeAlso: {
      type: [String], // Related definitions
      default: [],
    },
    category: {
      type: String, // Category of the definition.
      trim: true,
    },
    context: {
      type: String, // Context in which the definition is used.
      trim: true,
    },
    story: {
      type: String, // Backstory or usage explanation.
      trim: true,
    },
    deprecated: {
      type: Boolean, // Deprecated flag
      default: false, // By default, definitions are not deprecated
    },
    auditLog: {
      type: [{
        updatedBy: { type: String, required: true }, // Who made the change
        updatedAt: { type: Date, required: true },   // When the change was made
        changes: { type: Schema.Types.Mixed, required: true }, // What was changed
        version: { type: String, required: true },    // Version during the update
      }],
      default: [],  // Initialize as an empty array
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

/**
 * @pre save
 * @description Pre-save hook to update the 'updatedAt' field before saving.
 */
DefinitionSchema.pre('save', function (next) {
  if (this instanceof mongoose.Document) {
    this.set({ updatedAt: new Date() });
  }
  next();
});

// Create a compound index on 'name' and 'version' to enforce uniqueness
DefinitionSchema.index({ name: 1, version: 1 }, { unique: true });

// Create a text index for full-text search on the 'story' field
DefinitionSchema.index({ 
  description: "text",
  story: "text",
  context: "text",
  tags: "text",
  category: "text",
});

/**
 * @const DefinitionModel
 * @description Mongoose model for managing definitions in the database.
 */
export const DefinitionModel = model<IDefinitionModel>("Definition", DefinitionSchema);
