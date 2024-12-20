import { Request, Response } from 'express';
import { definitionService } from '../services/definitionService';

/**
 * @class DefinitionController
 * @description Controller for handling CRUD operations for definitions.
 */
export class DefinitionController {

  /**
   * @description Create a new definition in the repository.
   * @param {Request} req - The Express request object containing the definition data.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>}
   */
  async createDefinition(req: Request, res: Response): Promise<Response> {
    try {
      const definitionData = req.body;
      const newDefinition = await definitionService.createDefinition(definitionData);
      return res.status(201).json(newDefinition);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  }

  /**
   * @description Get a specific definition by name and version, returning only the lightweight 'definition' field.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>}
   */
  async getDefinitionByNameVersion(req: Request, res: Response): Promise<Response> {
    try {
      const { name, version } = req.params;
      const definition = await definitionService.getDefinitionByNameAndVersion(name, version);

      if (!definition) {
        return res.status(404).json({ error: 'Definition not found' });
      }

      return res.status(200).json(definition);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  }

  /**
   * @description Get all definitions with their metadata.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>}
   */
  async getAllDefinitions(req: Request, res: Response): Promise<Response> {
    try {
      const definitions = await definitionService.getAllDefinitions();
      return res.status(200).json(definitions);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  }

  /**
   * @description Update a specific definition by name and version.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>}
   */
  async updateDefinition(req: Request, res: Response): Promise<Response> {
    try {
      const { name, version } = req.params;
      const updateData = req.body;
      const updatedBy = 'system'; // TODO: get the correct user info from the token
      const updatedDefinition = await definitionService.updateDefinition(name, version, updateData, updatedBy);

      if (!updatedDefinition) {
        return res.status(404).json({ error: 'Definition not found' });
      }

      return res.status(200).json(updatedDefinition);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  }

  /**
   * @description Delete a specific definition by name and version.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>}
   */
  async deleteDefinition(req: Request, res: Response): Promise<Response> {
    try {
      const { name, version } = req.params;
      const deleted = await definitionService.deleteDefinition(name, version);

      if (!deleted) {
        return res.status(404).json({ error: 'Definition not found' });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  }
/**
   * @description Update selected metadata and definition, and auto-increment the version.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  async updateMetadataAndDefinitionController(req: Request, res: Response): Promise<Response> {
    try {
      const { name, version } = req.params;
      const updateData = req.body;

      // Call the service to update metadata and definition
      const updatedDefinition = await definitionService.updateMetadataAndDefinition(name, version, updateData);

      if (!updatedDefinition) {
        return res.status(404).json({ error: 'Definition not found' });
      }

      return res.status(200).json(updatedDefinition);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  }
/**
   * @description Search definitions by metadata fields.
   * @param {Request} req - The Express request object with query parameters.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>} - The list of matching definitions.
   */
  async searchDefinitions(req: Request, res: Response): Promise<Response> {
    try {
      const searchParams = req.query;

      const definitions = await definitionService.searchDefinitions(searchParams);

      return res.status(200).json(definitions);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  }
}

// Export a single instance of the controller class
export const definitionController = new DefinitionController();
