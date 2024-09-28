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
// React-router-dom
import { Link as RouterLink } from "react-router-dom";
// React Query
import useDeleteUserMutation from "../../hooks/users/useDeleteUserMutation";
// context
import useAuthContext from "../../hooks/auth/useAuthContext";
import useSnackbar from "../../hooks/ui/snackbar/useSnackbar";
// Utils
import permissions from "../../utils/permissions";
import { User, RequestedUser } from "../../config/types";

interface UsersListProps {
    data: RequestedUser[];
}

const tableHeaderCells = [
    "Username",
    "Status",
    "Roles",
    "Join Date",
    "Options",
];

function showUserOptions(currentUser: User, targetUser: RequestedUser) {
    const Permissions = permissions(currentUser, targetUser);
    return Permissions.completeAdminManagerOwner;
}

const UsersList = ({ data }: UsersListProps) => {
    // Delete user mutation
    const deleteUser = useDeleteUserMutation();

    // Getting the current user role
    const { getUserData } = useAuthContext();
    const CurrentUserData = getUserData()!;

    // Show snackbar on successful actions
    const { showSnackbar } = useSnackbar();

    // Delete user handler
    const onUserDelete = (id: string) => {
        deleteUser.mutate(id, {
            onSuccess: () => {
                showSnackbar("User Deleted!");
            },
        });
    };

    return (
        <>
            <TableContainer
                component={Paper}
                elevation={0}
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
                                        bgcolor: "secondary.main",
                                        color: "secondary.contrastText",
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
                                    <RouterLink
                                        to={`/dashboard/notes/${user._id}`}
                                    >
                                        {user.username}
                                    </RouterLink>
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
                                    {showUserOptions(CurrentUserData, user) && (
                                        <Stack
                                            spacing={2}
                                            direction="row"
                                            justifyContent="flex-end"
                                        >
                                            {CurrentUserData.id !==
                                                user._id && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() =>
                                                        onUserDelete(user._id)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            )}
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
