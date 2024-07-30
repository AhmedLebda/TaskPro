// React Query
import useUsersQuery from "../../users/UseUsersQuery";
// Custom Hooks
import useAuthContext from "../../auth/useAuthContext";

const useUsersSelect = () => {
    const { data, isLoading } = useUsersQuery();

    const { getUserRole } = useAuthContext();

    // Get the role of the current user
    const currentUserRole = getUserRole();

    // determines if the "Assign note to user" dropdown is visible
    const isUsersSelectVisible =
        currentUserRole === "admin" || currentUserRole === "manager";

    return { data, isLoading, isUsersSelectVisible };
};

export default useUsersSelect;
