import NoteModel from "../models/Note.js";
import asyncHandler from "express-async-handler";
import { validateNoteUpdateInput } from "../utils/helpers/noteController_helpers.js";
import mongoose from "mongoose";
import UserModel from "../models/User.js";

// @desc: Get all notes from db
// @route: GET /api/notes
// @access: Public
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
const note_create = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    // check if the user is a valid objectId
    if (mongoose.Types.ObjectId.isValid(user)) {
        // Throw error if the user doesn't exist in the db
        const userExists = await UserModel.findById(user);
        if (!userExists) throw Error("This user doesn't exist");
    }
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
const note_update = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    // create the updates Object
    const updates = await validateNoteUpdateInput(
        id,
        user,
        title,
        text,
        completed
    );

    // find a note by id and update
    const updatedNote = await NoteModel.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });

    // return the updated user
    res.status(200).json(updatedNote);
});

// @desc: delete a note
// @route: DELETE /api/notes
// @access: Private
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
