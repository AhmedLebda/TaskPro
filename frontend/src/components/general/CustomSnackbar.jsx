import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useSnackbar from "../../hooks/ui/snackbar/useSnackbar";

const CustomSnackbar = () => {
    const { snackbar, resetSnackbar } = useSnackbar();
    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={resetSnackbar}
        >
            <Alert
                onClose={resetSnackbar}
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;
