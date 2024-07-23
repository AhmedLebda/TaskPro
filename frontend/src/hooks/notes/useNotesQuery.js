import { useQuery } from "@tanstack/react-query";
import useAuthFetch from "../auth/useAuthFetch";

const useNotesQuery = () => {
    const getNotes = useAuthFetch("/notes", "GET");
    return useQuery({
        queryKey: ["notes"],
        queryFn: getNotes,
    });
};

export default useNotesQuery;
