import useAuthFetch from "../auth/useAuthFetch";
import { useMutation } from "@tanstack/react-query";

const useNoteCreateMutation = () => {
    const createNote = useAuthFetch("/notes", "POST");
    return useMutation({
        mutationFn: (noteData) => createNote(noteData),
    });
};

export default useNoteCreateMutation;
