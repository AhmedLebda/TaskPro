import setupUserTests from "../setup/user.setup";
import { Tokens } from "../test_types";
import {
    createUser,
    getRandomUserData,
    testUserDelete,
} from "../helpers/user.helpers";
import { User } from "../../types/types";
import { Types } from "mongoose";

let tokens: Tokens;

beforeAll(async () => {
    tokens = await setupUserTests();
});

describe("DELETE /users: delete user by id", () => {
    describe("Given Invalid user id", () => {
        test.each([
            ["admin", 400],
            ["manager", 400],
            ["employee", 401],
        ])(
            "Users with role: '%s' should return status: %i when deleting a user with invalid id",
            async (role: string, expectedStatus: number) => {
                await testUserDelete(
                    role,
                    expectedStatus,
                    tokens,
                    new Types.ObjectId()
                );
            }
        );
    });

    describe("given user with employee role", () => {
        test.each([
            ["admin", 204],
            ["manager", 204],
            ["employee", 401],
        ])(
            "Users with role: '%s' should return status: %i when deleting a user with employee role",
            async (role: string, expectedStatus: number) => {
                const employeeUserData = getRandomUserData([
                    "employee",
                ]) as User;
                const createdEmployeeUser = await createUser(employeeUserData);

                await testUserDelete(
                    role,
                    expectedStatus,
                    tokens,
                    createdEmployeeUser._id
                );
            }
        );
    });

    describe("Given user with admin role", () => {
        test.each([
            ["admin", 401],
            ["manager", 401],
        ])(
            "Users with role: '%s' should return status: %i when deleting a user with admin role",
            async (role: string, expectedStatus: number) => {
                const adminUserData = getRandomUserData(["admin"]) as User;
                const createdAdminUser = await createUser(adminUserData);

                await testUserDelete(
                    role,
                    expectedStatus,
                    tokens,
                    createdAdminUser._id
                );
            }
        );
    });

    describe("Given user with manager role", () => {
        test.each([
            ["admin", 204],
            ["manager", 401],
        ])(
            "Users with role: '%s' should return status: %i when deleting a user with manager role",
            async (role: string, expectedStatus: number) => {
                const managerUserData = getRandomUserData(["manager"]) as User;
                const createdManagerUser = await createUser(managerUserData);

                await testUserDelete(
                    role,
                    expectedStatus,
                    tokens,
                    createdManagerUser._id
                );
            }
        );
    });
});
