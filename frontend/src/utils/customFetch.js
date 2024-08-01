import { BASE_URL } from "../config/config";

const customFetch = async (
    endpoint,
    method,
    body,
    credentials = "omit",
    token
) => {
    let options = {
        mode: "cors",
        method: method.toUpperCase(),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: credentials,
    };

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (method.toLowerCase() !== "get") {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    // handle delete requests which just return 204 no content status code
    if (response.status === 204) {
        return;
    }

    const data = await response.json();

    if (!response.ok) throw Error(data.error);

    return data;
};

export default customFetch;
