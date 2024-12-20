import { schemaService } from "./schemaService";
import { definitionService } from "./definitionService";

/**
 * @class SchemaAnalyst
 * @description Analyzes schemas and resolves references to definitions and schemas, creating a self-contained schema.
 */
export class SchemaAnalyst {
  private cache: Map<string, any>; // Cache to store resolved entities (schemas or definitions)
  private refStack: Set<string>;   // Track references to detect circular dependencies

  constructor() {
    this.cache = new Map();
    this.refStack = new Set();
  }
  /**
   * @description Composes a self-contained schema by resolving all $ref references to definitions and schemas.
   * @param {string} name - The name of the schema to compose.
   * @param {string} version - The version of the schema to compose.
   * @returns {Promise<any>} - The fully resolved, self-contained schema.
   */
  async composeSelfContainedSchema(name: string, version: string): Promise<any> {
    // Step 1: Fetch the base schema from the schemaService
    const schema = await schemaService.getSchema(name, version);
    if (!schema) {
      throw new Error(`Schema ${name} version ${version} not found.`);
    }
    console.log('Schema to be resolved', JSON.stringify(schema, null, 2));

    // Step 2: Initialize the composed schema object
    const selfContainedSchema = { ...schema.definition }; // definition contains the JSON schema
    selfContainedSchema.definitions = {}; // Add definitions section to hold referenced schemas and definitions

    // Step 3: Recursively resolve references and embed them into the definitions
    await this.resolveRefsAndEmbed(selfContainedSchema, selfContainedSchema.definitions);

    // Step 4: Return the self-contained schema with all references resolved
    return selfContainedSchema;
  }

  /**
   * @description Recursively resolves references ($ref) and embeds the referenced schemas or definitions into the definitions.
   * @param {any} schema - The schema object being resolved.
   * @param {Record<string, any>} definitions - The definitions object where referenced schemas and definitions are stored.
   * @returns {Promise<void>} - Resolves references and embeds them into the definitions.
   */
  private async resolveRefsAndEmbed(schema: any, definitions: Record<string, any>): Promise<void> {
    // If schema is not an object, return as-is
    if (typeof schema !== "object" || schema === null) {
      return;
    }

    // Step 1: Check if there's a $ref to resolve
    if (schema.$ref) {
      const refKey = schema.$ref;

      // Distinguish between local and remote references
      const [refType, refName, refVersion] = this.parseRef(refKey);

      if (refType === "local") {
        // It's a local reference, check if it's already in definitions
        if (definitions[refName]) {
          console.log(`Local reference found: ${refName}`);
          return;
        } else {
          // Local reference not found in definitions, this is an issue
          throw new Error(`Could not resolve reference: ${refKey}`);
        }
      }

      // Check for circular references (if we've already seen this refKey)
      if (this.refStack.has(refKey)) {
        console.log(`Circular reference detected for ${refKey}. Skipping further resolution.`);
        return; // Stop resolving this reference and exit to avoid the circular loop
      }

      this.refStack.add(refKey);
      let resolvedEntity = this.cache.get(refKey);

      // Step 2: Check if it's a schema or a definition
      if (!resolvedEntity) {
        if (refType === "schemas") {
          resolvedEntity = await schemaService.getSchema(refName, refVersion);
        } else if (refType === "definitions") {
          resolvedEntity = await definitionService.getDefinitionByNameAndVersion(refName, refVersion);
        }

        if (!resolvedEntity) {
          throw new Error(`Could not resolve reference: ${refKey}`);
        }

        this.cache.set(refKey, resolvedEntity);
      }

      // Modify the $ref to point to the internal definitions section
      schema.$ref = `#/definitions/${refName}`;

      // Embed the resolved entity in the definitions section if it's not already there
      if (!definitions[refName]) {
        definitions[refName] = resolvedEntity.definition || resolvedEntity.definition;
        await this.resolveRefsAndEmbed(definitions[refName], definitions);
      }

      this.refStack.delete(refKey);
      return;
    }

    // Step 3: Handle composition schemas (allOf, oneOf, anyOf)
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

    // Step 4: Traverse and resolve all properties recursively
    for (const key of Object.keys(schema)) {
      if (typeof schema[key] === "object" && schema[key] !== null && key !== "$ref") {
        await this.resolveRefsAndEmbed(schema[key], definitions);
      }
    }
  }

