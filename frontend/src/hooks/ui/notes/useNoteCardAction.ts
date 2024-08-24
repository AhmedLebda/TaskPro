// React
import { MouseEvent, useState } from "react";
// Custom Hooks
// ==> React-Query
import useUpdateNoteMutation from "../../notes/useUpdateNoteMutation";
import useDeleteNoteMutation from "../../notes/useDeleteNoteMutation";
// ==> Contexts
import useSnackbar from "../snackbar/useSnackbar";
import useAuthContext from "../../auth/useAuthContext";
// utils
import permissions from "../../../utils/permissions";
import { RequestedUser } from "../../../config/types";

const useNoteCardAction = (
    noteId: string,
    completed: boolean,
    user: RequestedUser
) => {
    // React Query Mutations
    const updateNoteMutation = useUpdateNoteMutation();
    const deleteNoteMutation = useDeleteNoteMutation();

    // State for the menu
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Snack bar hook
    const { showSnackbar } = useSnackbar();

    // UserData
    const { getUserData } = useAuthContext();
    const currentUser = getUserData()!;

    const Permissions = permissions(currentUser, user);
    const showOptions = Permissions.completeAdminManagerOwner;

    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeCompletedStatus = () => {
        updateNoteMutation.mutate(
            { id: noteId, completed: !completed },
            { onSuccess: () => showSnackbar("Note status changed") }
        );

        handleClose();
    };

    const handleNoteDelete = () => {
        console.log(noteId);
        deleteNoteMutation.mutate(
            { id: noteId },
            { onSuccess: () => showSnackbar("Note Deleted") }
        );
        handleClose();
    };

    return {
        showOptions,
        anchorEl,
        open,
        handleClose,
        handleClick,
        handleChangeCompletedStatus,
        handleNoteDelete,
    };
};

export default useNoteCardAction;
