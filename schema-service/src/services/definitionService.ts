import { DefinitionModel, IDefinitionModel } from "../models/definition.model";

/**
 * @class DefinitionService
 * @description Service class to handle CRUD operations for definitions.
 */
export class DefinitionService {
  /**
   * @description Creates a new definition in the repository.
   * @param definitionData - The data object containing all the fields for the definition.
   * @returns {Promise<IDefinitionModel>} - The created definition document.
   * @throws {Error} - Throws an error if the definition already exists.
   */
  async createDefinition(definitionData: {
    name: string;
    version: string;
    author?: string;
    description?: string;
    license?: string;
    definition: Record<string, any>;
    tags?: string[];
    seeAlso?: string[];
    category?: string;
    context?: string;
    story?: string;
  }): Promise<IDefinitionModel> {
    // Check if the definition already exists
    const existingDefinition = await DefinitionModel.findOne({ name: definitionData.name, version: definitionData.version });

    if (existingDefinition) {
      throw new Error(`Definition ${definitionData.name} version ${definitionData.version} already exists.`);
    }

    // Create a new definition record with metadata
    const newDefinition = new DefinitionModel({
      name: definitionData.name,
      version: definitionData.version,
      author: definitionData.author,
      description: definitionData.description,
      license: definitionData.license,
      definition: definitionData.definition, // Core JSON definition
      tags: definitionData.tags || [], // Optional tags
      seeAlso: definitionData.seeAlso || [], // Optional seeAlso references
      category: definitionData.category || '', // Optional category
      context: definitionData.context || '', // Optional context
      story: definitionData.story || '', // Optional story
    });

    // Save to the database
    return newDefinition.save();
  }

  /**
   * @description Fetches a specific definition by name and version.
   * Returns only the lightweight 'definition' without metadata.
   * @param name - The name of the definition.
   * @param version - The version of the definition.
   * @returns {Promise<IDefinitionModel | null>} - The found definition or null if not found.
   */
  async getDefinitionByNameAndVersion(name: string, version: string): Promise<IDefinitionModel | null> {
    // Fetch only the core 'definition' field
    // return DefinitionModel.findOne({ name, version }).select('definition').lean();
    return DefinitionModel.findOne({ name, version }).lean();
  }

  /**
   * @description Fetches all definitions with their metadata.
   * @returns {Promise<IDefinitionModel[]>} - List of all definitions with metadata.
   */
  async getAllDefinitions(): Promise<IDefinitionModel[]> {
    // Fetch all definitions with their metadata
    return DefinitionModel.find().select('name version author description license tags seeAlso category context story createdAt updatedAt').lean();
  }

  /**
 * @description Update the metadata and/or definition of a specific definition.
 * If the 'definition' field is updated, a new version is created and an audit log is maintained.
 * @param {string} name - The name of the definition.
 * @param {string} version - The current version of the definition.
 * @param {Partial<IDefinitionModel>} updateData - The data to update (metadata or definition).
 * @param {string} updatedBy - The user or system making the update.
 * @returns {Promise<IDefinitionModel | null>} - The updated or newly created definition.
 */
  async updateDefinition(
    name: string,
    version: string,
    updateData: Partial<IDefinitionModel>,
    updatedBy: string
  ): Promise<IDefinitionModel | null> {
    const currentDefinition = await DefinitionModel.findOne({ name, version }).lean();

    if (!currentDefinition) {
      throw new Error(`Definition ${name} version ${version} not found`);
    }

    // Check if the definition field is being updated
    if (updateData.definition && JSON.stringify(updateData.definition) !== JSON.stringify(currentDefinition.definition)) {
      // If the definition changes, create a new version
      const newVersion = this.incrementVersion(version);

      // Capture the changes made in the audit log
      const auditLogEntry = {
        updatedBy,
        updatedAt: new Date(),
        changes: updateData.definition,  // Track what was changed in the definition
        version: newVersion,
      };

      const newDefinitionData = {
        ...currentDefinition,
        ...updateData,  // Apply metadata updates if any
        version: newVersion,
        createdAt: new Date(),
        updatedAt: new Date(),
        auditLog: [
          ...(currentDefinition.auditLog || []),  // Keep previous audit log entries
          auditLogEntry,  // Add new audit log entry
        ],
      };

      const newDefinition = new DefinitionModel(newDefinitionData);
      return newDefinition.save();
    } else {
      // If no changes to the definition, just update metadata without changing the version
      const auditLogEntry = {
        updatedBy,
        updatedAt: new Date(),
        changes: updateData,  // Track the metadata changes
        version,  // Keep the current version for metadata updates
      };

      return DefinitionModel.findOneAndUpdate(
        { name, version },
        {
          ...updateData,
          updatedAt: new Date(),
          $push: { auditLog: auditLogEntry },  // Append audit log for metadata changes
        },
        { new: true }
      );
    }
  }

