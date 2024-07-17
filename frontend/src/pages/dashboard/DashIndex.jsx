import { Box, Typography } from "@mui/material";

const DashIndex = () => {
    return (
        <Box>
            <Typography
                component="h1"
                sx={{ typography: { xs: "h5", sm: "h4", md: "h3" }, mb: 4 }}
            >
                Welcome Test User
            </Typography>

            <Typography paragraph color="text.secondary">
                {new Date().toLocaleString()}
            </Typography>
        </Box>
    );
};

export default DashIndex;
