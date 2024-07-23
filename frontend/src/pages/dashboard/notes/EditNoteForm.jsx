// MUI Components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
// React
import { useState } from "react";
// React-router-dom
import { useParams, useNavigate } from "react-router-dom";
// React Query
import { useQueryClient } from "@tanstack/react-query";
import useUpdateNoteMutation from "../../../hooks/notes/useUpdateNoteMutation";

const EditNoteForm = () => {
    // Error State
    const [error, setError] = useState(null);

    // Get query client to get cached notes data
    const queryClient = useQueryClient();

    // Get notes Data from cache
    const cachedData = queryClient.getQueryData(["notes"]);

    // Get note id from the url parameters
    const { noteId } = useParams();

    // find the target note
    const note = cachedData && cachedData.find((note) => note._id === noteId);

    // update mutation
    const updateNoteMutation = useUpdateNoteMutation();

    // Navigate user
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        title: note.title,
        text: note.text,
        completed: note.completed,
    });

    // Handling form data change
    const handleFormDataChange = (e) => {
        if (e.target.name === "completed") {
            setFormData({ ...formData, [e.target.name]: e.target.checked });
            return;
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handling form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const { title, text, completed } = formData;

        // Creating the update object
        let updates = { id: noteId };
        if (title && title !== note.title) {
            updates = { ...updates, title };
        }
        if (text && text !== note.text) {
            updates = { ...updates, text };
        }
        if (completed !== note.completed) {
            updates = { ...updates, completed };
        }

        // If the updates object doesn't contain title or text or completed status then there is nothing to update
        if (!updates.title && !updates.text && !updates.completed) {
            setError("not enough data to create a note");
            return;
        }

        updateNoteMutation.mutate(updates, {
            onSuccess: () => navigate("/dashboard/notes"),
            onError: ({ message }) => setError(message),
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
                <Typography component="h1" variant="h5">
                    Edit Note
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
                                id="title"
                                label="title"
                                required
                                fullWidth
                                autoFocus
                                value={formData.title}
                                onChange={handleFormDataChange}
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
                                value={formData.text}
                                onChange={handleFormDataChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl
                                component="fieldset"
                                variant="standard"
                            >
                                <FormLabel component="legend">
                                    Completed Status
                                </FormLabel>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="completed"
                                            checked={formData.completed}
                                            onChange={handleFormDataChange}
                                        />
                                    }
                                    label="completed"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditNoteForm;
