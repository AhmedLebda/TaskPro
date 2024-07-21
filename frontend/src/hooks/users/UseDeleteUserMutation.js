import { useMutation } from "@tanstack/react-query";
// import UserServices from "../../api/users";
import { useQueryClient } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";

const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();
    const deleteUser = useAuthFetch("/users", "DELETE");
    return useMutation({
        mutationFn: (id) => deleteUser({ id }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
        mutationKey: "deleteUser",
    });
};
export default useDeleteUserMutation;
