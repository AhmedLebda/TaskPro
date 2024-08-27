import express, { Request } from "express";
import { User, UserWithId } from "../types";

declare global {
    namespace Express {
        interface Request {
            user?: UserWithId;
            targetUser?: UserWithId;
            providedUserUpdates?: Partial<User>;
            paginationOptions?: { limit: number; page: number };
        }
    }
}
