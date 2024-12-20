import { Router } from 'express';
import { definitionController } from '../controllers/definitionController';

const router = Router();

/**
 * @route POST /definitions
 * @description Create a new definition in the repository. 
 * Expects the definition data in the request body, including metadata (author, description, tags, etc.) and the core definition.
 * @access Public
 * @example
 * POST /definitions
 * {
 *   "name": "exampleDefinition",
 *   "version": "1.0",
 *   "author": "Author Name",
 *   "description": "This is a reusable component.",
 *   "license": "MIT",
 *   "definition": { ... }, // Core JSON definition
 *   "tags": ["reusable", "component"],
 *   "seeAlso": ["relatedDefinition1", "relatedDefinition2"],
 *   "category": "Security",
 *   "context": "Policy Management",
 *   "story": "This definition allows for managing security policies."
 * }
 */
router.post('/', definitionController.createDefinition.bind(definitionController));

/**
 * @route GET /definitions/:name/:version
 * @description Retrieve a specific definition by its name and version. 
 * Returns only the 'definition' field without any metadata to keep the response lightweight.
 * @access Public
 * @example
 * GET /definitions/exampleDefinition/1.0
 * Response:
 * {
 *   "definition": { ... } // The core JSON definition
 * }
 */
router.get('/:name/:version', definitionController.getDefinitionByNameVersion.bind(definitionController));

/**
 * @route GET /definitions
 * @description Retrieve all definitions from the repository, including their metadata (author, description, tags, etc.).
 * The response provides a list of definitions with detailed metadata for management and searching.
 * @access Public
 * @example
 * GET /definitions
 * Response:
 * [
 *   {
 *     "name": "exampleDefinition",
 *     "version": "1.0",
 *     "author": "Author Name",
 *     "description": "This is a reusable component.",
 *     "license": "MIT",
 *     "tags": ["reusable", "component"],
 *     "seeAlso": ["relatedDefinition1", "relatedDefinition2"],
 *     "category": "Security",
 *     "context": "Policy Management",
 *     "story": "This definition allows for managing security policies."
 *   },
 *   ...
 * ]
 */
router.get('/', definitionController.getAllDefinitions.bind(definitionController));

/**
 * @route PUT /definitions/:name/:version
 * @description Update a specific definition by its name and version. 
 * Expects the updated data in the request body. If the definition is found, it will be updated.
 * @access Public
 * @example
 * PUT /definitions/exampleDefinition/1.0
 * {
 *   "author": "New Author",
 *   "description": "Updated description.",
 *   "definition": { ... }, // Updated JSON definition
 *   "tags": ["updated", "component"]
 * }
 */
router.put('/:name/:version', definitionController.updateDefinition.bind(definitionController));

// Add route for updating selected metadata and definition
router.patch('/:name/:version', definitionController.updateMetadataAndDefinitionController.bind(definitionController));

/**
 * @route DELETE /definitions/:name/:version
 * @description Delete a specific definition by its name and version. 
 * If the definition is found, it will be removed from the repository.
 * @access Public
 * @example
 * DELETE /definitions/exampleDefinition/1.0
 * Response:
 * 204 No Content
 */
router.delete('/:name/:version', definitionController.deleteDefinition.bind(definitionController));

// Search route
router.get('/search', definitionController.searchDefinitions.bind(definitionController));


export default router;

