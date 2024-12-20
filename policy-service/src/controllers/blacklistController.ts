import { Request, Response } from 'express';
import { Blacklist } from '../models/blacklist'; // Import the Blacklist model
import { handleError } from '../middleware/errorHandler'; // Import the error handling middleware

/**
 * BlacklistController handles the CRUD (Create, Read, Update, Delete) operations
 * for Blacklist documents in the MongoDB database.
 */
export class BlacklistController {

  /**
   * Creates a new Blacklist document in the database.
   * 
   * @param req - Express request object containing the new blacklist data in req.body.
   * @param res - Express response object used to send back the created blacklist or an error message.
   * @returns A promise that resolves to void.
   */
  public async createBlacklist(req: Request, res: Response): Promise<void> {
    try {
      // Create a new Blacklist instance with the data provided in the request body
      const blacklist = new Blacklist(req.body);
      
      // Save the Blacklist instance to the database
      await blacklist.save();
      
      // Respond with a 201 status code and the created blacklist
      res.status(201).json(blacklist);
    } catch (error) {
      // Handle any errors that occur during the creation process
      handleError(res, error);
    }
  }

  /**
   * Retrieves a Blacklist document by its ID.
   * 
   * @param req - Express request object containing the Blacklist ID in req.params.id.
   * @param res - Express response object used to send back the found blacklist or an error message.
   * @returns A promise that resolves to void.
   */
  public async getBlacklist(req: Request, res: Response): Promise<void> {
    try {
      // Find the Blacklist document by its ID
      const blacklist = await Blacklist.findById(req.params.id);
      
      if (!blacklist) {
        // If the Blacklist is not found, respond with a 404 status code
        res.status(404).json({ message: 'Blacklist not found' });
      } else {
        // If the Blacklist is found, respond with the blacklist data
        res.json(blacklist);
      }
    } catch (error) {
      // Handle any errors that occur during the retrieval process
      handleError(res, error);
    }
  }

  /**
   * Updates an existing Blacklist document by its ID.
   * 
   * @param req - Express request object containing the Blacklist ID in req.params.id and the updated data in req.body.
   * @param res - Express response object used to send back the updated blacklist or an error message.
   * @returns A promise that resolves to void.
   */
  public async updateBlacklist(req: Request, res: Response): Promise<void> {
    try {
      // Find the Blacklist document by its ID and update it with the data from req.body
      const blacklist = await Blacklist.findByIdAndUpdate(req.params.id, req.body, { new: true });
      
      if (!blacklist) {
        // If the Blacklist is not found, respond with a 404 status code
        res.status(404).json({ message: 'Blacklist not found' });
      } else {
        // If the Blacklist is found and updated, respond with the updated blacklist data
        res.json(blacklist);
      }
    } catch (error) {
      // Handle any errors that occur during the update process
      handleError(res, error);
    }
  }

  /**
   * Deletes a Blacklist document by its ID.
   * 
   * @param req - Express request object containing the Blacklist ID in req.params.id.
   * @param res - Express response object used to send back a confirmation message or an error message.
   * @returns A promise that resolves to void.
   */
  public async deleteBlacklist(req: Request, res: Response): Promise<void> {
    try {
      // Find the Blacklist document by its ID and delete it from the database
      const blacklist = await Blacklist.findByIdAndDelete(req.params.id);
      
      if (!blacklist) {
        // If the Blacklist is not found, respond with a 404 status code
        res.status(404).json({ message: 'Blacklist not found' });
      } else {
        // If the Blacklist is found and deleted, respond with a confirmation message
        res.json({ message: 'Blacklist deleted' });
      }
    } catch (error) {
      // Handle any errors that occur during the deletion process
      handleError(res, error);
    }
  }

  /**
   * Lists all Blacklist documents in the database.
   * 
   * @param req - Express request object (unused in this method).
   * @param res - Express response object used to send back the list of all blacklists or an error message.
   * @returns A promise that resolves to void.
   */
  public async listBlacklists(req: Request, res: Response): Promise<void> {
    try {
      // Retrieve all Blacklist documents from the database
      const blacklists = await Blacklist.find();
      
      // Respond with the list of all blacklists
      res.json(blacklists);
    } catch (error) {
      // Handle any errors that occur during the listing process
      handleError(res, error);
    }
  }
}


