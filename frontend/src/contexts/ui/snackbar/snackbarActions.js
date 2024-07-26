const setSnackbar = (payload) => ({
    type: "snackbar/setSnackbar",
    payload,
});

const resetSnackbar = () => ({
    type: "snackbar/resetSnackbar",
});

const snackbarActionsCreator = { setSnackbar, resetSnackbar };

export default snackbarActionsCreator;
