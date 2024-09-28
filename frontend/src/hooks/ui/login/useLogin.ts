// React
import { useState } from "react";
// Custom hooks
import useAuthContext from "../../auth/useAuthContext";
import useLoginMutation from "../../auth/useLoginMutation";
// Types
import { InitialLoginFormData } from "../../../config/types";

const useLogin = () => {
    const loginMutation = useLoginMutation();
    const { setCredentials, getAuthStatus } = useAuthContext();
    const [formData, setFormData] = useState<InitialLoginFormData>({
        username: "",
        password: "",
    });
    const [errorAlert, setErrorAlert] = useState<string>("");

    // Handle form input change event and update form data state.
    const handleFormDataChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();

        loginMutation.mutate(formData, {
            onSuccess: (data) => {
                setCredentials(data);
            },
            onError: (error) => {
                setErrorAlert(error.message);
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
