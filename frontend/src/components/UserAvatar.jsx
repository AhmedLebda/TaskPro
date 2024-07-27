import { Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import useAuthFetch from "../hooks/auth/useAuthFetch";
import useAuthContext from "../hooks/auth/useAuthContext";
const UserAvatar = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const logout = useAuthFetch("/auth/logout", "POST");
    const { resetCredentials, getUserData } = useAuthContext();
    const currentUserId = getUserData()?.id;
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogout = async () => {
        // Clear access token from the cookies
        await logout({}, "include");
        // reset the user global state
        resetCredentials();
        // Close the menu
        handleCloseUserMenu();
    };

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                        alt="Test user"
                        src="/static/images/avatar/2.jpg"
                        sx={{ bgcolor: "secondary.main" }}
                    />
                </IconButton>
            </Tooltip>

            <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={handleLogout} component={RouterLink} to="/">
                    <Typography textAlign="center">Logout</Typography>
                </MenuItem>
                <MenuItem
                    onClick={handleCloseUserMenu}
                    component={RouterLink}
                    to={`/dashboard/users/edit/${currentUserId}`}
                >
                    <Typography textAlign="center">Edit profile</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default UserAvatar;
