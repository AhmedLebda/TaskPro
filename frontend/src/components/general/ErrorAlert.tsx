import Alert from "@mui/material/Alert";

interface ErrorAlertProps {
    errorMessage: string | null;
}

const ErrorAlert = ({ errorMessage }: ErrorAlertProps) => {
    return errorMessage && <Alert severity="error">{errorMessage}</Alert>;
};

export default ErrorAlert;
