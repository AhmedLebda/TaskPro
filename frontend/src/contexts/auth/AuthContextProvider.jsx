import AuthServices from "../../api/auth";
import authContext from "./authContext";
import { useEffect, useReducer, useState } from "react";
import { Box } from "@mui/material";
import Spinner from "../../components/general/Spinner";
import AuthActionsCreator from "./authActions";

const authReducer = (state, action) => {
    switch (action.type) {
        case "auth/setCredentials":
            return action.payload;
        case "auth/updateCredentials":
            return { ...state, ...action.payload };
        case "auth/removeCredentials":
            return null;
        default:
            return state;
    }
};

const AuthContextProvider = ({ children }) => {
    const [user, dispatch] = useReducer(authReducer, null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const checkAuth = async () => {
            if (user) {
                setIsAuthenticated(true);
                setIsLoading(false);
                return;
            }

            try {
                const user = await AuthServices.refreshToken();
                dispatch(AuthActionsCreator.updateCredentials(user));
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [user]);

    if (isLoading)
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    height: "50vh",
                }}
            >
                <Spinner />
            </Box>
        );

    return (
        <authContext.Provider value={{ user, dispatch, isAuthenticated }}>
            {children}
        </authContext.Provider>
    );
};

export default AuthContextProvider;
