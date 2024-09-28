import supertest from "supertest";
import app from "../../../app";
import { testUsersListAccess } from "../helpers/user.helpers";

import setupUserTests from "../setup/user.setup";
import { Tokens } from "../test_types";

const api = supertest(app);

let tokens: Tokens;

beforeAll(async () => {
    tokens = await setupUserTests();
});

describe("GET /users: Get Users List", () => {
    test("Unauthenticated user can't access users list", async () => {
        await api.get("/api/users").expect(400);
    });

    test.each([
        ["employee", 401, false],
        ["manager", 200, true],
        ["admin", 200, true],
    ])(
        "Users with role '%s' should return status %i when accessing users list",

        async (role: string, expectedStatus: number, shouldMatch: boolean) => {
            await testUsersListAccess(
                role,
                expectedStatus,
                tokens,
                shouldMatch
            );
        }
    );
});
