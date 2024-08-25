import NoteModel from "../models/Note";
import asyncHandler from "express-async-handler";

// @desc: Get all notes from db
// @route: GET /api/notes
// @access: Private
const notes_list = asyncHandler(async (req, res) => {
    const { sortBy, page, limit } = req.paginationOptions;

    // Get all notes from db with the user field populated with user data
    const notes = await NoteModel.find({})
        .populate({ path: "user", select: "username roles" })
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit)
        .lean();

    if (notes.length === 0) throw Error("No Notes Found");

    const totalNotes = await NoteModel.countDocuments();
    const totalPages = Math.ceil(totalNotes / limit);

    const response = {
        data: notes,
        totalPages: totalPages,
    };

    return res.status(200).json(response);
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
    const { id: targetNoteId } = req.body;

    const { updates } = req;

    // Find the target note and update
    const note = await NoteModel.findById(targetNoteId);
    const updatedNote = await note.updateOne(updates);

    // return the updated user
    res.status(200).json(updatedNote);
});

// @desc: delete a note
// @route: DELETE /api/notes
// @access: Private
const note_delete = asyncHandler(async (req, res) => {
    // get the note id from request body
    const { id: targetNoteId } = req.body;

    await NoteModel.findByIdAndDelete(targetNoteId);

    // return a deleted status
    res.sendStatus(204);
});

// @desc: Get the notes assigned to the requesting user
// @routes: GET /api/notes/:targetUserId
// @access: Private
const user_notes = asyncHandler(async (req, res) => {
    const { _id: requestingUserId, roles: requestingUserRoles } = req.user;
    const { targetUserId } = req.params;
    const { sortBy, page, limit } = req.paginationOptions;
    const isRequesterAdminOrManager = requestingUserRoles.some(
        (role) => role === "admin" || role === "manager"
    );
    // Employee attempts to get another user notes
    if (
        !isRequesterAdminOrManager &&
        requestingUserId.toString() !== targetUserId
    )
        throw Error("Access denied");

    const userNotes = await NoteModel.find({ user: targetUserId })
        .populate({ path: "user", select: "username roles" })
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit)
        .lean();

    if (userNotes.length === 0) throw Error("No Notes Found");

    const totalUserNotes = await NoteModel.find({
        user: targetUserId,
    }).countDocuments();

    const totalPages = Math.ceil(totalUserNotes / limit);

    const response = {
        data: userNotes,
        totalPages: totalPages,
    };

    res.status(200).json(response);
});

export default {
    notes_list,
    note_create,
    note_update,
    note_delete,
    user_notes,
};
