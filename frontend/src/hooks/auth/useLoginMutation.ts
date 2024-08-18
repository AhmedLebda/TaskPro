import { useMutation } from "@tanstack/react-query";
import AuthServices from "../../api/auth";
import { InitialLoginFormData } from "../../config/types";

const useLoginMutation = () =>
    useMutation({
        mutationKey: ["login"],
        mutationFn: (userData: InitialLoginFormData) =>
            AuthServices.login(userData),
    });

export default useLoginMutation;
