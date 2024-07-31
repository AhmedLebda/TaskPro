import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container } from "@mui/material";
import useAuthContext from "../hooks/auth/useAuthContext";
import UserAvatar from "./UserAvatar";
const NavBar = () => {
    const { getAuthStatus } = useAuthContext();
    const isAuth = getAuthStatus();
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
                        TaskPro
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/about">
                        About
                    </Button>
                    {isAuth ? (
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/dashboard"
                            >
                                Dashboard
                            </Button>
                            <UserAvatar />
                        </Box>
                    ) : (
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/login"
                        >
                            Login
                        </Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavBar;
