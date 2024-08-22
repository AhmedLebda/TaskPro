// ** Login **
export interface InitialLoginFormData {
    username: string;
    password: string;
}

// ** Auth Context **
export interface AuthActionWithoutPayload {
    type: "auth/removeCredentials";
}
export interface AuthActionWithPayload {
    type: "auth/setCredentials" | "auth/updateCredentials";
    payload: any;
}
export type AuthAction = AuthActionWithoutPayload | AuthActionWithPayload;

export interface User {
    access_token: string;
    active: boolean;
    id: string;
    roles: string[];
    username: string;
}

// ** Snackbar **

export interface DefaultSnackbar {
    open: boolean;
    message: string;
}

export interface SnackbarActionWithPayload {
    type: "snackbar/setSnackbar";
    payload: { open: boolean; message: string };
}
export interface SnackbarActionWithoutPayload {
    type: "snackbar/resetSnackbar";
}

export type SnackbarAction =
    | SnackbarActionWithPayload
    | SnackbarActionWithoutPayload;
