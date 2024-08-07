import NoteModel from "../models/Note.js";
import asyncHandler from "express-async-handler";
import { validateNoteUpdateInput } from "../utils/helpers/noteController_helpers.js";
import mongoose from "mongoose";
import AuthHelpers from "../utils/helpers/auth_helpers.js";

// @desc: Get all notes from db
// @route: GET /api/notes
// @access: Private
const notes_list = asyncHandler(async (req, res) => {
    // id of user who made the request
    const requestingUser = req.user;
    const { _id: requesterId } = requestingUser;

    // Verify the role of the user who submitted the request.
    const isManagerOrAdmin = await AuthHelpers.isManagerOrAdminUser(
        requesterId
    );

    // Get all notes from db with the user field populated with user data
    const notes = await NoteModel.find({})
        .populate({ path: "user", select: "username" })
        .lean();

    // Throw error if there aren't any notes in the db
    if (notes.length === 0) throw Error("There are no notes");

    // Return all notes if the user is a manager
    if (isManagerOrAdmin) {
        return res.status(200).json(notes);
    }

    // Filter notes to return only notes of the employee who made the request
    const employeeNotes = notes.filter(
        (note) => note.user._id.toString() === requesterId.toString()
    );
    console.log(employeeNotes);
    return res.status(200).json(employeeNotes);
});

// @desc: Add a new note to db
// @route: POST /api/notes
// @access: Private
const note_create = asyncHandler(async (req, res) => {
    const { user: assignedUserId, title, text } = req.body;

    // Creating note object with provided note data
    const noteObject = { user: assignedUserId, title, text };
    const note = new NoteModel(noteObject);

    // Save the note to db
    const createdNote = await note.save();

    res.status(201).json(createdNote);
});

// @desc: Edit a note
// @route: PATCH /api/notes
// @access: Private
const note_update = asyncHandler(async (req, res) => {
    const {
        id: targetNoteId,
        user: assignedUser,
        title,
        text,
        completed,
    } = req.body;

    // create the updates Object
    const updates = await validateNoteUpdateInput(
        assignedUser,
        title,
        text,
        completed
    );

    // Find the target note and update
    const note = await NoteModel.findById(targetNoteId);
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
