// src/models/exportVariable.ts

// Import necessary modules from mongoose
import { Schema, Document, model } from 'mongoose';

// Define the ExportVariable interface that extends the Mongoose Document interface
// This interface provides strong typing for the ExportVariable model, ensuring that 
// each field is properly typed

interface ExportVariable extends Document {
  name: string;                             // The name of the exported variable (required)
  definitions?: { [key: string]: string };  // Optional key-value pairs defining the variable's contents or purpose
}

// Define the ExportVariable Schema for MongoDB, mapping the ExportVariable interface to the database

const ExportVariableSchema = new Schema<ExportVariable>({
  name: { 
    type: String, 
    required: true          // The name field is mandatory, specifying the name of the export variable
  },
  definitions: { 
    type: Object, 
    required: false         // The definitions field is optional, used to store key-value pairs 
                            // that define the variable's contents or purpose
  },
});

// Create and export the ExportVariable model
// This model corresponds to the 'ExportVariable' collection in MongoDB and can be used 
// to interact with export variable documents

const ExportVariableModel = model<ExportVariable>('ExportVariable', ExportVariableSchema);

export default ExportVariableModel;

