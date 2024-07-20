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

    // eslint-disable-next-line no-unused-vars
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

    const AuthActions = { login };

    return AuthActions;
};

export default useAuthContext;
