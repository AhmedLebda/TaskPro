// React
import { useState } from "react";
// Custom hooks
import useAuthContext from "../../auth/useAuthContext";
import useLoginMutation from "../../auth/useLoginMutation";
// Helpers
import { initialErrorState, showError } from "../../../utils/ErrorHelpers";

const useLogin = () => {
    const loginMutation = useLoginMutation();
    const { setCredentials, getAuthStatus } = useAuthContext();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errorAlert, setErrorAlert] = useState(initialErrorState);

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
                showError(error.message, errorAlert, setErrorAlert);
            },
        });
    };

    const isAuthenticated = getAuthStatus();

    return {
        formData,
        isAuthenticated,
        errorAlert,
        handleSubmit,
        handleFormDataChange,
    };
};

export default useLogin;
