import setupUserTests from "../setup/user.setup";
import { Tokens } from "../test_types";
import { createRandomUser, testUserDelete } from "../helpers/user.helpers";
import { Types } from "mongoose";

interface TestCase {
	description: string;
	cases: [string, number][];
	userIdFn: () => Promise<Types.ObjectId> | Types.ObjectId;
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
			["employee", 401],
		],
		userIdFn: () => new Types.ObjectId(),
	},
	{
		description: "Given user with employee role",
		cases: [
			["admin", 204],
			["manager", 204],
			["employee", 401],
		],
		userIdFn: async () => {
			const createdEmployeeUser = await createRandomUser("employee");
			return createdEmployeeUser._id;
		},
	},
	{
		description: "Given user with admin role",
		cases: [
			["admin", 401],
			["manager", 401],
		],
		userIdFn: async () => {
			const createdAdminUser = await createRandomUser("admin");
			return createdAdminUser._id;
		},
	},
	{
		description: "Given user with manager role",
		cases: [
			["admin", 204],
			["manager", 401],
		],
		userIdFn: async () => {
			const createdManagerUser = await createRandomUser("manager");
			return createdManagerUser._id;
		},
	},
];

describe("DELETE /users: delete user by id", () => {
	testCases.forEach(({ description, cases, userIdFn }) => {
		describe(description, () => {
			test.each(cases)(
				"Users with role: '%s' should return status: %i",
				async (role: string, expectedStatus: number) => {
					const userId = await userIdFn();
					await testUserDelete(role, expectedStatus, tokens, userId);
				}
			);
		});
	});
});
