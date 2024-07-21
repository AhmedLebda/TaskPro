const BASE_URL = "http://localhost:3001/api/auth";

const FETCH_OPTIONS = {
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
};

const login = async (userData) => {
    const response = await fetch(BASE_URL, {
        ...FETCH_OPTIONS,
        method: "POST",
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) throw Error(data.error);

    return data;
};

const refreshToken = async () => {
    const response = await fetch(`${BASE_URL}/refresh`, {
        ...FETCH_OPTIONS,
        method: "GET",
    });

    const data = await response.json();

    if (!response.ok) throw Error("refresh token expired");
    return data;
};

const AuthServices = { login, refreshToken };

export default AuthServices;
