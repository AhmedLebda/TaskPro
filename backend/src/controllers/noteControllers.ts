import NoteModel from "../models/Note";
import asyncHandler from "express-async-handler";
import { toNoteRequestBody } from "../utils/helpers/type_helpers";
import { NoteQueryResponse, PopulatedNote } from "../types/types";

// @desc: Get all notes from db
// @route: GET /api/notes
// @access: Private
const notes_list = asyncHandler(async (req, res) => {
    if (!req.paginationOptions) throw new Error("Pagination error");

    const { sortBy, page, limit } = req.paginationOptions;

    // Get all notes from db with the user field populated with user data
    const notes = (await NoteModel.find({})
        .populate({ path: "user", select: "username roles" })
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit)
        .lean()) as PopulatedNote[];

    if (notes.length === 0) throw Error("No Notes Found");

    const totalNotes = await NoteModel.countDocuments();
    const totalPages = Math.ceil(totalNotes / limit);

    const response: NoteQueryResponse = {
        data: notes,
        totalPages: totalPages,
    };

    res.status(200).json(response);
});

// @desc: Add a new note to db
// @route: POST /api/notes
// @access: Private
const note_create = asyncHandler(async (req, res) => {
    const { user: assignedUserId, title, text } = toNoteRequestBody(req.body);

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
    const { id: targetNoteId } = toNoteRequestBody(req.body);

    const { providedNoteUpdates } = req;

    // Find the target note and update
    const note = await NoteModel.findById(targetNoteId);
    if (!note) throw new Error("This note doesn't exist");

    const updatedNote = await note.updateOne(providedNoteUpdates);

    // return the updated user
    res.status(200).json(updatedNote);
});

// @desc: delete a note
// @route: DELETE /api/notes
// @access: Private
const note_delete = asyncHandler(async (req, res) => {
    // get the note id from request body
    const { id: targetNoteId } = toNoteRequestBody(req.body);

    await NoteModel.findByIdAndDelete(targetNoteId);

    // return a deleted status
    res.sendStatus(204);
});

// @desc: Get the notes assigned to the requesting user
// @routes: GET /api/notes/:targetUserId
// @access: Private
const user_notes = asyncHandler(async (req, res) => {
    if (!req.user) throw new Error("Access denied");
    const { _id: requestingUserId, roles: requestingUserRoles } = req.user;

    const { targetUserId } = req.params;

    if (!req.paginationOptions) throw new Error("Pagination error");
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

    const userNotes = (await NoteModel.find({ user: targetUserId })
        .populate({ path: "user", select: "username roles" })
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit)
        .lean()) as PopulatedNote[];

    if (userNotes.length === 0) throw Error("No Notes Found");

    const totalUserNotes = await NoteModel.find({
        user: targetUserId,
    }).countDocuments();

    const totalPages = Math.ceil(totalUserNotes / limit);

    const response: NoteQueryResponse = {
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
