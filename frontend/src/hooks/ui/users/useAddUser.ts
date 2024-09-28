import { ChangeEvent, FormEvent, useState } from "react";
// React-router-dom
import { useNavigate } from "react-router-dom";
// Custom hooks
import useCreateUserMutation from "../../users/useCreateUserMutation";
import useSnackbar from "../snackbar/useSnackbar";
import { InitialAddUserFormData, Role } from "../../../config/types";

const InitialState = {
    username: "",
    password: "",
    roles: {
        employee: false,
        manager: false,
        admin: false,
    },
};

const useAddUser = () => {
    const createUser = useCreateUserMutation();

    const navigate = useNavigate();
    const [errorAlert, setErrorAlert] = useState("");
    const [formData, setFormData] =
        useState<InitialAddUserFormData>(InitialState);

    // Show successful message on user creation
    const { showSnackbar } = useSnackbar();

    // Handles change in form data
    const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === "checkbox") {
            setFormData({
                ...formData,
                roles: {
                    ...formData.roles,
                    [e.target.name]: e.target.checked,
                },
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const roles: Role[] = [];

    // Validates the form data
    const validateForm = () => {
        // Collect all checked roles into an array
        for (const [key, value] of Object.entries(formData.roles)) {
            if (value) {
                roles.push(key as Role);
            }
        }

        if (!formData.username || !formData.password) {
            setErrorAlert("Invalid username or password");
        }

        if (roles.length === 0) {
            roles.push("employee");
        }
    };

    // Handles form submission
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        validateForm();

        const userData = {
            username: formData.username,
            password: formData.password,
            roles,
        };

        createUser.mutate(userData, {
            onSuccess: (response) => {
                console.log("user created!", response);
                showSnackbar("Success! The user account has been set up.");
                navigate("/dashboard/users");
            },
            onError: (error) => {
                console.error("Error creating user:", error);
                setErrorAlert(error.message);
            },
        });
    };

    return {
        formData,
        errorMessage: errorAlert,
        isLoading: createUser.isPending,
        handleFormDataChange,
        handleSubmit,
    };
};

export default useAddUser;
