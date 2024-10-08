import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import UserAvatar from "../general/UserAvatar";
import PeopleIcon from "@mui/icons-material/People";
import ChecklistIcon from "@mui/icons-material/Checklist";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import useAuthContext from "../../hooks/auth/useAuthContext";

const drawerWidth = 240;

const DashboardDrawer = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { getCurrentUserRole, getUserData } = useAuthContext();

    const { active: isUserActive, id: currentUserId } = getUserData()!;

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    let drawerLinks = [
        {
            title: "Dashboard",
            path: "/dashboard",
            icon: <HomeIcon />,
        },
        {
            title: "My Notes",
            path: `notes/${currentUserId}?page=1`,
            icon: <ChecklistIcon />,
        },
        {
            title: "Create Note",
            path: "notes/Create",
            icon: <CreateIcon />,
        },
    ];
    if (
        getCurrentUserRole() === "admin" ||
        getCurrentUserRole() === "manager"
    ) {
        drawerLinks.push(
            ...[
                {
                    title: "All Notes",
                    path: "notes?page=1",
                    icon: <ChecklistIcon />,
                },
                {
                    title: "Users List",
                    path: "users?page=1",
                    icon: <PeopleIcon />,
                },

                {
                    title: "Add User",
                    path: "users/add",
                    icon: <PersonAddIcon />,
                },
            ]
        );
    }

    // if user status is 'Inactive', then just show the dashboard home page
    if (!isUserActive) {
        drawerLinks = [
            {
                title: "Dashboard",
                path: "/dashboard",
                icon: <HomeIcon />,
            },
        ];
    }

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {drawerLinks.map((item, index) => (
                    <ListItem disablePadding key={index}>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={handleDrawerClose}
                        >
                            <ListItemIcon sx={{ color: "secondary.main" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Dashboard
                    </Typography>

                    <Box sx={{ display: "flex", gap: 3 }}>
                        <Button color="inherit" component={RouterLink} to="/">
                            Home
                        </Button>
                        {/* Avatar */}
                        <UserAvatar />
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
};

export default DashboardDrawer;
