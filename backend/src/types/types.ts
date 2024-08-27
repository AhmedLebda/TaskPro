import { Types } from "mongoose";

export type Role = "employee" | "manager" | "admin";

export interface User {
    username: string;
    password: string;
    roles: Role[];
    active: boolean;
}

export interface UserWithId extends User {
    _id: Types.ObjectId;
}

export interface UserRequestBody extends Partial<User> {
    id: string;
}
