import { UserRequestBody, Role } from "../../types/types";

const isString = (param: unknown): param is string => {
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
