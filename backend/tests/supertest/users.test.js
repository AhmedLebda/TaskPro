import { test, describe, after, beforeEach } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../app";
import User from "../../models/User";
import { usersInDb } from "../../utils/test_helpers/user_helpers";
import AuthHelpers from "../../utils/helpers/auth_helpers";

const api = supertest(app);

let firstUserId = null;
// ## Reset the db before every test ## //
beforeEach(async () => {
    console.log("resetting db...");
    await User.deleteMany({});
    const user = new User({
        username: "root",
        password: "UA0FYIgXIYSp2K",
    });
    user.password = await AuthHelpers.generateHashedPassword(user.password);
    const firstUser = await user.save();
    firstUserId = firstUser.id;
    console.log(`user ${user.username} is created!`);
});

describe("Initial db state", () => {
    test("Have one user", async () => {
        const initialUsers = await usersInDb();
        assert.strictEqual(initialUsers.length, 1);
    });

    test("first user username is root", async () => {
        const initialUsers = await usersInDb();
        const username = initialUsers[0].username;
        assert.strictEqual(username, "root");
    });

    test("first user default data are correct", async () => {
        const initialUsers = await usersInDb();
        const roles = initialUsers[0].roles;
        const active = initialUsers[0].active;
        assert.deepStrictEqual(roles, ["Employee"]);
        assert.strictEqual(active, true);
    });
});

describe("User Creation", () => {
    test("successfully add user to db with correct data", async () => {
        const initialUsers = await usersInDb();

        const user = {
            username: "Lester",
            password: "tI8wDvAjVX9N0u",
        };

        const response = await api
            .post("/api/users")
            .send(user)
            .expect(201)
            .expect("Content-Type", /json/);

        const updatedUsers = await usersInDb();

        assert.strictEqual(updatedUsers.length, initialUsers.length + 1);
        assert.strictEqual(response.body.username, updatedUsers[1].username);
    });

    test("Fail to add user to db with incorrect data", async () => {
        const initialUsers = await usersInDb();

        const user = {};

        await api.post("/api/users").send(user).expect(400);

        const updatedUsers = await usersInDb();

        assert.strictEqual(updatedUsers.length, initialUsers.length);
    });

    test("Fail to add user with existing username", async () => {
        const initialUsers = await usersInDb();

        const user = {
            username: "root",
            password: "UA0FYIgXIYSp2K",
        };

        await api.post("/api/users").send(user).expect(400);

        const updatedUsers = await usersInDb();

        assert.strictEqual(updatedUsers.length, initialUsers.length);
    });

    test("successfully add users when roles are provided", async () => {
        const user = {
            username: "Lester",
            password: "tI8wDvAjVX9N0u",
            roles: ["admin"],
        };

        const response = await api
            .post("/api/users")
            .send(user)
            .expect(201)
            .expect("Content-Type", /json/);
        assert.deepStrictEqual(response.body.roles, ["admin"]);
    });
});

describe("User update", () => {
    test("successfully update user with correct data", async () => {
        const updates = {
            id: firstUserId,
            username: "Lester",
        };

        await api
            .patch("/api/users")
            .send(updates)
            .expect(200)
            .expect("Content-Type", /json/);

        const updatedUsers = await usersInDb();

        assert.strictEqual(updatedUsers[0].username, "Lester");
    });

    test("fail to update user with incorrect data", async () => {
        const updates = {
            id: "invalid id",
            username: "Lester",
        };

        await api
            .patch("/api/users")
            .send(updates)
            .expect(400)
            .expect("Content-Type", /json/);

        const updatedUsers = await usersInDb();

        assert.strictEqual(updatedUsers[0].username, "root");
    });
});
describe("User delete", () => {
    test("successfully delete user with correct id", async () => {
        const initialUsers = await usersInDb();

        const requestBody = {
            id: firstUserId,
        };

        await api.delete("/api/users").send(requestBody).expect(204);

        const updatedUsers = await usersInDb();

        assert.strictEqual(updatedUsers.length, initialUsers.length - 1);
    });

    test("fail to delete user with incorrect id", async () => {
        const initialUsers = await usersInDb();

        const updates = {
            id: "invalid id",
        };

        await api
            .delete("/api/users")
            .send(updates)
            .expect(400)
            .expect("Content-Type", /json/);

        const updatedUsers = await usersInDb();

        assert.strictEqual(updatedUsers.length, initialUsers.length);
    });
});

describe.skip("user Login", () => {
    test("Login: Successfully with valid credentials", async () => {
        const userData = { username: "root", password: "UA0FYIgXIYSp2K" };

        const res = await api
            .post("/api/users/login")
            .send(userData)
            .expect(200)
            .expect("Content-Type", /json/);

        assert(Object.keys(res.body).includes("access_token"));
    });

    test("Login: Fail with invalid credentials", async () => {
        const userData = { username: "root", password: "UA0" };
        const res = await api
            .post("/api/users/login")
            .send(userData)
            .expect(400)
            .expect("Content-Type", /json/);

        assert(Object.keys(res.body).includes("error"));
    });
});

// ## Close the db connection after running all tests ## //
after(async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
});
