import { useQuery } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";
import { useParams } from "react-router-dom";
import { Note } from "../../config/types";

const useNoteDetailsQuery = () => {
    const params = useParams();

    const targetNoteId = params.noteId;

    const getNoteDetails = useAuthFetch(
        `/notes/details/${targetNoteId}`,
        "GET"
    );
    return useQuery<Note>({
        queryKey: ["notes", targetNoteId],
        queryFn: getNoteDetails,
        enabled: targetNoteId !== undefined,
    });
};

export default useNoteDetailsQuery;
