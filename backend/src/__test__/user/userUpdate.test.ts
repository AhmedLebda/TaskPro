import setupUserTests from "../setup/user.setup";
import { Tokens } from "../test_types";
import {
    createUser,
    getRandomUserData,
    testUserUpdate,
} from "../helpers/user.helpers";
import { User } from "../../types/types";
import { Types } from "mongoose";
import UserModel from "../../models/User";

let tokens: Tokens;

beforeAll(async () => {
    tokens = await setupUserTests();
});

describe("PATCH /users: update user by id", () => {
    describe("Given Invalid user id", () => {
        const updates = { id: new Types.ObjectId().toString() };
        test.each([
            ["admin", 400],
            ["manager", 400],
            ["employee", 400],
        ])(
            "Users with role: '%s' should return status: %i when updating a user with invalid id",
            async (role: string, expectedStatus: number) => {
                await testUserUpdate(role, expectedStatus, tokens, updates);
            }
        );
    });

    describe("given user with employee role", () => {
        test.each([
            ["admin", 200],
            ["manager", 200],
            ["employee", 401],
        ])(
            "Users with role: '%s' should return status: %i when updating a user with employee role",
            async (role: string, expectedStatus: number) => {
                const employeeUserData = getRandomUserData([
                    "employee",
                ]) as User;
                const createdEmployeeUser = await createUser(employeeUserData);

                const updates = {
                    id: createdEmployeeUser._id.toString(),
                    active: false,
                };

                await testUserUpdate(role, expectedStatus, tokens, updates);
                const updatedEmployeeUser = await UserModel.findById(
                    createdEmployeeUser._id.toString()
                );

                if (role !== "employee")
                    expect(updatedEmployeeUser?.active).toBe(false);
            }
        );

        test("Employee updating his own account", async () => {
            const employee = await UserModel.findOne({ username: "employee" });

            const updates = {
                id: employee?._id.toString(),
                username: "updatedEmployee",
            };

            await testUserUpdate("employee", 200, tokens, updates);

            const updatedEmployeeUser = await UserModel.findById(
                employee?._id.toString()
            );

            expect(updatedEmployeeUser?.username).toBe("updatedEmployee");
        });
    });

    describe("Given user with admin role", () => {
        test.each([
            ["admin", 401],
            ["manager", 401],
        ])(
            "Users with role: '%s' should return status: %i when deactivate a user with admin role",
            async (role: string, expectedStatus: number) => {
                const admin = await UserModel.findOne({ username: "admin" });

                const updates = { id: admin?._id.toString(), active: false };
                await testUserUpdate(role, expectedStatus, tokens, updates);
            }
        );

        test("Admin can update his own username", async () => {
            const admin = await UserModel.findOne({ username: "admin" });

            const updates = {
                id: admin?._id.toString(),
                username: "updatedAdmin",
            };

            await testUserUpdate("admin", 200, tokens, updates);

            const updatedAdmin = await UserModel.findById(
                admin?._id.toString()
            );

            expect(updatedAdmin?.username).toBe("updatedAdmin");
        });
    });

    describe("Given user with manager role", () => {
        test.each([
            ["admin", 200],
            ["manager", 401],
        ])(
            "Users with role: '%s' should return status: %i when updating a user with manager role",
            async (role: string, expectedStatus: number) => {
                const managerUserData = getRandomUserData(["manager"]) as User;
                const createdManagerUser = await createUser(managerUserData);

                const updates = {
                    id: createdManagerUser._id.toString(),
                    active: false,
                };

                await testUserUpdate(role, expectedStatus, tokens, updates);
            }
        );

        test("manager can update his own username", async () => {
            const manager = await UserModel.findOne({ username: "manager" });

            const updates = {
                id: manager?._id.toString(),
                username: "updatedManager",
            };

            await testUserUpdate("manager", 200, tokens, updates);

            const updatedManager = await UserModel.findById(
                manager?._id.toString()
            );

            expect(updatedManager?.username).toBe("updatedManager");
        });
    });
});
