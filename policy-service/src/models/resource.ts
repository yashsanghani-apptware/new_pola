// src/models/resource.ts

import mongoose, { Schema, Document } from 'mongoose';
import { Action, ResourceRule, Event, Variables, Context, Alert } from './types';

/**
 * Interface representing the tagging options for a resource.
 * This allows for defining how the resource can be tagged, whether
 * tagging is allowed at creation or later, and whether system tags
 * from CloudFormation are included.
 *
 * @interface ITagging
 */
export interface ITagging {
  /**
   * Indicates whether the resource can be tagged.
   * @type {boolean}
   */
  taggable?: boolean;

  /**
   * Determines if tags should be applied when the resource is created.
   * @type {boolean}
   */
  tagOnCreate?: boolean;

  /**
   * Specifies if tags can be updated after resource creation.
   * @type {boolean}
   */
  tagUpdatable?: boolean;

  /**
   * The property path where tags are stored.
   * @type {string}
   */
  tagProperty?: string;
}

/**
 * Interface representing the handler configuration for resource operations.
 * Handlers define the permissions required to perform an operation
 * and the timeout for the operation.
 *
 * @interface IHandlers
 */
export interface IHandlers {
  /**
   * A list of required permissions for the operation.
   * @type {string[]}
   */
  permissions: string[];

  /**
   * The timeout duration for the operation, in minutes.
   * @type {number}
   */
  timeoutInMinutes: number;
}

/**
 * Interface representing a resource document in MongoDB.
 * This defines the structure and properties of a resource,
 * including identifiers, descriptions, properties, handlers,
 * and policies associated with the resource.
 *
 * @interface IResource
 * @extends {Document}
 */
export interface IResource extends Document {
  /**
   * The unique identifier for the resource document.
   * @type {mongoose.Types.ObjectId}
   */
  _id: mongoose.Types.ObjectId;

  /**
   * The type name of the resource, following a specific format.
   * format: ServiceName::ResourceType::ResourceName
   * example: drs::dataroom:farm240
   * @type {string}
   */
  typeName: string;

  /**
   * The name of the resource.
   * @type {string}
   */
  name: string;

  /**
   * The Agsiri Resource Identifier (ARI) for the resource.
   * @type {string}
   * format: ari:serivice:region:client-id:resource-type:resource-id
   * example: ari:drs:us:12812121-1:dataroom:MyUniqueId => this constitutes 
   * the globally unique name for the resource
   */
  ari: string;

  /**
   * A brief description of the resource.
   * @type {string}
   */
  description: string;

  /**
   * The source URL where the resource originated from.
   * @type {string}
   */
  sourceUrl?: string;

  /**
   * The URL pointing to the resource's documentation.
   * @type {string}
   */
  documentationUrl?: string;

  /**
   * The strategy for resource replacement, either "create_then_delete" or "delete_then_create".
   * @type {string}
   */
  replacementStrategy?: string;

  /**
   * The tagging options for the resource.
   * @type {ITagging}
   */
  tagging?: ITagging;

  /**
   * A key-value map of resource properties.
   * @type {{ [key: string]: any }}
   */
  properties: { [key: string]: any };

  /**
   * An array of required property names for the resource.
   * @type {string[]}
   */
  required: string[];

   /**
   * An array of resource rules for the resource.
   * This can be overridden by resource policies. This is optional field.
   * @type {ResourceRule[]}
   */
  rules?: ResourceRule[]; 

    /**
   * An array of actions for the resource.
   * This can be overridden by resource policies. This is optional field.
   * @type {Action[]}
   */
  actions?: Action[]; 
  
    /**
   * Alerts related to the resource. This field stores alert configurations
   * that monitor the resource's state or activities.
   * @type {Alert[]}
   */
  alerts?: Alert[];

    /**
   * Optional variables that may be used within the resource rules
   * @type {Variables}
   */
  variables?: Variables;          

  /**
   * Mapping of property names to their transformed versions.
   * @type {{ [key: string]: string }}
   */
  propertyTransform?: { [key: string]: string };

  /**
   * Operation handlers for the resource, such as create, read, update, delete, 
   * search, query, list,.
   * @type {{
   *   create: IHandlers;
   *   read: IHandlers;
   *   update: IHandlers;
   *   delete: IHandlers;
   *   search: IHandlers;
   *   query: IHandlers;
   *   list: IHandlers;
   *   publish: IHandlers;
   *   subscribe: IHandlers;
   *   notify: IHandlers;
   *   receive: IHandlers;
   * }}
   */
  handlers: {
    create: IHandlers;
    read: IHandlers;
    update: IHandlers;
    delete: IHandlers;
    search: IHandlers;
    query: IHandlers;
    list: IHandlers;
    publish: IHandlers;
    subscribe: IHandlers;
    notify: IHandlers;
    receive: IHandlers;
  };

  /**
   * An array of properties that are read-only.
   * @type {string[]}
   */
  readOnlyProperties?: string[];

  /**
   * An array of properties that are write-only.
   * @type {string[]}
   */
  writeOnlyProperties?: string[];

  /**
   * An array of properties that are only used during conditional creation.
   * @type {string[]}
   */
  conditionalCreateOnlyProperties?: string[];

  /**
   * An array of non-public property names.
   * @type {string[]}
   */
  privateProperties?: string[];

