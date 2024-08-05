import mongoose from "mongoose";
// Models
import UserModel from "../../models/User.js";
// Utils
import AuthHelpers from "../../utils/helpers/auth_helpers.js";
import asyncHandler from "express-async-handler";

// @desc: Checks the permissions before updating users info
/* @permissions: 
-   employees can only update their own account info
-   employees can't update their roles
-   only admins can update accounts with admin role
-   only admins can update account role to admin
 */
const checkUserUpdatePermissions = asyncHandler(async (req, res, next) => {
    // Getting the id of user which is requested to update
    const { id, roles } = req.body;

    // Id of the user who made the request
    const requesterUserId = req.userId;

    // Check requester roles
    const isManagerOrAdmin = await AuthHelpers.isManagerUser(requesterUserId);
    const isAdmin = await AuthHelpers.isAdminUser(requesterUserId);

    // Throw error if id isn't provided or not a valid ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw Error("invalid id");
    }

    // Check user exists in the db
    const user = await UserModel.findById(id).lean();

    if (!user) {
        throw Error("user not found");
    }

    // Throw Error if user who made request isn't the account owner or an admin or manager
    if (requesterUserId !== id && !isManagerOrAdmin) {
        return res.status(401).json({
            error: "Access Denied: Only managers are permitted to perform this action.",
            isError: true,
        });
    }

    // Throw Error if user tries to update role and he isn't a manager or admin
    if (roles && !isManagerOrAdmin) {
        return res.status(401).json({
            error: "Access Denied: Only managers are permitted to perform this action.",
            isError: true,
        });
    }

    // Throw error if the request tries to update user to have admin role
    if (roles?.includes("admin")) {
        return res.status(401).json({
            error: "Access Denied",
            isError: true,
        });
    }

    // Throw error if user is not an admin and tries to update info of a user with admin role
    if (user.roles.includes("admin") && !isAdmin) {
        return res.status(401).json({
            error: "Access Denied: Only admins are permitted to perform this action.",
            isError: true,
        });
    }

    next();
});

export default checkUserUpdatePermissions;
