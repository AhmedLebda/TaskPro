import { Box, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import useAuthContext from "../../hooks/auth/useAuthContext";
import BadgeIcon from "@mui/icons-material/Badge";
const DashIndex = () => {
    const { getUserData } = useAuthContext();
    const username = getUserData()?.username;
    const roles = getUserData()?.roles;
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
            <Chip
                icon={<BadgeIcon />}
                label={roles}
                color="secondary"
                sx={{ p: 2, mb: 4 }}
            />

            <Typography paragraph color="text.secondary">
                Today: {new Date().toLocaleString()}
            </Typography>
        </Box>
    );
};

export default DashIndex;
