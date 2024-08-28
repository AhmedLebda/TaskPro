import { Schema, model } from "mongoose";
import Counter from "./Counter";
import { Note } from "../types/types";

const noteSchema = new Schema<Note>(
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

export default model<Note>("Note", noteSchema);
