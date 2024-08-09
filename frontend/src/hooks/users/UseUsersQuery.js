import { useQuery } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";
import useAuthContext from "../auth/useAuthContext";
const useUsersQuery = () => {
    const { getUserData, getCurrentUserRole } = useAuthContext();
    const getUsers = useAuthFetch("/users", "GET");
    const isActive = getUserData().active;
    const isAuthorized =
        getCurrentUserRole() === "admin" || getCurrentUserRole() === "manager";

    return useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        enabled: isActive && isAuthorized,
    });
};

export default useUsersQuery;
