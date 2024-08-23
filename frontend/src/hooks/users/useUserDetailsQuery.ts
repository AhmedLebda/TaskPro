import useAuthFetch from "../auth/useAuthFetch";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { RequestedUser } from "../../config/types";

const useUserDetailsQuery = () => {
    const { userId } = useParams();
    const getUserDetails = useAuthFetch(`/users/${userId}`, "GET");
    return useQuery<RequestedUser>({
        queryKey: ["users", userId],
        queryFn: getUserDetails,
    });
};

export default useUserDetailsQuery;
