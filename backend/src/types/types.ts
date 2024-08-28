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

export interface Note {
    user: Types.ObjectId;
    title: string;
    text: string;
    completed: boolean;
    ticket: number;
}

export interface NoteWithId extends Note {
    _id: Types.ObjectId;
}

export interface PopulatedNote extends Omit<NoteWithId, "user"> {
    user: UserWithId;
}

export interface NoteRequestBody extends Partial<Note> {
    id: string;
}

export interface SortBy {
    completed: number;
    createdAt: number;
}

export type TaskSort = "newest" | "oldest" | "pending" | "completed";
