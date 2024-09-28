import { PropsWithChildren, useReducer } from "react";
import { createContext, Dispatch } from "react";
import { DefaultSnackbar, SnackbarAction } from "../../../config/types";

interface ContextValue {
    snackbar: DefaultSnackbar;
    dispatch: Dispatch<SnackbarAction>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const snackbarContext = createContext({} as ContextValue);

const initialState: DefaultSnackbar = {
    open: false,
    message: "",
};

const snackbarReducer = (
    state = initialState,
    action: SnackbarAction
): DefaultSnackbar => {
    switch (action.type) {
        case "snackbar/setSnackbar":
            return { ...state, ...action.payload };
        case "snackbar/resetSnackbar":
            return initialState;
        default:
            return state;
    }
};

const SnackbarContextProvider = ({ children }: PropsWithChildren) => {
    const [snackbar, dispatch] = useReducer(snackbarReducer, initialState);

    return (
        <snackbarContext.Provider value={{ snackbar, dispatch }}>
            {children}
        </snackbarContext.Provider>
    );
};

export default SnackbarContextProvider;
