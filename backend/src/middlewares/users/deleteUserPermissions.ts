import asyncHandler from "express-async-handler";
import NoteModel from "../../models/Note";

/**
 * ! Must be used after 'checkTargetUserExists' middleware
 * Middleware function to handle user permissions for deleting user accounts.
 *
 * This middleware ensures that only authorized users can delete accounts and enforces certain
 * restrictions to maintain system integrity:
 *
 * 1. **Manager Deletion Restriction**:
 *    - Allows only users with the 'admin' role to delete accounts with 'admin' or 'manager' roles.
 *      This ensures that lower-level users cannot delete higher-level accounts, preserving the
 *      administrative structure and preventing potential misuse of permissions.
 *
 * 2. **Admin Account Protection**:
 *    - Prevents the deletion of any user with the 'admin' role. This is crucial to protect the
 *      existence of the critical admin account, ensuring that the system always has an administrator
 *      available for management and oversight.
 *
 * 3. **Associated Notes Check**:
 *    - Checks if the user to be deleted has any associated notes (or tasks). If the user still has
 *      open tasks or notes, the deletion is blocked to avoid losing important data or breaking
 *      ongoing workflows. An error is thrown to indicate that the deletion cannot proceed due to
 *      existing associated data.
 *
 * If any of these conditions are violated, the middleware responds with an appropriate error message
 * and status code (401 for permission issues, or a thrown error for associated notes). If all checks
 * pass, the middleware calls `next()` to proceed with the deletion request.
 */

const deleteUserPermissions = asyncHandler(async (req, res, next) => {
    // Target User Data
    const { targetUser } = req;
    if (!targetUser) throw new Error("Access Denied");

    const { _id: targetUserId } = targetUser;
    const isTargetUserAdmin = targetUser.roles.includes("admin");
    const isTargetUserAdminOrManager = targetUser.roles.some(
        (role) => role === "admin" || role === "manager"
    );

    // Requesting User Data
    const { user: requestingUser } = req;
    if (!requestingUser) throw new Error("Access Denied");

    const isRequesterAdmin = requestingUser.roles.includes("admin");

    // only admins are permitted to delete managers
    if (!isRequesterAdmin && isTargetUserAdminOrManager) {
        res.status(401).json({
            error: "You don't have the permissions to do this action",
            isError: true,
        });
        return;
    }

    // Throw error if request tries to delete an admin user
    if (isTargetUserAdmin) {
        res.status(401).json({
            error: "Admin account can't be deleted",
            isError: true,
        });
        return;
    }

    // Check if the user still have any notes associated to him
    const associatedNotes = await NoteModel.find({ user: targetUserId });

    // if the user have notes then it can't be deleted
    if (associatedNotes.length > 0) {
        throw Error(
            "This user still have opened tasks and it can't be deleted"
        );
    }

    next();
});

export default deleteUserPermissions;
