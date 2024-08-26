import { Schema, Document, model } from "mongoose";
import Counter from "./Counter";

interface NoteSchema extends Document {
    user: { type: Schema.Types.ObjectId; ref: "User"; required: true };
    title: string;
    text: string;
    completed: boolean;
    ticket: number;
}

const noteSchema = new Schema<NoteSchema>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Note title is missing"],
        },
        text: {
            type: String,
            required: [true, "Note text is missing"],
        },
        completed: {
            type: Boolean,
            default: false,
        },
        ticket: Number,
    },
    { timestamps: true }
);

// transform _id to id and remove __v, password, confirmPassword from json return
noteSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

// Automatic generation of a unique ticket number for each new Note.
noteSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                "noteTicket",
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            if (!counter) {
                throw new Error("Can't find counter");
            }

            this.ticket = counter.seq;
        } catch (error) {
            if (error instanceof Error) {
                next(error);
            }
        }
    }
    next();
});

export default model<NoteSchema>("Note", noteSchema);
