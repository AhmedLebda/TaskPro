import { useMutation } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";
import { User } from "../../config/types";
const useUpdateUserMutation = () => {
    const updateUser = useAuthFetch("/users", "PATCH");
    return useMutation({
        mutationFn: (updates: Partial<User>) => updateUser(updates),
        mutationKey: ["updateUser"],
    });
};
export default useUpdateUserMutation;
