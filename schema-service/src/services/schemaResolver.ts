import { schemaService } from "./schemaService";
import { definitionService } from "./definitionService";

/**
 * @class SchemaResolver
 * @description Resolves JSON schemas and definitions, including resolving $ref references and schema composition (e.g., allOf, oneOf, anyOf).
 */
export class SchemaResolver {
  private cache: Map<string, any>; // Cache to store resolved schemas and definitions
  private refStack: Set<string>;   // Track references to detect circular dependencies

  constructor() {
    this.cache = new Map();
    this.refStack = new Set();
  }

  /**
   * @description Resolves the complete schema by its name and version, resolving all $ref references and compositions.
   * @param {string} name - The name of the schema to resolve.
   * @param {string} version - The version of the schema to resolve.
   * @returns {Promise<any>} - The fully resolved schema.
   */
  async resolveSchema(name: string, version: string): Promise<any> {
    const schema = await schemaService.getSchema(name, version);
    if (!schema) {
      throw new Error(`Schema ${name} version ${version} not found.`);
    }

    return this.resolveRefs(schema.definition);
  }

  /**
   * @description Resolves a definition by its name and version.
   * @param {string} name - The name of the definition to resolve.
   * @param {string} version - The version of the definition to resolve.
   * @returns {Promise<any>} - The fully resolved definition.
   */
  async resolveDefinition(name: string, version: string): Promise<any> {
    const definition = await definitionService.getDefinitionByNameAndVersion(name, version);
    if (!definition) {
      throw new Error(`Definition ${name} version ${version} not found.`);
    }

    return this.resolveRefs(definition.definition);
  }

  /**
   * @description Recursively resolves references within the schema or definition ($ref, allOf, oneOf, anyOf).
   * @param {any} schema - The schema or definition object to resolve.
   * @returns {Promise<any>} - The resolved schema or definition.
   */
 
  private async resolveRefs(schema: Record<string, any>, rootSchema: Record<string, any> = schema): Promise<any> {
    // If schema is not an object, return as-is
    if (typeof schema !== "object" || schema === null) {
        return schema;
    }

    const resolveSchemaRefs = async (schemaPart: any, root: any): Promise<any> => {
        // If it's not an object, return as-is
        if (typeof schemaPart !== "object" || schemaPart === null) {
            return schemaPart;
        }

        // Handle $ref resolution
        if (schemaPart.$ref) {
            const refKey = schemaPart.$ref;
            console.log(`Resolving $ref: ${refKey}`); // Add logging for debug

            // Check if this is a local reference (e.g., #/definitions/someDefinition)
            if (refKey.startsWith("#/definitions")) {
                // Extract the definition name from the $ref (e.g., "matchExprList")
                const definitionName = refKey.split("/")[2];

                console.log(`Looking for local definition: ${definitionName}`); // Add logging for debug

                // Check if the definition exists within the current schema's definitions
                if (root.definitions && root.definitions[definitionName]) {
                    console.log(`Found local definition: ${definitionName}`); // Add logging for debug
                    return this.resolveRefs(root.definitions[definitionName], root);
                } else {
                    console.error(`Local definition ${definitionName} not found in schema.`); // Add error logging
                    throw new Error(`Local definition ${definitionName} not found in schema.`);
                }
            }

            // If it's an external reference (e.g., a full URL)
            if (this.refStack.has(refKey)) {
                throw new Error(`Circular reference detected for ${refKey}`);
            }

            this.refStack.add(refKey);

            const [refType, refName, refVersion] = this.parseRef(refKey);
            let resolvedEntity = this.cache.get(refKey);

            if (!resolvedEntity) {
                // Check if it's a schema or a definition
                if (refType === "schemas") {
                    resolvedEntity = await this.resolveSchema(refName, refVersion);
                } else if (refType === "definitions") {
                    resolvedEntity = await this.resolveDefinition(refName, refVersion);
                }

                this.cache.set(refKey, resolvedEntity);
            }

            this.refStack.delete(refKey);

            // Recursively resolve references within the resolved entity
            return this.resolveRefs(resolvedEntity);
        }

        // Resolve composition (allOf, oneOf, anyOf)
        if (schemaPart.allOf) {
            const resolvedSchemas = await Promise.all(
                schemaPart.allOf.map((subSchema: any) => resolveSchemaRefs(subSchema, root))
            );
            return this.composeSchema(resolvedSchemas);
        }

        if (schemaPart.oneOf) {
            return {
                ...schemaPart,
                oneOf: await Promise.all(schemaPart.oneOf.map((subSchema: any) => resolveSchemaRefs(subSchema, root))),
            };
        }

        if (schemaPart.anyOf) {
            return {
                ...schemaPart,
                anyOf: await Promise.all(schemaPart.anyOf.map((subSchema: any) => resolveSchemaRefs(subSchema, root))),
            };
        }

        // Traverse all properties and resolve $ref recursively in each property
        const resolvedPart: Record<string, any> = Array.isArray(schemaPart) ? [] : {};
        for (const key of Object.keys(schemaPart)) {
            resolvedPart[key] = await resolveSchemaRefs(schemaPart[key], root);
        }

        return resolvedPart;
    };

    // Start recursive $ref resolution with the current schema as the root
    return resolveSchemaRefs(schema, rootSchema);
}