  /**
   * @description Parses a $ref string and extracts the type (schemas or definitions), name, and version.
   * Handles both remote references (e.g., "http://registry.agsiri.com/v1/definitions/match/2.6")
   * and local references (e.g., "#/definitions/match").
   * @param {string} ref - The $ref string (e.g., "http://registry.agsiri.com/v1/definitions/matchExprList/2.6" or "#/definitions/match").
   * @returns {[string, string, string]} - An array with the type, name, and version of the referenced entity.
   */
  private parseRef(ref: string): [string, string, string] {
    // Check if the reference is local (starts with "#/")
    if (ref.startsWith("#/")) {
      const segments = ref.split('/');
      if (segments.length < 3) {
        throw new Error(`Invalid local $ref format: ${ref}`);
      }
      const refType = 'local';  // Treat this as a local reference
      const refName = segments[2]; // Extract the reference name (e.g., "match")
      const refVersion = '';  // Local references don't have versions
      console.log(`Parsed Local Ref -> Type: ${refType}, Name: ${refName}`);
      return [refType, refName, refVersion];
    }

    // If it's not local, treat it as a remote URL reference
    try {
      const url = new URL(ref);
      const pathSegments = url.pathname.split('/');
      const refType = pathSegments[2]; // Either 'schemas' or 'definitions'
      const refName = pathSegments[3]; // Get the schema/definition name
      const refVersion = pathSegments[4]; // Get the version
      console.log(`Parsed Remote Ref -> Type: ${refType}, Name: ${refName}, Version: ${refVersion}`);
      return [refType, refName, refVersion];
    } catch (error) {
      throw new Error(`Invalid remote $ref format: ${ref}`);
    }
  }
  /**
   * @description Lists all components (definitions) used in the schema, including their versions.
   * @param {string} name - The name of the schema.
   * @param {string} version - The version of the schema.
   * @returns {Promise<{name: string, version: string}[]>} - A list of component names and their versions.
   */
  async listComponentUsage(name: string, version: string): Promise<{ name: string, version: string }[]> {
    const componentList: { name: string, version: string }[] = [];
    const visitedRefs = new Set<string>();

    // Fetch the schema
    const schema = await schemaService.getSchema(name, version);
    console.log('Analyzing Schema...', name, JSON.stringify(schema, null, 2));

    if (!schema) {
      throw new Error(`Schema ${name} version ${version} not found.`);
    }

    // Recursively resolve references and collect component usage
    await this.collectComponentUsage(schema.definition, componentList, visitedRefs);

    // Return the list of components used
    return componentList;
  }

  /**
   * @description Recursively collects components (definitions) from the schema.
   * @param {any} schema - The schema to collect components from.
   * @param {Array<{name: string, version: string}>} componentList - The list to store component names and versions.
   * @param {Set<string>} visitedRefs - A set of visited references to avoid duplicates.
   * @returns {Promise<void>} - Resolves once all components are collected.
   */
  private async collectComponentUsage(schema: any, componentList: { name: string, version: string }[], visitedRefs: Set<string>): Promise<void> {
    if (typeof schema !== "object" || schema === null) {
      return;
    }

    if (schema.$ref && !visitedRefs.has(schema.$ref)) {
      visitedRefs.add(schema.$ref);
      const [refType, refName, refVersion] = this.parseRef(schema.$ref);

      // Add the component to the list
      componentList.push({ name: refName, version: refVersion });

      // Fetch and resolve the reference if it's a definition
      if (refType === "definitions") {
        const definition = await definitionService.getDefinitionByNameAndVersion(refName, refVersion);
        if (definition && definition.definition) {
          await this.collectComponentUsage(definition.definition, componentList, visitedRefs);
        }
      }
    }

    // Recursively handle composition schemas (allOf, oneOf, anyOf)
    if (schema.allOf) {
      for (const subSchema of schema.allOf) {
        await this.collectComponentUsage(subSchema, componentList, visitedRefs);
      }
    }

    if (schema.oneOf) {
      for (const subSchema of schema.oneOf) {
        await this.collectComponentUsage(subSchema, componentList, visitedRefs);
      }
    }

    if (schema.anyOf) {
      for (const subSchema of schema.anyOf) {
        await this.collectComponentUsage(subSchema, componentList, visitedRefs);
      }
    }

    // Traverse all properties recursively
    for (const key of Object.keys(schema)) {
      if (typeof schema[key] === "object" && schema[key] !== null) {
        await this.collectComponentUsage(schema[key], componentList, visitedRefs);
      }
    }
  }
  // 1. Detect Redundant Components
  async detectRedundantComponents(): Promise<any[]> {
    const allDefinitions = await definitionService.getAllDefinitions();
    const redundancyMap: Record<string, any[]> = {};

    for (const definition of allDefinitions) {
      const signature = JSON.stringify(definition.definition);
      if (!redundancyMap[signature]) {
        redundancyMap[signature] = [];
      }
      redundancyMap[signature].push({ name: definition.name, version: definition.version });
    }

    return Object.values(redundancyMap).filter(group => group.length > 1);
  }

