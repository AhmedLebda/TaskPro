const BASE_URL = "http://localhost:3001/api/auth";

const FETCH_OPTIONS = {
    method: "cors",
    headers: {
        "Content-Type": "application/json",
    },
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

const AuthServices = { login };

export default AuthServices;
