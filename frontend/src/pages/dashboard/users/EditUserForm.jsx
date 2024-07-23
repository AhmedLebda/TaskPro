// MUI Components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";
// React-router-dom
import { useParams, useNavigate, Navigate } from "react-router-dom";
// React Query
import { useQueryClient } from "@tanstack/react-query";
import useUpdateUserMutation from "../../../hooks/users/UseUpdateUserMutation";
// React
import { useState } from "react";
import useAuthContext from "../../../hooks/auth/useAuthContext";

const EditUserForm = () => {
    // Getting user id from the url params
    const { userId } = useParams();

    // navigate hook to redirect user after successful action
    const navigate = useNavigate();

    // context hook to get the update credentials method
    const { updateCredentials } = useAuthContext();

    // Getting query client to get cached user data
    const queryClient = useQueryClient();

    // Custom hook to create an update user mutation
    const updateMutation = useUpdateUserMutation();

    // Getting users Data from cache
    const cachedData = queryClient.getQueryData(["users"]);

    // Error state to display errors
    const [error, setError] = useState(null);

    // List of all available roles
    const roles = ["employee", "manager", "admin"];

    // Find the specific user with id from url parameters
    const user = cachedData?.find((user) => user._id === userId);
    // console.log(user);
    // Function that checks if a role active
    const isRoleActive = (role) => user?.roles.includes(role);

    // Form States
    const [username, setUsername] = useState(user?.username);
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(user?.active);
    const [rolesState, setRolesState] = useState({
        employee: isRoleActive("employee"),
        manager: isRoleActive("manager"),
        admin: isRoleActive("admin"),
    });

    const handleRolesStateChange = (e) =>
        setRolesState({
            ...rolesState,
            [e.target.name]: e.target.checked,
        });

    const handleSubmit = (event) => {
        event.preventDefault();
        let updates = { id: userId, active: isActive };
        const checkedRoles = roles.filter((role) => rolesState[role]);

        if (username && username !== user.username) {
            updates = { ...updates, username };
        }
        if (password) {
            updates = { ...updates, password };
        }
        if (checkedRoles.length !== 0) {
            updates = { ...updates, roles: checkedRoles };
        }

        updateMutation.mutate(updates, {
            onSuccess: (res) => {
                const { username, active, roles } = res;
                updateCredentials({ username, active, roles });
                navigate("/dashboard/users");
            },
            onError: (error) => {
                setError(error.message);
            },
        });
    };

    // return to the users list in dashboard if the user can't be found in the cache
    if (!user) {
        return <Navigate to="/dashboard/users" />;
    }

    return (
        <Container component="main" maxWidth="xs">
            {error && <Alert severity="error">{error}</Alert>}

            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Edit User
                </Typography>

                {/* Form */}
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        {/* Username */}
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                name="username"
                                fullWidth
                                id="username"
                                label="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        {/* Password */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        {/* Roles */}
                        <Grid item xs={12}>
                            <FormControl
                                component="fieldset"
                                variant="standard"
                            >
                                <FormLabel component="legend">
                                    Active Status
                                </FormLabel>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="active"
                                            checked={isActive}
                                            onChange={(e) =>
                                                setIsActive(e.target.checked)
                                            }
                                        />
                                    }
                                    label="Active"
                                />
                            </FormControl>
                            <FormControl
                                component="fieldset"
                                variant="standard"
                            >
                                <FormLabel component="legend">
                                    Employee Role
                                </FormLabel>
                                <FormGroup
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    {roles.map((role) => (
                                        <FormControlLabel
                                            key={role}
                                            control={
                                                <Checkbox
                                                    name={role}
                                                    checked={rolesState[role]}
                                                    onChange={
                                                        handleRolesStateChange
                                                    }
                                                />
                                            }
                                            label={role}
                                        />
                                    ))}
                                </FormGroup>

                                <FormHelperText>
                                    Password field can be left empty
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditUserForm;
