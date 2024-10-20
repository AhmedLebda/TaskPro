import { UserRequestBody, Role, NoteRequestBody } from "../../types/types";
import { Types } from "mongoose";

export const isString = (param: unknown): param is string => {
	return typeof param === "string" || param instanceof String;
};

const isRole = (value: unknown): value is Role => {
	return ["admin", "manager", "employee"].includes(value as Role);
};

const isBoolean = (value: unknown): value is boolean => {
	return typeof value === "boolean";
};

export const toUserRequestBody = (body: unknown): UserRequestBody => {
	if (!body || typeof body !== "object")
		throw new Error("Invalid or missing data");

	const { id, username, password, roles, active } = body as UserRequestBody;

	if (id !== undefined && !isString(id)) {
		throw new Error("Invalid data: id should be a string");
	}

	if (username !== undefined && !isString(username)) {
		throw new Error("Invalid data: username should be a string");
	}

	if (password !== undefined && !isString(password)) {
		throw new Error("Invalid data: password should be a string");
	}

	if (roles !== undefined) {
		if (!Array.isArray(roles)) {
			throw new Error("Invalid data: roles should be an array");
		}
		if (!roles.every(isRole)) {
			throw new Error("Invalid data: roles contain invalid values");
		}
	}

	if (active !== undefined && !isBoolean(active)) {
		throw new Error("Invalid data: active status should be a boolean");
	}

	return {
		id,
		username,
		password,
		roles,
		active,
	};
};

export const toNoteRequestBody = (body: unknown): NoteRequestBody => {
	if (!body || typeof body !== "object")
		throw new Error("Invalid or missing data");

	const { id, user, title, text, completed } = body as NoteRequestBody;

	if (id !== undefined && !isString(id)) {
		throw new Error("Invalid data: id should be a string");
	}
	if (user !== undefined && !Types.ObjectId.isValid(user as Types.ObjectId)) {
		throw new Error("Invalid data: user should be a string");
	}
	if (title !== undefined && !isString(title)) {
		throw new Error("Invalid data: title should be a string");
	}
	if (text !== undefined && !isString(text)) {
		throw new Error("Invalid data: text should be a string");
	}
	if (completed !== undefined && typeof completed !== "boolean") {
		throw new Error("Invalid data: completed should be a boolean");
	}
	return {
		id,
		user,
		title,
		text,
		completed,
	};
};
