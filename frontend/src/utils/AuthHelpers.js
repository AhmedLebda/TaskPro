import { jwtDecode } from "jwt-decode";

// Checks if a JWT (JSON Web Token) is expired.
export function isJwtExpired(token) {
    // Decode the token
    const decodedToken = jwtDecode(token);

    // Check if token is expired
    const currentTimestamp = Date.now() / 1000;
    // Token is expired
    if (decodedToken.exp < currentTimestamp) {
        return true;
    }

    // token isn't expired
    return false;
}

export const getUserRole = (roles) => {
    if (roles.includes("admin")) {
        return "admin";
    } else if (roles.includes("manager")) {
        return "manager";
    } else {
        return "employee";
    }
};

export const havePermissions = (currentUser, targetUser) => {
    const { id: currentUserId, roles: currentUserRoles } = currentUser;
    const { _id: targetUserId, roles: targetUserRoles } = targetUser;

    const currentUserRole = getUserRole(currentUserRoles);
    const targetUserRole = getUserRole(targetUserRoles);

    if (currentUserRole == "admin") return true;

    if (currentUserRole == "manager" && currentUserId === targetUserId)
        return true;

    if (targetUserRole === "employee") return true;

    return false;
};
