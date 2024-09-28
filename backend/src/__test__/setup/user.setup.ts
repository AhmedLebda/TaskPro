import { resetUsersCollection } from "../helpers/user.helpers";
import supertest from "supertest";
import app from "../../../app";
import { AuthResponse, Tokens } from "../test_types";

const api = supertest(app);

const roles = ["employee", "manager", "admin"];
const tokens: Tokens = {};

const setupUserTests = async (): Promise<Tokens> => {
	if (Object.keys(tokens).length) return tokens;

	await resetUsersCollection();

	// Authenticate users with different roles

	for (const role of roles) {
		const response = (await api
			.post("/api/auth")
			.send({ username: role, password: role })
			.expect(200)) as { body: AuthResponse };
		tokens[role] = tokens[role] = {
			access_token: response.body.access_token,
			id: response.body.id,
		};
	}

	return tokens;
};

export default setupUserTests;
