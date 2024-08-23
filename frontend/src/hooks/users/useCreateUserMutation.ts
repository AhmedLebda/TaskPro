import { useMutation } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";
import { AddUserRequestBody } from "../../config/types";

const useCreateUserMutation = () => {
    const createUser = useAuthFetch("/users", "POST");
    return useMutation({
        mutationFn: (userData: AddUserRequestBody) => createUser(userData),
        mutationKey: ["createUser"],
    });
};

export default useCreateUserMutation;
