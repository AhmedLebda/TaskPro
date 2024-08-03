import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const Spinner = ({ item = "Data" }) => {
    return (
        <Box
            component="main"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: "auto",
            }}
        >
            <CircularProgress />
            <Typography variant="caption">Getting {item}</Typography>
        </Box>
    );
};

export default Spinner;
