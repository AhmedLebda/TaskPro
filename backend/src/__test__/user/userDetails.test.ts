// import { User } from "../../types/types";
import {
	createRandomUser,
	// createUser,
	// getRandomUserData,
	testUserDetails,
} from "../helpers/user.helpers";
import setupUserTests from "../setup/user.setup";
import { Tokens } from "../test_types";
import { Types } from "mongoose";
// import UserModel from "../../models/User";

interface TestCase {
	description: string;
	cases: [string, number, boolean][];
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
			["admin", 400, false],
			["manager", 400, false],
			["employee", 400, false],
		],
		userIdFn: () => new Types.ObjectId().toString(),
	},
	{
		description:
			"Given user with employee role (Not employee attempting the request)",
		cases: [
			["admin", 200, true],
			["manager", 200, true],
			["employee", 401, false],
		],
		userIdFn: async () => {
			const createdEmployeeUser = await createRandomUser("employee");
			return createdEmployeeUser._id.toString();
		},
	},
	{
		description: "Employee getting data of his own account",
		cases: [["employee", 200, true]],
		userIdFn: async () => {
			return tokens["employee"].id;
		},
	},
	{
		description: "Given user with admin role",
		cases: [
			["admin", 200, true],
			["manager", 200, false],
			["employee", 401, false],
		],
		userIdFn: async () => {
			const createdAdminUser = await createRandomUser("admin");
			return createdAdminUser._id.toString();
		},
	},
	{
		description: "Given user with manager role",
		cases: [
			["admin", 200, true],
			["manager", 200, false],
			["employee", 401, false],
		],
		userIdFn: async () => {
			const createdManagerUser = await createRandomUser("manager");
			return createdManagerUser._id.toString();
		},
	},
];

describe("GET /users/:id - get user data", () => {
	testCases.forEach(({ description, cases, userIdFn }) => {
		describe(description, () => {
			test.each(cases)(
				"Users with role: '%s' should return status: %i",
				async (
					role: string,
					expectedStatus: number,
					shouldMatch: boolean
				) => {
					const userId = await userIdFn();
					await testUserDetails(
						role,
						expectedStatus,
						tokens,
						userId,
						shouldMatch
					);
				}
			);
		});
	});
});
