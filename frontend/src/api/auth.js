import customFetch from "../utils/customFetch";

const login = async (userData) => {
    return await customFetch("/auth", "post", userData, "include");
};

const refreshToken = async () => {
    return await customFetch("/auth/refresh", "get", null, "include");
};

const AuthServices = { login, refreshToken };

export default AuthServices;
