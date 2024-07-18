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

const UserServices = { getUsersList, createUser };
export default UserServices;
