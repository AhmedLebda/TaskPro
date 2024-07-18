import { useMutation } from "@tanstack/react-query";
import UserServices from "../../api/users";

const useCreateUserMutation = () =>
    useMutation({
        mutationFn: (userData) => UserServices.createUser(userData),
    });

export default useCreateUserMutation;
