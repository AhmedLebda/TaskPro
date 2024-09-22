import { NoteObject, Tokens } from "../test_types";
import setupNotesTests from "../setup/notes.setup";
import {
	generateNoteDataForNewUser,
	testNoteCreatePrivileges,
} from "../helpers/note.helpers";
import { Types } from "mongoose";

let tokens: Tokens;

beforeAll(async () => {
	const { tokens: setupTokens } = await setupNotesTests();
	tokens = setupTokens;
});

describe("POST /api/notes - Create Note", () => {
	describe("Given invalid user", () => {
		test("should return status 400", async () => {
			const invalidId = new Types.ObjectId().toString();
			const note: NoteObject = {
				user: invalidId,
				title: "Test",
				text: "Test Note",
			};
			await testNoteCreatePrivileges("admin", 400, tokens, note, false);
		});
	});

	describe("Given valid note data", () => {
		test.each([
			["admin", 201, true],
			["manager", 201, true],
			["employee", 201, true],
		])(
			"User with role: %s should return status: %i when creating note assigned to himself",
			async (
				role: string,
				expectedStatus: number,
				shouldMatch: boolean
			) => {
				const note: NoteObject = {
					user: tokens[role].id,
					title: "Test",
					text: "Test Note",
				};
				await testNoteCreatePrivileges(
					role,
					expectedStatus,
					tokens,
					note,
					shouldMatch
				);
			}
		);
	});

	describe("Note Assign Permissions", () => {
		describe("To Employee", () => {
			test.each([
				["admin", 201, true],
				["manager", 201, true],
				["employee", 400, false],
			])(
				"User with role: %s should return status: %i when trying to assign note to user with 'Employee' role",
				async (
					role: string,
					expectedStatus: number,
					shouldMatch: boolean
				) => {
					const note = await generateNoteDataForNewUser("employee");
					await testNoteCreatePrivileges(
						role,
						expectedStatus,
						tokens,
						note,
						shouldMatch
					);
				}
			);
		});

		describe("To Manager", () => {
			test.each([
				["admin", 201, true],
				["manager", 400, false],
				["employee", 400, false],
			])(
				"User with role: %s should return status: %i when trying to assign note to user with 'manager' role",
				async (
					role: string,
					expectedStatus: number,
					shouldMatch: boolean
				) => {
					const note = await generateNoteDataForNewUser("manager");
					await testNoteCreatePrivileges(
						role,
						expectedStatus,
						tokens,
						note,
						shouldMatch
					);
				}
			);
		});

		describe("To Admin", () => {
			test.each([
				["admin", 201, true],
				["manager", 400, false],
				["employee", 400, false],
			])(
				"User with role: %s should return status: %i when trying to assign note to user with 'admin' role",
				async (
					role: string,
					expectedStatus: number,
					shouldMatch: boolean
				) => {
					const note = await generateNoteDataForNewUser("admin");
					await testNoteCreatePrivileges(
						role,
						expectedStatus,
						tokens,
						note,
						shouldMatch
					);
				}
			);
		});
	});
});
