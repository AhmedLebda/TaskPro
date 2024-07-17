import { useQuery } from "@tanstack/react-query";
import NoteServices from "../api/notes";

const useNotesQuery = () =>
    useQuery({
        queryKey: ["notes"],
        queryFn: NoteServices.getNotesList,
    });

export default useNotesQuery;
