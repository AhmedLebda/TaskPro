import { Box, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import useAuthContext from "../../hooks/auth/useAuthContext";
import BadgeIcon from "@mui/icons-material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const DashIndex = () => {
    const { getUserData } = useAuthContext();
    const user = getUserData();
    const username = user.username;
    const roles = user.roles;
    const active = user.active;

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
        </Box>
    );
};

export default DashIndex;
