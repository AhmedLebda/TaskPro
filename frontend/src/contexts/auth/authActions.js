const setCredentials = (payload) => ({
    type: "auth/setCredentials",
    payload,
});
const removeCredentials = () => ({ type: "auth/removeCredentials" });

const AuthActionsCreator = { setCredentials, removeCredentials };

export default AuthActionsCreator;
