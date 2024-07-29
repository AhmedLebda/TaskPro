// React
import { useState } from "react";
// Custom hooks
import useAuthContext from "../../auth/useAuthContext";
import useLoginMutation from "../../auth/useLoginMutation";

const useLogin = () => {
    const loginMutation = useLoginMutation();
    const { setCredentials, getAuthStatus } = useAuthContext();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    // Handle form input change event and update form data state.
    const handleFormDataChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        loginMutation.mutate(formData, {
            onSuccess: (data) => {
                setCredentials(data);
            },
            onError: (error) => {
                console.log(error.message);
                setError(error.message);
            },
        });
    };

    const isAuthenticated = getAuthStatus();

    return {
        formData,
        isAuthenticated,
        error,
        handleSubmit,
        handleFormDataChange,
    };
};

export default useLogin;
