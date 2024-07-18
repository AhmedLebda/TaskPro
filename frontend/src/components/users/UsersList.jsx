import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useState } from "react";
import { useTheme } from "@mui/material";
import useDeleteUserMutation from "../../hooks/users/UseDeleteUserMutation";

const UsersList = ({ data }) => {
    const [snackbar, setSnackbar] = useState({ open: false, msg: "" });
    const theme = useTheme();
    const deleteUser = useDeleteUserMutation();
    const tableHeaderCells = [
        "Username",
        "Status",
        "Roles",
        "Join Date",
        "Options",
    ];

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

    const onUserEdit = (id) => {
        console.log(`Editing user: ${id}`);
    };
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.msg}
                </Alert>
            </Snackbar>
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
                                <TableCell align="right">
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
                                            onClick={() => onUserEdit(user._id)}
                                        >
                                            Edit
                                        </Button>
                                    </Stack>
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
