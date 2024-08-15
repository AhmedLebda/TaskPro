// MUI components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
// Custom Components
import UsersSelect from "../../../components/notes/UsersSelect";
import ErrorAlert from "../../../components/general/ErrorAlert";
// Custom Hooks
import useCreateNote from "../../../hooks/ui/notes/useCreateNote";

const CreateNoteForm = () => {
    const {
        errorAlert,
        formData,
        isMutating,
        handleFormDataChange,
        handleSubmit,
    } = useCreateNote();

    return (
        <Container component="main" maxWidth="xs">
            <ErrorAlert error={errorAlert} />
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
                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                name="title"
                                required
                                fullWidth
                                id="title"
                                label="title"
                                autoFocus
                                value={formData.title}
                                onChange={handleFormDataChange}
                            />
                        </Grid>

                        {/* Text */}
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

                        {/* Assign note to a user (only for admins and managers) */}

                        <Grid item xs={12}>
                            <UsersSelect
                                value={formData.user}
                                onChange={handleFormDataChange}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isMutating}
                    >
                        Create
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CreateNoteForm;
