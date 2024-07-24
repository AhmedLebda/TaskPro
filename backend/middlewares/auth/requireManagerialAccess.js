import asyncHandler from "express-async-handler";
import AuthHelpers from "../../utils/helpers/auth_helpers.js";

// @important: only should be used after requireAuth middleware because it uses the userId from the request object which will only be there if the user passes the require auth check
// Gives access only to users with Admin and Manager roles
const requireManagerialRole = asyncHandler(async (req, res, next) => {
    // Get the requester id (already in the request object because we check for authentication first)
    const userId = req.userId;

    const isManager = await AuthHelpers.isManagerUser(userId);

    // If user isn't a manager or admin respond with an unauthorized error
    if (!isManager) {
        return res
            .status(401)
            .json({ error: "Only Managers are authorized", isError: true });
    }

    next();
});

export default requireManagerialRole;
