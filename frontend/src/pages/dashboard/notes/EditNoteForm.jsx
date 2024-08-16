// MUI Components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
// Custom Component
import UsersSelect from "../../../components/notes/UsersSelect";
import ErrorAlert from "../../../components/general/ErrorAlert";
// Custom Hooks
import useEditNote from "../../../hooks/ui/notes/useEditNote";
const EditNoteForm = () => {
    const { errorAlert, formData, handleFormDataChange, handleSubmit } =
        useEditNote();

    return (
        <Container component="main" maxWidth="xs">
            <ErrorAlert errorMessage={errorAlert} />

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
                        {/* Title */}
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

                        {/* Completed Status */}
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
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditNoteForm;
