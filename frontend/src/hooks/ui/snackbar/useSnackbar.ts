import { useContext } from "react";
import snackbarActionsCreator from "../../../contexts/ui/snackbar/snackbarActions";
import { snackbarContext } from "../../../contexts/ui/snackbar/SnackbarContextProvider";

const useSnackbar = () => {
    const context = useContext(snackbarContext);

    if (!context)
        throw Error(
            "useSnackbar must be used inside an SnackbarContextProvider"
        );

    const { snackbar, dispatch } = context;

    const showSnackbar = (message: string) => {
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
