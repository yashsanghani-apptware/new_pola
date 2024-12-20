// src/models/resourceEvent.ts

import mongoose, { Schema, Document } from 'mongoose';
import { Event } from './types';

/**
 * Mongoose schema for the ResourceEvent model.
 */
const ResourceEventSchema: Schema = new Schema({
  resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true }, // Reference to Resource
  ari: { type: String, required: true, index: true }, // Index on ARI for quick lookups
  eventType: { type: String, required: true },
  eventName: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  timestamp: { type: Date, required: true },
  context: { type: Object }, // Context-specific data
  attr: { type: Map, of: Schema.Types.Mixed },
});

/**
 * Mongoose model for interacting with the `ResourceEvent` collection.
 */
export const ResourceEvent = mongoose.model<Event>('ResourceEvent', ResourceEventSchema);