import NoteModel from "../../models/Note";
import { UserRequestBody, UserWithId } from "../../types/types";
import { AssociatedDataError, PermissionError } from "./permission_errors";

/* UserPermissionsService:

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

 * UPDATE:
------------
    * Admin: All roles except his roles and active status
    * Managers: employees active status and his username and password
    * Employees: his username and password only
* GET DETAILS: 
------------
    * Admin: All users
    * Managers: All users
    * Employees: His account details only
 */

class BasePermissions {
	// Helper method to check if the user is an admin
	protected static isAdmin(user: UserWithId | UserRequestBody): boolean {
		if (!user.roles) return false;
		return user.roles.includes("admin");
	}

	// Helper method to check if the user is a manager
	protected static isManager(user: UserWithId | UserRequestBody): boolean {
		if (!user.roles) return false;
		return user.roles.includes("manager");
	}

	// Helper method to check if the user is an employee
	protected static isEmployee(user: UserWithId | UserRequestBody): boolean {
		return !this.isAdmin(user) && !this.isManager(user);
	}

	protected static isAccountOwner(
		requestingUser: UserWithId,
		targetUser: UserWithId
	): boolean {
		return requestingUser._id.toString() === targetUser._id.toString();
	}
}

export class UserPermissionsService extends BasePermissions {
	// Helper method to validate users and throw errors if invalid
	private static validateUsers(
		requestingUser: UserWithId,
		targetUser: UserWithId | UserRequestBody
	): void {
		if (!targetUser || !requestingUser) {
			throw new PermissionError("Access Denied", 403);
		}

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

	static async canDeleteUser(
		requestingUser: UserWithId,
		targetUser: UserWithId
	): Promise<void> {
		this.validateUsers(requestingUser, targetUser);

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
		this.validateUsers(requestingUser, targetUser);
	}

	static async canUpdateUser(
		requestingUser: UserWithId,
		targetUser: UserWithId,
		updates: UserRequestBody
	): Promise<void> {
		const {
			roles: providedRoles,
			active: providedActiveStatus,
			username: providedUsername,
			password: providedPassword,
		} = updates;

		// User attempts to modify user roles to be 'admin'
		if (providedRoles?.includes("admin")) {
			throw new PermissionError(
				"You do not have permission to perform this action.",
				401
			);
		}

		// only admin is able to modify users role
		if (!this.isAdmin(requestingUser) && providedRoles) {
			throw new PermissionError(
				"You do not have permission to perform this action.",
				401
			);
		}

		if (this.isAdmin(targetUser)) {
			if (
				providedRoles ||
				providedActiveStatus === false ||
				!this.isAdmin(requestingUser)
			) {
				throw new PermissionError(
					"You do not have permission to perform this action.",
					401
				);
			}
		}

		// Employees can't modify another user account
		if (this.isEmployee(requestingUser)) {
			if (!this.isAccountOwner(requestingUser, targetUser)) {
				throw new PermissionError(
					"You do not have permission to perform this action.",
					401
				);
			}
		}

		// Managers can't modify another manager account
		if (this.isManager(requestingUser)) {
			if (
				this.isManager(targetUser) &&
				!this.isAccountOwner(requestingUser, targetUser)
			) {
				throw new PermissionError(
					"You do not have permission to perform this action.",
					401
				);
			}
		}

		// User can't change his own active status
		if (
			this.isAccountOwner(requestingUser, targetUser) &&
			providedActiveStatus !== undefined
		) {
			throw new PermissionError(
				"You do not have permission to perform this action.",
				401
			);
		}

		// Only Admin or account owner can change username and password
		if (
			!this.isAdmin(requestingUser) &&
			!this.isAccountOwner(requestingUser, targetUser) &&
			(providedUsername || providedPassword)
		) {
			throw new PermissionError(
				"You do not have permission to perform this action.",
				401
			);
		}
	}

	static async canGetUserDetails(
		requestingUser: UserWithId,
		targetUser: UserWithId
	): Promise<void> {
		if (this.isEmployee(requestingUser)) {
			if (!this.isAccountOwner(requestingUser, targetUser)) {
				throw new PermissionError(
					"You do not have permission to perform this action.",
					401
				);
			}
		}
	}
}

export class NotePermissionsService extends BasePermissions {
	static async hasNotePermission(
		requestingUser: UserWithId,
		targetUser: UserWithId
	): Promise<void> {
		// Employee trying to edit another user task
		if (
			this.isEmployee(requestingUser) &&
			!this.isAccountOwner(requestingUser, targetUser)
		) {
			throw new PermissionError(
				"You don't have the permissions to perform this action",
				401
			);
		}

		// Manager trying to modify a task assigned to another manager or admin
		if (
			this.isManager(requestingUser) &&
			(this.isAdmin(targetUser) || this.isManager(targetUser)) &&
			!this.isAccountOwner(requestingUser, targetUser)
		) {
			throw new PermissionError(
				"You don't have the permissions to perform this action",
				401
			);
		}
	}
}
