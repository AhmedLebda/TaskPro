import { useContext } from "react";
import authContext from "../../contexts/auth/authContext";
import AuthActionsCreator from "../../contexts/auth/authActions";
import { getUserRole } from "../../utils/AuthHelpers";
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

    const getCurrentUserRole = () => getUserRole(user.roles);

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
