import useNotesQuery from "../../notes/useNotesQuery";

const useNotes = () => {
    const { data, isLoading, error } = useNotesQuery();

    const allNotes = data?.data ?? [];
    const totalPages = data?.totalPages ?? 0;

    return { allNotes, totalPages, isLoading, error };
};

export default useNotes;
