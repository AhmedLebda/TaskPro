import { useContext } from "react";
import authContext from "../../contexts/auth/authContext";
import AuthActionsCreator from "../../contexts/auth/authActions";
import useLoginMutation from "./useLoginMutation";
import { useNavigate } from "react-router-dom";

const useAuthContext = () => {
    const context = useContext(authContext);
    const loginMutation = useLoginMutation();
    const navigate = useNavigate();

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

    const login = async (loginData) => {
        loginMutation.mutate(loginData, {
            onSuccess: (data) => {
                setCredentials(data);
                navigate("/dashboard");
            },
            onError: (error) => console.log(error.message),
        });
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
        login,
        updateCredentials,
        setCredentials,
        resetCredentials,
        getUserData,
        getAuthStatus,
        getUserRole,
    };

    return AuthActions;
};

export default useAuthContext;
