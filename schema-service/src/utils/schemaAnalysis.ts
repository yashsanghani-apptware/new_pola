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

  try {
    // Example of composing a self-contained schema
    const selfContainedSchema = await schemaAnalyst.composeSelfContainedSchema(
      "policy",
      "2.7"
    );
    console.log("Self-contained schema:", JSON.stringify(selfContainedSchema, null, 2));

    const components = await schemaAnalyst.listComponentUsage("policy", "2.7");
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

