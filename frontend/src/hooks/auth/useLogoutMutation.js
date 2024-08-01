import { useMutation } from "@tanstack/react-query";
import useAuthFetch from "./useAuthFetch";
import useAuthContext from "./useAuthContext";

const useLogoutMutation = () => {
    const { resetCredentials } = useAuthContext();
    const logout = useAuthFetch("/auth/logout", "POST");

    return useMutation({
        mutationKey: "logout",
        mutationFn: () => logout({}, "include"),
        onSuccess: resetCredentials,
    });
};
export default useLogoutMutation;
