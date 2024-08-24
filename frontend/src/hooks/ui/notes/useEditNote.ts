// React
import { ChangeEvent, FormEvent, useState } from "react";
// React-router-dom
import { useParams, useNavigate } from "react-router-dom";
// React Query
import { useQueryClient } from "@tanstack/react-query";
import useUpdateNoteMutation from "../../notes/useUpdateNoteMutation";
// Custom Hooks
import useSnackbar from "../snackbar/useSnackbar";
import { Note, NoteUpdates } from "../../../config/types";
import { SelectChangeEvent } from "@mui/material";

const useEditNote = () => {
    // Error State
    const [errorAlert, setErrorAlert] = useState("");

    // Get query client to get cached notes data
    const queryClient = useQueryClient();

    // Get notes Data from cache
    const cachedData = queryClient.getQueryData(["notes"]) as Note[] | null;

    // Get note id from the url parameters
    const { noteId } = useParams();

    // find the target note
    const note = cachedData && cachedData.find((note) => note._id === noteId);

    // update mutation
    const updateNoteMutation = useUpdateNoteMutation();

    // Navigate user
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        user: note?.user._id || "",
        title: note?.title || "",
        text: note?.text || "",
        completed: note?.completed || false,
    });

    // Show successful message on task update
    const { showSnackbar } = useSnackbar();

    // Handling form data change
    const handleFormDataChange = (
        e:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<string | null>
    ) => {
        if (e.target instanceof HTMLInputElement) {
            if (e.target.type === "checkbox") {
                setFormData({ ...formData, [e.target.name]: e.target.checked });
            } else {
                setFormData({ ...formData, [e.target.name]: e.target.value });
            }
        } else if (e.target instanceof HTMLTextAreaElement) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        } else if (e instanceof HTMLSelectElement) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Handling form submit
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!note || !noteId) {
            setErrorAlert("note enough note data");
            return;
        }

        const { title, text, completed, user } = formData;

        // Creating the update object
        let updates: NoteUpdates = { id: noteId };

        if (title && title !== note.title) {
            updates = { ...updates, title };
        }
        if (text && text !== note.text) {
            updates = { ...updates, text };
        }
        if (completed !== note.completed) {
            updates = { ...updates, completed };
        }
        if (user && user !== note.user._id) {
            updates = { ...updates, user };
        }

        // If the updates object includes only the note's ID, return immediately without making an API request, as there are no changes to the note.
        if (Object.entries(updates).length === 1) {
            setErrorAlert("You didn't change anything to update");
            return;
        }

        updateNoteMutation.mutate(updates, {
            onSuccess: () => {
                showSnackbar("Success! The task changes have been saved.");
                navigate("/dashboard/notes");
            },
            onError: ({ message }) => setErrorAlert(message),
        });
    };

    return { errorAlert, formData, handleFormDataChange, handleSubmit };
};

export default useEditNote;
