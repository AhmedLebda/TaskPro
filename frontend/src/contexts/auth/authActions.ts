import {
    AuthActionWithoutPayload,
    AuthActionWithPayload,
    User,
} from "../../config/types";

const setCredentials = (payload: User): AuthActionWithPayload => ({
    type: "auth/setCredentials",
    payload,
});
const updateCredentials = (payload: User): AuthActionWithPayload => ({
    type: "auth/updateCredentials",
    payload,
});
const removeCredentials = (): AuthActionWithoutPayload => ({
    type: "auth/removeCredentials",
});

const AuthActionsCreator = {
    setCredentials,
    updateCredentials,
    removeCredentials,
};

export default AuthActionsCreator;
