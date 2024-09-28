import { isJwtExpired } from "../../utils/AuthHelpers";
import useAuthContext from "./useAuthContext";
import AuthServices from "../../api/auth";
import customFetch from "../../utils/customFetch";
import { FetchMethods, FetchCredentials } from "../../config/types";

const useAuthFetch = (endpoint: string, method: FetchMethods) => {
    const { getUserData, updateCredentials, resetCredentials } =
        useAuthContext();

    const { access_token: accessToken } = getUserData() || {};

    // If access token exists and not expired return a custom fetch function to the original endpoint
    if (accessToken && !isJwtExpired(accessToken)) {
        return async (body = {}, credentials: FetchCredentials = "omit") =>
            customFetch(endpoint, method, credentials, body, accessToken);
    }

    // Access token doesn't exist or expired: try to refresh the token then return custom fetch function to the endpoint
    return async (body = {}, credentials: FetchCredentials = "omit") => {
        try {
            const newUserData = await AuthServices.refreshToken();

            const { access_token: accessToken } = newUserData;

            updateCredentials(newUserData);

            return customFetch(
                endpoint,
                method,
                credentials,
                body,
                accessToken
            );
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                if (error.message === "refresh token expired") {
                    resetCredentials();
                }
            }
        }
    };
};

export default useAuthFetch;
