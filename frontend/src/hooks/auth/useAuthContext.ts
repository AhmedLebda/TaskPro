import { useContext } from "react";
import authContext from "../../contexts/auth/authContext";
import AuthActionsCreator from "../../contexts/auth/authActions";
import { getUserRole } from "../../utils/AuthHelpers";
import { User } from "../../config/types";

const useAuthContext = () => {
    const context = useContext(authContext);

    if (!context)
        throw Error(
            "useAuthContext must be used inside an AuthContextProvider"
        );

    const { user, dispatch, isAuthenticated } = context;

    const setCredentials = (credentials: User) =>
        dispatch(AuthActionsCreator.setCredentials(credentials));

    const updateCredentials = (updates: Partial<User>) => {
        dispatch(AuthActionsCreator.updateCredentials(updates));
    };

    const resetCredentials = () => {
        dispatch(AuthActionsCreator.removeCredentials());
    };

    const getUserData = () => user;

    const getCurrentUserRole = () => {
        if (!user) throw Error("User isn't logged in");

        return getUserRole(user.roles);
    };

    const getAuthStatus = () => isAuthenticated;

    const AuthActions = {
        setCredentials,
        updateCredentials,
        resetCredentials,
        getUserData,
        getCurrentUserRole,
        getAuthStatus,
    };

    return AuthActions;
};

export default useAuthContext;