  // 2. Analyze Component Versions
  async analyzeComponentVersions(componentName: string): Promise<Record<string, number>> {
    const allDefinitions = await definitionService.getAllDefinitions();
    const versionMap: Record<string, number> = {};

    for (const definition of allDefinitions) {
      if (definition.name === componentName) {
        const version = definition.version;
        if (!versionMap[version]) {
          versionMap[version] = 0;
        }
        versionMap[version] += 1;
      }
    }

    return versionMap;
  }

  // 3. Circular Dependency Checker
  async detectCircularDependencies(): Promise<string[]> {
    const allDefinitions = await definitionService.getAllDefinitions();
    const circularDependencies: string[] = [];

    for (const definition of allDefinitions) {
      const visitedRefs = new Set<string>();
      try {
        await this.collectComponentUsage(definition.definition, [], visitedRefs);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('Circular reference detected')) {
            circularDependencies.push(`Circular dependency in definition: ${definition.name} version: ${definition.version}`);
          }
        } else {
          console.error('Unknown error:', error);
        }
      }
    }
    return circularDependencies;
  }

  // 4. Find Unused Components
  async findUnusedComponents(): Promise<any[]> {
    const allDefinitions = await definitionService.getAllDefinitions();
    const allSchemas = await schemaService.getAllSchemas(); // Fetch all schemas
    const usedDefinitions = new Set<string>(); // A set to track used definitions

    // Helper function to collect all definitions used in a schema or definition
    const collectUsedDefinitions = async (schema: any) => {
      if (typeof schema !== "object" || schema === null) return;

      if (schema.$ref) {
        const [refType, refName, refVersion] = this.parseRef(schema.$ref);
        if (refType === "definitions") {
          usedDefinitions.add(`${refName}_${refVersion}`);
        }
      }

      // Recursively handle composition schemas (allOf, oneOf, anyOf)
      if (schema.allOf) {
        for (const subSchema of schema.allOf) {
          await collectUsedDefinitions(subSchema);
        }
      }

      if (schema.oneOf) {
        for (const subSchema of schema.oneOf) {
          await collectUsedDefinitions(subSchema);
        }
      }

      if (schema.anyOf) {
        for (const subSchema of schema.anyOf) {
          await collectUsedDefinitions(subSchema);
        }
      }

      // Traverse all properties recursively
      for (const key of Object.keys(schema)) {
        if (typeof schema[key] === "object" && schema[key] !== null) {
          await collectUsedDefinitions(schema[key]);
        }
      }
    };

    // Step 1: Collect all definitions used in schemas
    for (const schema of allSchemas) {
      await collectUsedDefinitions(schema.definition);
    }

    // Step 2: Collect all definitions used in other definitions
    for (const definition of allDefinitions) {
      await collectUsedDefinitions(definition.definition);
    }

    // Step 3: Find unused definitions by comparing all definitions to used ones
    const unusedDefinitions = allDefinitions.filter(
      (definition) => !usedDefinitions.has(`${definition.name}_${definition.version}`)
    );

    return unusedDefinitions.map((definition) => ({
      name: definition.name,
      version: definition.version,
    }));
  }

  // 5. Analyze Component Impact
  async analyzeComponentImpact(componentName: string, componentVersion: string): Promise<any[]> {
    const allSchemas = await schemaService.getAllSchemas(); // Fetch all schemas
    const allDefinitions = await definitionService.getAllDefinitions(); // Fetch all definitions
    const impactReport = [];

    // Helper function to check if a component is used in a schema/definition
    const checkComponentUsage = async (schema: any): Promise<boolean> => {
      if (typeof schema !== "object" || schema === null) return false;

      if (schema.$ref) {
        const [refType, refName, refVersion] = this.parseRef(schema.$ref);
        if (refType === "definitions" && refName === componentName && refVersion === componentVersion) {
          return true; // Component is found
        }
      }

      // Recursively handle composition schemas (allOf, oneOf, anyOf)
      if (schema.allOf) {
        for (const subSchema of schema.allOf) {
          if (await checkComponentUsage(subSchema)) return true;
        }
      }

      if (schema.oneOf) {
        for (const subSchema of schema.oneOf) {
          if (await checkComponentUsage(subSchema)) return true;
        }
      }

      if (schema.anyOf) {
        for (const subSchema of schema.anyOf) {
          if (await checkComponentUsage(subSchema)) return true;
        }
      }

      // Traverse all properties recursively
      for (const key of Object.keys(schema)) {
        if (typeof schema[key] === "object" && schema[key] !== null) {
          if (await checkComponentUsage(schema[key])) return true;
        }
      }

      return false; // Component is not found
    };

    // Step 1: Check all schemas for component usage
    for (const schema of allSchemas) {
      if (await checkComponentUsage(schema.definition)) {
        impactReport.push({
          schemaName: schema.name,
          schemaVersion: schema.version,
          impact: `Changes in ${componentName} v${componentVersion} will affect this schema.`,
        });
      }
    }

    // Step 2: Check all definitions for component usage
    for (const definition of allDefinitions) {
      if (await checkComponentUsage(definition.definition)) {
        impactReport.push({
          definitionName: definition.name,
          definitionVersion: definition.version,
          impact: `Changes in ${componentName} v${componentVersion} will affect this definition.`,
        });
      }
    }

    return impactReport;
  }

  // 6. Component Usage Frequency Analysis
  async componentUsageFrequency(): Promise<any[]> {
    const allDefinitions = await definitionService.getAllDefinitions();
    const allSchemas = await schemaService.getAllSchemas();
    const usageFrequency: Record<string, number> = {};

    // Helper function to increment usage for a definition
    const incrementUsage = (definitionName: string) => {
      if (!usageFrequency[definitionName]) {
        usageFrequency[definitionName] = 0;
      }
      usageFrequency[definitionName] += 1;
    };

    // Helper function to recursively scan schema or definition for references
    const scanForComponentUsage = async (schema: any) => {
      if (typeof schema !== "object" || schema === null) return;

      if (schema.$ref) {
        const [refType, refName] = this.parseRef(schema.$ref);
        if (refType === "definitions") {
          incrementUsage(refName);
        }
      }

      // Recursively handle composition schemas (allOf, oneOf, anyOf)
      if (schema.allOf) {
        for (const subSchema of schema.allOf) {
          await scanForComponentUsage(subSchema);
        }
      }

      if (schema.oneOf) {
        for (const subSchema of schema.oneOf) {
          await scanForComponentUsage(subSchema);
        }
      }

      if (schema.anyOf) {
        for (const subSchema of schema.anyOf) {
          await scanForComponentUsage(subSchema);
        }
      }

      // Traverse all properties recursively
      for (const key of Object.keys(schema)) {
        if (typeof schema[key] === "object" && schema[key] !== null) {
          await scanForComponentUsage(schema[key]);
        }
      }
    };

    // Step 1: Scan through all schemas
    for (const schema of allSchemas) {
      await scanForComponentUsage(schema.definition);
    }

    // Step 2: Scan through all definitions
    for (const definition of allDefinitions) {
      await scanForComponentUsage(definition.definition);
    }

    // Step 3: Return sorted list of components based on frequency
    return Object.entries(usageFrequency).sort((a, b) => b[1] - a[1]);
  }

  // 7. Deprecate Component
  async deprecateComponent(name: string, version: string): Promise<void> {
    // Step 1: Check if the component exists
    const component = await definitionService.getDefinitionByNameAndVersion(name, version);
    if (!component) {
      throw new Error(`Component ${name} v${version} not found.`);
    }

    // Step 2: Deprecate the component using `findOneAndUpdate`
    await definitionService.updateDefinition(name, version, { deprecated: true }, 'System');

    console.log(`Component ${name} v${version} has been marked as deprecated.`);

    // Step 3: Find all schemas that are using this component
    const allSchemas = await schemaService.getAllSchemas(); // Assuming you have a way to retrieve all schemas
    const schemasUsingComponent = [];

    for (const schema of allSchemas) {
      const componentUsage = await this.listComponentUsage(schema.name, schema.version);
      const isUsingComponent = componentUsage.some(
        (comp) => comp.name === name && comp.version === version
      );

      if (isUsingComponent) {
        schemasUsingComponent.push(schema);
        console.log(`Schema ${schema.name} v${schema.version} is using deprecated component ${name} v${version}`);
      }
    }

    if (schemasUsingComponent.length === 0) {
      console.log(`No schemas are using deprecated component ${name} v${version}`);
    }
  }

  // 8. Compare Component Versions
  async compareComponentVersions(name: string, version1: string, version2: string): Promise<any> {
    // Fetch both versions of the component
    const componentV1 = await definitionService.getDefinitionByNameAndVersion(name, version1);
    const componentV2 = await definitionService.getDefinitionByNameAndVersion(name, version2);

    // If either version is missing, throw an error
    if (!componentV1) {
      throw new Error(`Component ${name} version ${version1} not found.`);
    }
    if (!componentV2) {
      throw new Error(`Component ${name} version ${version2} not found.`);
    }

    // Convert the definitions to JSON for comparison
    const version1JSON = JSON.stringify(componentV1.definition, null, 2);
    const version2JSON = JSON.stringify(componentV2.definition, null, 2);

    // Generate the diff between the two versions
    const diffResult = this.diff(version1JSON, version2JSON);

    // Return both versions and the diff
    return {
      version1: version1JSON,
      version2: version2JSON,
      diff: diffResult
    };
  }

  // 9. Get Audit Trail for Component
