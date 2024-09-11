import supertest from "supertest";
import app from "../../app";
import { resetUsersCollection } from "./helpers/user.helpers";
import { loginAsAdmin } from "./helpers/auth.helpers";

const api = supertest(app);

let accessToken: string;
let refreshToken: string;

beforeAll(async () => {
    await resetUsersCollection();
    ({ accessToken, refreshToken } = await loginAsAdmin());
});

describe("Auth Endpoints", () => {
    describe("POST /api/auth - Login", () => {
        test("Admin user can login with correct credentials", async () => {
            const response = await api
                .post("/api/auth")
                .send({ username: "admin", password: "admin" })
                .expect(200);

            expect(response.body).toMatchObject({
                username: "admin",
                roles: expect.arrayContaining(["admin"]),
            });
        });

        test("Admin user can't login with incorrect credentials", async () => {
            const response = await api
                .post("/api/auth")
                .send({ username: "admin", password: "wrong" })
                .expect(400);

            expect(response.body.error).toEqual("Invalid username or password");
        });
    });

    describe("POST /api/auth/logout - Logout", () => {
        test("Logged-in user can log out", async () => {
            const logoutResponse = await api
                .post("/api/auth/logout")
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200);

            expect(logoutResponse.body.message).toEqual("Cookies cleared!");
        });
    });

    describe("GET /api/auth/refresh - Refresh Access Token", () => {
        test("Logged-in user can refresh their access token", async () => {
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
            const refreshResponse = await api
                .get("/api/auth/refresh")
                .expect(400);

            expect(refreshResponse.body.error).toEqual("Invalid Token");
        });
    });
});
