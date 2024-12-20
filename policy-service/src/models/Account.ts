import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user
  accountType: 'Individual' | 'Entity' | 'Trust'; // Type of account
  details: {
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    address: {
      street: string;
      locality: string;
      region: string;
      postalCode: string;
      country: string;
    };
    differentAddress: {
      street: string;
      locality: string;
      region: string;
      postalCode: string;
      country: string;
    };
    socialSecurityNumber?: string; // Only for individuals
    entityDetails?: {
      // Only for Entity accounts
      entityName: string;
      entityType: string;
      ein: string; // Employer Identification Number
      jurisdiction: string; // Jurisdiction
      dateOfFormation: Date;
      signatoryTitle: string
      deliveryAddressDifferent: boolean;
      deliveryAddress?: {
        street: string;
        locality: string;
        region: string;
        postalCode: string;
        country: string;
      };
    };
    trustDetails?: {
      // Enhanced Trust Details
      trustName: string;
      trustType: 'Revocable' | 'Irrevocable';
      hasEIN: boolean;
      ein?: string;
      trusteeIsGrantor: boolean;
      grantors: {
        firstName: string;
        lastName: string;
        email: string;
        dateOfBirth: Date;
        phone: string;
        ssnOrItin?: string;
        address: {
          street: string;
          locality: string;
          region: string;
          postalCode: string;
          country: string;
        };
      }[];
      hasMultipleGrantors: boolean;
      deliveryAddressDifferent: boolean;
      deliveryAddress?: {
        street: string;
        locality: string;
        region: string;
        postalCode: string;
        country: string;
      };
    };
    isJoint?: boolean; // Indicates if it's a joint account
    jointHolderDetails?: {
      // Details for joint accounts
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: Date;
      address: {
        street: string;
        locality: string;
        region: string;
        postalCode: string;
        country: string;
      };
      socialSecurityNumber: string;
    };
    concentAndDiscloses: boolean;
    certify: boolean;

  };
  isDeleted: boolean;
}

const AccountSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accountType: {
      type: String,
      enum: ['Individual', 'Self-Directed IRA', 'Entity', 'Trust'],
      required: true,
    },
    details: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      dateOfBirth: { type: Date },
      address: {
        street: { type: String, required: true },
        locality: { type: String, required: true },
        region: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
      },
      differentAddress: {
        street: { type: String },
        locality: { type: String },
        region: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
      socialSecurityNumber: { type: String },
      entityDetails: {
        entityName: { type: String },
        entityType: { type: String },
        ein: { type: String },
        jurisdiction: { type: String },
        dateOfFormation: { type: Date },
        signatoryTitle: { type: String },
        deliveryAddressDifferent: { type: Boolean, default: false },
        deliveryAddress: {
          street: { type: String },
          locality: { type: String },
          region: { type: String },
          postalCode: { type: String },
          country: { type: String },
        },
      },
      trustDetails: {
        trustName: { type: String },
        trustType: { type: String, enum: ['Revocable', 'Irrevocable'] },
        hasEIN: { type: Boolean, default: false },
        ein: { type: String },
        trusteeIsGrantor: { type: Boolean, default: false },
        grantors: [
          {
            firstName: { type: String },
            lastName: { type: String },
            email: { type: String },
            dateOfBirth: { type: Date },
            phone: { type: String },
            ssnOrItin: { type: String },
            address: {
              street: { type: String },
              locality: { type: String },
              region: { type: String },
              postalCode: { type: String },
              country: { type: String },
            },
          },
        ],
        hasMultipleGrantors: { type: Boolean, default: false },
        deliveryAddressDifferent: { type: Boolean, default: false },
        deliveryAddress: {
          street: { type: String },
          locality: { type: String },
          region: { type: String },
          postalCode: { type: String },
          country: { type: String },
        },
      },
      isJoint: { type: Boolean, default: false },
      jointHolderDetails: {
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String },
        phone: { type: String },
        dateOfBirth: { type: Date },
        address: {
          street: { type: String },
          locality: { type: String },
          region: { type: String },
          postalCode: { type: String },
          country: { type: String },
        },
        socialSecurityNumber: { type: String },
      },
      concentAndDiscloses: { type: Boolean, default: false },
      certify: { type: Boolean, default: false },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Account = mongoose.model<IAccount>('Account', AccountSchema);
