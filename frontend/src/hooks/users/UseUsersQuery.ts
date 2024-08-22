import { useQuery } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";
import useAuthContext from "../auth/useAuthContext";
import { useSearchParams } from "react-router-dom";
import { RequestedUser } from "../../config/types";

interface UsersQuery {
    data: RequestedUser[];
    totalPages: number;
}

const useUsersQuery = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;

    const { getUserData, getCurrentUserRole } = useAuthContext();

    const isActive = getUserData()?.active;

    const isAuthorized =
        getCurrentUserRole() === "admin" || getCurrentUserRole() === "manager";

    const getUsers = useAuthFetch(`/users?page=${page}`, "GET");

    return useQuery<UsersQuery>({
        queryKey: ["users", page],
        queryFn: getUsers,
        enabled: isActive && isAuthorized,
    });
};

export default useUsersQuery;
