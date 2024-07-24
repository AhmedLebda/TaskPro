import NoteModel from "../models/Note.js";
import asyncHandler from "express-async-handler";
import { validateNoteUpdateInput } from "../utils/helpers/noteController_helpers.js";
import mongoose from "mongoose";
import UserModel from "../models/User.js";
import AuthHelpers from "../utils/helpers/auth_helpers.js";

// @desc: Get all notes from db
// @route: GET /api/notes
// @access: Private
const notes_list = asyncHandler(async (req, res) => {
    // Get all notes from db with the user field populated with user data
    const notes = await NoteModel.find({})
        .populate({ path: "user", select: "username" })
        .lean();

    // Throw error if there aren't any notes in the db
    if (notes.length === 0) throw Error("There are no notes");

    res.status(200).json(notes);
});

// @desc: Add a new note to db
// @route: POST /api/notes
// @access: Private
// @permissions: Admin, Manager => assign notes to users
const note_create = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;
    const userId = req.userId;

    // Check if user have manager role
    const isManager = await AuthHelpers.isManagerUser(userId);

    // check if the user is a valid objectId
    if (mongoose.Types.ObjectId.isValid(user)) {
        // Throw error if the user doesn't exist in the db
        const userExists = await UserModel.findById(user);
        if (!userExists) throw Error("This user doesn't exist");
    }

    //  Throw an error if the requester is neither the owner of the note nor a manager.
    // Only managers can assign notes to other users.
    if (userId !== user && !isManager)
        throw Error("You aren't authorized to assign notes to another user");

    // Creating note object with provided note data
    const noteObject = { user, title, text };
    const note = new NoteModel(noteObject);

    // Save the note to db
    const createdNote = await note.save();

    res.status(201).json(createdNote);
});

// @desc: Edit a note
// @route: PATCH /api/notes
// @access: Private
// @permissions:  Admin, Manager or note owner => update note
// @permissions:  Admin, Manager => update note assignment
const note_update = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    // The id of the user who made the request
    const userId = req.userId;

    // create the updates Object
    const updates = await validateNoteUpdateInput(
        id,
        user,
        title,
        text,
        completed
    );

    // Find the target note
    const note = await NoteModel.findById(id);

    // Check if user have manager role
    const isManager = await AuthHelpers.isManagerUser(userId);

    // The note can only be edited by either a manager or the user to whom it is assigned.
    if (userId !== note.user.toString() && !isManager)
        throw Error("You can't Edit this note");

    // Editing the assignment of notes should only be permitted for managers.
    if (user && !isManager)
        throw Error("You aren't authorized to assign notes to another user");

    const updatedNote = await note.updateOne(updates);

    // return the updated user
    res.status(200).json(updatedNote);
});

// @desc: delete a note
// @route: DELETE /api/notes
// @access: Private
// @permissions: Admin and Manager only
const note_delete = asyncHandler(async (req, res) => {
    // get the note id from request body
    const { id } = req.body;

    // check if the id exists and a valid object id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) throw Error("invalid id");

    // Check if a note with the provided id exists in the db
    const noteExists = await NoteModel.findById(id);

    if (!noteExists) throw Error("This note doesn't exist");

    // find note and delete
    await noteExists.deleteOne();

    // return a deleted status
    res.sendStatus(204);
});

export default { notes_list, note_create, note_update, note_delete };
