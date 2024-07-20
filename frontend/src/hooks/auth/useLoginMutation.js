import { useMutation } from "@tanstack/react-query";
import AuthServices from "../../api/auth";

const useLoginMutation = () =>
    useMutation({
        mutationFn: (userData) => AuthServices.login(userData),
        mutationKey: "login",
    });

export default useLoginMutation;
