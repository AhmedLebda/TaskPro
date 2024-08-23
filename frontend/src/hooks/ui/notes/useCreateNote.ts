// Custom Hooks
import useNoteCreateMutation from "../../notes/useCreateNoteMutation";
import useAuthContext from "../../auth/useAuthContext";
import useSnackbar from "../snackbar/useSnackbar";
// React-router-dom
import { useNavigate } from "react-router-dom";
// React
import { ChangeEvent, FormEvent, useState } from "react";
// React-query
import { NewNote } from "../../../config/types";
import { SelectChangeEvent } from "@mui/material";

const useCreateNote = () => {
    // Error state
    const [errorAlert, setErrorAlert] = useState("");

    // Getting user data from the global context
    const { getUserData } = useAuthContext();
    const user = getUserData()!;

    // Form state
    const [formData, setFormData] = useState<NewNote>({
        title: "",
        text: "",
        user: user.id,
    });

    // Note mutation to create new notes
    const noteMutation = useNoteCreateMutation();

    // navigate hook to redirect user after successful note creation
    const navigate = useNavigate();

    // Show success message on task creation
    const { showSnackbar } = useSnackbar();

    const handleFormDataChange = (
        e:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<string | null>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // user must provide title and text for note
        if (!formData.title || !formData.text) {
            setErrorAlert("not enough data to create a note");
            return;
        }

        // Default case for employees the note is assigned to the current user
        const noteData: NewNote = {
            user: formData.user,
            title: formData.title,
            text: formData.text,
        };

        // Create a new note and redirect user to notes list in case of success or show alert of the error message in case of error
        noteMutation.mutate(noteData, {
            onSuccess: () => {
                showSnackbar("Success! The task has been added.");
                navigate(`/dashboard/notes/${user.id}`);
            },
            onError: (error) => setErrorAlert(error.message),
        });
    };

    return {
        errorAlert,
        formData,
        handleFormDataChange,
        handleSubmit,
        isMutating: noteMutation.isPending,
    };
};

export default useCreateNote;
