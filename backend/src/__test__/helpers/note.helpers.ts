import NoteModel from "../../models/Note";
import supertest from "supertest";
import app from "../../../app";
import { NoteWithId, Role, User } from "../../types/types";
import { NoteObject, Tokens } from "../test_types";
import { createUser, getRandomUserData } from "./user.helpers";

const api = supertest(app);

export const deleteAllNotes = async (): Promise<void> => {
	console.log("INFO: Deleting all notes");
	try {
		await NoteModel.deleteMany({});
	} catch (error) {
		console.error("ERROR: Failed to reset notes collection", error);
		throw error;
	}
};

export const createNote = async (noteObj: NoteObject): Promise<NoteWithId> => {
	console.log("INFO: Creating a new note", noteObj.title);
	try {
		const newNote = await NoteModel.create(noteObj);
		return newNote;
	} catch (error) {
		console.error("ERROR: Failed to create a new note", error);
		throw error;
	}
};

export const testNotesListAccess = async (
	role: string,
	expectedStatus: number,
	tokens: Tokens,
	shouldMatch: boolean
) => {
	const response = await api
		.get("/api/notes")
		.set("Authorization", `Bearer ${tokens[role].access_token}`)
		.expect(expectedStatus);

	if (shouldMatch) {
		expect(response.body.data.length).toEqual(3);
		expect(response.body.data[0]).toMatchObject({
			_id: expect.any(String),
			user: expect.any(Object),
			title: expect.any(String),
			text: expect.any(String),
			completed: expect.any(Boolean),
			ticket: expect.any(Number),
		});
	}
};

export const testUserNotesListAccess = async (
	role: string,
	expectedStatus: number,
	tokens: Tokens,
	targetUser: string,
	shouldMatch: boolean
) => {
	const response = await api
		.get(`/api/notes/${targetUser}`)
		.set("Authorization", `Bearer ${tokens[role].access_token}`)
		.expect(expectedStatus);

	if (shouldMatch) {
		expect(response.body.data[0].user._id).toBe(targetUser);
	}
};

export const testNoteDetailsAccess = async (
	role: string,
	expectedStatus: number,
	tokens: Tokens,
	targetNote: string,
	shouldMatch: boolean
) => {
	const response = await api
		.get(`/api/notes/details/${targetNote}`)
		.set("Authorization", `Bearer ${tokens[role].access_token}`)
		.expect(expectedStatus);

	if (shouldMatch) {
		expect(response.body._id).toBe(targetNote);
	}
};

export const testNoteCreatePrivileges = async (
	role: string,
	expectedStatus: number,
	tokens: Tokens,
	note: NoteObject,
	shouldMatch: boolean
) => {
	const response = await api
		.post("/api/notes")
		.set("Authorization", `Bearer ${tokens[role].access_token}`)
		.send(note)
		.expect(expectedStatus);

	const data: NoteWithId = response.body;

	if (shouldMatch) {
		expect(data.user).toBe(note.user);
	}
};

export const generateNoteDataForNewUser = async (
	role: Role
): Promise<NoteObject> => {
	const userData = getRandomUserData([role]) as User;
	const targetUser = await createUser(userData);
	const note: NoteObject = {
		user: targetUser._id.toString(),
		title: "Test",
		text: "Test Note",
	};
	return note;
};
