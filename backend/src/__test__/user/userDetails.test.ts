import { User } from "../../types/types";
import {
    createUser,
    getRandomUserData,
    testUserDetails,
} from "../helpers/user.helpers";
import setupUserTests from "../setup/user.setup";
import { Tokens } from "../test_types";
import { Types } from "mongoose";
import UserModel from "../../models/User";

let tokens: Tokens;

beforeAll(async () => {
    tokens = await setupUserTests();
});

describe("GET /users/:id - get user data", () => {
    describe("Given Invalid user id", () => {
        const invalidId = new Types.ObjectId().toString();
        test("Return status code 400 with invalid user id", async () => {
            await testUserDetails("admin", 400, tokens, invalidId, false);
        });
    });

    describe("given user with employee role", () => {
        test.each([
            ["admin", 200, true],
            ["manager", 200, true],
            ["employee", 401, false],
        ])(
            "Users with role: '%s' should return status: %i when getting data of a user with employee role",
            async (
                role: string,
                expectedStatus: number,
                shouldMatch: boolean
            ) => {
                const employeeUserData = getRandomUserData([
                    "employee",
                ]) as User;
                const createdEmployeeUser = await createUser(employeeUserData);
                const id = createdEmployeeUser._id.toString();
                await testUserDetails(
                    role,
                    expectedStatus,
                    tokens,
                    id,
                    shouldMatch
                );
            }
        );

        test("Employee getting data of his own account", async () => {
            const employee = await UserModel.findOne({ username: "employee" });

            if (!employee) throw Error("User not found");

            const id = employee._id.toString();

            await testUserDetails("employee", 200, tokens, id, true);
        });
    });

    describe("Given user with admin role", () => {
        test.each([
            ["admin", 200, true],
            ["manager", 200, false],
            ["employee", 401, false],
        ])(
            "Users with role: '%s' should return status: %i when getting data of user with admin role",
            async (
                role: string,
                expectedStatus: number,
                shouldMatch: boolean
            ) => {
                const adminUserData = getRandomUserData(["admin"]) as User;
                const createdAdminUser = await createUser(adminUserData);
                const id = createdAdminUser._id.toString();
                await testUserDetails(
                    role,
                    expectedStatus,
                    tokens,
                    id,
                    shouldMatch
                );
            }
        );
    });

    describe("Given user with manager role", () => {
        test.each([
            ["admin", 200, true],
            ["manager", 200, false],
            ["employee", 401, false],
        ])(
            "Users with role: '%s' should return status: %i when getting data of user with manager role",
            async (
                role: string,
                expectedStatus: number,
                shouldMatch: boolean
            ) => {
                const managerUserData = getRandomUserData(["manager"]) as User;

                const createdManagerUser = await createUser(managerUserData);

                const id = createdManagerUser._id.toString();

                await testUserDetails(
                    role,
                    expectedStatus,
                    tokens,
                    id,
                    shouldMatch
                );
            }
        );
    });
});
