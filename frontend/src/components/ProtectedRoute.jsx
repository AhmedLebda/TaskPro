import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuthContext from "../hooks/auth/useAuthContext";
import Spinner from "./Spinner";
import { Box } from "@mui/material";
const ProtectedRoute = () => {
    const refreshTokenRef = useRef();
    const { refreshToken, getUserData } = useAuthContext();
    refreshTokenRef.current = refreshToken;
    const user = getUserData();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const getNewToken = async () => {
            await refreshTokenRef.current();
        };

        if (!user) {
            getNewToken();
        } else {
            setIsLoading(false);
        }
    }, [isLoading, user]);

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
    return <Outlet></Outlet>;
};

export default ProtectedRoute;
