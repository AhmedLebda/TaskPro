import asyncHandler from "express-async-handler";
import { toUserRequestBody } from "../../utils/helpers/type_helpers";
/**
 * Middleware function to handle user permissions for creating new user accounts and assigning roles.
 *
 * This middleware performs authorization checks to ensure that only users with appropriate
 * permissions can create new accounts and assign roles:
 *
 * 1. **Admin Role Restriction**:
 *    - Prevents any user from assigning the 'admin' role to a newly created account. This restriction
 *      ensures that only the existing admin user can control and manage 'admin' roles, maintaining
 *      the integrity and security of the administrative hierarchy.
 *
 * 2. **Role Modification Authorization**:
 *    - Limits the ability to assign the 'manager' role to only users with the 'admin' role. This ensures
 *      that only the admin can elevate users to managerial positions, preventing unauthorized role
 *      escalations.
 *
 * If any of these conditions are violated, the middleware responds with a 401 status code and an
 * appropriate error message. If all checks pass, the middleware proceeds by calling `next()` to continue
 * with the request handling.
 */

const createUserPermissions = asyncHandler(async (req, res, next) => {
    const { roles: providedRoles } = toUserRequestBody(req.body);

    if (!providedRoles || providedRoles.length === 0) {
        return next();
    }

    // Requesting User Data
    const { user: requestingUser } = req;

    if (!requestingUser) throw new Error("Access Denied");

    const isRequesterAdmin = requestingUser.roles.includes("admin");

    // User attempts to modify user roles to be 'admin'
    if (providedRoles.includes("admin")) {
        res.status(401).json({
            error: "Access Denied",
            isError: true,
        });
        return;
    }

    // only admin is able to modify users role
    if (!isRequesterAdmin && providedRoles.includes("manager")) {
        res.status(401).json({
            error: "Access Denied: You do not have permission to perform this action.",
            isError: true,
        });
        return;
    }

    next();
});

export default createUserPermissions;
