import supertest from "supertest";
import app from "../../../app";
import { Tokens } from "../test_types";
import setupNotesTests from "../setup/notes.setup";
import {
    testNotesListAccess,
    testUserNotesListAccess,
    // testUserNotesListAccess,
} from "../helpers/note.helpers";

const api = supertest(app);

let tokens: Tokens;

beforeAll(async () => {
    tokens = await setupNotesTests();
});

describe.skip("GET /api/notes - Get All Notes List", () => {
    test("Unauthenticated user can't access users list", async () => {
        await api.get("/api/users").expect(400);
    });

    test.each([
        ["admin", 200, true],
        ["manager", 200, true],
        ["employee", 401, false],
    ])(
        "Users with role '%s' should return status %i when accessing All Notes list",

        async (role: string, expectedStatus: number, shouldMatch: boolean) => {
            await testNotesListAccess(
                role,
                expectedStatus,
                tokens,
                shouldMatch
            );
        }
    );
});

describe("GET /api/notes/:targetUserId - Get User Notes List", () => {
    test("should return 400 error when accessing notes for an invalid user", async () => {
        await api
            .get("/api/users/invalid")
            .set("Authorization", `Bearer ${tokens["admin"].access_token}`)
            .expect(400);
    });

    describe("Given note created by employee", () => {
        test.each([
            ["admin", 200, true],
            ["manager", 200, true],
            ["employee", 200, true],
        ])(
            "Users with role '%s' should return status %i when accessing notes created by Employee",

            async (
                role: string,
                expectedStatus: number,
                shouldMatch: boolean
            ) => {
                const targetEmployee = tokens["employee"].id;
                await testUserNotesListAccess(
                    role,
                    expectedStatus,
                    tokens,
                    targetEmployee,
                    shouldMatch
                );
            }
        );
    });

    describe("Given note created by Admin", () => {
        test.each([
            ["admin", 200, true],
            ["manager", 200, true],
            ["employee", 400, false],
        ])(
            "Users with role '%s' should return status %i when accessing notes created by Admin",

            async (
                role: string,
                expectedStatus: number,
                shouldMatch: boolean
            ) => {
                const targetEmployee = tokens["admin"].id;
                await testUserNotesListAccess(
                    role,
                    expectedStatus,
                    tokens,
                    targetEmployee,
                    shouldMatch
                );
            }
        );
    });

    describe("Given note created by Manager", () => {
        test.each([
            ["admin", 200, true],
            ["manager", 200, true],
            ["employee", 400, false],
        ])(
            "Users with role '%s' should return status %i when accessing notes created by Manager",

            async (
                role: string,
                expectedStatus: number,
                shouldMatch: boolean
            ) => {
                const targetEmployee = tokens["manager"].id;
                await testUserNotesListAccess(
                    role,
                    expectedStatus,
                    tokens,
                    targetEmployee,
                    shouldMatch
                );
            }
        );
    });
});
