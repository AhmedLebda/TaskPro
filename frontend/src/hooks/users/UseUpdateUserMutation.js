import { useMutation } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";

const useUpdateUserMutation = () => {
    const updateUser = useAuthFetch("/users", "PATCH");
    return useMutation({
        mutationFn: (updates) => updateUser(updates),
        mutationKey: "updateUser",
    });
};
export default useUpdateUserMutation;
