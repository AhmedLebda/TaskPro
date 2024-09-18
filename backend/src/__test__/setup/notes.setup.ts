import { resetUsersCollection } from "../helpers/user.helpers";
import supertest from "supertest";
import app from "../../../app";
import { AuthResponse, Tokens } from "../test_types";
import { createNote, deleteAllNotes } from "../helpers/note.helpers";

const api = supertest(app);

const roles = ["employee", "manager", "admin"];
const tokens: Tokens = {};

const setupNotesTests = async (): Promise<Tokens> => {
    if (Object.keys(tokens).length) return tokens;

    await resetUsersCollection();
    await deleteAllNotes();

    // Authenticate users with different roles

    for (const role of roles) {
        const response = (await api
            .post("/api/auth")
            .send({ username: role, password: role })
            .expect(200)) as { body: AuthResponse };

        tokens[role] = {
            access_token: response.body.access_token,
            id: response.body.id,
        };

        // Create notes for authenticated users
        const noteObject = {
            user: response.body.id,
            title: `${role}'s Note`,
            text: "Test note",
        };
        await createNote(noteObject);
    }

    return tokens;
};

export default setupNotesTests;
