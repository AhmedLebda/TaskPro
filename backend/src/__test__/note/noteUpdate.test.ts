import { Tokens } from "../test_types";
import setupNotesTests from "../setup/notes.setup";
import { createNoteForNewUser, testNoteUpdate } from "../helpers/note.helpers";
import { Types } from "mongoose";
import { NoteRequestBody, NoteWithId } from "../../types/types";
import { createRandomUser } from "../helpers/user.helpers";

let tokens: Tokens;
let notes: NoteWithId[];

beforeAll(async () => {
	const { tokens: setupTokens, notes: setupNotes } = await setupNotesTests();
	tokens = setupTokens;
	notes = setupNotes;
});

describe("PATCH /api/notes - Update Note", () => {
	describe("Given invalid note id", () => {
		test("should return status 400", async () => {
			const invalidId = new Types.ObjectId().toString();
			const updates: NoteRequestBody = {
				id: invalidId,
				title: "New title",
			};
			await testNoteUpdate("admin", 400, tokens, updates);
		});
	});

	describe("Note Update Permissions", () => {
		describe("Updating => [title, text, completed status]", () => {
			describe("Note assigned to the user attempting the update", () => {
				test.each([
					["admin", 200],
					["manager", 200],
					["employee", 200],
				])(
					"User with role: %s should return status: %i",
					async (role: string, expectedStatus: number) => {
						const targetNote = notes.find(
							(note) => note.user.toString() === tokens[role].id
						);
						if (!targetNote)
							throw new Error(`Note ${role} does not exist`);

						const updates: NoteRequestBody = {
							id: targetNote._id.toString(),
							title: `New title for ${role}'s note`,
							text: "New text for ${role}'s note",
							completed: true,
						};
						await testNoteUpdate(
							role,
							expectedStatus,
							tokens,
							updates
						);
					}
				);
			});

			describe("Note Assigned To Employee (Not the employee attempting to update)", () => {
				test.each([
					["admin", 200],
					["manager", 200],
					["employee", 400],
				])(
					"User with role: %s should return status: %i",
					async (role: string, expectedStatus: number) => {
						const note = await createNoteForNewUser("employee");
						const noteId = note._id.toString();

						const updates: NoteRequestBody = {
							id: noteId,
							title: "New title",
							text: "New text",
							completed: true,
						};
						await testNoteUpdate(
							role,
							expectedStatus,
							tokens,
							updates
						);
					}
				);
			});

			describe("Note Assigned To Manager (Not the employee attempting to update)", () => {
				test.each([
					["admin", 200],
					["manager", 400],
					["employee", 400],
				])(
					"User with role: %s should return status: %i",
					async (role: string, expectedStatus: number) => {
						const note = await createNoteForNewUser("manager");
						const noteId = note._id.toString();

						const updates: NoteRequestBody = {
							id: noteId,
							title: "New title",
							text: "New text",
							completed: true,
						};
						await testNoteUpdate(
							role,
							expectedStatus,
							tokens,
							updates
						);
					}
				);
			});

			describe("Note Assigned To Admin", () => {
				test.each([
					["admin", 200],
					["manager", 400],
					["employee", 400],
				])(
					"User with role: %s should return status: %i",
					async (role: string, expectedStatus: number) => {
						const note = notes.find(
							(n) => n.user.toString() === tokens["admin"].id
						);
						if (!note) throw new Error(`Note not found`);
						const noteId = note._id.toString();

						const updates: NoteRequestBody = {
							id: noteId,
							title: "New title",
							text: "New text",
							completed: true,
						};
						await testNoteUpdate(
							role,
							expectedStatus,
							tokens,
							updates
						);
					}
				);
			});
		});

		describe("Updating => Note Assigned User", () => {
			describe("Assign to employee", () => {
				test.each([
					["admin", 200],
					["manager", 200],
					["employee", 400],
				])(
					"User with role: %s should return status: %i",
					async (role: string, expectedStatus: number) => {
						const note = notes.find(
							(n) => n.user.toString() === tokens["employee"].id
						);

						if (!note) throw new Error("Note doesn't exist");

						const noteId = note._id.toString();

						const newEmployee = await createRandomUser("employee");

						const updates: NoteRequestBody = {
							id: noteId,
							user: newEmployee._id,
						};
						await testNoteUpdate(
							role,
							expectedStatus,
							tokens,
							updates
						);
					}
				);
			});
			describe("Assign to manager (Not manager attempting to update note)", () => {
				test.each([
					["admin", 200],
					["manager", 400],
					["employee", 400],
				])(
					"User with role: %s should return status: %i",
					async (role: string, expectedStatus: number) => {
						const note = notes.find(
							(n) => n.user.toString() === tokens["employee"].id
						);

						if (!note) throw new Error("Note doesn't exist");

						const noteId = note._id.toString();

						const newManager = await createRandomUser("manager");

						const updates: NoteRequestBody = {
							id: noteId,
							user: newManager._id,
						};
						await testNoteUpdate(
							role,
							expectedStatus,
							tokens,
							updates
						);
					}
				);
			});

			describe("Assign Admin", () => {
				test.each([
					["admin", 200],
					["manager", 400],
					["employee", 400],
				])(
					"User with role: %s should return status: %i",
					async (role: string, expectedStatus: number) => {
						const note = notes.find(
							(n) => n.user.toString() === tokens["employee"].id
						);

						if (!note) throw new Error("Note doesn't exist");

						const noteId = note._id.toString();

						const adminId = tokens["admin"].id;

						const updates: NoteRequestBody = {
							id: noteId,
							user: new Types.ObjectId(adminId),
						};
						await testNoteUpdate(
							role,
							expectedStatus,
							tokens,
							updates
						);
					}
				);
			});
		});
	});
});
