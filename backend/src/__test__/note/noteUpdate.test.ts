import { Tokens } from "../test_types";
import setupNotesTests from "../setup/notes.setup";
import { createNoteForNewUser, testNoteUpdate } from "../helpers/note.helpers";
import { Types } from "mongoose";
import { NoteRequestBody, NoteWithId, Role } from "../../types/types";
import { createRandomUser } from "../helpers/user.helpers";

let tokens: Tokens;
let notes: NoteWithId[];

beforeAll(async () => {
	const { tokens: setupTokens, notes: setupNotes } = await setupNotesTests();
	tokens = setupTokens;
	notes = setupNotes;
});

// Helper function to prepare updates
const prepareUpdate = (
	targetNoteId: string,
	updates: Partial<NoteRequestBody>
): NoteRequestBody => ({
	id: targetNoteId,
	...updates,
});

// Helper function for running role-based tests
const runRoleTests = (
	role: string,
	expectedStatus: number,
	updates: NoteRequestBody
) => {
	return testNoteUpdate(role, expectedStatus, tokens, updates);
};

describe("PATCH /api/notes - Update Note", () => {
	describe("Given invalid note id", () => {
		test("should return status 400", async () => {
			const invalidId = new Types.ObjectId().toString();
			const updates = prepareUpdate(invalidId, { title: "New title" });
			await runRoleTests("admin", 400, updates);
		});
	});

	describe("Note Update Permissions", () => {
		const roles: Role[] = ["admin", "manager", "employee"];

		describe("Updating => [title, text, completed status]", () => {
			const scenarios = [
				{
					description:
						"Note assigned to the user attempting the update",
					expectedStatus: { admin: 200, manager: 200, employee: 200 },
					findNote: (role: string) =>
						notes.find(
							(note) => note.user.toString() === tokens[role].id
						),
				},
				{
					description: "Note Assigned To Admin",
					expectedStatus: { admin: 200, manager: 400, employee: 400 },
					findNote: () =>
						notes.find(
							(note) =>
								note.user.toString() === tokens["admin"].id
						),
				},
				{
					description:
						"Note Assigned To Employee (Not the employee attempting to update)",
					expectedStatus: { admin: 200, manager: 200, employee: 400 },
					createNote: () => createNoteForNewUser("employee"),
				},
				{
					description:
						"Note Assigned To Manager (Not the employee attempting to update)",
					expectedStatus: { admin: 200, manager: 400, employee: 400 },
					createNote: () => createNoteForNewUser("manager"),
				},
			];

			for (const scenario of scenarios) {
				describe(scenario.description, () => {
					for (const role of roles) {
						const expectedStatus = scenario.expectedStatus[role];

						test(`User with role: ${role} should return status: ${expectedStatus}`, async () => {
							let note;

							if (scenario.findNote) {
								note = scenario.findNote(role);
							} else if (scenario.createNote) {
								note = await scenario.createNote();
							}

							if (!note)
								throw new Error(
									`Note not found for role: ${role}`
								);

							const updates = prepareUpdate(note._id.toString(), {
								title: `New title for ${role}'s note`,
								text: "New text",
								completed: true,
							});
							await runRoleTests(role, expectedStatus, updates);
						});
					}
				});
			}
		});

		describe("Updating => Note Assigned User", () => {
			const roles: Role[] = ["admin", "manager", "employee"];
			const scenarios = [
				{
					description: "Assign to employee",
					assignToRole: "employee",
					expectedStatus: { admin: 200, manager: 200, employee: 400 },
				},
				{
					description: "Assign to manager",
					assignToRole: "manager",
					expectedStatus: { admin: 200, manager: 400, employee: 400 },
				},
				{
					description: "Assign to admin",
					assignToRole: "admin",
					expectedStatus: { admin: 200, manager: 400, employee: 400 },
				},
			];

			for (const scenario of scenarios) {
				describe(scenario.description, () => {
					for (const role of roles) {
						const expectedStatus = scenario.expectedStatus[role];
						test(`User with role: ${role} should return status: ${expectedStatus}`, async () => {
							const note = notes.find(
								(n) =>
									n.user.toString() === tokens["employee"].id
							);

							if (!note)
								throw new Error(
									`Note doesn't exist for role: ${role}`
								);
							let newUserId: Types.ObjectId;
							if (scenario.assignToRole === "admin") {
								newUserId = new Types.ObjectId(
									tokens["admin"].id
								);
							} else {
								const newUser = await createRandomUser(
									scenario.assignToRole as Role
								);
								newUserId = newUser._id;
							}
							const updates = prepareUpdate(note._id.toString(), {
								user: newUserId,
							});
							await runRoleTests(role, expectedStatus, updates);
						});
					}
				});
			}
		});
	});
});
