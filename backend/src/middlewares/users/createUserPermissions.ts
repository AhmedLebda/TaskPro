import asyncHandler from "express-async-handler";
import { toUserRequestBody } from "../../utils/helpers/type_helpers";
import UserPermissionsService from "../permissions/permissions_services";

/**
 * Middleware function to handle user permissions for creating new user accounts and assigning roles.
 */

const createUserPermissions = asyncHandler(async (req, _res, next) => {
    const targetUser = toUserRequestBody(req.body);

    // Requesting User Data
    const { user: requestingUser } = req;

    if (!requestingUser) throw new Error("Access Denied");

    await UserPermissionsService.canCreateUser(requestingUser, targetUser);

    next();
});

export default createUserPermissions;
