import {
    DefaultSnackbar,
    SnackbarActionWithPayload,
    SnackbarActionWithoutPayload,
} from "./../../../config/types";

const setSnackbar = (payload: DefaultSnackbar): SnackbarActionWithPayload => ({
    type: "snackbar/setSnackbar",
    payload,
});

const resetSnackbar = (): SnackbarActionWithoutPayload => ({
    type: "snackbar/resetSnackbar",
});

const snackbarActionsCreator = { setSnackbar, resetSnackbar };

export default snackbarActionsCreator;
