import supertest from "supertest";
import app from "../../app";
import { resetUsersCollection } from "./helpers/user.helpers";

const api = supertest(app);

beforeEach(async () => {
    await resetUsersCollection();
});

describe("POST /api/auth", () => {
    test("Admin user can login with correct credentials", async () => {
        const response = await api
            .post("/api/auth")
            .send({ username: "admin", password: "admin" })
            .expect(200);
        expect(response.body.username).toEqual("admin");
        expect(Array.isArray(response.body.roles)).toBe(true);
        expect(response.body.roles).toContain("admin");
    });

    test("Admin user can't login without correct credentials", async () => {
        const response = await api
            .post("/api/auth")
            .send({ username: "admin", password: "wrong" })
            .expect(400);
        expect(response.body.error).toEqual("Invalid username or password");
    });
});

describe("POST /api/auth/logout", () => {
    test("Logged-in user can log out", async () => {
        // Login
        const loginResponse = await api
            .post("/api/auth")
            .send({ username: "admin", password: "admin" })
            .expect(200);

        // Logout
        const logoutResponse = await api
            .post("/api/auth/logout")
            .set("Authorization", `Bearer ${loginResponse.body.access_token}`)
            .expect(200);
        expect(logoutResponse.body.message).toEqual("Cookies cleared!");
    });
});

describe("GET /api/auth/refresh", () => {
    test("Logged-in user can refresh their access token", async () => {
        // Login
        const loginResponse = await api
            .post("/api/auth")
            .send({ username: "admin", password: "admin" })
            .expect(200);
        // Extract the cookie from the response
        const cookies = loginResponse.headers[
            "set-cookie"
        ] as unknown as string[];
        const refreshTokenCookie = cookies.find((cookie) =>
            cookie.startsWith("ref_jwt=")
        );

        // Ensure the cookie is found
        expect(refreshTokenCookie).toBeDefined();

        // Extract the token value from the cookie string
        const refreshToken = refreshTokenCookie?.split(";")[0].split("=")[1];

        // Refresh token
        const refreshResponse = await api
            .get("/api/auth/refresh")
            .set("Cookie", `ref_jwt=${refreshToken}`)
            .expect(200);

        expect(refreshResponse.body.access_token).toBeTruthy();
        expect(refreshResponse.body).toMatchObject({
            access_token: expect.any(String),
            id: expect.any(String),
            username: expect.any(String),
            roles: expect.any(Array),
            active: expect.any(Boolean),
        });
    });

    test("Logged-out user can't refresh their access token", async () => {
        const refreshResponse = await api.get("/api/auth/refresh").expect(400);
        expect(refreshResponse.body.error).toEqual("Invalid Token");
    });
});
