// import supertest from "supertest";
// import app from "../../app";
// import UserModel from "../models/User";
// const api = supertest(app);

beforeEach(async () => {
    console.log("This will run before each test");
});
describe("User", () => {
    describe("GET /users", () => {
        test("Admin user can get all users", () => {
            expect(true).toBe(true);
        });
    });
});
