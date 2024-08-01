import { isJwtExpired } from "../../utils/AuthHelpers";
import useAuthContext from "./useAuthContext";
import AuthServices from "../../api/auth";
import customFetch from "../../utils/customFetch";

const useAuthFetch = (endpoint, method) => {
    const { getUserData, updateCredentials, resetCredentials } =
        useAuthContext();

    const { access_token: accessToken } = getUserData() || {};

    // If access token exists and not expired return a custom fetch function to the original endpoint
    if (accessToken && !isJwtExpired(accessToken)) {
        return async (body = {}, credentials = "omit") =>
            customFetch(endpoint, method, body, credentials, accessToken);
    }

    // Access token doesn't exist or expired: try to refresh the token then return custom fetch function to the endpoint
    return async (body = {}, credentials = "omit") => {
        try {
            const newAccessToken = await AuthServices.refreshToken();

            const { access_token } = newAccessToken;

            updateCredentials(newAccessToken);

            return customFetch(
                endpoint,
                method,
                body,
                credentials,
                access_token
            );
        } catch (error) {
            console.log(error.message);
            if (error.message === "refresh token expired") {
                resetCredentials();
            }
        }
    };
};

export default useAuthFetch;
