import { useQuery } from "@tanstack/react-query";
import UserServices from "../../api/users";

const useUsersQuery = () =>
    useQuery({
        queryKey: ["users"],
        queryFn: UserServices.getUsersList,
    });

export default useUsersQuery;
