import mongoose from 'mongoose';
import { IScenario, Scenario } from '../models/scenario'; // Import the Scenario model and the IScenario interface

/**
 * DatabaseService provides methods to interact with the MongoDB database, including
 * connecting and disconnecting, as well as performing CRUD operations on scenarios.
 */
export class DatabaseService {
  private dbConnectionString: string;

  /**
   * Initializes a new instance of the DatabaseService class.
   * @param dbConnectionString The connection string used to connect to the MongoDB database.
   */
  constructor(dbConnectionString: string) {
    this.dbConnectionString = dbConnectionString;
  }

  /**
   * Connects to the MongoDB database using the provided connection string.
   * @returns A promise that resolves when the connection is established.
   * @throws An error if the connection fails.
   */
  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.dbConnectionString);
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error; // Re-throw to allow handling in the caller
    }
  }

  /**
   * Disconnects from the MongoDB database.
   * @returns A promise that resolves when the disconnection is complete.
   * @throws An error if the disconnection fails.
   */
  async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.log('Disconnected from the database');
    } catch (error) {
      console.error('Error disconnecting from the database:', error);
      // Consider whether to rethrow or handle the error differently here
    }
  }

  /**
   * Finds a scenario by its unique ID.
   * @param scenarioId The ID of the scenario to find.
   * @returns A promise that resolves to the scenario document or null if not found.
   * @throws An error if the operation fails.
   */
  async findScenarioById(scenarioId: string): Promise<IScenario | null> {
    try {
      const scenario = await Scenario.findById(scenarioId);
      return scenario;
    } catch (error) {
      console.error('Error finding scenario by ID:', error);
      throw error; // Re-throw to allow handling in the caller
    }
  }

  /**
   * Lists all scenarios in the database.
   * @returns A promise that resolves to an array of all scenarios.
   * @throws An error if the operation fails.
   */
  async listAllScenarios(): Promise<IScenario[]> {
    try {
      const scenarios = await Scenario.find({});
      return scenarios;
    } catch (error) {
      console.error('Error listing scenarios:', error);
      throw error; // Re-throw to allow handling in the caller
    }
  }

  /**
   * Adds a new scenario to the database.
   * @param scenario The scenario object to add, following the IScenario interface.
   * @returns A promise that resolves to the newly added scenario.
   * @throws An error if the operation fails.
   */
  async addScenario(scenario: IScenario): Promise<IScenario> {
    try {
      const newScenario = await Scenario.create(scenario);
      return newScenario;
    } catch (error) {
      console.error('Error adding scenario:', error);
      throw error; // Re-throw to allow handling in the caller
    }
  }

  /**
   * Updates an existing scenario in the database by its ID.
   * @param scenarioId The ID of the scenario to update.
   * @param updateData The data to update the scenario with.
   * @returns A promise that resolves to the updated scenario, or null if not found.
   * @throws An error if the operation fails.
   */
  async updateScenario(scenarioId: string, updateData: Partial<IScenario>): Promise<IScenario | null> {
    try {
      const updatedScenario = await Scenario.findByIdAndUpdate(scenarioId, updateData, { new: true });
      return updatedScenario;
    } catch (error) {
      console.error('Error updating scenario:', error);
      throw error; // Re-throw to allow handling in the caller
    }
  }

  /**
   * Deletes a scenario from the database by its ID.
   * @param scenarioId The ID of the scenario to delete.
   * @returns A promise that resolves when the deletion is complete.
   * @throws An error if the operation fails.
   */
  async deleteScenario(scenarioId: string): Promise<void> {
    try {
      await Scenario.findByIdAndDelete(scenarioId);
      console.log(`Scenario with ID ${scenarioId} deleted`);
    } catch (error) {
      console.error('Error deleting scenario:', error);
      throw error; // Re-throw to allow handling in the caller
    }
  }

  /**
   * Searches for scenarios in the database based on a query object.
   * @param query The MongoDB query object to search scenarios.
   * @returns A promise that resolves to an array of matching scenarios.
   * @throws An error if the operation fails.
   */
  async searchScenarios(query: any): Promise<IScenario[]> {
    try {
      const scenarios = await Scenario.find(query);
      return scenarios;
    } catch (error) {
      console.error('Error searching scenarios:', error);
      throw error; // Re-throw to allow handling in the caller
    }
  }

  /**
   * Performs an advanced query on scenarios with filtering, sorting, and pagination options.
   * @param filter The filter conditions to apply.
   * @param sort The sorting options.
   * @param skip Number of documents to skip for pagination.
   * @param limit Number of documents to return.
   * @returns A promise that resolves to an array of matching scenarios.
   * @throws An error if the operation fails.
   */
  async queryScenarios(
    filter: any,
    sort: any = {},
    skip: number = 0,
    limit: number = 10
  ): Promise<IScenario[]> {
    try {
      const scenarios = await Scenario.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      return scenarios;
    } catch (error) {
      console.error('Error querying scenarios:', error);
      throw error; // Re-throw to allow handling in the caller
    }
  }

  /**
   * Counts the number of scenarios in the database that match a given query.
   * @param query The MongoDB query object.
   * @returns A promise that resolves to the number of matching scenarios.
   * @throws An error if the operation fails.
   */
  async countScenarios(query: any): Promise<number> {
    try {
      const count = await Scenario.countDocuments(query);
      return count;
    } catch (error) {
      console.error('Error counting scenarios:', error);
      throw error; // Re-throw to allow handling in the caller
    }
  }

  // Additional database operations can be added as needed, such as aggregation, bulk updates, etc.
}

