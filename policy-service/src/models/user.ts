// src/models/user.ts

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// The IAddress interface defines the structure for an address, 
// encapsulating various address-related attributes.
export interface IAddress {
  streetAddress: string;         // Street address of the user's residence
  addressLocality: string;       // Locality (e.g., city) of the user's residence
  addressRegion: string;         // Region (e.g., state or province) of the user's residence
  postalCode: string;            // Postal code of the user's residence
  addressCountry: string;        // Country of the user's residence
}

// The IContactPoint interface defines the structure for a contact point, 
// encapsulating communication-related attributes like telephone and email.
export interface IContactPoint {
  telephone: string;             // Primary telephone number for the user
  contactType: string;           // Type of contact (e.g., work, home, mobile)
  email: string;                 // Email address associated with this contact point
}


// The IUser interface defines the structure of a user document within
// the system. A user represents an individual entity with personal
// information, roles, group memberships, and custom attributes.
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId,
  firstName: string;                          // First name of the user
  lastName: string;                           // Last name of the user
  familyName: string;                         // Family (last) name of the user
  email: string;                              // Email address of the user
  telephone: string;                          // Primary contact telephone number for the user
  jobTitle?: string;                          // Job title of the user (optional)
  username: string;                           // Username for authentication
  password: string;                           // Hashed password for authentication
  dateOfBirth: Date;                          // Date of birth of the user
  address: IAddress;                          // Address details of the user (embedded document)
  contactPoint: IContactPoint;                // Contact point details (embedded document)
  groups?: mongoose.Types.ObjectId[];         // References to groups the user is a part of
  roles?: mongoose.Types.ObjectId[];          // References to roles assigned to the user
  policies?: mongoose.Types.ObjectId[];       // References to policies associated with the user
  baneficiaries?: mongoose.Types.ObjectId[];  // References to beneficiaries associated with the user  
  organization?: string;                      // Reference to the organization the user belongs to
  picture?: string;                           // URL of the user's profile picture
  isSocialLoagin?: boolean;                   // Flag to indicate social login
  socialLoginProvider?: string;               // Provider used for social login
  isEmailVerified?: boolean;                  // Flag to indicate email verification
  isAccredited?: boolean;                     // Flag to indicate accreditation
  accreditationList?: string[];              // List of accredited organizations
  attr: { [key: string]: any };               // Custom attributes (key-value pairs) for extensibility
}

// Schema definition for the IAddress interface, used to store
// address-related information within the User schema.
const AddressSchema: Schema = new Schema({
  streetAddress: { type: String },         // Street address is required
  addressLocality: { type: String },       // Locality (e.g., city) is required
  addressRegion: { type: String },         // Region (e.g., state or province) is required
  postalCode: { type: String },            // Postal code is required
  addressCountry: { type: String },        // Country is required
});

// Schema definition for the IContactPoint interface, used to store
// contact-related information within the User schema.
const ContactPointSchema: Schema = new Schema({
  telephone: { type: String, required: true },             // Telephone number is required
  contactType: { type: String, required: true },           // Contact type (e.g., work, home, mobile) is required
  email: { type: String, required: true, match: /.+\@.+\..+/ }, // Email must be valid and is required
});

// Schema definition for the IUser interface. Defines how user
// information is structured and stored in the database.
const UserSchema: Schema = new Schema({
  firstName: { type: String },                  // First name is required
  lastName: { type: String},                   // Last name is required
  familyName: { type: String, required: false },                // Family name
  email: { type: String, required: true, match: /.+\@.+\..+/ }, // Valid email address is required
  telephone: { type: String, required: false },                  // Telephone number is required
  jobTitle: { type: String },                                   // Job title is optional
  username: { type: String, required: true },                   // Username is required
  password: { type: String, required: false },                  
  dateOfBirth: { type: Date, required: false },                  // Date of birth is required
  address: { type: AddressSchema, required: false },            // Address details are optional
  contactPoint: { type: ContactPointSchema, required: false },   
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group', default: [] }], // References to group memberships
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role', default: [] }],   // References to assigned roles
  policies: [{ type: Schema.Types.ObjectId, ref: 'Policy' }],   // References to associated policies
  baneficiaries: [{ type: Schema.Types.ObjectId, ref: 'Beneficiary' }],
  organization: { type: String, required: false, match: /^[a-f\d]{24}$/ }, // Organization reference is optional
  picture: { type: String },                                           // Profile picture URL is optional
  isSocialLoagin: { type: Boolean, required: false, default: false },  // Social login flag
  socialLoginProvider: { type: String, required: false },            // Provider used for social login
  isEmailVerified: { type: Boolean, required: false, default: false }, // Email verification flag
  isAccredited: { type: Boolean, required: false, default: false },   // Accreditation flag
  accreditationList: { type: [String], required: false },            // List of accredited organizations
  attr: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true,
    default: { version: '1.1' },  // Setting a default version for custom attributes
  },
});

// Pre-save middleware to hash the password before saving the user
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next();  // Proceed to the next middleware
});

// Index for fast lookup by email, ensuring email addresses are unique
UserSchema.index({ email: 1 }, { unique: true });

// Index for fast lookup by username, ensuring usernames are unique
UserSchema.index({ username: 1 }, { unique: true });

// Index for fast lookup by organization and group memberships
UserSchema.index({ organization: 1 });
UserSchema.index({ groups: 1 });

// Add a compound index on `organization` and `roles` to optimize queries
UserSchema.index({ organization: 1, roles: 1 });

// Export the mongoose model for the IUser schema, allowing interaction
// with the 'User' collection in MongoDB.
export const User = mongoose.model<IUser>('User', UserSchema);

