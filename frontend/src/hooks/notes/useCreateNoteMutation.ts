import useAuthFetch from "../auth/useAuthFetch";
import { useMutation } from "@tanstack/react-query";

import { NewNote } from "../../config/types";

const useNoteCreateMutation = () => {
    const createNote = useAuthFetch("/notes", "POST");
    return useMutation({
        mutationFn: (noteData: NewNote) => createNote(noteData),
    });
};

export default useNoteCreateMutation;
