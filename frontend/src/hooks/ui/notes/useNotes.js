import useNotesQuery from "../../notes/useNotesQuery";
// import { useSearchParams } from "react-router-dom";
const useNotes = () => {
    const { data, isLoading, error } = useNotesQuery();
    // const [, setSearchParams] = useSearchParams();
    const allNotes = data?.data;
    const totalPages = data?.totalPages;

    // const handlePageChange = (e, newPage) => {
    //     setSearchParams({ page: newPage });
    // };

    return { allNotes, totalPages, isLoading, error };
};

export default useNotes;
