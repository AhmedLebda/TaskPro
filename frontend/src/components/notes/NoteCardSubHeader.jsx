import { Box, Chip, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

const NoteCardSubHeader = ({ completed, createdAt }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "flex-start",
            }}
        >
            <Typography variant="subtitle2">
                {new Date(createdAt).toLocaleString()}
            </Typography>
            <Chip
                icon={completed ? <CheckCircleIcon /> : <PendingIcon />}
                label={completed ? "Completed" : "Pending"}
                color={completed ? "success" : "warning"}
                size="small"
            />
        </Box>
    );
};

export default NoteCardSubHeader;
