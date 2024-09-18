import asyncHandler from "express-async-handler";
// import NoteModel from "../../models/Note";
import UserPermissionsService from "../permissions/permissions_services";

/**
 * ! Must be used after 'checkTargetUserExists' middleware
 * Middleware function to handle user permissions for deleting user accounts.
 */

const deleteUserPermissions = asyncHandler(async (req, _res, next) => {
    // Target User Data
    const { targetUser } = req;
    if (!targetUser) throw new Error("Access Denied");

    // Requesting User Data
    const { user: requestingUser } = req;
    if (!requestingUser) throw new Error("Access Denied");

    await UserPermissionsService.canDeleteUser(requestingUser, targetUser);

    next();
});

export default deleteUserPermissions;
