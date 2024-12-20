import { Request, Response } from 'express';
import { Fact } from '../models/fact'; // Import the Fact model
import { handleError } from '../middleware/errorHandler'; // Import the error handling middleware

/**
 * FactController handles the CRUD (Create, Read, Update, Delete) operations
 * for Fact documents in the MongoDB database.
 */
export class FactController {

  /**
   * Creates a new Fact document in the database.
   * 
   * @param req - Express request object containing the new fact data in req.body.
   * @param res - Express response object used to send back the created fact or an error message.
   * @returns A promise that resolves to void.
   */
  public async createFact(req: Request, res: Response): Promise<void> {
    try {
      // Create a new Fact instance with the data provided in the request body
      const fact = new Fact(req.body);
      
      // Save the Fact instance to the database
      await fact.save();
      
      // Respond with a 201 status code and the created fact
      res.status(201).json(fact);
    } catch (error) {
      // Handle any errors that occur during the creation process
      handleError(res, error);
    }
  }

  /**
   * Retrieves a Fact document by its ID.
   * 
   * @param req - Express request object containing the Fact ID in req.params.id.
   * @param res - Express response object used to send back the found fact or an error message.
   * @returns A promise that resolves to void.
   */
  public async getFact(req: Request, res: Response): Promise<void> {
    try {
      // Find the Fact document by its ID
      const fact = await Fact.findById(req.params.id);
      
      if (!fact) {
        // If the Fact is not found, respond with a 404 status code
        res.status(404).json({ message: 'Fact not found' });
      } else {
        // If the Fact is found, respond with the fact data
        res.json(fact);
      }
    } catch (error) {
      // Handle any errors that occur during the retrieval process
      handleError(res, error);
    }
  }

  /**
   * Updates an existing Fact document by its ID.
   * 
   * @param req - Express request object containing the Fact ID in req.params.id and the updated data in req.body.
   * @param res - Express response object used to send back the updated fact or an error message.
   * @returns A promise that resolves to void.
   */
  public async updateFact(req: Request, res: Response): Promise<void> {
    try {
      // Find the Fact document by its ID and update it with the data from req.body
      const fact = await Fact.findByIdAndUpdate(req.params.id, req.body, { new: true });
      
      if (!fact) {
        // If the Fact is not found, respond with a 404 status code
        res.status(404).json({ message: 'Fact not found' });
      } else {
        // If the Fact is found and updated, respond with the updated fact data
        res.json(fact);
      }
    } catch (error) {
      // Handle any errors that occur during the update process
      handleError(res, error);
    }
  }

  /**
   * Deletes a Fact document by its ID.
   * 
   * @param req - Express request object containing the Fact ID in req.params.id.
   * @param res - Express response object used to send back a confirmation message or an error message.
   * @returns A promise that resolves to void.
   */
  public async deleteFact(req: Request, res: Response): Promise<void> {
    try {
      // Find the Fact document by its ID and delete it from the database
      const fact = await Fact.findByIdAndDelete(req.params.id);
      
      if (!fact) {
        // If the Fact is not found, respond with a 404 status code
        res.status(404).json({ message: 'Fact not found' });
      } else {
        // If the Fact is found and deleted, respond with a confirmation message
        res.json({ message: 'Fact deleted' });
      }
    } catch (error) {
      // Handle any errors that occur during the deletion process
      handleError(res, error);
    }
  }

  /**
   * Lists all Fact documents in the database.
   * 
   * @param req - Express request object (unused in this method).
   * @param res - Express response object used to send back the list of all facts or an error message.
   * @returns A promise that resolves to void.
   */
  public async listFacts(req: Request, res: Response): Promise<void> {
    try {
      // Retrieve all Fact documents from the database
      const facts = await Fact.find();
      
      // Respond with the list of all facts
      res.json(facts);
    } catch (error) {
      // Handle any errors that occur during the listing process
      handleError(res, error);
    }
  }
}


