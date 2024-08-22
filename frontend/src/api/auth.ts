import customFetch from "../utils/customFetch";
import { User } from "../config/types";

interface UserData {
    username: string;
    password: string;
}

const login = async (userData: UserData): Promise<User> => {
    return await customFetch("/auth", "POST", "include", userData);
};

const refreshToken = async (): Promise<User> => {
    return await customFetch("/auth/refresh", "GET", "include");
};

const AuthServices = { login, refreshToken };

export default AuthServices;
