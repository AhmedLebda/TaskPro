import { useReducer } from "react";
import snackbarContext from "./snackbarContext";

const snackbarReducer = (state, action) => {
    switch (action.type) {
        case "snackbar/setSnackbar":
            return { ...state, ...action.payload };
        case "snackbar/resetSnackbar":
            return {
                ...state,
                open: false,
                message: "",
            };
        default:
            return state;
    }
};

const SnackbarContextProvider = ({ children }) => {
    const [snackbar, dispatch] = useReducer(snackbarReducer, {
        open: false,
        message: "",
    });

    return (
        <snackbarContext.Provider value={{ snackbar, dispatch }}>
            {children}
        </snackbarContext.Provider>
    );
};

export default SnackbarContextProvider;
