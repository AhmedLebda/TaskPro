// React Router dom
import { useParams } from "react-router-dom";
// Custom Hooks
import useAuthContext from "./useAuthContext";
// Utils
import { getUserRole } from "../../utils/AuthHelpers";

const usePermissions = (targetUserRoles) => {
    const { userId: targetUserId } = useParams();
    const { getUserData } = useAuthContext();
    const { roles: currentUserRoles, id: currentUserId } = getUserData();

    const currentUserRole = getUserRole(currentUserRoles);
    const targetUserRole = getUserRole(targetUserRoles);

    const haveAdminPermissions =
        currentUserRole === "admin" && targetUserRole !== "admin";

    const haveOwnerPermissions = currentUserId === targetUserId;

    const haveManagerPermissions =
        currentUserRole === "manager" && targetUserRole === "employee";

    return {
        haveAdminPermissions,
        haveOwnerPermissions,
        haveManagerPermissions,
    };
};

export default usePermissions;
