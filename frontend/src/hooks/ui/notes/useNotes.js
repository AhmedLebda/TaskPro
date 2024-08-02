import useNotesQuery from "../../notes/useNotesQuery";
import useAuthContext from "../../auth/useAuthContext";
import { useSearchParams } from "react-router-dom";

const visibleNotes = (view, role, notesData, currentUserId) => {
    if (view !== "all" && role !== "employee") {
        return notesData?.filter((note) => note.user._id === currentUserId);
    }
    return notesData;
};

const sortNotes = (sortBy, notesData) => {
    return notesData?.sort((note) => (note[sortBy] ? 1 : -1));
};

const useNotes = () => {
    // This will return all notes if the user is Admin or Manager, and return only employee notes if user is employee.
    const { data, isLoading, error } = useNotesQuery();

    // Getting current user id and role
    const { getUserData, getUserRole } = useAuthContext();
    const role = getUserRole();
    const { id: currentUserId } = getUserData();

    // Get the view mode from the search parameters
    const [searchParams] = useSearchParams();
    const view = searchParams.get("view");

    // Filter notes based on user role and view mode (all, employee)
    const notesToRender = visibleNotes(view, role, data, currentUserId);

    // Sort notes based on completed status (true at the top)
    const sortedNotes = sortNotes("completed", notesToRender);

    return { sortedNotes, isLoading, error };
};

export default useNotes;
