import { Schema, model } from "mongoose";
// import Inc from "mongoose-sequence";
import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const noteSchema = new Schema(
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
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const AutoIncrement = AutoIncrementFactory(mongoose);

noteSchema.plugin(AutoIncrement, {
    inc_field: "ticket",
    id: "ticketNumbers",
    start_seq: 500,
});

export default model("Note", noteSchema);
