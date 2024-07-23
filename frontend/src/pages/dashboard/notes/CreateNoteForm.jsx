// MUI components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
// Custom Hooks
import useNoteCreateMutation from "../../../hooks/notes/useCreateNoteMutation";
import useAuthContext from "../../../hooks/auth/useAuthContext";
// React-router-dom
import { useNavigate } from "react-router-dom";
// React
import { useState } from "react";

const CreateNoteForm = () => {
    // Error state
    const [error, setError] = useState(null);
    // Getting user data from the global context
    const { getUserData } = useAuthContext();
    const user = getUserData();
    // Note mutation to create new notes
    const noteMutation = useNoteCreateMutation();
    // navigate hook to redirect user after successful note creation
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        const text = formData.get("text");

        // user must provide title and text for note
        if (!title || !text) {
            setError("not enough data to create a note");
            return;
        }

        // Create a new note and redirect user to notes list in case of success or show alert of the error message in case of error
        noteMutation.mutate(
            { user: user.id, title, text },
            {
                onSuccess: () => navigate("/dashboard/notes"),
                onError: (error) => setError(error.message),
            }
        );
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
                <Typography component="h1" variant="h5">
                    Create Note
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
                                name="title"
                                required
                                fullWidth
                                id="title"
                                label="title"
                                autoFocus
                            />
                        </Grid>
                        {/* Password */}
                        <Grid item xs={12}>
                            <TextField
                                required
                                multiline
                                rows={6}
                                fullWidth
                                name="text"
                                label="Text"
                                id="text"
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CreateNoteForm;
