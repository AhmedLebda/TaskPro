import useUserNotesQuery from "../../notes/userUserNotesQuery";

const useUserNotes = () => {
    const { data, isLoading, error } = useUserNotesQuery();

    const allNotes = data?.data ?? [];
    const totalPages = data?.totalPages ?? 0;

    return { allNotes, totalPages, isLoading, error };
};

export default useUserNotes;
