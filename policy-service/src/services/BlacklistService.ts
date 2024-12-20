import { Blacklist, IBlacklist } from '../models/blacklist'; // Import the Blacklist model and the IBlacklist interface

/**
 * BlacklistService provides methods to interact with the Blacklist collection in MongoDB.
 * It supports operations such as finding, listing, adding, updating, deleting, and querying
 * blacklist entries.
 */
export class BlacklistService {
  
  /**
   * Finds a blacklist entry by its unique ID.
   * 
   * @param entryId - The ID of the blacklist entry to be found.
   * @returns A promise that resolves to the found blacklist entry or null if not found.
   * @throws An error if the operation fails.
   */
  async findBlacklistEntryById(entryId: string): Promise<IBlacklist | null> {
    try {
      // Find the blacklist entry by its ID using Mongoose's findById method
      return await Blacklist.findById(entryId);
    } catch (error) {
      console.error('Error finding blacklist entry by ID:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Lists all blacklist entries in the collection.
   * 
   * @returns A promise that resolves to an array of all blacklist entries.
   * @throws An error if the operation fails.
   */
  async listAllBlacklistEntries(): Promise<IBlacklist[]> {
    try {
      // Retrieve all blacklist entries using Mongoose's find method
      return await Blacklist.find({});
    } catch (error) {
      console.error('Error listing blacklist entries:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Adds a new blacklist entry to the collection.
   * 
   * @param entry - The blacklist entry to be added, following the IBlacklist interface.
   * @returns A promise that resolves to the newly created blacklist entry.
   * @throws An error if the operation fails.
   */
  async addBlacklistEntry(entry: IBlacklist): Promise<IBlacklist> {
    try {
      // Create and save a new blacklist entry using Mongoose's create method
      return await Blacklist.create(entry);
    } catch (error) {
      console.error('Error adding blacklist entry:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Updates an existing blacklist entry by its ID with the provided update data.
   * 
   * @param entryId - The ID of the blacklist entry to be updated.
   * @param updateData - The data to update the blacklist entry with.
   * @returns A promise that resolves to the updated blacklist entry, or null if not found.
   * @throws An error if the operation fails.
   */
  async updateBlacklistEntry(entryId: string, updateData: Partial<IBlacklist>): Promise<IBlacklist | null> {
    try {
      // Find and update the blacklist entry by its ID, returning the new document
      return await Blacklist.findByIdAndUpdate(entryId, updateData, { new: true });
    } catch (error) {
      console.error('Error updating blacklist entry:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Deletes a blacklist entry by its ID.
   * 
   * @param entryId - The ID of the blacklist entry to be deleted.
   * @returns A promise that resolves to void.
   * @throws An error if the operation fails.
   */
  async deleteBlacklistEntry(entryId: string): Promise<void> {
    try {
      // Find and delete the blacklist entry by its ID
      await Blacklist.findByIdAndDelete(entryId);
    } catch (error) {
      console.error('Error deleting blacklist entry:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Searches for blacklist entries based on a provided query.
   * 
   * @param query - The query object used to search for matching blacklist entries.
   * @returns A promise that resolves to an array of matching blacklist entries.
   * @throws An error if the operation fails.
   */
  async searchBlacklistEntries(query: any): Promise<IBlacklist[]> {
    try {
      // Search for blacklist entries that match the query criteria
      return await Blacklist.find(query);
    } catch (error) {
      console.error('Error searching blacklist entries:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Queries the blacklist entries with additional options like sorting, skipping, and limiting.
   * 
   * @param filter - The filter object used to query for blacklist entries.
   * @param sort - An optional sort object to determine the order of the results.
   * @param skip - An optional number of documents to skip in the result set.
   * @param limit - An optional maximum number of documents to return.
   * @returns A promise that resolves to an array of matching blacklist entries.
   * @throws An error if the operation fails.
   */
  async queryBlacklistEntries(filter: any, sort: any = {}, skip: number = 0, limit: number = 10): Promise<IBlacklist[]> {
    try {
      // Query the blacklist entries with the provided filter, sort, skip, and limit options
      return await Blacklist.find(filter).sort(sort).skip(skip).limit(limit);
    } catch (error) {
      console.error('Error querying blacklist entries:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Counts the number of blacklist entries that match a provided query.
   * 
   * @param query - The query object used to count matching blacklist entries.
   * @returns A promise that resolves to the number of matching entries.
   * @throws An error if the operation fails.
   */
  async countBlacklistEntries(query: any): Promise<number> {
    try {
      // Count the number of documents that match the query criteria
      return await Blacklist.countDocuments(query);
    } catch (error) {
      console.error('Error counting blacklist entries:', error); // Log any errors that occur
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}

