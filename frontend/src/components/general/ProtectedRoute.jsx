import { Outlet } from "react-router-dom";
import useAuthContext from "../../hooks/auth/useAuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = () => {
    const { getAuthStatus } = useAuthContext();
    const isAuth = getAuthStatus();
    if (!isAuth) {
        return <Navigate to="/login" />;
    }
    return <Outlet></Outlet>;
};

export default ProtectedRoute;
