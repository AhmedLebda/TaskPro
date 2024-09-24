import { Tokens } from "../test_types";
import setupNotesTests from "../setup/notes.setup";
import {
	createNote,
	generateNoteDataForNewUser,
	testNoteDelete,
} from "../helpers/note.helpers";
import { Types } from "mongoose";
import { NoteWithId } from "../../types/types";

let tokens: Tokens;
let notes: NoteWithId[];

beforeAll(async () => {
	const { tokens: setupTokens, notes: setupNotes } = await setupNotesTests();
	tokens = setupTokens;
	notes = setupNotes;
});

describe("DELETE /api/notes - Delete Note", () => {
	describe("Given invalid note id", () => {
		test("should return status 400", async () => {
			const invalidId = new Types.ObjectId();

			await testNoteDelete("admin", 400, tokens, invalidId);
		});
	});

	describe("Given valid note id", () => {
		test.each([
			["admin", 204],
			["manager", 204],
			["employee", 401],
		])(
			"User with role: %s should return status: %i when deleting a note created by himself",
			async (role: string, expectedStatus: number) => {
				const targetNote = notes.find(
					(note) => note.user.toString() === tokens[role].id
				);
				if (targetNote === undefined) {
					throw new Error("Note not found for user");
				}
				const noteId = targetNote._id;

				await testNoteDelete(role, expectedStatus, tokens, noteId);
			}
		);
	});

	describe("Note Delete Permissions", () => {
		describe("Assigned To Employee (Not the employee attempting to delete)", () => {
			test.each([
				["admin", 204],
				["manager", 204],
				["employee", 401],
			])(
				"User with role: %s should return status: %i when trying to delete note assigned to user with 'Employee' role",
				async (role: string, expectedStatus: number) => {
					const noteData = await generateNoteDataForNewUser(
						"employee"
					);
					const note = await createNote(noteData);
					const noteId = note._id;

					await testNoteDelete(role, expectedStatus, tokens, noteId);
				}
			);
		});

		describe("Assigned To Manager (Not the manager attempting to delete)", () => {
			test.each([
				["admin", 204],
				["manager", 400],
				["employee", 401],
			])(
				"User with role: %s should return status: %i when trying to delete note assigned to user with 'Manager' role",
				async (role: string, expectedStatus: number) => {
					const noteData = await generateNoteDataForNewUser(
						"manager"
					);
					const note = await createNote(noteData);
					const noteId = note._id;
					await testNoteDelete(role, expectedStatus, tokens, noteId);
				}
			);
		});

		describe("Assigned To Admin", () => {
			test.each([
				["employee", 401],
				["manager", 400],
				["admin", 204],
			])(
				"User with role: %s should return status: %i when trying to delete note assigned to user with 'Admin' role",
				async (role: string, expectedStatus: number) => {
					const note = await createNote({
						user: tokens["admin"].id,
						title: "Admin",
						text: "Admin",
					});
					const noteId = note._id;
					await testNoteDelete(role, expectedStatus, tokens, noteId);
				}
			);
		});
	});
});
