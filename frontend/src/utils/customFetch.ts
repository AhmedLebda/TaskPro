import { BASE_URL } from "../config/config";
import { FetchMethods, FetchCredentials } from "../config/types";

interface FetchOptions {
    mode: "cors" | "same-origin" | "no-cors";
    method: FetchMethods;
    credentials: FetchCredentials;
    headers: {
        "Content-Type": "application/json";
        Authorization?: `Bearer ${string}`;
    };
    body?: string;
}

const customFetch = async (
    endpoint: string,
    method: FetchMethods,
    credentials: FetchCredentials,
    body?: string,
    token?: string
) => {
    const options: FetchOptions = {
        mode: "cors",
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: credentials,
    };

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (method !== "GET") {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(
        `${BASE_URL}${endpoint}`,
        options as RequestInit
    );

    // handle delete requests which just return 204 no content status code
    if (response.status === 204) {
        return;
    }

    const data = await response.json();

    if (!response.ok) throw Error(data.error);

    return data;
};

export default customFetch;
