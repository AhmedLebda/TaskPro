import { useContext } from "react";
import authContext from "../../contexts/auth/authContext";
import AuthActionsCreator from "../../contexts/auth/authActions";
import useLoginMutation from "./useLoginMutation";
import { useNavigate } from "react-router-dom";
import AuthServices from "../../api/auth";

const useAuthContext = () => {
    const context = useContext(authContext);
    const loginMutation = useLoginMutation();
    const navigate = useNavigate();

    if (!context)
        throw Error(
            "useAuthContext must be used inside an AuthContextProvider"
        );

    const { user, dispatch } = context;

    const login = async (loginData) => {
        loginMutation.mutate(loginData, {
            onSuccess: (data) => {
                dispatch(AuthActionsCreator.setCredentials(data));
                navigate("/dashboard");
            },
            onError: (error) => console.log(error.message),
        });
    };

    const setCredentials = (credentials) =>
        dispatch(AuthActionsCreator.setCredentials(credentials));

    const updateCredentials = (updates) => {
        dispatch(AuthActionsCreator.updateCredentials(updates));
    };

    const refreshToken = async () => {
        try {
            const token = await AuthServices.refreshToken();
            if (!token.access_token) {
                throw Error("Invalid token");
            }
            updateCredentials(token);
        } catch (error) {
            navigate("/login");
        }
    };
    const getUserData = () => user;

    const AuthActions = {
        login,
        updateCredentials,
        setCredentials,
        refreshToken,
        getUserData,
    };

    return AuthActions;
};

export default useAuthContext;
