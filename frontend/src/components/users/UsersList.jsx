import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { useTheme } from "@mui/material";
const UsersList = ({ data }) => {
    const theme = useTheme();
    const tableHeaderCells = ["Username", "Status", "Roles", "Join Date"];
    return (
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
                                    color: theme.palette.secondary.contrastText,
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersList;
