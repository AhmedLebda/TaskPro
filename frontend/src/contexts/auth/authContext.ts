import { createContext, Dispatch } from "react";
import { AuthAction, User } from "../../config/types";

interface initialContextValue {
    user: User | null;
    dispatch: Dispatch<AuthAction>;
    isAuthenticated: boolean;
}

const authContext = createContext<initialContextValue>(
    {} as initialContextValue
);

export default authContext;
