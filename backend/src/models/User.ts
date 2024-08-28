import { Schema, model } from "mongoose";
import { User } from "../types/types";

const userSchema = new Schema<User>(
    {
        username: {
            type: String,
            minLength: [3, "username is too short"],
            maxLength: [30, "username is too long"],
            required: [true, "Please enter a username"],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "please enter a password"],
        },
        roles: { type: [{ type: String }], default: ["employee"] },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default model<User>("User", userSchema);
