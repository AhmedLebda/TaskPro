// MUI Components
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
// Custom Component
import Spinner from "../../../components/general/Spinner";
import RolesFieldset from "../../../components/users/RolesFieldset";
import ActiveStatusFieldset from "../../../components/users/ActiveStatusFieldset";
import UsernameInput from "../../../components/users/UsernameInput";
import PasswordInput from "../../../components/users/PasswordInput";
import ErrorAlert from "../../../components/general/ErrorAlert";

// Custom Hooks
import useEditUser from "../../../hooks/ui/users/useEditUser";

const EditUserForm = () => {
    const {
        formData,
        isLoading,
        isMutating,
        errorAlert,
        handleFormDataChange,
        handleSubmit,
        isRolesFieldsetEnabled,
        isDataInputsEnabled,
        isActiveCheckboxEnabled,
    } = useEditUser();

    if (isLoading) {
        return <Spinner />;
    }

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
                            disabled={!isDataInputsEnabled}
                        />

                        <PasswordInput
                            value={formData.password}
                            onChange={handleFormDataChange}
                            disabled={!isDataInputsEnabled}
                        />

                        {/* Active Status Checkbox */}

                        <ActiveStatusFieldset
                            value={formData.active}
                            onChange={handleFormDataChange}
                            disabled={!isActiveCheckboxEnabled}
                        />

                        {/* Roles Checkboxes*/}
                        <RolesFieldset
                            disabled={!isRolesFieldsetEnabled}
                            rolesValues={formData.roles}
                            onChange={handleFormDataChange}
                        />
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isMutating}
                    >
                        Edit
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditUserForm;
