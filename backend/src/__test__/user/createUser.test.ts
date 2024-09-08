import { getRandomUserData, testUserCreate } from "../helpers/user.helpers";
import { Tokens } from "../test_types";
import setupUserTests from "../setup/user.setup";

let tokens: Tokens;

beforeAll(async () => {
    tokens = await setupUserTests();
});

describe("POST /users: Create new user", () => {
    describe("Given correct user data", () => {
        test.each([
            ["admin", 201, true],
            ["manager", 201, true],
            ["employee", 401, false],
        ])(
            "Users with role: '%s' should return status: %i when creating a user with correct data",
            async (
                role: string,
                expectedStatus: number,
                shouldMatch: boolean
            ) => {
                const userData = getRandomUserData(["employee"]);

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

    describe("Fail if user tries to create an admin", () => {
        test.each([
            ["admin", 401, false],
            ["manager", 401, false],
        ])(
            "Users with role: '%s' should return status: %i when creating a user with an admin role",
            async (
                role: string,
                expectedStatus: number,
                shouldMatch: boolean
            ) => {
                const userData = getRandomUserData(["admin"]);

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

    describe("Fail if user data is missing", () => {
        const userData = {};
        test.each([
            ["admin", 400, false],
            ["manager", 400, false],
        ])(
            "Users with role: '%s' should return status: %i when creating a user with invalid data",
            async (
                role: string,
                expectedStatus: number,
                shouldMatch: boolean
            ) => {
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

    describe("Only Admin can create another managers", () => {
        test.each([
            ["admin", 201, true],
            ["manager", 401, false],
        ])(
            "Users with role: '%s' should return status: %i when creating a user with manager role",
            async (
                role: string,
                expectedStatus: number,
                shouldMatch: boolean
            ) => {
                const userData = getRandomUserData(["manager"]);
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
