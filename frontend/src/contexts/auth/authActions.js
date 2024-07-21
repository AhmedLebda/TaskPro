const setCredentials = (payload) => ({
    type: "auth/setCredentials",
    payload,
});
const updateCredentials = (payload) => ({
    type: "auth/updateCredentials",
    payload,
});
const removeCredentials = () => ({ type: "auth/removeCredentials" });

const AuthActionsCreator = {
    setCredentials,
    updateCredentials,
    removeCredentials,
};

export default AuthActionsCreator;
