import UserModel from "../../models/User";
import createAdmin from "../../config/initialAdmin";
import AuthHelpers from "../../utils/helpers/auth_helpers";
import supertest from "supertest";
import app from "../../../app";
import { Role, User } from "../../types/types";

const api = supertest(app);

type UserData = Omit<User, "active">;

const managerUserData: UserData = {
    username: "manager",
    password: "manager",
    roles: ["manager"],
};
const employeeUserData: UserData = {
    username: "employee",
    password: "employee",
    roles: ["employee"],
};

const createUser = async (data: UserData) => {
    const { username, password, roles } = data;

    const hashedPassword = await AuthHelpers.generateHashedPassword(password);

    const user = new UserModel({ username, password: hashedPassword, roles });

    await user.save();

    console.log(`INFO: ${data.roles[0]} user created successfully`);

    return user;
};

const deleteAllUsers = async (): Promise<void> => {
    console.log("INFO: Deleting all users");
    await UserModel.deleteMany({});
};

export const resetUsersCollection = async (): Promise<void> => {
    try {
        console.log("INFO: Resetting db...");

        const actions = [
            deleteAllUsers(),
            createAdmin(),
            createUser(managerUserData),
            createUser(employeeUserData),
        ];

        await Promise.all(actions);
    } catch (error) {
        console.error("ERROR: Failed to reset users collection", error);
        throw error;
    }
};

export const getRandomUserData = (roles: Role[]): Partial<User> => {
    return {
        username: `user-${Math.random().toString(36)}`,
        password: "password",
        roles: roles,
        active: true,
    };
};

export const testUsersListAccess = async (
    role: string,
    expectedStatus: number,
    tokens: { [role: string]: string },
    shouldMatch: boolean
) => {
    const response = await api
        .get("/api/users")
        .set("Authorization", `Bearer ${tokens[role]}`)
        .expect(expectedStatus);

    if (shouldMatch) {
        expect(response.body.data.length).toEqual(3);
        expect(response.body.data[0]).toMatchObject({
            _id: expect.any(String),
            username: expect.any(String),
            roles: expect.any(Array),
            active: expect.any(Boolean),
        });
    }
};

export const testUserCreate = async (
    role: string,
    expectedStatus: number,
    tokens: { [role: string]: string },
    userData: Partial<User>,
    shouldMatch: boolean
) => {
    const response = await api
        .post("/api/users")
        .set("Authorization", `Bearer ${tokens[role]}`)
        .send(userData)
        .expect(expectedStatus);

    if (shouldMatch) {
        expect(response.body).toMatchObject({
            id: expect.any(String),
            username: expect.any(String),
            roles: expect.any(Array),
            active: expect.any(Boolean),
        });
    }
};
