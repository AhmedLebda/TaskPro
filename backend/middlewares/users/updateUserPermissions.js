// Utils
import asyncHandler from "express-async-handler";

/**
 * ! Must be used after 'checkTargetUserExists' middleware
 * Middleware function to handle user permissions for updating user roles and active status.
 *
 * This middleware performs the following checks to ensure proper authorization before allowing
 * changes to user roles and account status:
 *
 * 1. **Admin Role Restriction**:
 *    - Prevents any user from assigning the 'admin' role to another user. This is because only
 *      administrators should have the capability to manage such critical roles.
 *
 * 2. **Admin Role Protection**:
 *    - Restricts modifications to the admin account. Admin account is protected
 *      from having their roles changed to prevent potential security issues.
 *
 * 3. **Active Status of Admin Accounts**:
 *    - Prevents deactivation of accounts with the 'admin' role to ensure critical accounts remain active
 *      and operational.
 *
 * 4. **Employee Account Restrictions**:
 *    - Ensures that users who are neither 'admin' nor 'manager' cannot modify accounts other than their
 *      own, safeguarding user data from unauthorized changes.
 *
 * 5. **Manager Restrictions**:
 *    - Limits 'manager' users from modifying 'admin' or other 'manager' accounts to maintain hierarchy
 *      and prevent potential misuse of permissions.
 *
 * If any of these conditions are violated, the middleware responds with a 401 status code and an
 * appropriate error message. If all checks pass, the middleware calls `next()` to proceed with the
 * request handling.
 */

const updateUserPermissions = asyncHandler(async (req, res, next) => {
    const { roles: providedRoles, active: providedActiveStatus } = req.body;
    // Target User Data
    const { targetUser } = req;
    const { _id: targetUserId } = targetUser;
    const isTargetUserAdmin = targetUser.roles.includes("admin");
    const isTargetUserAdminOrManager = targetUser.roles.some(
        (role) => role === "admin" || role === "manager"
    );

    // Requesting User Data
    const { user: requestingUser } = req;
    const { _id: requestingUserId } = requestingUser;
    const isRequesterAdmin = requestingUser.roles.includes("admin");
    const isRequesterManager = requestingUser.roles.includes("manager");
    const isRequesterAdminOrManager = isRequesterAdmin || isRequesterManager;
    const isRequesterTheAccountOwner =
        requestingUserId.toString() === targetUserId.toString();

    // User attempts to modify user roles to be 'admin'
    if (providedRoles?.includes("admin")) {
        return res.status(401).json({
            error: "Access Denied",
            isError: true,
        });
    }

    // only admin is able to modify users role
    if (!isRequesterAdmin && providedRoles) {
        return res.status(401).json({
            error: "Access Denied: You do not have permission to perform this action.",
            isError: true,
        });
    }

    // Admin account roles can't be modified
    if (isTargetUserAdmin && providedRoles) {
        return res.status(401).json({
            error: "Admin account roles can't be modified",
            isError: true,
        });
    }

    // Admin account active status can't be modified
    if (isTargetUserAdmin && providedActiveStatus === false) {
        return res.status(401).json({
            error: "Admin account can't be deactivated",
            isError: true,
        });
    }

    // Employees can't modify another user account
    if (!isRequesterAdminOrManager && !isRequesterTheAccountOwner) {
        return res.status(401).json({
            error: "Access Denied: You do not have permission to perform this action.",
            isError: true,
        });
    }

    // Managers can't modify the admin or another manager account
    if (
        isRequesterManager &&
        isTargetUserAdminOrManager &&
        !isRequesterTheAccountOwner
    ) {
        return res.status(401).json({
            error: "Access Denied: You do not have permission to perform this action.",
            isError: true,
        });
    }

    next();
});

export default updateUserPermissions;
