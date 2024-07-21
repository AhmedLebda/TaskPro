import { useMutation } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";

const useCreateUserMutation = () => {
    const createUser = useAuthFetch("/users", "POST");
    return useMutation({
        mutationFn: (userData) => createUser(userData),
        mutationKey: "createUser",
    });
};

export default useCreateUserMutation;
