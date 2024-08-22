import { Outlet } from "react-router-dom";
import useAuthContext from "../../hooks/auth/useAuthContext";
import { Navigate } from "react-router-dom";

const UserActiveCheck = () => {
    const { getUserData } = useAuthContext();

    const active = getUserData()?.active;

    if (!active) {
        return <Navigate to="/dashboard" />;
    }
    return <Outlet></Outlet>;
};

export default UserActiveCheck;
