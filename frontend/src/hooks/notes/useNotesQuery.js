import { useQuery } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";
import { useSearchParams } from "react-router-dom";

const useNotesQuery = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const sortBy = searchParams.get("sortBy") || "newest";

    const getNotes = useAuthFetch(
        `/notes?page=${page}&sortBy=${sortBy}`,
        "GET"
    );
    return useQuery({
        queryKey: ["notes", page, sortBy],
        queryFn: getNotes,
    });
};

export default useNotesQuery;