  /**
   * @description Increments the version in x.y format.
   * @param {string} currentVersion - The current version of the definition.
   * @returns {string} - The updated version.
   */
  incrementVersion(currentVersion: string): string {
    const versionParts = currentVersion.split('.').map(Number);
    if (versionParts.length === 2) {
      let [major, minor] = versionParts;
      minor += 1;
      if (minor > 10) {
        major += 1;
        minor = 0;
      }
      return `${major}.${minor}`;
    }
    return currentVersion;
  }

  /**
   * @description Deletes a definition by name and version.
   * @param name - The name of the definition.
   * @param version - The version of the definition.
   * @returns {Promise<boolean>} - Returns true if the definition is deleted, otherwise false.
   */
  async deleteDefinition(name: string, version: string): Promise<boolean> {
    const result = await DefinitionModel.findOneAndDelete({ name, version });
    return !!result;
  }

  /**
   * @description Lists definitions with optional filters.
   * @param filter - Filters to apply (e.g., by tags).
   * @returns {Promise<IDefinitionModel[]>} - List of matching definitions.
   */
  async listDefinitions(filter: Record<string, any> = {}): Promise<IDefinitionModel[]> {
    return DefinitionModel.find(filter).lean();
  }
  /**
     * @description Update selected metadata and definition, and auto-increment the version.
     * @param {string} name - The name of the definition.
     * @param {string} version - The current version of the definition.
     * @param {Partial<IDefinitionModel>} updateData - The selected metadata and definition to update.
     * @returns {Promise<IDefinitionModel | null>} - The updated definition document, or null if not found.
     */
  async updateMetadataAndDefinition(
    name: string,
    version: string,
    updateData: Partial<IDefinitionModel>
  ): Promise<IDefinitionModel | null> {
    // Find the existing definition
    const existingDefinition = await DefinitionModel.findOne({ name, version });
    if (!existingDefinition) {
      throw new Error(`Definition ${name} version ${version} not found.`);
    }

    // Update selected metadata
    if (updateData.author) existingDefinition.author = updateData.author;
    if (updateData.description) existingDefinition.description = updateData.description;
    if (updateData.license) existingDefinition.license = updateData.license;
    if (updateData.tags) existingDefinition.tags = updateData.tags;
    if (updateData.seeAlso) existingDefinition.seeAlso = updateData.seeAlso;
    if (updateData.category) existingDefinition.category = updateData.category;
    if (updateData.context) existingDefinition.context = updateData.context;
    if (updateData.story) existingDefinition.story = updateData.story;

    // Update the definition if provided
    if (updateData.definition) {
      existingDefinition.definition = updateData.definition;
      // Increment the version
      existingDefinition.version = this.incrementVersion(existingDefinition.version);
    }
    // Save the updated definition
    return existingDefinition.save();
  }
  /**
   * @description Search for definitions based on metadata fields and support full-text search on 'story'.
   * @param {Record<string, any>} searchParams - Object containing the search criteria.
   * @returns {Promise<IDefinitionModel[]>} - List of matching definitions.
   */
  async searchDefinitions(searchParams: Record<string, any>): Promise<IDefinitionModel[]> {
    const query: Record<string, any> = {};

    // Build query for specific metadata fields
    if (searchParams.author) {
      query.author = searchParams.author;
    }
    if (searchParams.tags) {
      query.tags = { $in: searchParams.tags.split(',') };
    }
    if (searchParams.category) {
      query.category = searchParams.category;
    }
    if (searchParams.context) {
      query.context = searchParams.context;
    }

    // If story is provided, perform a text search on the story field
    if (searchParams.story) {
      query.$text = { $search: searchParams.story };
    }

    // Fetch the filtered list of definitions
    return DefinitionModel.find(query).lean();
  }
}


export const definitionService = new DefinitionService();

