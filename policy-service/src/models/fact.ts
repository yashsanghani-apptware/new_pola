// src/models/Fact.ts
import mongoose, { Schema, Document } from 'mongoose';

enum FactType {
    User = 'User',
    Resource = 'Resource',
}

enum FactStatus {
    Active = 'ACTIVE',
    Expired = 'EXPIRED',
}

export interface IFact extends Document {
    objId: mongoose.Types.ObjectId;
    type: FactType;
    attr: {
        [key: string]: any;
    };
    createdAt: Date;
    createdBy: mongoose.Types.ObjectId;
    effectiveUntil: Date;
    status: FactStatus;
}

const FactSchema: Schema = new Schema({
    objId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(FactType),
        required: true,
    },
    attr: {
        type: Map,
        of: Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    effectiveUntil: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        enum: Object.values(FactStatus),
        default: FactStatus.Active,
        required: true,
    },
});


export const Fact = mongoose.model<IFact>('Fact', FactSchema);

