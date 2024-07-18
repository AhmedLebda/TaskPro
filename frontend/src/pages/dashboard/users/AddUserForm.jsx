import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";

import useCreateUserMutation from "../../../hooks/users/UseCreateUserMutation";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddUserForm = () => {
    const createUser = useCreateUserMutation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const username = data.get("username");
        const password = data.get("password");

        // Collect all checked roles into an array
        const roles = [];

        data.forEach((value, key) => {
            if (key === "employee" || key === "manager" || key === "admin") {
                roles.push(key);
            }
        });

        if ((!username, !password)) {
            setError("Invalid username or password");
        }

        if (roles.length === 0) {
            roles.push("employee");
        }

        const userData = {
            username,
            password,
            roles,
        };

        createUser.mutate(userData, {
            onSuccess: (response) => {
                console.log("user created!", response);
                setError(null);
                navigate("/dashboard/users");
            },
            onLoading: () => {
                setIsLoading(true);
            },
            onError: (error) => {
                setError(error.message);
            },
        });
    };

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
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Add User
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
                                required
                                fullWidth
                                id="username"
                                label="username"
                                autoFocus
                            />
                        </Grid>
                        {/* Password */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        {/* Roles */}
                        <Grid item xs={12}>
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
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                defaultChecked
                                                name="employee"
                                            />
                                        }
                                        label="Employee"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox name="manager" />}
                                        label="Manager"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox name="admin" />}
                                        label="Admin"
                                    />
                                </FormGroup>

                                <FormHelperText>
                                    Employee is a default value
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AddUserForm;
