import { SchemaResolver } from "./schemaResolver";
import { schemaService } from "./schemaService";

// Mock schemaService to simulate schema retrieval
schemaService.getSchema = async (name: string, version: string) => {
  const schemas: Record<string, any> = {
    "BaseUserSchema/1.0": {
      schemaRecord: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
        },
        required: ["id", "name"],
      },
    },
    "AddressSchema/1.0": {
      schemaRecord: {
        type: "object",
        properties: {
          street: { type: "string" },
          city: { type: "string" },
        },
        required: ["street", "city"],
      },
    },
    "UserSchema/1.0": {
      schemaRecord: {
        allOf: [
          { $ref: "BaseUserSchema/1.0" },
          {
            type: "object",
            properties: {
              email: { type: "string" },
              address: { $ref: "AddressSchema/1.0" },
            },
            required: ["email"],
          },
        ],
      },
    },
  };

  return schemas[`${name}/${version}`] || null;
};

// Example program to test SchemaResolver
(async () => {
  const schemaResolver = new SchemaResolver();

  try {
    const resolvedSchema = await schemaResolver.resolveSchema("UserSchema", "1.0");

    console.log("Resolved Schema:");
    console.log(JSON.stringify(resolvedSchema, null, 2));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error resolving schema:", error.message);
    } else {
      console.error("Unknown error occurred");
    }
  }
})();

