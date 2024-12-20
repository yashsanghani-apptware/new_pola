import { Schema, model, Document } from 'mongoose';

export interface IScenario extends Document {
    name: string;
    description: string;
    expression: string;
    expected: boolean;
    explanation: string;  // Add the explanation field here
}

const ScenarioSchema = new Schema<IScenario>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    expression: { type: String, required: true },
    expected: { type: Boolean, required: true },
    explanation: { type: String, required: true },  // Add this to the schema
});

export const Scenario = model<IScenario>('Scenario', ScenarioSchema);

