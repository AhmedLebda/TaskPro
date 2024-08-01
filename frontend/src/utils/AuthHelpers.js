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
