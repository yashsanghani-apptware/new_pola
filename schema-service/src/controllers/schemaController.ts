import { Request, Response } from "express";
import { schemaService } from "../services/schemaService";
import { SchemaResolver } from "../services/schemaResolver";

/**
 * @class SchemaController
 * @description Controller to manage JSON schema operations like creating, retrieving, updating, and deleting schemas.
 */
class SchemaController {
  private schemaResolver: SchemaResolver;

  constructor() {
    this.schemaResolver = new SchemaResolver(); // Initialize the SchemaResolver
  }

  /**
   * @description Create a new schema along with its metadata.
   * @param {Request} req - The request object containing schema metadata and definition.
   * @param {Response} res - The response object to send back the result.
   * @returns {Promise<void>}
   */
  createSchema = async (req: Request, res: Response): Promise<void> => {
    try {
      // Directly pass the entire request body into the createSchema method
      const schemaData = req.body;
  
      // Let Mongoose handle the creation, including timestamps like createdAt and updatedAt
      const schema = await schemaService.createSchema(schemaData);
      
      // Respond with the created schema
      res.status(201).json(schema);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          res.status(409).json({ error: "Schema already exists with the same name and version" });
        } else {
          res.status(500).json({ error: "Failed to create schema", details: error.message });
        }
      } else {
        res.status(500).json({ error: "An unknown error occurred during schema creation" });
      }
    }
  };
  
  /**
   * @description Retrieve a schema's metadata by name and version.
   * @param {Request} req - The request object containing the name and version of the schema.
   * @param {Response} res - The response object to send back the schema metadata.
   * @returns {Promise<void>}
   */
  async getSchemaMetadata(req: Request, res: Response): Promise<void> {
    try {
      const { name, version } = req.params;
      const schema = await schemaService.getSchemaMetadata(name, version);
      if (schema) {
        res.status(200).json(schema);
      } else {
        res.status(404).json({ message: "Schema not found" });
      }
    } catch (error) {
      res.status(500).json({
        error: "Failed to retrieve schema metadata",
        details: (error as Error).message,
      });
    }
  }

  /**
   * @description Retrieve a schema's content by name and version, resolving $ref references and compositions.
   * @param {Request} req - The request object containing the name and version of the schema.
   * @param {Response} res - The response object to send back the schema content.
   * @returns {Promise<void>}
   */
  async getSchemaContent(req: Request, res: Response): Promise<void> {
    try {
      const { name, version } = req.params;
      const schema = await this.schemaResolver.composeSelfContainedSchema(name, version);
      if (schema) {
        res.status(200).json(schema);
      } else {
        res.status(404).json({ message: "Schema not found" });
      }
    } catch (error) {
      res.status(500).json({
        error: "Failed to retrieve schema content",
        details: (error as Error).message,
      });
    }
  }

  /**
   * @description Update a schema by name and version. 
   * If the defintion (definition) changes, increment the version and keep the old version intact.
   * @param {Request} req - The request object containing the updated schema data.
   * @param {Response} res - The response object to send back the updated schema.
   * @returns {Promise<void>}
   */
  async updateSchema(req: Request, res: Response): Promise<void> {
    try {
      const { name, version } = req.params;
      const updatedSchema = await schemaService.updateSchema(name, version, req.body);
      if (updatedSchema) {
        res.status(200).json(updatedSchema);
      } else {
        res.status(404).json({ message: "Schema not found" });
      }
    } catch (error) {
      res.status(500).json({
        error: "Failed to update schema",
        details: (error as Error).message,
      });
    }
  }

  /**
   * @description Delete a schema by name and version.
   * @param {Request} req - The request object containing the name and version of the schema.
   * @param {Response} res - The response object to confirm deletion.
   * @returns {Promise<void>}
   */
  async deleteSchema(req: Request, res: Response): Promise<void> {
    try {
      const { name, version } = req.params;
      const deletedSchema = await schemaService.deleteSchema(name, version);
      if (deletedSchema) {
        res.status(200).json({ message: "Schema deleted successfully", deletedSchema });
      } else {
        res.status(404).json({ message: "Schema not found" });
      }
    } catch (error) {
      res.status(500).json({
        error: "Failed to delete schema",
        details: (error as Error).message,
      });
    }
  }

  /**
   * @description Retrieve all schemas with optional pagination.
   * @param {Request} req - The request object containing optional page and limit query parameters.
   * @param {Response} res - The response object to send back the list of schemas.
   * @returns {Promise<void>}
   */
  async getAllSchemas(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const schemas = await schemaService.getAllSchemas(page, limit);
      res.status(200).json(schemas);
    } catch (error) {
      res.status(500).json({
        error: "Failed to retrieve schemas",
        details: (error as Error).message,
      });
    }
  }
  /**
 * @description Resolve schema references and return the fully resolved schema.
 * @param {Request} req - The request object containing the name and version of the schema.
 * @param {Response} res - The response object to send back the resolved schema.
 * @returns {Promise<void>}
 */
  resolveSchema = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, version } = req.params;
      const schema = await schemaService.getSchema(name, version);
      if (schema) {
        // Assuming SchemaResolver resolves the references in the schema
        const resolvedSchema = await this.schemaResolver.resolveSchema(name, version);
        res.status(200).json(resolvedSchema);
      } else {
        res.status(404).json({ message: "Schema not found" });
      }
    } catch (error) {
      res.status(500).json({
        error: "Failed to resolve schema",
        details: (error as Error).message,
      });
    }
  };

}

export const schemaController = new SchemaController();
