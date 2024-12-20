import { Fact, IFact } from '../models/fact'; // Import the Fact model and the IFact interface

/**
 * FactService provides methods to interact with the Fact collection in MongoDB.
 * It supports operations such as finding, listing, adding, updating, deleting, searching,
 * and querying facts.
 */
export class FactService {

  /**
   * Finds a fact by its unique ID.
   * 
   * @param factId - The ID of the fact to be found.
   * @returns A promise that resolves to the found fact or null if not found.
   * @throws An error if the operation fails.
   */
  async findFactById(factId: string): Promise<IFact | null> {
    try {
      // Find the fact by its ID using Mongoose's findById method
      return await Fact.findById(factId);
    } catch (error) {
      console.error('Error finding fact by ID:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Lists all facts in the collection.
   * 
   * @returns A promise that resolves to an array of all facts.
   * @throws An error if the operation fails.
   */
  async listAllFacts(): Promise<IFact[]> {
    try {
      // Retrieve all facts using Mongoose's find method
      return await Fact.find({});
    } catch (error) {
      console.error('Error listing facts:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Adds a new fact to the collection.
   * 
   * @param fact - The fact to be added, following the IFact interface.
   * @returns A promise that resolves to the newly created fact.
   * @throws An error if the operation fails.
   */
  async addFact(fact: IFact): Promise<IFact> {
    try {
      // Create and save a new fact using Mongoose's create method
      return await Fact.create(fact);
    } catch (error) {
      console.error('Error adding fact:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Updates an existing fact by its ID with the provided update data.
   * 
   * @param factId - The ID of the fact to be updated.
   * @param updateData - The data to update the fact with.
   * @returns A promise that resolves to the updated fact, or null if not found.
   * @throws An error if the operation fails.
   */
  async updateFact(factId: string, updateData: Partial<IFact>): Promise<IFact | null> {
    try {
      // Find and update the fact by its ID, returning the new document
      return await Fact.findByIdAndUpdate(factId, updateData, { new: true });
    } catch (error) {
      console.error('Error updating fact:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Deletes a fact by its ID.
   * 
   * @param factId - The ID of the fact to be deleted.
   * @returns A promise that resolves to void.
   * @throws An error if the operation fails.
   */
  async deleteFact(factId: string): Promise<void> {
    try {
      // Find and delete the fact by its ID
      await Fact.findByIdAndDelete(factId);
    } catch (error) {
      console.error('Error deleting fact:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Searches for facts based on a provided query.
   * 
   * @param query - The query object used to search for matching facts.
   * @returns A promise that resolves to an array of matching facts.
   * @throws An error if the operation fails.
   */
  async searchFacts(query: any): Promise<IFact[]> {
    try {
      // Search for facts that match the query criteria
      return await Fact.find(query);
    } catch (error) {
      console.error('Error searching facts:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Queries the facts with additional options like sorting, skipping, and limiting.
   * 
   * @param filter - The filter object used to query for facts.
   * @param sort - An optional sort object to determine the order of the results.
   * @param skip - An optional number of documents to skip in the result set.
   * @param limit - An optional maximum number of documents to return.
   * @returns A promise that resolves to an array of matching facts.
   * @throws An error if the operation fails.
   */
  async queryFacts(filter: any, sort: any = {}, skip: number = 0, limit: number = 10): Promise<IFact[]> {
    try {
      // Query the facts with the provided filter, sort, skip, and limit options
      return await Fact.find(filter).sort(sort).skip(skip).limit(limit);
    } catch (error) {
      console.error('Error querying facts:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Counts the number of facts that match a provided query.
   * 
   * @param query - The query object used to count matching facts.
   * @returns A promise that resolves to the number of matching entries.
   * @throws An error if the operation fails.
   */
  async countFacts(query: any): Promise<number> {
    try {
      // Count the number of documents that match the query criteria
      return await Fact.countDocuments(query);
    } catch (error) {
      console.error('Error counting facts:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}

