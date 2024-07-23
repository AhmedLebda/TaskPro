import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";

const useDeleteNoteMutation = () => {
    const queryClient = useQueryClient();
    const deleteNote = useAuthFetch("/notes", "DELETE");

    return useMutation({
        mutationKey: "deleteNote",
        mutationFn: (id) => deleteNote(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
        onError: ({ message }) => console.log(message),
    });
};
export default useDeleteNoteMutation;
