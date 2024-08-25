import { Schema, model } from "mongoose";
import Inc from "mongoose-sequence";

interface NoteSchema {
    user: { type: Schema.Types.ObjectId; ref: "User"; required: true };
    title: { type: string; required: [true, string] };
    text: { type: string; require: [true, string] };
    completed: { type: boolean; default: boolean };
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

// const AutoIncrement = AutoIncrementFactory(noteSchema);
const AutoIncrement = Inc(noteSchema);

noteSchema.plugin(AutoIncrement as any, {
    inc_field: "ticket",
    id: "ticketNumbers",
    start_seq: 500,
});

export default model("Note", noteSchema);