  /**
   * @description Utility to parse $ref strings (e.g., "http://registry.agsiri.com/v1/schemas/match/2.6").
   * @param {string} ref - The $ref string to parse.
   * @returns {[string, string, string]} - Returns the type (schemas/definitions), name, and version.
   */
  private parseRef(ref: string): [string, string, string] {
    try {
      const url = new URL(ref);
      const pathSegments = url.pathname.split('/');
      const refType = pathSegments[pathSegments.length - 3];  // Get the type (schemas/definitions)
      const refName = pathSegments[pathSegments.length - 2];  // Get the name
      const version = pathSegments[pathSegments.length - 1];  // Get the version
      return [refType, refName, version];
    } catch (error) {
      throw new Error(`Invalid $ref format: ${ref}`);
    }
  }

  /**
   * @description Merges schemas using the allOf composition.
   * @param {any[]} schemas - The array of schemas to merge.
   * @returns {any} - The composed schema.
   */
  private composeSchema(schemas: any[]): any {
    const composedSchema: any = { properties: {}, required: [] };

    for (const schema of schemas) {
      // Merge properties
      if (schema.properties) {
        composedSchema.properties = {
          ...composedSchema.properties,
          ...schema.properties,
        };
      }

      // Merge required fields
      if (schema.required) {
        composedSchema.required = [
          ...new Set([...composedSchema.required, ...schema.required]),
        ];
      }
    }

    return composedSchema;
  }

  /**
   * @description Composes a self-contained schema by resolving all external $ref references into local definitions.
   * @param {string} name - The name of the schema to resolve and compose.
   * @param {string} version - The version of the schema to resolve and compose.
   * @returns {Promise<any>} - The fully composed, self-contained schema with all $ref resolved to definitions.
   */
  public async composeSelfContainedSchema(name: string, version: string): Promise<any> {
    // Step 1: Fetch the base schema from the schemaService
    const schema = await schemaService.getSchema(name, version);
    if (!schema) {
      throw new Error(`Schema ${name} version ${version} not found.`);
    }

    // Step 2: Initialize the composed schema object
    const selfContainedSchema = { ...schema.definition };
    selfContainedSchema.definitions = {}; // Add definitions section to hold referenced schemas

    // Step 3: Recursively resolve references and embed them into the definitions
    await this.resolveRefsAndEmbed(selfContainedSchema, selfContainedSchema.definitions);

    // Step 4: Return the self-contained schema with all references resolved
    return selfContainedSchema;
  }

  /**
   * @description Recursively resolves references ($ref) and embeds the referenced schemas or definitions into the definitions.
   * @param {any} schema - The schema object being resolved.
   * @param {Record<string, any>} definitions - The definitions object where referenced schemas are stored.
   * @returns {Promise<void>} - Resolves references and embeds them into the definitions.
   */
  private async resolveRefsAndEmbed(schema: any, definitions: Record<string, any>): Promise<void> {
    // If schema is not an object, return as-is
    if (typeof schema !== "object" || schema === null) {
      return;
    }

    // Resolve $ref references
    if (schema.$ref) {
      const refKey = schema.$ref;

      const [refType, refName, refVersion] = this.parseRef(refKey);
      const internalRefKey = refName;

      if (!definitions[internalRefKey]) {
        let resolvedEntity;
        if (refType === "schemas") {
          resolvedEntity = await this.resolveSchema(refName, refVersion);
        } else if (refType === "definitions") {
          resolvedEntity = await this.resolveDefinition(refName, refVersion);
        }

        definitions[internalRefKey] = resolvedEntity;

        // Recursively resolve references in the embedded entity, but avoid infinite loops
        await this.resolveRefsAndEmbed(resolvedEntity, definitions);
      }

      // Modify the $ref to point to the internal definitions section
      schema.$ref = `#/definitions/${internalRefKey}`;
      return;
    }

    // Handle composition schemas (allOf, oneOf, anyOf)
    if (schema.allOf) {
      for (const subSchema of schema.allOf) {
        await this.resolveRefsAndEmbed(subSchema, definitions);
      }
    }

    if (schema.oneOf) {
      for (const subSchema of schema.oneOf) {
        await this.resolveRefsAndEmbed(subSchema, definitions);
      }
    }

    if (schema.anyOf) {
      for (const subSchema of schema.anyOf) {
        await this.resolveRefsAndEmbed(subSchema, definitions);
      }
    }

    // Recursively resolve all properties in the schema
    for (const key of Object.keys(schema)) {
      if (typeof schema[key] === "object" && schema[key] !== null) {
        await this.resolveRefsAndEmbed(schema[key], definitions);
      }
    }
  }
}

