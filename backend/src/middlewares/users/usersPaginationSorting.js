import asyncHandler from "express-async-handler";

const paginationSorting = asyncHandler(async (req, res, next) => {
    const LIMIT = 6;
    const page = +req.query.page - 1 || 0;

    req.paginationOptions = {
        limit: LIMIT,
        page: page,
    };

    next();
});

export default paginationSorting;
