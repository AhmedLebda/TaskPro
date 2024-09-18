import supertest from "supertest";
import app from "../../../app";
import { Tokens } from "../test_types";
import setupNotesTests from "../setup/notes.setup";
import { testNotesListAccess } from "../helpers/note.helpers";

const api = supertest(app);

let tokens: Tokens;

beforeAll(async () => {
    tokens = await setupNotesTests();
});

describe("GET /api/notes - Get All Notes List", () => {
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
