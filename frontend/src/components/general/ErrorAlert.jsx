import Alert from "@mui/material/Alert";

const ErrorAlert = ({ error }) => {
    const { isVisible, message } = error;
    return isVisible && <Alert severity="error">{message}</Alert>;
};

export default ErrorAlert;
