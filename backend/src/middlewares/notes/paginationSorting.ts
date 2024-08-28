import asyncHandler from "express-async-handler";
import { getSortQuery } from "../../utils/helpers/notesController_helpers";
import { isString } from "../../utils/helpers/type_helpers";
import { TaskSort } from "../../types/types";
/**
 * Middleware to handle pagination and sorting for query operations.
 * Extracts `page`, `sortBy` query parameters, and sets pagination and sorting options.
 * Attaches these options to `req.paginationOptions` for use in subsequent handlers.
 *
 * - `page`: Zero-based page number (defaults to 0 if not provided or invalid).
 * - `limit`: Number of items per page (fixed at 6).
 * - `sortBy`: Sorting criteria derived from the query string.
 *
 * Usage: Place this middleware before route handlers that need pagination and sorting.
 */

const toTaskSort = (param: unknown): TaskSort => {
    const validValues = ["newest", "oldest", "pending", "completed"];
    if (isString(param) && validValues.includes(param)) {
        return param as TaskSort;
    }
    return "newest";
};

const paginationSorting = asyncHandler(async (req, _res, next) => {
    const LIMIT = 6;
    const page = Number(req.query.page) - 1 || 0;
    const sortBy = getSortQuery(toTaskSort(req.query.sortBy));

    req.paginationOptions = {
        limit: LIMIT,
        page: page,
        sortBy: sortBy,
    };

    next();
});

export default paginationSorting;
