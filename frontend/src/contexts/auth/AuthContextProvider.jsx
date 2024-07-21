import authContext from "./authContext";
import { useReducer } from "react";

const authReducer = (state, action) => {
    switch (action.type) {
        case "auth/setCredentials":
            return action.payload;
        case "auth/updateCredentials":
            return { ...state, ...action.payload };
        case "auth/removeCredentials":
            return null;
        default:
            return state;
    }
};

const AuthContextProvider = ({ children }) => {
    const [user, dispatch] = useReducer(authReducer, null);
    console.log(user);
    return (
        <authContext.Provider value={{ user, dispatch }}>
            {children}
        </authContext.Provider>
    );
};

export default AuthContextProvider;
