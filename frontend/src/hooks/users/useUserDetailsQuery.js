import useAuthFetch from "../auth/useAuthFetch";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const useUserDetailsQuery = () => {
    const { userId } = useParams();
    const getUserDetails = useAuthFetch(`/users/${userId}`, "GET");
    return useQuery({
        queryKey: ["users", userId],
        queryFn: getUserDetails,
    });
};

export default useUserDetailsQuery;
