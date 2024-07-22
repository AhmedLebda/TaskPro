import { isJwtExpired, customFetch } from "../../utils/AuthHelpers";
import useAuthContext from "./useAuthContext";
import AuthServices from "../../api/auth";

const useAuthFetch = (endpoint, method) => {
    const AuthActions = useAuthContext();
    const accessToken = AuthActions.getUserData()?.access_token;

    if (accessToken && !isJwtExpired(accessToken)) {
        return async (body = {}, credentials = "omit") =>
            customFetch(endpoint, method, accessToken, body, credentials);
    }

    return async (body = {}, credentials = "omit") => {
        try {
            const newAccessToken = await AuthServices.refreshToken();

            const { access_token } = newAccessToken;

            AuthActions.updateCredentials(newAccessToken);

            return customFetch(
                endpoint,
                method,
                access_token,
                body,
                credentials
            );
        } catch (error) {
            console.log(error.message);
            if (error.message === "refresh token expired") {
                AuthActions.resetCredentials();
            }
        }
    };
};

export default useAuthFetch;
