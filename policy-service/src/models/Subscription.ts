// src/models/subscription.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the Subscription Category interface
export interface ISubscriptionCategory extends Document {
  name: string; // Name of the subscription category (e.g., 'Deal Announcements & Updates')
  description: string; // Description of what the category is about
  action: string; // Action to be taken when the category is subscribed
  createdAt: Date; // When the category was created
  updatedAt: Date; // When the category was last updated
}

// Define the Subscription interface
export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;                  // Reference to the user
  categoryId: mongoose.Types.ObjectId;               // Reference to the Subscription Category
  isSubscribed: boolean;                              // Whether the user is subscribed or not
  updatedAt: Date;                                   // Date when the subscription was last updated
}

// Schema definition for Subscription Categories
const SubscriptionCategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  action: { type: String, required: true },
}, { timestamps: true });

// Schema definition for Subscriptions
const SubscriptionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'SubscriptionCategory', required: true },
  isSubscribed: { type: Boolean, required: true, default: false },
}, { timestamps: true });

// Export the models for Subscription and SubscriptionCategory
export const SubscriptionCategory = mongoose.model<ISubscriptionCategory>('SubscriptionCategory', SubscriptionCategorySchema);
export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
