import { Schema, Document, model } from "mongoose";
// import AutoIncrementFactory from "mongoose-sequence";
// import AutoIncrement from "mongoose-sequence";
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
// const AutoIncrement = Inc(noteSchema);
// const AutoIncrementSequence = AutoIncrement(noteSchema);

// noteSchema.plugin(AutoIncrementSequence, {
//     inc_field: "ticket",
//     id: "ticketNumbers",
//     start_seq: 500,
// });

export default model<NoteSchema>("Note", noteSchema);
