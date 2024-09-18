// Utils
import asyncHandler from "express-async-handler";
import { toUserRequestBody } from "../../utils/helpers/type_helpers";
import UserPermissionsService from "../permissions/permissions_services";
/**
 * ! Must be used after 'checkTargetUserExists' middleware
 * Middleware function to handle user permissions for updating user roles and active status.
 */

const updateUserPermissions = asyncHandler(async (req, _res, next) => {
    const updates = toUserRequestBody(req.body);

    // Target User Data
    const { targetUser } = req;
    if (!targetUser) throw new Error("Access Denied");

    // Requesting User Data
    const { user: requestingUser } = req;
    if (!requestingUser) throw new Error("Access Denied");

    await UserPermissionsService.canUpdateUser(
        requestingUser,
        targetUser,
        updates
    );

    next();
});

export default updateUserPermissions;
