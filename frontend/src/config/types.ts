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
export type FetchMethods = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
export type FetchCredentials = "omit" | "include";

// ** Users **

export type Role = "employee" | "manager" | "admin";

export interface User {
    access_token: string;
    active: boolean;
    id: string;
    roles: Role[];
    username: string;
    createdAt: number;
}

export type RequestedUser = Omit<User, "id"> & { _id: string };

export interface InitialAddUserFormData {
    username: string;
    password: string;
    roles: {
        employee: boolean;
        manager: boolean;
        admin: boolean;
    };
}

export interface AddUserRequestBody {
    username: string;
    password: string;
    roles: Role[];
}

// ** Permissions **
export interface PermissionsReturn {
    strictAdmin: boolean;
    strictAdminOwner: boolean;
    strictAdminManager: boolean;
    completeAdminManagerOwner: boolean;
    strictAdminManagerOwner: boolean;
}

// ** Notes **

export interface Note {
    _id: string;
    user: Pick<User, "username" | "roles">;
    title: string;
    text: string;
    completed: boolean;
    ticket: number;
    createdAt: number;
}

export interface NewNote {
    title: string;
    text: string;
    user: string;
}
