const BASE_URL = "http://localhost:3001/api/notes";

const getNotesList = async () => {
    const response = await fetch(BASE_URL);

    if (!response.ok) throw Error("Error fetching data");

    const data = await response.json();

    return data;
};

const NoteServices = { getNotesList };
export default NoteServices;
