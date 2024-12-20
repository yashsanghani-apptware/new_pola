import mongoose, { Schema, Document } from 'mongoose';

export interface IAccreditation extends Document {
  title: string; // Title of the accreditation
}

// Schema definition for the IAccreditation interface
const AccreditationSchema: Schema = new Schema({
  title: { type: String, required: true }, // Title is mandatory
});

// Export the Mongoose model for the Accreditation schema
export const Accreditation = mongoose.model<IAccreditation>('Accreditation', AccreditationSchema);
