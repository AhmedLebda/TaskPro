import { getRandomUserData, testUserCreate } from "../helpers/user.helpers";
import { Tokens } from "../test_types";
import setupUserTests from "../setup/user.setup";
import { User } from "../../types/types";

interface TestCase {
	description: string;
	cases: [string, number, boolean][];
	userDataFn: () => Partial<User>;
}

let tokens: Tokens;

beforeAll(async () => {
	tokens = await setupUserTests();
});

const testCases: TestCase[] = [
	{
		description: "Given correct user data",
		cases: [
			["admin", 201, true],
			["manager", 201, true],
			["employee", 401, false],
		],
		userDataFn: () => getRandomUserData(["employee"]),
	},
	{
		description: "Fail if user tries to create an admin",
		cases: [
			["admin", 401, false],
			["manager", 401, false],
		],
		userDataFn: () => getRandomUserData(["admin"]),
	},
	{
		description: "Fail if user data is missing",
		cases: [
			["admin", 400, false],
			["manager", 400, false],
		],
		userDataFn: () => ({}),
	},
	{
		description: "Only Admin can create another managers",
		cases: [
			["admin", 201, true],
			["manager", 401, false],
		],
		userDataFn: () => getRandomUserData(["manager"]),
	},
];

describe("POST /users: Create new user", () => {
	testCases.forEach(({ description, cases, userDataFn }) => {
		describe(description, () => {
			test.each(cases)(
				"Users with role: '%s' should return status: %i",
				async (
					role: string,
					expectedStatus: number,
					shouldMatch: boolean
				) => {
					const userData = userDataFn();
					await testUserCreate(
						role,
						expectedStatus,
						tokens,
						userData,
						shouldMatch
					);
				}
			);
		});
	});
});
