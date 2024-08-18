import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
const PageNotFound = () => {
    return (
        <Box
            sx={{
                display: "grid",
                placeItems: "center",
                minHeight: "60vh",
            }}
        >
            <Container maxWidth="sm">
                <Typography
                    component="h1"
                    variant="h2"
                    sx={{ fontWeight: "bold", mb: 2 }}
                >
                    404
                </Typography>
                <Typography component="h2" variant="h4">
                    UH OH! You&apos;re lost.
                </Typography>

                <Typography paragraph color="text.secondary">
                    The page you are looking for does not exist. How you got
                    here is a mystery. But you can click the button below to go
                    back to the homepage.
                </Typography>

                <Button variant="outlined" component={RouterLink} to="/">
                    Home
                </Button>
            </Container>
        </Box>
    );
};

export default PageNotFound;
