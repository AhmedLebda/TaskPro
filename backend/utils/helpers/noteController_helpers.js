import mongoose from "mongoose";
import NoteModel from "../../models/Note.js";
import UserModel from "../../models/User.js";

//@desc: Validate the note input and return an object with the updates if they are provided

export const validateNoteUpdateInput = async (user, title, text, completed) => {
    let updates = null;

    // Check that user exists
    if (user) {
        updates = { user };
    }

    if (title) {
        updates = { ...updates, title };
    }
    if (text) {
        updates = { ...updates, text };
    }

    if (completed !== undefined) {
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
