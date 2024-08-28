import { Note, SortBy, User, UserWithId } from "../types";

declare global {
    namespace Express {
        interface Request {
            user?: UserWithId;
            targetUser?: UserWithId;
            providedUserUpdates?: Partial<User>;
            providedNoteUpdates?: Partial<Note>;
            paginationOptions?: {
                limit: number;
                page: number;
                sortBy?: SortBy;
            };
        }
    }
}
