import { useContext } from "react";
import authContext from "../../contexts/auth/authContext";
import AuthActionsCreator from "../../contexts/auth/authActions";

const useAuthContext = () => {
    const context = useContext(authContext);

    if (!context)
        throw Error(
            "useAuthContext must be used inside an AuthContextProvider"
        );

    const { user, dispatch, isAuthenticated } = context;

    const setCredentials = (credentials) =>
        dispatch(AuthActionsCreator.setCredentials(credentials));

    const updateCredentials = (updates) => {
        dispatch(AuthActionsCreator.updateCredentials(updates));
    };

    const resetCredentials = () => {
        dispatch(AuthActionsCreator.removeCredentials());
    };

    const getUserData = () => user;

    const getUserRole = () => {
        if (user.roles.includes("admin")) {
            return "admin";
        } else if (user.roles.includes("manager")) {
            return "manager";
        } else {
            return "employee";
        }
    };

    const getAuthStatus = () => isAuthenticated;

    const AuthActions = {
        setCredentials,
        updateCredentials,
        resetCredentials,
        getUserData,
        getUserRole,
        getAuthStatus,
    };

    return AuthActions;
};

export default useAuthContext;
