import { useQuery } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";

const useUsersQuery = () => {
    const getUsers = useAuthFetch("/users", "GET");
    return useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });
};

export default useUsersQuery;
