// MUI Components
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CustomSnackbar from "../CustomSnackbar";
// MUI Hooks
import { useTheme } from "@mui/material";
// React
import { useState } from "react";
// React-router-dom
import { Link as RouterLink } from "react-router-dom";
// React Query
import useDeleteUserMutation from "../../hooks/users/UseDeleteUserMutation";
// context
import useAuthContext from "../../hooks/auth/useAuthContext";

const tableHeaderCells = [
    "Username",
    "Status",
    "Roles",
    "Join Date",
    "Options",
];

const UsersList = ({ data }) => {
    const [snackbar, setSnackbar] = useState({ open: false, msg: "" });

    const theme = useTheme();

    const deleteUser = useDeleteUserMutation();

    const { getUserRole } = useAuthContext();

    const onUserDelete = (id) => {
        deleteUser.mutate(id, {
            onSuccess: () => {
                console.log(`Deleted user: ${id}`);
                setSnackbar({
                    ...snackbar,
                    open: true,
                    msg: "User deleted successfully",
                });
            },
        });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const showOptions = (userRoles, currentUserRoles) => {
        return userRoles.includes("admin") && currentUserRoles !== "admin"
            ? false
            : true;
    };

    return (
        <>
            <CustomSnackbar
                isOpen={snackbar.open}
                onClose={handleSnackbarClose}
                message={snackbar.msg}
            />
            <TableContainer
                component={Paper}
                elevation={3}
                style={{ overflow: "auto", maxHeight: "65vh" }}
            >
                <Table aria-label="users table">
                    <TableHead>
                        <TableRow>
                            {tableHeaderCells.map((cell) => (
                                <TableCell
                                    align="left"
                                    key={cell}
                                    sx={{
                                        backgroundColor:
                                            theme.palette.secondary.main,
                                        color: theme.palette.secondary
                                            .contrastText,
                                    }}
                                >
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell component="th" scope="row">
                                    {user.username}
                                </TableCell>
                                <TableCell>
                                    {user.active ? "Active" : "Inactive"}
                                </TableCell>
                                <TableCell>{user.roles.join(" | ")}</TableCell>
                                <TableCell>
                                    {new Date(user.createdAt).toLocaleString()}
                                </TableCell>
                                {/* Options */}

                                <TableCell align="right">
                                    {showOptions(user.roles, getUserRole()) && (
                                        <Stack spacing={2} direction="row">
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() =>
                                                    onUserDelete(user._id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                component={RouterLink}
                                                to={`edit/${user._id}`}
                                            >
                                                Edit
                                            </Button>
                                        </Stack>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default UsersList;
