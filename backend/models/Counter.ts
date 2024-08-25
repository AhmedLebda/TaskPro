import { Schema, Document, model } from "mongoose";

interface CounterSchema extends Document {
    _id: string;
    seq: number;
}

const counterSchema = new Schema<CounterSchema>({
    _id: { type: String },
    seq: { type: Number, default: 0 },
});

export default model<CounterSchema>("Counter", counterSchema);
