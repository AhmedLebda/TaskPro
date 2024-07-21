import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../api/config";

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

export const customFetch = async (endpoint, method, token, body) => {
    let options = {
        mode: "cors",
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    if (method.toLowerCase() !== "get") {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    // handle delete requests which just return 204 no content status code
    if (response.status === 204) {
        return;
    }

    const data = await response.json();

    if (!response.ok) throw Error(data.error);

    return data;
};
