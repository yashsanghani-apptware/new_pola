import { VariableManager } from './VariableManager'; // Import the VariableManager class for handling variable resolution
import { User } from '../models/user'; // Import the User model
import { Resource } from '../models/resource'; // Import the Resource model
import { Fact } from '../models/fact'; // Import the Fact model
import { Blacklist } from '../models/blacklist'; // Import the Blacklist model

/**
 * The ContextBuilder class is responsible for constructing the runtime context for a given 
 * user and resource. This context includes user data, resource data, associated facts, blacklist 
 * entries, and resolved variables.
 */
export class ContextBuilder {
    private variableManager: VariableManager;

    /**
     * Initializes a new instance of the ContextBuilder class.
     * The constructor creates an instance of the VariableManager to handle variable resolution.
     */
    constructor() {
        this.variableManager = new VariableManager();
    }

    /**
     * Builds the runtime context for a user and resource based on provided identifiers.
     * This method fetches data for the user and resource, loads associated facts and blacklist entries,
     * and resolves any global or passed-in variables.
     * 
     * @param identifiers - An object containing the userId and resourceId to build the context for.
     * @param variables - A key-value map of variables to be resolved.
     * @param globals - A key-value map of global variables to be included in the context.
     * @returns A promise that resolves to an object containing the final runtime context.
     */
    async buildContext(
        identifiers: { userId: string; resourceId: string },
        variables: { [key: string]: any },
        globals: { [key: string]: any }
    ): Promise<{ [key: string]: any }> {
        const contextData: { [key: string]: any } = {}; // Initialize an empty object to hold the context data

        // Log the identifiers for debugging purposes
        console.log('Building context with identifiers:', identifiers);

        // Fetch user data based on the provided userId
        const user = await User.findById(identifiers.userId).lean();
        if (user) {
            console.log('User found:', user);
            contextData.user = user;
        } else {
            console.warn(`User not found for ID: ${identifiers.userId}`);
            contextData.user = {}; // Set to an empty object if the user is not found
        }

        // Fetch resource data based on the provided resourceId
        const resource = await Resource.findById(identifiers.resourceId).lean();
        if (resource) {
            console.log('Resource found:', resource);
            contextData.resource = resource;
        } else {
            console.warn(`Resource not found for ID: ${identifiers.resourceId}`);
            contextData.resource = {}; // Set to an empty object if the resource is not found
        }

        // Load and merge facts into the user attributes
        const userFacts = await Fact.find({
            _id: identifiers.userId,
            type: 'User',
            status: 'ACTIVE'
        } as any).lean();
        for (const fact of userFacts) {
            contextData.user.attr = { ...contextData.user.attr, ...fact.attr };
        }

        // Load and merge facts into the resource attributes
        const resourceFacts = await Fact.find({
            _id: identifiers.resourceId,
            type: 'Resource',
            status: 'ACTIVE'
        } as any).lean();
        for (const fact of resourceFacts) {
            contextData.resource.attr = { ...contextData.resource.attr, ...fact.attr };
        }

        // Load blacklist entries for the user or resource
        const blacklistEntries = await Blacklist.find({
            $or: [
                { id: identifiers.userId, type: 'User' },
                { id: identifiers.resourceId, type: 'Resource' }
            ]
        }).lean();

        if (blacklistEntries && blacklistEntries.length > 0) {
            contextData.blacklist = blacklistEntries.map(entry => ({
                id: entry.id,
                type: entry.type,
                reason: entry.reason,
                status: entry.status
            }));
        } else {
            contextData.blacklist = []; // Initialize an empty array if no blacklist entries are found
        }

        // Resolve and merge variables from the input and global scope
        const resolvedVariables = this.variableManager.resolveVariables(variables); // Resolve input variables
        const importedVariables = await this.variableManager.importAllExportedVariables(); // Import exported variables

        // Combine all data into the final runtime context
        const finalVariables = { ...resolvedVariables, ...importedVariables, ...globals };
        const runtimeContext = { ...contextData, ...finalVariables };

        // Log the final runtime context for debugging purposes
        console.log('Final runtime context:', runtimeContext);

        // Return the constructed context object
        return {
            request: {},
            runtime: runtimeContext,
            variables: finalVariables,
            globals: globals || {},
        };
    }
}

/**
 * This function provides an explicit export of the `buildContext` method.
 * It allows the context to be built directly by providing user and resource identifiers,
 * along with variables and global settings.
 * 
 * @param identifiers - An object containing the userId and resourceId to build the context for.
 * @param variables - A key-value map of variables to be resolved.
 * @param globals - A key-value map of global variables to be included in the context.
 * @returns A promise that resolves to an object containing the final runtime context.
 */
export const buildContext = async (
    identifiers: { userId: string; resourceId: string },
    variables: { [key: string]: any },
    globals: { [key: string]: any }
): Promise<{ [key: string]: any }> => {
    const contextBuilder = new ContextBuilder(); // Create an instance of ContextBuilder
    return contextBuilder.buildContext(identifiers, variables, globals); // Build and return the context
};