async getAuditTrail(componentName: string, componentVersion: string): Promise<any> {
  // Fetch the component by name and version
  const component = await definitionService.getDefinitionByNameAndVersion(componentName, componentVersion);
  
  // If the component is not found, throw an error
  if (!component) {
    throw new Error(`Component ${componentName} v${componentVersion} not found.`);
  }

  // Check if the auditLog field exists
  if (!component.auditLog || component.auditLog.length === 0) {
    return `No audit trail found for ${componentName} v${componentVersion}.`;
  }

  // Return the audit log
  return component.auditLog;
}

  /**
   * @description Compares two JSON objects and returns the difference between them.
   * @param {string} v1 - The first version in JSON string format.
   * @param {string} v2 - The second version in JSON string format.
   * @returns {any} - The difference between the two versions.
   */
  private diff(v1: string, v2: string): any {
    // Basic diff implementation - you could use a diff library here if needed
    const obj1 = JSON.parse(v1);
    const obj2 = JSON.parse(v2);

    const changes: Record<string, any> = {};

    for (const key in obj1) {
      if (obj1[key] !== obj2[key]) {
        changes[key] = { version1: obj1[key], version2: obj2[key] };
      }
    }

    for (const key in obj2) {
      if (!(key in obj1)) {
        changes[key] = { version1: undefined, version2: obj2[key] };
      }
    }

    return changes;
  }
}
