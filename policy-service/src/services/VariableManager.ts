import ExportedVariable from '../models/exportVariable'; // Import the ExportedVariable model from the models directory

/**
 * VariableManager is responsible for managing the resolution and import of variables 
 * used throughout the application.
 */
export class VariableManager {
  
  /**
   * Resolves a set of variables provided as input. This method takes a key-value map of variables,
   * processes them, and returns a new map with the resolved variables.
   * 
   * @param variables - An optional key-value map of variables to be resolved.
   * @returns A key-value map of resolved variables.
   */
  resolveVariables(variables: { [key: string]: any } = {}): { [key: string]: any } {
    const resolvedVariables: { [key: string]: any } = {};

    // Iterate through each key-value pair in the input variables
    for (const [key, value] of Object.entries(variables)) {
      try {
        // Directly assign the value to the resolved variables map
        resolvedVariables[key] = value;
      } catch (e) {
        // Log an error if resolving the variable fails and assign null to the resolved variable
        console.error(`Error resolving variable '${key}':`, e);
        resolvedVariables[key] = null;
      }
    }

    return resolvedVariables; // Return the map of resolved variables
  }

  /**
   * Imports all export variables from the database, specifically from the ExportVariable collection.
   * The method retrieves all documents, iterates over the `definitions` field of each document, 
   * and populates the key-value pairs into the `importedVariables` object.
   * 
   * @returns A promise that resolves to a key-value map of imported variables.
   */
  async importAllExportedVariables(): Promise<{ [key: string]: any }> {
    const importedVariables: { [key: string]: any } = {}; // Initialize an empty map to hold the imported variables

    try {
      // Retrieve all documents from the ExportVariable collection, converting them to plain JavaScript objects
      const variableDocuments = await ExportedVariable.find({}).lean();

      // Iterate over each retrieved export variable document
      for (const variableDocument of variableDocuments) {
        // Check if the document has a `definitions` field
        if (variableDocument.definitions) {
          // Iterate over each key-value pair in the `definitions` object
          for (const [key, value] of Object.entries(variableDocument.definitions)) {
            // Populate the importedVariables map with the key-value pairs from definitions
            importedVariables[key] = value;
          }
        }
      }
    } catch (e) {
      // Log any errors encountered during the import process
      console.error('Error importing exported variables:', e);
    }

    return importedVariables; // Return the map containing all imported variables
  }
}

