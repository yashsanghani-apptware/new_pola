// src/models/beneficiary.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the Beneficiary type
export type BeneficiaryType = 'us-person' | 'non-us-person' | 'trust' | 'entities';

// Define the Beneficiary interface
export interface IBeneficiary extends Document {
    userId: mongoose.Types.ObjectId;            // Reference to the user
    type: BeneficiaryType;                       // Type of the beneficiary
    firstName: string;                           // First name of the beneficiary
    lastName: string;                            // Last name of the beneficiary
    email: string;                               // Email of the beneficiary
    phone: string;                               // Phone number of the beneficiary
    dateOfBirth: Date;                           // Date of birth of the beneficiary
    address: {
        street: string;
        locality: string;
        region: string;
        postalCode: string;
        country: string;
    };                                          // Address of the beneficiary
    socialSecurityNumber?: string;               // Optional SSN for applicable beneficiary types
    acceptTermsAndConditions: boolean;           // Field to accept terms and conditions
    relationship?: string;                       // Optional relationship to the user
    isContingent: boolean;                       // Whether the beneficiary is contingent
    isDeleted: boolean;                          // Whether the beneficiary is deleted
    isNonUSPerson: boolean;                      // Whether the beneficiary is a non-US person
    nonUSPersonDetails?: {
        countryOfCitizenship?: string;
        countryOfResidency?: string;
    };                                          // Optional non-US person details
    isEntity: boolean;                          // Whether the beneficiary is an entity
    entityDetails?: {
        signatoryTitle: string;
        entityName: string;
        entityType: string;
        entityEIN: string;
        entityJurisdiction: string;
    }
    isTrust: boolean;                           // Whether the beneficiary is a trust
    trustDetails?: {
        trustType: string;
        trustName: string;
        ssnOrItin: string;
        dateOfFormation: Date;
        isEIN: boolean;
        trustEIN: string;
    }

}

// Schema definition for Beneficiaries
const BeneficiarySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['us-person', 'non-us-person', 'trust', 'entities'], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: {
        street: { type: String, required: true },
        locality: { type: String, required: true },
        region: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    socialSecurityNumber: { type: String },
    acceptTermsAndConditions: { type: Boolean, required: true },
    relationship: { type: String },
    isContingent: { type: Boolean, required: true },
    isDeleted: { type: Boolean, default: false },
    isNonUSPerson: { type: Boolean, default: false },
    nonUSPersonDetails: {
        countryOfCitizenship: { type: String },
        countryOfResidency: { type: String }
    },
    isEntity: { type: Boolean, default: false },
    entityDetails: {
        signatoryTitle: { type: String },
        entityName: { type: String },
        entityType: { type: String },
        entityEIN: { type: String },
        entityJurisdiction: { type: String },
    },
    isTrust: { type: Boolean, default: false },
    trustDetails: {
        trustType: { type: String },
        trustName: { type: String },
        ssnOrItin: { type: String },
        dateOfFormation: { type: Date },
        isEIN: { type: Boolean },
        trustEIN: { type: String },
    }
}, { timestamps: true });

// Export the model for Beneficiaries
export const Beneficiary = mongoose.model<IBeneficiary>('Beneficiary', BeneficiarySchema);
