// React Query
import useUsersQuery from "../../users/UseUsersQuery";
// Custom Hooks
import useAuthContext from "../../auth/useAuthContext";
// utils
import { getUserRole } from "../../../utils/AuthHelpers";
import { RequestedUser } from "../../../config/types";
const useUsersSelect = () => {
    const { data, isLoading } = useUsersQuery();
    const { getCurrentUserRole, getUserData } = useAuthContext();
    const { id: currentUserId } = getUserData()!;

    const totalPages = data?.totalPages ?? 0;

    // Get the role of the current user
    const currentUserRole = getCurrentUserRole();

    // determines if the "Assign note to user" dropdown is visible
    const isUsersSelectVisible =
        currentUserRole === "admin" || currentUserRole === "manager";

    let selectOptions: RequestedUser[] | null = null;

    if (data) {
        selectOptions =
            currentUserRole === "admin"
                ? data.data
                : data.data.filter(
                      (user) =>
                          user._id === currentUserId ||
                          getUserRole(user.roles) === "employee"
                  );
    }

    return { selectOptions, totalPages, isLoading, isUsersSelectVisible };
};

export default useUsersSelect;
