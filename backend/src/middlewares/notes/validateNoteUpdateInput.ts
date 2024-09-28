import asyncHandler from "express-async-handler";
import { Note } from "../../types/types";
import { toNoteRequestBody } from "../../utils/helpers/type_helpers";

// Validates the provided data to update the note
// Creates an "updates" object with the provided data and attaches it to the request object
/* checks:
- user provided data to update
- Provided data are of the right type
*/

const validateNoteUpdateInput = asyncHandler(async (req, _res, next) => {
    const {
        user: assignedUser,
        title,
        text,
        completed,
    } = toNoteRequestBody(req.body);

    let updates: Partial<Note> | null = null;

    // Check that user exists
    if (assignedUser) {
        updates = { user: assignedUser };
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

    req.providedNoteUpdates = updates;

    next();
});

export default validateNoteUpdateInput;
