import { Document, SortOrder, Types } from "mongoose";

export type Role = "employee" | "manager" | "admin";

export interface User {
	username: string;
	password: string;
	roles: Role[];
	active: boolean;
}

export interface UserWithId extends User, Document {
	_id: Types.ObjectId;
}

export interface UserRequestBody extends Partial<User> {
	id: string;
}

export interface UserQueryResponse {
	data: UserWithId[];
	totalPages: number;
}

export interface Note {
	user: Types.ObjectId | UserWithId;
	title: string;
	text: string;
	completed: boolean;
	ticket: number;
}

export interface NoteWithId extends Note, Document {
	_id: Types.ObjectId;
}

export interface PopulatedNote extends Omit<NoteWithId, "user"> {
	user: UserWithId;
}

export interface NoteRequestBody extends Partial<Note> {
	id: string;
}
export interface NoteQueryResponse {
	data: PopulatedNote[];
	totalPages: number;
}

export interface SortBy {
	[key: string]: SortOrder;
}

export type TaskSort = "newest" | "oldest" | "pending" | "completed";
