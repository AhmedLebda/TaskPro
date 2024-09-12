import NoteModel from "../../models/Note";
import { UserRequestBody, UserWithId } from "../../types/types";
import { AssociatedDataError, PermissionError } from "./permission_errors";

/* Permissions:

 * DELETE:
------------
    * Admin: All users except his account
    * Managers: employees only
    * Employees: None
    * ** CONSTRAINS: User who have pending tasks can't be deleted. **
    
 * CREATE:
------------
    * Admin: All roles except "Admin"
    * Managers: employees only
    * Employees: None
 */

class UserPermissionsService {
    // Helper method to check if the user is an admin
    private static isAdmin(user: UserWithId | UserRequestBody): boolean {
        if (!user.roles) return false;
        return user.roles.includes("admin");
    }

    // Helper method to check if the user is a manager
    private static isManager(user: UserWithId | UserRequestBody): boolean {
        if (!user.roles) return false;
        return user.roles.includes("manager");
    }

    // Helper method to check if the user is an employee
    private static isEmployee(user: UserWithId | UserRequestBody): boolean {
        return !this.isAdmin(user) && !this.isManager(user);
    }

    // Helper method to validate users and throw errors if invalid
    private static validateUsers(
        requestingUser: UserWithId,
        targetUser: UserWithId | UserRequestBody,
        action: "delete" | "create"
    ): void {
        if (!targetUser || !requestingUser) {
            throw new PermissionError("Access Denied", 403);
        }

        if (action === "delete" || action === "create") {
            if (this.isEmployee(requestingUser)) {
                throw new PermissionError(
                    "You don't have the permissions to perform this action",
                    401
                );
            }

            if (this.isAdmin(targetUser)) {
                throw new PermissionError("This action is not permitted.", 401);
            }

            if (this.isManager(targetUser) && !this.isAdmin(requestingUser)) {
                throw new PermissionError(
                    "You don't have the permissions to perform this action",
                    401
                );
            }
        }
    }

    static async canDeleteUser(
        requestingUser: UserWithId,
        targetUser: UserWithId
    ): Promise<void> {
        this.validateUsers(requestingUser, targetUser, "delete");

        // Check for associated tasks
        const associatedNotes = await NoteModel.find({
            user: targetUser._id,
        }).exec();
        if (associatedNotes.length > 0) {
            throw new AssociatedDataError(
                "This user still has open tasks and cannot be deleted"
            );
        }
    }

    static async canCreateUser(
        requestingUser: UserWithId,
        targetUser: UserRequestBody
    ): Promise<void> {
        this.validateUsers(requestingUser, targetUser, "create");
    }
}

export default UserPermissionsService;
