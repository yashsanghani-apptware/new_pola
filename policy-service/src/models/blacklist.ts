import mongoose, { Schema, Document } from 'mongoose';

export interface IBlacklist extends Document {
  id: string; // UserId or ResourceId
  type: 'User' | 'Resource'; // Distinguish between user and resource blacklists
  reason: string; // Reason for blacklisting
  attr: { [key: string]: any };
  createdBy: string;
  effectiveUntil: Date;
  status: 'ACTIVE' | 'EXPIRED';
  createdAt: Date;
}

const BlacklistSchema: Schema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['User', 'Resource'], required: true },
  reason: { type: String, required: true }, 
  attr: { type: Map, of: Schema.Types.Mixed, required: true },
  createdBy: { type: String, required: true },
  effectiveUntil: { type: Date, required: true },
  status: { type: String, enum: ['ACTIVE', 'EXPIRED'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Blacklist = mongoose.model<IBlacklist>('Blacklist', BlacklistSchema);

