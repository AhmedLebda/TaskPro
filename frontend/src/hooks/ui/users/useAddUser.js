import useCreateUserMutation from "../../users/UseCreateUserMutation";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useAddUser = () => {
    const createUser = useCreateUserMutation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        roles: {
            employee: false,
            manager: false,
            admin: false,
        },
    });
    const roles = [];

    // Handles change in form data
    const handleFormDataChange = (e) => {
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

    // Validates the form data
    const validateForm = () => {
        // Collect all checked roles into an array
        for (let [key, value] of Object.entries(formData.roles)) {
            if (value) {
                roles.push(key);
            }
        }

        if ((!formData.username, !formData.password)) {
            setError("Invalid username or password");
        }

        if (roles.length === 0) {
            roles.push("employee");
        }
    };

    // Handles form submission
    const handleSubmit = (event) => {
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
                setError(null);
                navigate("/dashboard/users");
            },
            onLoading: () => {
                setIsLoading(true);
            },
            onError: (error) => {
                setError(error.message);
            },
        });
    };
    return { formData, error, isLoading, handleFormDataChange, handleSubmit };
};

export default useAddUser;
