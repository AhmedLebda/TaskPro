// MUI Components
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// React-router-dom
import { Link as RouterLink } from "react-router-dom";
// Custom Hooks
import useNoteCardAction from "../../hooks/ui/notes/useNoteCardAction";
import { RequestedUser } from "../../config/types";

interface NoteCardActionProps {
    noteId: string;
    completed: boolean;
    user: RequestedUser;
}

const NoteCardAction = ({ noteId, completed, user }: NoteCardActionProps) => {
    const {
        showOptions,
        anchorEl,
        open,
        handleClose,
        handleClick,
        handleChangeCompletedStatus,
        handleNoteDelete,
    } = useNoteCardAction(noteId, completed, user);

    return (
        showOptions && (
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
                        to={`/dashboard/notes/edit/${noteId}`}
                    >
                        Edit
                    </MenuItem>
                    <MenuItem onClick={handleNoteDelete}>Delete</MenuItem>
                </Menu>
            </>
        )
    );
};

export default NoteCardAction;
