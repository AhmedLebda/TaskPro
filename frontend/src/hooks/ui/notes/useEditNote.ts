// React
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
// React-router-dom
import { useNavigate } from "react-router-dom";
// React Query
import useUpdateNoteMutation from "../../notes/useUpdateNoteMutation";
// Custom Hooks
import useSnackbar from "../snackbar/useSnackbar";
import { NoteUpdates } from "../../../config/types";
import { SelectChangeEvent } from "@mui/material";
import useNoteDetailsQuery from "../../notes/useNoteDetailsQuery";

const initialFormData = {
    user: "",
    title: "",
    text: "",
    completed: false,
};

const useEditNote = () => {
    // Error State
    const [errorAlert, setErrorAlert] = useState("");

    const { data: targetNote, isLoading, error } = useNoteDetailsQuery();
    if (error) setErrorAlert(error.message);

    // Form state
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (targetNote) {
            setFormData({
                user: targetNote.user._id,
                title: targetNote.title,
                text: targetNote.text,
                completed: targetNote.completed,
            });
        }
    }, [targetNote]);

    // update mutation
    const updateNoteMutation = useUpdateNoteMutation();

    // Navigate user
    const navigate = useNavigate();

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

        if (!targetNote) return;

        const { title, text, completed, user } = formData;
        const { _id: targetNoteId } = targetNote;

        // Creating the update object
        let updates: NoteUpdates = { id: targetNoteId };

        if (title && title !== targetNote.title) {
            updates = { ...updates, title };
        }
        if (text && text !== targetNote.text) {
            updates = { ...updates, text };
        }
        if (completed !== targetNote.completed) {
            updates = { ...updates, completed };
        }
        if (user && user !== targetNote.user._id) {
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

    return {
        errorAlert,
        isLoading,
        isMutating: updateNoteMutation.isPending,
        formData,
        handleFormDataChange,
        handleSubmit,
    };
};

export default useEditNote;
