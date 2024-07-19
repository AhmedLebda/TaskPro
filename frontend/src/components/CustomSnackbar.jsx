import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CustomSnackbar = ({ isOpen, onClose, message }) => {
    return (
        <Snackbar open={isOpen} autoHideDuration={6000} onClose={onClose}>
            <Alert
                onClose={onClose}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;
