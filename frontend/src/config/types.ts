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
    createdAt: number;
}

export type RequestedUser = Omit<User, "id"> & { _id: string };

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

// ** API  **
// export enum FetchMethods {
//     GET = "GET",
//     POST = "POST",
//     PUT = "PUT",
//     PATCH = "PATCH",
//     DELETE = "DELETE",
// }

// export enum FetchCredentials {
//     OMIT = "omit",
//     INCLUDE = "include",
// }
export type FetchMethods = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
export type FetchCredentials = "omit" | "include";
