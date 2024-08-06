import asyncHandler from "express-async-handler";

// @important: only should be used after requireAuth middleware because it uses the userId from the request object which will only be there if the user passes the require auth check
// Gives access only to users with Admin and Manager roles
const requireManagerialRole = asyncHandler(async (req, res, next) => {
    // Get the requesting user (already in the request object because we check for authentication first)
    const requestingUser = req.user;

    // Check if requesting user have manager or admin role
    const isRequesterAdmin = requestingUser.roles.includes("admin");
    const isRequesterManager = requestingUser.roles.includes("manager");
    const isRequesterManagerOrAdmin = isRequesterAdmin || isRequesterManager;

    // If user isn't a manager or admin respond with an unauthorized error
    if (!isRequesterManagerOrAdmin) {
        return res.status(401).json({
            error: "Access Denied: Only managers are permitted to perform this action.",
            isError: true,
        });
    }

    next();
});

export default requireManagerialRole;
