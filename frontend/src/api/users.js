const BASE_URL = "http://localhost:3001/api/users";

const FETCH_OPTIONS = {
    method: "cors",
    headers: {
        "Content-Type": "application/json",
    },
};

const getUsersList = async () => {
    const response = await fetch(BASE_URL);

    if (!response.ok) throw Error("Error fetching data");

    const data = await response.json();

    return data;
};

const createUser = async (userData) => {
    const response = await fetch(BASE_URL, {
        ...FETCH_OPTIONS,
        method: "POST",
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) throw Error(data.error);

    return data;
};

const deleteUser = async (id) => {
    const reqBody = { id };
    const response = await fetch(BASE_URL, {
        ...FETCH_OPTIONS,
        method: "DELETE",
        body: JSON.stringify(reqBody),
    });

    // Only parse the response in case of error which returns an error object
    if (!response.ok) {
        const data = await response.json();
        throw Error(data.error);
    }

    // We return a response object here because in case of successful delete operation the api only returns a status code '204' and no content so if we tried to parse the response into json data it will only return null and not a promise which will cause error in react query mutation function
    return response;
};

const updateUser = async (updates) => {
    const response = await fetch(BASE_URL, {
        ...FETCH_OPTIONS,
        method: "PATCH",
        body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) throw Error(data.error);

    return data;
};

const UserServices = { getUsersList, createUser, deleteUser, updateUser };
export default UserServices;
