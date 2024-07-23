import useAuthFetch from "../auth/useAuthFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const useUpdateNoteMutation = () => {
    const queryClient = useQueryClient();
    const updateNote = useAuthFetch("/notes", "PATCH");
    return useMutation({
        mutationKey: "updateNote",
        mutationFn: (updates) => updateNote(updates),
        onSuccess: () => queryClient.invalidateQueries(["notes"]),
    });
};

export default useUpdateNoteMutation;
