import { schemaService } from "../services/schemaService";
import { definitionService } from "../services/definitionService";
import { SchemaAnalyst } from "../services/schemaAnalyst";
import { connectDB } from "../config/database";  // Import MongoDB connection function
import mongoose from 'mongoose';

async function shutdown() {
  console.log('Closing MongoDB connection...');
  await mongoose.connection.close(); // Gracefully close MongoDB connection
  console.log('MongoDB connection closed. Exiting...');
  process.exit(0); // Forcefully exit
}
async function main() {
  // Initialize MongoDB connection
  await connectDB();

  const schemaAnalyst = new SchemaAnalyst();

  // Example usage: Creating and resolving schemas and definitions
  try {
    const schemaData = {
      name: "policy",
      version: "2.6",
      author: "Surendra Reddy",
      description: "The Policy schema defines rules and conditions for managing resources, principals, roles, and events.",
      license: "Confidential Property of 451 Labs",
      definition: {
        $id: "http://registry.agsiri.com:8080/v1/schemas/policy/2.6",
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "Policy Schema",
        type: "object",
        required: ["apiVersion"],
        properties: {
          apiVersion: {
            type: "string",
            const: "api.pola.dev/v2.6",
          },
          matchExprList: {
            $ref: "http://registry.agsiri.com:8080/v1/definitions/matchExprList/2.6",
          },
          match: {
            $ref: "http://registry.agsiri.com:8080/v1/definitions/match/2.6",
          },
        },
      },
      category: "Policy Management",
      context: "Defines rules for managing resources, principals, and events.",
      story: "This schema describes policies used for resource access control.",
    };

    // Creating a schema using schemaService
    await schemaService.createSchema(schemaData as any); // We cast it to 'any' to bypass TypeScript type checking
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        console.log("Schema already exists.");
      } else {
        console.error(`Error creating schema: ${error.message}`);
      }
    } else {
      console.error("Unknown error occurred while creating schema");
    }
  }

  try {
    // Create the first definition (matchExprList)
    const matchExprListDefinition = {
      name: "matchExprList",
      version: "2.6",
      author: "Surendra Reddy",
      description: "Defines an expression list used in matching conditions for the policy.",
      license: "Confidential Property of 451 Labs",
      definition: {
        matchExprList: {
          type: "object",
          required: ["of"],
          additionalProperties: false,
          properties: {
            of: {
              type: "array",
              items: {
                $ref: "http://registry.agsiri.com:8080/v1/definitions/match/2.6",
              },
              minItems: 1,
            },
          },
        },
      },
      category: "Matching Logic",
      context: "Used to evaluate match conditions within policies.",
      story: "This definition provides the structure for handling lists of expressions in match-based conditions.",
    };

    await definitionService.createDefinition(matchExprListDefinition);

    // Create the second definition (match)
    const matchDefinition = {
      name: "match",
      version: "2.6",
      author: "Surendra Reddy",
      description: "Defines matching logic for the policy.",
      license: "Confidential Property of 451 Labs",
      definition: {
        match: {
          type: "object",
          required: ["all", "any", "none", "expr"],
          properties: {
            all: { $ref: "http://registry.agsiri.com:8080/v1/definitions/matchExprList/2.6" },
            any: { $ref: "http://registry.agsiri.com:8080/v1/definitions/matchExprList/2.6" },
            none: { $ref: "http://registry.agsiri.com:8080/v1/definitions/matchExprList/2.6" },
            expr: { type: "string" },
          },
        },
      },
      category: "Matching Logic",
      context: "Defines conditions for matching logic.",
      story: "This definition is used to define matching logic within policies.",
    };

    await definitionService.createDefinition(matchDefinition);

  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        console.log("Definition already exists.");
      } else {
        console.error(`Error creating definition: ${error.message}`);
      }
    } else {
      console.error("Unknown error occurred while creating definitions");
    }
  }

  try {
    // Example of composing a self-contained schema
    const selfContainedSchema = await schemaAnalyst.composeSelfContainedSchema(
      "policy",
      "2.6"
    );
    console.log("Self-contained schema:", JSON.stringify(selfContainedSchema, null, 2));

    const components = await schemaAnalyst.listComponentUsage("policy", "2.6");
    console.log("Components used in schema:", components);

     return shutdown(); // Make sure to close the connection and exit
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error composing self-contained schema: ${error.message}`);
    } else {
      console.error("Unknown error occurred while composing schema");
    }
  }
}
main()

