import { useQuery } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";
import { useSearchParams } from "react-router-dom";
import { Note } from "../../config/types";

interface NotesQuery {
    data: Note[];
    totalPages: number;
}

const useNotesQuery = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const sortBy = searchParams.get("sortBy") || "newest";

    const getNotes = useAuthFetch(
        `/notes?page=${page}&sortBy=${sortBy}`,
        "GET"
    );
    return useQuery<NotesQuery>({
        queryKey: ["notes", page, sortBy],
        queryFn: getNotes,
    });
};

export default useNotesQuery;
