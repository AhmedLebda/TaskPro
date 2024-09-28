import { useQuery } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";
import { useSearchParams, useParams } from "react-router-dom";
import { Note } from "../../config/types";

interface NotesQuery {
    data: Note[];
    totalPages: number;
}

const useUserNotesQuery = () => {
    const [searchParams] = useSearchParams();
    const params = useParams();
    const page = searchParams.get("page") || 1;
    const sortBy = searchParams.get("sortBy") || "newest";

    const userId = params.userId;

    const getNotes = useAuthFetch(
        `/notes/${userId}?page=${page}&sortBy=${sortBy}`,
        "GET"
    );
    return useQuery<NotesQuery>({
        queryKey: ["notes", userId, page, sortBy],
        queryFn: getNotes,
    });
};

export default useUserNotesQuery;
