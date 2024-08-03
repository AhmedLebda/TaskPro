import { Box, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import useAuthContext from "../../../hooks/auth/useAuthContext";
import BadgeIcon from "@mui/icons-material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Alert from "@mui/material/Alert";

const DashIndex = () => {
    const { getUserData } = useAuthContext();
    const { username, roles, active } = getUserData();

    const roleChips = roles.map((role) => (
        <Chip
            key={role}
            icon={<BadgeIcon />}
            label={role}
            color="secondary"
            sx={{ p: 1, mb: 4, textTransform: "capitalize" }}
        />
    ));

    return (
        <Box>
            <Typography
                component="h1"
                sx={{
                    typography: { xs: "h5", sm: "h4", md: "h3" },
                    mb: 2,
                    textTransform: "capitalize",
                }}
            >
                Welcome {username}
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
                {roleChips}
                <Chip
                    icon={active ? <CheckCircleIcon /> : <CancelIcon />}
                    label={active ? "Active" : "Inactive"}
                    color={active ? "success" : "error"}
                    sx={{ p: 2, mb: 4 }}
                />
            </Box>

            <Typography paragraph color="text.secondary">
                Today: {new Date().toLocaleString()}
            </Typography>

            {!active && (
                <Alert severity="info">
                    <b>Notice:</b> If your account appears inactive, please
                    reach out to your manager to request reactivation. They will
                    assist you with the process.
                </Alert>
            )}
        </Box>
    );
};

export default DashIndex;
