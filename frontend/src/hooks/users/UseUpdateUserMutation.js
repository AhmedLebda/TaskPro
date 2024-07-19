import { useMutation } from "@tanstack/react-query";
import UserServices from "../../api/users";

const useUpdateUserMutation = () => {
    return useMutation({
        mutationFn: (updates) => UserServices.updateUser(updates),
        mutationKey: "updateUser",
    });
};
export default useUpdateUserMutation;
