import mongoose from "mongoose";
import NoteModel from "../../models/Note.js";
import UserModel from "../../models/User.js";

//@desc: Validate the note input and return an object with the updates if they are provided

export const validateNoteUpdateInput = async (
    id,
    user,
    title,
    text,
    completed
) => {
    // Check if there is an id provided and the id is a valid ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw Error("invalid id");
    }

    // Check if the note exists in the db
    const note = await NoteModel.findById(id);

    if (!note) {
        throw Error("note not found");
    }

    let updates = null;

    // Check that user exists
    if (user) {
        // the user is a valid object id
        if (mongoose.Types.ObjectId.isValid(user)) {
            // Check if user exists in the db
            const userExists = await UserModel.findById(user);
            if (!userExists) throw Error("This user doesn't exist");

            updates = { user };
        } else {
            throw Error("invalid user id");
        }
    }

    if (title) {
        updates = { ...updates, title };
    }
    if (text) {
        updates = { ...updates, text };
    }
    if (completed) {
        if (typeof completed !== "boolean")
            throw Error("completed value can only be true or false");
        updates = { ...updates, completed };
    }

    // Throw error if there are no provided values to update
    if (!updates) {
        throw Error("No provided values to update");
    }

    // return an object with the provided updates
    return updates;
};
