import { useMutation } from "@tanstack/react-query";
import UserServices from "../../api/users";
import { useQueryClient } from "@tanstack/react-query";

const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => UserServices.deleteUser(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
        mutationKey: "deleteUser",
    });
};
export default useDeleteUserMutation;
