import { getUserRole } from "./AuthHelpers";
/* Permissions
 * strict Admin: admin user can perform actions on all users except
 * complete Admin: admin user can perform actions on all users (including himself)
 * Manager: manager user perform actions on all employees
 * owner: the current user perform action on himself
 */

interface CurrentUser {
    id: string;
    roles: string[];
}

interface targetUser {
    _id: string;
    roles: string[];
}

interface PermissionsReturn {
    strictAdmin: boolean;
    strictAdminOwner: boolean;
    strictAdminManager: boolean;
    completeAdminManagerOwner: boolean;
    strictAdminManagerOwner: boolean;
}

const permissions = (
    currentUser: CurrentUser,
    targetUser: targetUser
): PermissionsReturn => {
    const currentUserId = currentUser.id;
    const currentUserRole = getUserRole(currentUser.roles);

    const targetUserId = targetUser?._id;
    const targetUserRole = getUserRole(targetUser?.roles);

    const haveStrictAdminPermissions =
        currentUserRole === "admin" && targetUserRole !== "admin";

    const haveCompleteAdminPermissions = currentUserRole === "admin";

    const haveManagerPermissions =
        currentUserRole === "manager" && targetUserRole === "employee";

    const haveOwnerPermissions = currentUserId === targetUserId;

    return {
        strictAdmin: haveStrictAdminPermissions,
        strictAdminOwner: haveStrictAdminPermissions || haveOwnerPermissions,
        strictAdminManager:
            haveStrictAdminPermissions || haveManagerPermissions,
        completeAdminManagerOwner:
            haveCompleteAdminPermissions ||
            haveManagerPermissions ||
            haveOwnerPermissions,

        strictAdminManagerOwner:
            haveStrictAdminPermissions ||
            haveManagerPermissions ||
            haveOwnerPermissions,
    };
};

export default permissions;
