import setupUserTests from "../setup/user.setup";
import { Tokens } from "../test_types";
import { createRandomUser, testUserUpdate } from "../helpers/user.helpers";
import { Types } from "mongoose";

interface TestCase {
	description: string;
	cases: [string, number][];
	userIdFn: () => Promise<string> | string;
}

let tokens: Tokens;

beforeAll(async () => {
	tokens = await setupUserTests();
});

const testCases: TestCase[] = [
	{
		description: "Given Invalid user id",
		cases: [
			["admin", 400],
			["manager", 400],
			["employee", 400],
		],
		userIdFn: () => new Types.ObjectId().toString(),
	},
	{
		description: "Given user with admin role (Deactivate)",
		cases: [
			["admin", 401],
			["manager", 401],
		],
		userIdFn: async () => {
			return tokens["admin"].id;
		},
	},
	{
		description:
			"Given user with employee role (Deactivate) (Not employee attempting the request)",
		cases: [
			["admin", 200],
			["manager", 200],
			["employee", 401],
		],
		userIdFn: async () => {
			const createdEmployeeUser = await createRandomUser("employee");
			return createdEmployeeUser._id.toString();
		},
	},

	{
		description:
			"Given user with manager role (Deactivate) (Not manager attempting the request)",
		cases: [
			["admin", 200],
			["manager", 401],
		],
		userIdFn: async () => {
			const createdManagerUser = await createRandomUser("manager");
			return createdManagerUser._id.toString();
		},
	},
];

describe("PATCH /users/:id - update user by id", () => {
	testCases.forEach(({ description, cases, userIdFn }) => {
		describe(description, () => {
			test.each(cases)(
				"Users with role: '%s' should return status: %i",
				async (role: string, expectedStatus: number) => {
					const userId = await userIdFn();
					const updates = { id: userId, active: false };
					await testUserUpdate(role, expectedStatus, tokens, updates);
				}
			);
		});
	});

	describe("Users update their own account data", () => {
		test.each([
			["admin", 200],
			["manager", 200],
			["employee", 200],
		])(
			"Users with role: '%s' should return status: %i",
			async (role: string, expectedStatus: number) => {
				const userId = tokens[role].id;
				const updates = { id: userId, username: `updated-${role}` };
				await testUserUpdate(role, expectedStatus, tokens, updates);
			}
		);
	});
});
