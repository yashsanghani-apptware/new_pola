// src/model/eventPolicy.ts
import { Schema, Document, model } from 'mongoose';
import { EventPolicy } from './types'


const EventPolicySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  resource: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
    match: /^[0-9]+(\.[0-9]+)*$/, // Pattern to match version format like "1.0" or "2.1.3"
  },
  rules: {
    type: [Object],
    required: true,
  },
  scope: {
    type: String,
    match: /^([0-9A-Za-z][\-0-9A-Z_a-z]*(\.[\-0-9A-Z_a-z]*)*)*$/, // Regex pattern to match scope
  },
  variables: {
    type: Schema.Types.Mixed, // Assuming VariablesSchema is used here in actual code
  },
  auditInfo: {
    type: Schema.Types.Mixed, // Assuming AuditInfoSchema is used here in actual code
    required: true,
  },
  apiVersion: {
    type: String,
    required: true,
    enum: ['api.pola.dev/v2.5'], // Ensuring it matches the expected API version
  },
});


// Export the model
export const EventPolicyModel= model<EventPolicy>('EventPolicy', EventPolicySchema);

