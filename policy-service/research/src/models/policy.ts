// src/models/policy.ts

// Import necessary modules from mongoose
import { Schema, Document, model } from 'mongoose';

// Import types used within the Policy model for strong typing
import {
  Metadata, PrincipalPolicy, ResourcePolicy, DerivedRole, ExportVariable, RolePolicy, GroupPolicy, AuditInfo
} from './types';

// The Policy interface defines the structure of a policy document within the system.
// This interface ensures that each field in the policy model is properly typed,
// providing strong typing and consistency throughout the application.
export interface Policy extends Document {
  apiVersion: string;                   // The API version that this policy conforms to (required)
  name: string;                         // The name of the policy (optional)
  description?: string;                 // Optional description providing a human-readable explanation of the policy
  metadata?: Metadata;                  // Optional metadata for the policy, such as annotations, labels, etc.
  principalPolicy?: PrincipalPolicy;    // Optional policy defining rules for principals (e.g., users, groups, roles)
  resourcePolicy?: ResourcePolicy;      // Optional policy defining rules for resources (e.g., services, endpoints)
  derivedRoles?: DerivedRole;           // Optional field for derived roles associated with this policy
  exportVariables?: ExportVariable;     // Optional variables that may be exported by the policy for external use
  rolePolicy?: RolePolicy;              // Optional policy defining rules for roles
  groupPolicy?: GroupPolicy;            // Optional policy defining rules for groups
  disabled?: boolean;                   // Flag indicating whether the policy is disabled (optional)
  auditInfo: AuditInfo;                 // Audit information tracking creation and updates of the policy (required)
}

// Define the Policy Schema for MongoDB, mapping the Policy interface to the database
const PolicySchema = new Schema<Policy>({
  apiVersion: { 
    type: String, 
    required: true, 
    default: "api.pola.dev/v1"         // The default API version used if not explicitly provided
  },
  name: { 
    type: String, 
    required: false                      // Optional name to name the policy for easy reference
  },
  description: { 
    type: String, 
    required: false                      // Optional description to clarify the purpose or context of the policy
  },
  metadata: { 
    type: Object, 
    required: false                      // Optional metadata, following the Metadata type definition
  },
  principalPolicy: { 
    type: Object, 
    required: false                      // Optional field for principal policies
  },
  resourcePolicy: { 
    type: Object, 
    required: false                      // Optional field for resource policies
  },
  derivedRoles: { 
    type: Object, 
    required: false                      // Optional field for derived roles
  },
  exportVariables: { 
    type: Object, 
    required: false                      // Optional field for exportable variables
  },
  rolePolicy: { 
    type: Object, 
    required: false                      // Optional field for role policies
  },
  groupPolicy: { 
    type: Object, 
    required: false                      // Optional field for group policies
  },
  disabled: { 
    type: Boolean, 
    required: false                      // Optional flag to indicate if the policy is inactive or disabled
  },
  auditInfo: {
    createdBy: { 
      type: String, 
      required: true                      // ID of the user or system that created the policy (required)
    },
    createdAt: { 
      type: Date, 
      default: Date.now                   // Timestamp of when the policy was created, defaults to the current time
    },
    updatedBy: { 
      type: String, 
      required: false                     // ID of the user or system that last updated the policy (optional)
    },
    updatedAt: { 
      type: Date, 
      required: false                     // Timestamp of the last update, to be set when the policy is modified
    },
  },
});

// Indexing for the Policy Schema

// Index on apiVersion for efficient version-based queries
PolicySchema.index({ apiVersion: 1 });

// Index on name for fast lookups by policy name
PolicySchema.index({ name: 1 });

// Index on disabled for quick retrieval of active policies
PolicySchema.index({ disabled: 1 });

// Compound index on createdBy and createdAt for efficient filtering and sorting
PolicySchema.index({ 'auditInfo.createdBy': 1, 'auditInfo.createdAt': -1 });

// Text index on description to allow full-text search
PolicySchema.index({ description: 'text' });

// Compound index on rolePolicy, groupPolicy, and principalPolicy for optimized access control queries
PolicySchema.index({
  rolePolicy: 1,
  groupPolicy: 1,
  principalPolicy: 1,
});

// Create and export the Policy model
// This model corresponds to the 'Policy' collection in MongoDB and can be used to interact with policy documents
const PolicyModel = model<Policy>('Policy', PolicySchema);

export default PolicyModel;

