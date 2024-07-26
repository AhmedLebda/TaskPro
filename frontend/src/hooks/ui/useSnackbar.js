import { useContext } from "react";
import snackbarContext from "../../contexts/ui/snackbar/snackbarContext";
import snackbarActionsCreator from "../../contexts/ui/snackbar/snackbarActions";

const useSnackbar = () => {
    const context = useContext(snackbarContext);

    if (!context)
        throw Error(
            "useSnackbar must be used inside an SnackbarContextProvider"
        );

    const { snackbar, dispatch } = context;

    const showSnackbar = (message) => {
        dispatch(
            snackbarActionsCreator.setSnackbar({ open: true, message: message })
        );
    };
    const resetSnackbar = () => {
        dispatch(snackbarActionsCreator.resetSnackbar());
    };

    return { snackbar, showSnackbar, resetSnackbar };
};

export default useSnackbar;