  /**
   * An array of non-public definitions.
   * @type {string[]}
   */
  privateDefinitions?: string[];

  /**
   * An array of properties that are only set during creation.
   * @type {string[]}
   */
  createOnlyProperties?: string[];

  /**
   * An array of deprecated property names.
   * @type {string[]}
   */
  deprecatedProperties?: string[];

  /**
   * An array of primary identifier property names.
   * @type {string[]}
   */
  primaryIdentifier: string[];

  /**
   * An array of additional identifier property names.
   * @type {string[]}
   */
  additionalIdentifiers?: string[];

  /**
   * A list of events associated with the resource.
   * These events can be used to monitor changes or actions on the resource.
   * @type {IResourceEvent[]}
   */
  events?: Event[];

  /**
   * Configuration settings specific to the resource type.
   * @type {{ [key: string]: any }}
   */
  configuration?: { [key: string]: any };

  /**
   * Links related to the resource, such as templates and mappings.
   * @type {{
   *   templateUri: string;
   *   mappings: string;
   * }}
   */
  resourceLink?: {
    templateUri: string;
    mappings: string;
  };

  /**
   * Custom attributes added to the resource.
   * @type {{ [key: string]: any }}
   */
  attr?: { [key: string]: any };

  /**
   * Policies linked to the resource.
   * @type {mongoose.Types.ObjectId[]}
   */
  policies?: mongoose.Types.ObjectId[];

  /**
   * Audit information, including who created or updated the resource and when.
   * @type {{
   *   createdBy: string;
   *   createdAt: Date;
   *   updatedBy?: string;
   *   updatedAt?: Date;
   * }}
   */
  auditInfo?: {
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
  };

  /**
   * The version of the resource document.
   * @type {string}
   */
  version?: string;
}

/**
 * Mongoose schema for the Resource model.
 * This schema defines the structure and constraints for the resource documents stored in MongoDB.
 */
const ResourceSchema: Schema = new Schema({
  typeName: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9_-]{2,64}::[a-zA-Z0-9_-]{2,64}::[a-zA-Z0-9_-]{2,64}$/
  },
  ari: { type: String, required: true },
  description: { type: String, required: true },
  name: { type: String, required: false },
  sourceUrl: { type: String },
  documentationUrl: { type: String },
  replacementStrategy: { type: String, enum: ["create_then_delete", "delete_then_create"] },
  tagging: {
    taggable: { type: Boolean, default: true },
    tagOnCreate: { type: Boolean, default: true },
    tagUpdatable: { type: Boolean, default: true },
    tagProperty: { type: String, default: "/properties/Tags" },
  },
  properties: { type: Map, of: Schema.Types.Mixed, required: true },
  required: { type: [String], required: true },
  propertyTransform: { type: Map, of: String },
  handlers: {
    create: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
    read: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
    update: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
    delete: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
    search: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
    query: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
    list: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
    publish: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
    subcribe: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
    notify: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
    receive: {
      permissions: { type: [String], required: true },
      timeoutInMinutes: { type: Number, default: 120, min: 2, max: 2160 },
    },
  },

  readOnlyProperties: { type: [String] },
  writeOnlyProperties: { type: [String] },
  createOnlyProperties: { type: [String] },
  deprecatedProperties: { type: [String] },
  conditionalCreateOnlyProperties: { type: [String] },
  privateProperties: { type: [String] },
  privateDefinitions: { type: [String] },
  primaryIdentifier: { type: [String], required: true },
  additionalIdentifiers: { type: [String] },
  events: [
    {
      type: [Object],
      required: false
    }
  ], 
  variables: { 
    type: Object, 
    required: false     // Optional field for defining variables specific to the policy
  },
  rules: { 
    type: [Object], 
    required: false      // The rules field is mandatory, containing an array of 
                        // ResourceRule objects that define the policy's permissions and conditions
  },
  actions: { 
    type: [Object], 
    required: false      // The rules field is mandatory, containing an array of 
                        // ResourceRule objects that define the policy's permissions and conditions
  },
  alerts: {
    type: [
    {
      enabled: { type: Boolean, required: true },
      rules: {
        condition: { type: Object, required: true },
        action: { type: String, required: true },
        severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
        output: { type: Object },
        notify: { type: Object },
      },
    }
    ],
    required: false,
    _id: false, // Mark alerts as optional by preventing automatic generation of _id for subdocuments
  },
  configuration: { type: Map, of: Schema.Types.Mixed },
  resourceLink: {
    templateUri: { type: String },
    mappings: { type: String },
  },
  attr: { type: Map, of: Schema.Types.Mixed }, // Custom attributes
  policies: [{ type: Schema.Types.ObjectId, ref: 'Policy' }], // Policies linked to the resource
  auditInfo: {
    createdBy: { type: String},
    createdAt: { type: Date, default: Date.now, required: false },
    updatedBy: { type: String },
    updatedAt: { type: Date },
  },
  version: { type: String, default: '1.0' },
});

/**
 * Pre-save hook to update the `updatedAt` field with the current date.
 * This hook ensures that every time a resource document is saved,
 * the `updatedAt` field reflects the most recent update timestamp.
 */
ResourceSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Mongoose model for interacting with the `Resource` collection.
 * This model encapsulates the schema and allows for CRUD operations on resource documents.
 */
export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

