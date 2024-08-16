import Alert from "@mui/material/Alert";

const ErrorAlert = ({ errorMessage }) => {
    return errorMessage && <Alert severity="error">{errorMessage}</Alert>;
};

export default ErrorAlert;
