// MUI Components
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// React
import { useState } from "react";
// React-router-dom
import { Link as RouterLink } from "react-router-dom";
// Custom Hooks
// ==> React-Query
import useUpdateNoteMutation from "../../hooks/notes/useUpdateNoteMutation";
import useDeleteNoteMutation from "../../hooks/notes/useDeleteNoteMutation";
// ==> Contexts
import useSnackbar from "../../hooks/ui/snackbar/useSnackbar";

const NoteCardAction = ({ noteId, completed }) => {
    // React Query Mutations
    const updateNoteMutation = useUpdateNoteMutation();
    const deleteNoteMutation = useDeleteNoteMutation();

    // State for the menu
    const [anchorEl, setAnchorEl] = useState(null);

    // Snack bar hook
    const { showSnackbar } = useSnackbar();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
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

    return (
        <>
            <Tooltip title="Options">
                <IconButton aria-label="settings" onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem onClick={handleChangeCompletedStatus}>
                    Change status
                </MenuItem>
                <MenuItem
                    onClick={handleClose}
                    component={RouterLink}
                    to={`edit/${noteId}`}
                >
                    Edit
                </MenuItem>
                <MenuItem onClick={handleNoteDelete}>Delete</MenuItem>
            </Menu>
        </>
    );
};

export default NoteCardAction;
