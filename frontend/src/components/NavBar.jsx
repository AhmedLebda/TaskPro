import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import { Container } from "@mui/material";

const NavBar = () => {
    return (
        <AppBar
            position="static"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, mb: 2 }}
        >
            <Container disableGutters>
                <Toolbar>
                    <Typography
                        variant="h5"
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        Notes
                    </Typography>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/dashboard"
                    >
                        Dashboard
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/login">
                        Login
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavBar;
