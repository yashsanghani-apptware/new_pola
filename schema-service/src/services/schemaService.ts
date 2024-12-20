import { ISchemaModel, SchemaModel } from "../models/schema.model";

/**
 * @class SchemaService
 * @description Service class to handle schema-related operations such as creating, retrieving, updating, and deleting schemas.
 */
class SchemaService {
  /**
   * @method createSchema
   * @description Creates a new schema in the database.
   * @param {ISchemaModel} schemaData - The schema object containing name, version, description, schema definition, and metadata.
   * @returns {Promise<ISchemaModel>} - The created schema document.
   * @throws Will throw an error if schema creation fails.
   */
  async createSchema(schemaData: ISchemaModel): Promise<ISchemaModel> {
    try {
      // Check if the schema with the same name and version already exists
      const existingSchema = await SchemaModel.findOne({
        name: schemaData.name,
        version: schemaData.version,
      });

      if (existingSchema) {
        throw new Error(
          `Schema with name ${schemaData.name} and version ${schemaData.version} already exists.`
        );
      }

      // If no duplicates, proceed to create the schema
      const schema = new SchemaModel(schemaData);
      return await schema.save();
    } catch (error) {
      throw new Error("Error creating schema: " + (error as Error).message);
    }
  }

  /**
   * @method getSchema
   * @description Retrieves a schema from the database by its name and version.
   * @param {string} name - The name of the schema.
   * @param {string} version - The version of the schema.
   * @returns {Promise<ISchemaModel | null>} - The schema document if found, otherwise null.
   * @throws Will throw an error if schema retrieval fails.
   */
  async getSchema(name: string, version: string): Promise<ISchemaModel | null> {
    try {
      return await SchemaModel.findOne({ name, version });
    } catch (error) {
      throw new Error("Error retrieving schema: " + (error as Error).message);
    }
  }

  /**
   * @method getSchemaMetadata
   * @description Retrieve only the schema metadata (without the content).
   * @param {string} name - The name of the schema.
   * @param {string} version - The version of the schema.
   * @returns {Promise<any | null>} - A promise that resolves to the schema metadata or null if not found.
   * @throws Will throw an error if metadata retrieval fails.
   */
  async getSchemaMetadata(name: string, version: string): Promise<any | null> {
    try {
      // Find the schema by name and version, excluding the schema (content)
      return await SchemaModel.findOne({ name, version }, { schema: 0 }); // Exclude schema content
    } catch (error) {
      throw new Error(
        `Error retrieving schema metadata: ${(error as Error).message}`
      );
    }
  }

  /**
   * @method updateSchema
   * @description Updates an existing schema by its name and version. Only updates metadata if schema is not modified.
   * @param {string} name - The name of the schema.
   * @param {string} version - The version of the schema.
   * @param {Partial<ISchemaModel>} updateData - The data to update the schema with.
   * @returns {Promise<ISchemaModel | null>} - The updated schema document if found, otherwise null.
   * @throws Will throw an error if schema update fails.
   */
  async updateSchema(
    name: string,
    version: string,
    updateData: Partial<ISchemaModel>
  ): Promise<ISchemaModel | null> {
    try {
      // If the schema (definition) is updated, increment version
      if (updateData.schema) {
        // Fetch the existing schema
        const currentSchema = await SchemaModel.findOne({ name, version });
        if (!currentSchema) {
          throw new Error("Schema not found for update.");
        }

        // Increment version logic
        const [major, minor] = version.split(".").map(Number);
        const newVersion = minor >= 10 ? `${major + 1}.0` : `${major}.${minor + 1}`;
        updateData.version = newVersion;

        // Create a new schema entry to preserve the old version
        const newSchema = new SchemaModel({
          ...currentSchema.toObject(),
          ...updateData,
          version: newVersion,
        });
        return await newSchema.save();
      }

      // If only metadata is updated, just update the document
      return await SchemaModel.findOneAndUpdate(
        { name, version },
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      throw new Error("Error updating schema: " + (error as Error).message);
    }
  }

  /**
   * @method deleteSchema
   * @description Deletes a schema from the database by its name and version.
   * @param {string} name - The name of the schema.
   * @param {string} version - The version of the schema.
   * @returns {Promise<ISchemaModel | null>} - The deleted schema document if found, otherwise null.
   * @throws Will throw an error if schema deletion fails.
   */
  async deleteSchema(
    name: string,
    version: string
  ): Promise<ISchemaModel | null> {
    try {
      return await SchemaModel.findOneAndDelete({ name, version });
    } catch (error) {
      throw new Error("Error deleting schema: " + (error as Error).message);
    }
  }

  /**
   * @method listSchemas
   * @description Retrieves a list of schemas with optional filtering by name and/or version.
   * @param {string} [name] - (Optional) Filter schemas by name.
   * @param {string} [version] - (Optional) Filter schemas by version.
   * @returns {Promise<ISchemaModel[]>} - A list of schema documents.
   * @throws Will throw an error if listing schemas fails.
   */
  async listSchemas(name?: string, version?: string): Promise<ISchemaModel[]> {
    try {
      const filter: any = {};
      if (name) filter.name = name;
      if (version) filter.version = version;
      return await SchemaModel.find(filter);
    } catch (error) {
      throw new Error("Error listing schemas: " + (error as Error).message);
    }
  }

  /**
   * @method getAllSchemas
   * @description Get all schemas with optional pagination.
   * @param {number} [page=1] - The page number for pagination.
   * @param {number} [limit=10] - The number of schemas per page.
   * @returns {Promise<ISchemaModel[]>} - A list of schema documents.
   * @throws Will throw an error if retrieval fails.
   */
  async getAllSchemas(page = 1, limit = 10): Promise<ISchemaModel[]> {
    try {
      return await SchemaModel.find()
        .skip((page - 1) * limit) // Skip documents for pagination
        .limit(limit); // Limit the number of documents returned
    } catch (error) {
      throw new Error(`Error retrieving schemas: ${(error as Error).message}`);
    }
  }

  /**
   * @method searchSchemas
   * @description Perform a text search on schema fields like story, description, context, etc.
   * @param {string} query - The search string.
   * @returns {Promise<ISchemaModel[]>} - List of schemas that match the search query.
   */
  async searchSchemas(query: string): Promise<ISchemaModel[]> {
    try {
      return await SchemaModel.find({ $text: { $search: query } });
    } catch (error) {
      throw new Error("Error searching schemas: " + (error as Error).message);
    }
  }
  /**
 * @description Finds all schemas that reference a particular component by name and version.
 * @param {string} componentName - The name of the component (definition).
 * @param {string} componentVersion - The version of the component (definition).
 * @returns {Promise<any[]>} - A list of schemas that use the component.
 */
  async findSchemasUsingComponent(componentName: string, componentVersion: string): Promise<any[]> {
    try {
      // Assuming each schema has a 'definitions' or similar structure where component usage is tracked
      return await SchemaModel.find({
        $or: [
          { 'definition.$ref': `http://registry.agsiri.com/v1/definitions/${componentName}/${componentVersion}` },
          { 'definition.components': { $elemMatch: { name: componentName, version: componentVersion } } }
        ]
      }).lean();
    } catch (error) {
      throw new Error(`Error finding schemas using component ${componentName} v${componentVersion}: ${(error as Error).message}`);
    }
  }
}

export const schemaService = new SchemaService();
