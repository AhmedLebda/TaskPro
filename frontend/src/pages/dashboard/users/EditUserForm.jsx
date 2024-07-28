// MUI Components
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";
// Custom Component
import Spinner from "../../../components/Spinner";
import RolesFieldset from "../../../components/users/RolesFieldset";
import ActiveStatusFieldset from "../../../components/users/ActiveStatusFieldset";
import UsernameInput from "../../../components/users/UsernameInput";
import PasswordInput from "../../../components/users/PasswordInput";
// Custom Hooks
import useEditUser from "../../../hooks/ui/users/useEditUser";

const EditUserForm = () => {
    const {
        formData,
        isLoading,
        error,
        handleFormDataChange,
        handleSubmit,
        isShowRolesFieldset,
    } = useEditUser();

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
                        <UsernameInput
                            value={formData.username}
                            onChange={handleFormDataChange}
                        />

                        <PasswordInput
                            value={formData.password}
                            onchange={handleFormDataChange}
                        />

                        {/* Active Status Checkbox */}
                        <ActiveStatusFieldset
                            value={formData.active}
                            onChange={handleFormDataChange}
                        />

                        {/* Roles Checkboxes*/}
                        <RolesFieldset
                            isVisible={isShowRolesFieldset}
                            rolesValues={formData.roles}
                            onChange={handleFormDataChange}
                        />

                        <Grid item xs={12}>
                            <FormHelperText>
                                Password field can be left empty
                            </FormHelperText>
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
