import supertest from "supertest";
import app from "../../../app";

const api = supertest(app);

export const loginAsAdmin = async () => {
    const response = await api
        .post("/api/auth")
        .send({ username: "admin", password: "admin" })
        .expect(200);

    const accessToken = response.body.access_token;
    const cookies = response.headers["set-cookie"] as unknown as string[];
    const refreshTokenCookie = cookies.find((cookie) =>
        cookie.startsWith("ref_jwt=")
    );

    if (!refreshTokenCookie) {
        throw new Error("Refresh token not found");
    }

    const refreshToken = refreshTokenCookie.split(";")[0].split("=")[1];
    return { accessToken, refreshToken };
};
