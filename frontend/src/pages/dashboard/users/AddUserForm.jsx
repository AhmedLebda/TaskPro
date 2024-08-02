import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
// MUI Components
import Container from "@mui/material/Container";
// Custom Components
import RolesFieldset from "../../../components/users/RolesFieldset";
import UsernameInput from "../../../components/users/UsernameInput";
import PasswordInput from "../../../components/users/PasswordInput";
import ErrorAlert from "../../../components/general/ErrorAlert";
// Custom Hooks
import useAddUser from "../../../hooks/ui/users/useAddUser";

const AddUserForm = () => {
    const {
        errorAlert,
        isLoading,
        handleFormDataChange,
        handleSubmit,
        formData,
    } = useAddUser();

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
                        <UsernameInput
                            value={formData.username}
                            onChange={handleFormDataChange}
                        />

                        {/* Password */}
                        <PasswordInput
                            value={formData.password}
                            onChange={handleFormDataChange}
                        />

                        {/* Roles */}
                        <RolesFieldset
                            rolesValues={formData.roles}
                            onChange={handleFormDataChange}
                        />
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
