import { Router } from 'express';
import { schemaController } from '../controllers/schemaController';

/**
 * @description Router for handling schema-related operations such as creating, retrieving, updating, deleting schemas,
 * and resolving schema references.
 * @route /schemas
 */
const router = Router();

/**
 * @route POST /schemas
 * @description Create a new schema.
 * @access Public
 */
router.post('/', schemaController.createSchema);

/**
 * @route GET /:name/:version
 * @description Retrieve the content of a schema by name and version. This will return the full schema record including all schema definitions.
 * @access Public
 */
router.get('/:name/:version', schemaController.getSchemaContent.bind(schemaController));

/**
 * @route GET /schemas/:name/:version/describe
 * @description Retrieve metadata of a schema by name and version. This will return metadata like name, version, author, license, and timestamps.
 * @access Public
 */
router.get('/:name/:version/describe', schemaController.getSchemaMetadata);

/**
 * @route GET /schemas/:name/:version/resolve
 * @description Retrieve and resolve a schema by name and version. This resolves any references ($ref) to other schemas or schema components.
 * @access Public
 */
router.get('/:name/:version/resolve', schemaController.resolveSchema.bind(schemaController));

/*
 * @route GET /schemas
 * @description Retrieve all schemas with optional pagination. Query parameters 'page' and 'limit' can be provided for paginated results.
 * @access Public
 */
router.get('/', schemaController.getAllSchemas);

/**
 * @route PUT /schemas/:name/:version
 * @description Update a schema by name and version.
 * @access Public
 */
router.put('/:name/:version', schemaController.updateSchema);

/**
 * @route DELETE /schemas/:name/:version
 * @description Delete a schema by name and version.
 * @access Public
 */
router.delete('/:name/:version', schemaController.deleteSchema);

export default router;
