import mongoose, { Schema, Document, model } from "mongoose";

/**
 * @interface ISchemaModel
 * @description Interface for the Schema model representing a JSON schema stored in MongoDB.
 * It extends the base Mongoose Document interface.
 */
export interface ISchemaModel extends Document {
  name: string; // The name of the schema (e.g., workflow name).
  version: string; // The version of the schema.
  author?: string; // Optional schema author.
  description?: string; // An optional description of the schema.
  license?: string; // Optional license string.
  definition: Record<string, any>; // The actual JSON schema definition. 
  tags?: string[]; // Optional tags to categorize or label the schema.
  seeAlso?: string[]; // Optional references to related schemas.
  category?: string; // Optional category for the schema.
  context?: string; // Optional context information explaining where or how the schema is used.
  story?: string; // Optional textual description or background story about the schema.
  createdAt: Date; // The date the schema was created.
  updatedAt: Date; // The date the schema was last updated.
}

/**
 * @constant SchemaDefinition
 * @description Mongoose schema definition for storing JSON schemas.
 */
const SchemaDefinition = new Schema<ISchemaModel>(
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
      type: String, // Optional author for the schema.
    },
    description: {
      type: String, // Optional description for the schema.
      trim: true,
    },
    license: {
      type: String, // Optional license info for the schema.
      trim: true,
    },
    definition: {
      // This field contains the entire JSON schema definition.
      type: Schema.Types.Mixed, // Use Mixed type for flexibility in storing any kind of schema.
      required: true,
    },
    tags: {
      type: [String], // Array of strings for tags.
      default: [], // Defaults to an empty array if no tags are provided.
    },
    seeAlso: {
      type: [String], // Optional array of related schema references.
      default: [], // Defaults to an empty array if no seeAlso references are provided.
    },
    category: {
      type: String, // Optional category field.
      trim: true,
    },
    context: {
      type: String, // Optional context field.
      trim: true,
    },
    story: {
      type: String, // Optional story field providing a narrative or explanation.
      trim: true,
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields.
);

/**
 * @pre save
 * @description Pre-save hook to update the 'updatedAt' field before saving.
 */
SchemaDefinition.pre('save', function (next) {
  if (this instanceof mongoose.Document) {
    this.set({ updatedAt: new Date() });
  }
  next();
});

// Create a compound index on 'name' and 'version' to enforce uniqueness.
SchemaDefinition.index({ name: 1, version: 1 }, { unique: true });

/**
 * @description Text index on fields like description, story, context, etc., for full-text search capabilities.
 */
SchemaDefinition.index({
  description: "text",
  story: "text",
  context: "text",
  tags: "text",
  category: "text"
});

/**
 * @const SchemaModel
 * @description Mongoose model for managing schemas in the database.
 */
export const SchemaModel = model<ISchemaModel>("Schema", SchemaDefinition);
