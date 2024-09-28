import { jwtDecode } from "jwt-decode";

// Define the structure of the decoded token
interface DecodedToken {
    exp: number;
}
// Checks if a JWT (JSON Web Token) is expired.
export function isJwtExpired(token: string): boolean {
    // Decode the token
    const decodedToken = jwtDecode<DecodedToken>(token);

    // Check if token is expired
    const currentTimestamp = Date.now() / 1000;

    // Token is expired
    if (decodedToken.exp < currentTimestamp) {
        return true;
    }

    // token isn't expired
    return false;
}

export const getUserRole = (roles: string[]): string => {
    if (roles.includes("admin")) {
        return "admin";
    } else if (roles.includes("manager")) {
        return "manager";
    } else {
        return "employee";
    }
};
