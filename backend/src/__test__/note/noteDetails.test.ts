// import supertest from "supertest";
// import app from "../../../app";
import { Tokens } from "../test_types";
import setupNotesTests from "../setup/notes.setup";
import { testNoteDetailsAccess } from "../helpers/note.helpers";
import { NoteWithId } from "../../types/types";

// const api = supertest(app);

let tokens: Tokens;
let notes: NoteWithId[];

beforeAll(async () => {
	const { tokens: setupTokens, notes: setupNotes } = await setupNotesTests();
	tokens = setupTokens;
	notes = setupNotes;
});

// test("true", () => {
// 	console.log(tokens);
// 	console.log(notes);
// 	expect(true).toBe(true);
// });

describe("GET /api/notes/details/:id - Get Note Details", () => {
	describe("Given note created by employee", () => {
		test.each([
			["admin", 200, true],
			["manager", 200, true],
			["employee", 200, true],
		])(
			"Users with role '%s' should return status %i when accessing details for note created by Employee",

			async (
				role: string,
				expectedStatus: number,
				shouldMatch: boolean
			) => {
				const targetNote = notes.find(
					(note) => note.title === "employee's Note"
				);
				if (!targetNote) {
					throw new Error("Note not found");
				}
				const targetNoteId = targetNote._id.toString();
				await testNoteDetailsAccess(
					role,
					expectedStatus,
					tokens,
					targetNoteId,
					shouldMatch
				);
			}
		);
	});

	describe("Given note created by manager", () => {
		test.each([
			["admin", 200, true],
			["manager", 200, true],
			["employee", 401, false],
		])(
			"Users with role '%s' should return status %i when accessing details for note created by Manager",

			async (
				role: string,
				expectedStatus: number,
				shouldMatch: boolean
			) => {
				const targetNote = notes.find(
					(note) => note.title === "manager's Note"
				);
				if (!targetNote) {
					throw new Error("Note not found");
				}
				const targetNoteId = targetNote._id.toString();
				await testNoteDetailsAccess(
					role,
					expectedStatus,
					tokens,
					targetNoteId,
					shouldMatch
				);
			}
		);
	});

	describe("Given note created by admin", () => {
		test.each([
			["admin", 200, true],
			["manager", 401, false],
			["employee", 401, false],
		])(
			"Users with role '%s' should return status %i when accessing details for note created by Admin",

			async (
				role: string,
				expectedStatus: number,
				shouldMatch: boolean
			) => {
				const targetNote = notes.find(
					(note) => note.title === "admin's Note"
				);
				if (!targetNote) {
					throw new Error("Note not found");
				}
				const targetNoteId = targetNote._id.toString();
				await testNoteDetailsAccess(
					role,
					expectedStatus,
					tokens,
					targetNoteId,
					shouldMatch
				);
			}
		);
	});
});
