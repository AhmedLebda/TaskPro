import { Schema, Document, model } from "mongoose";

interface UserSchema extends Document {
    username: string;
    password: string;
    roles: string[];
    active: boolean;
}

const userSchema = new Schema<UserSchema>(
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
        roles: { type: [{ type: String }], default: ["Employee"] },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// transform _id to id and remove __v, password, confirmPassword from json return
userSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        delete returnedObject.confirmPassword;
    },
});

export default model<UserSchema>("User", userSchema);
