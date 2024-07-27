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
// Custom Component
import Spinner from "../../../components/Spinner";
// React-router-dom
import { useParams, useNavigate } from "react-router-dom";
// React Query
import useUpdateUserMutation from "../../../hooks/users/UseUpdateUserMutation";
import useUserDetailsQuery from "../../../hooks/users/useUserDetailsQuery";
// React
import { useState, useEffect, useCallback } from "react";
import useAuthContext from "../../../hooks/auth/useAuthContext";

// Initial Form state
const initialFormData = {
    username: "",
    password: "",
    active: false,
    roles: {
        employee: false,
        manager: false,
        admin: false,
    },
};

// List of all available roles
const roles = ["employee", "manager", "admin"];

const EditUserForm = () => {
    // Getting user id from the url params
    const { userId } = useParams();

    // navigate hook to redirect user after successful action
    const navigate = useNavigate();

    // context hook to get the update credentials method
    const { updateCredentials, getUserData } = useAuthContext();

    // Get the user id
    const currentUserId = getUserData().id;

    // Get user data
    const { data: user, isLoading, error: fetchError } = useUserDetailsQuery();

    // Custom hook to create an update user mutation
    const updateMutation = useUpdateUserMutation();

    // Error state to display errors
    const [error, setError] = useState(null);

    // Form fields state
    const [formData, setFormData] = useState(initialFormData);

    // Get the active roles when data comes from api
    const getActiveRoles = useCallback(() => {
        return user?.roles.reduce(
            (acc, curr) => {
                acc[curr] = true;
                return acc;
            },
            { ...initialFormData.roles }
        );
    }, [user]);

    useEffect(() => {
        if (user) {
            const userData = {
                username: user.username,
                active: user.active,
                roles: { ...initialFormData.roles, ...getActiveRoles() },
            };

            setFormData({ ...initialFormData, ...userData });
        }
    }, [getActiveRoles, user]);

    // Handles change in form data
    const handleFormDataChange = (e) => {
        if (e.target.name === "active") {
            setFormData({ ...formData, [e.target.name]: e.target.checked });
            return;
        }

        if (e.target.type === "checkbox") {
            setFormData({
                ...formData,
                roles: { ...formData.roles, [e.target.name]: e.target.checked },
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Handles form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        let updates = { id: userId };

        if (formData.username !== user.username) {
            updates = { ...updates, username: formData.username };
        }

        if (formData.password) {
            updates = { ...updates, password: formData.password };
        }

        if (
            JSON.stringify(formData.roles) !== JSON.stringify(getActiveRoles())
        ) {
            const rolesArray = [];

            for (let [key, value] of Object.entries(formData.roles)) {
                if (value) {
                    rolesArray.push(key);
                }
            }
            console.log(rolesArray);

            updates = { ...updates, roles: rolesArray };
        }

        if (formData.active !== user.active) {
            updates = { ...updates, active: formData.active };
        }
        console.log(updates);
        if (Object.values(updates).length === 1) {
            setError("You didn't provide new data to update");
            return;
        }

        updateMutation.mutate(updates, {
            onSuccess: (res) => {
                const { id, username, active, roles } = res;
                // Only update the user info. if the user is trying to update his own account info. so admins and managers don't update the user info. state with wrong info when they try to update another user info.
                if (id === currentUserId) {
                    updateCredentials({ username, active, roles });
                }
                navigate("/dashboard/users");
            },
            onError: (error) => {
                setError(error.message);
            },
        });
    };

    if (fetchError) {
        setError(fetchError.message);
    }

    if (isLoading) {
        return <Spinner />;
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
                                value={formData.username}
                                onChange={handleFormDataChange}
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
                                value={formData.password}
                                onChange={handleFormDataChange}
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
                                            checked={formData.active}
                                            onChange={handleFormDataChange}
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
                                                    checked={
                                                        formData.roles[role]
                                                    }
                                                    onChange={
                                                        handleFormDataChange
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
