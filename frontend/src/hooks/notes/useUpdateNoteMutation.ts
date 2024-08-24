import useAuthFetch from "../auth/useAuthFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NoteUpdates } from "../../config/types";

const useUpdateNoteMutation = () => {
    const queryClient = useQueryClient();
    const updateNote = useAuthFetch("/notes", "PATCH");

    return useMutation({
        mutationKey: ["updateNote"],
        mutationFn: (updates: Partial<NoteUpdates>) => updateNote(updates),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
    });
};

export default useUpdateNoteMutation;
