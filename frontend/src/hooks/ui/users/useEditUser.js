import { useNavigate, useParams } from "react-router-dom";
import useAuthContext from "../../auth/useAuthContext";
import useUserDetailsQuery from "../../users/useUserDetailsQuery";
import useUpdateUserMutation from "../../users/useUpdateUserMutation";
import { useState, useEffect, useCallback } from "react";
import useSnackbar from "../snackbar/useSnackbar";

import permissions from "../../../utils/permissions";

// Initial Form state
const initialFormData = {
    username: "",
    password: "",
    active: false,
    roles: {
        employee: false,
        manager: false,
        admin: false,
    },
};

const useEditUser = () => {
    // Getting user id from the url params
    const { userId: targetUserId } = useParams();

    // navigate hook to redirect user after successful action
    const navigate = useNavigate();

    // context hook to get the update credentials method
    const { updateCredentials, getUserData } = useAuthContext();

    // Get the user id
    const currentUserId = getUserData().id;

    // Get user data
    const { data: user, isLoading, error: fetchError } = useUserDetailsQuery();

    // Custom hook to create an update user mutation
    const updateMutation = useUpdateUserMutation();

    // Error state to display errors
    const [errorAlert, setErrorAlert] = useState("");

    // Form fields state
    const [formData, setFormData] = useState(initialFormData);

    // Show successful message on user edit
    const { showSnackbar } = useSnackbar();

    // Transform active roles to object when data comes from api
    const getActiveRoles = useCallback(() => {
        return user?.roles.reduce(
            (acc, curr) => {
                acc[curr] = true;
                return acc;
            },
            { ...initialFormData.roles }
        );
    }, [user]);

    // Permissions
    const Permissions = permissions(getUserData(), user);

    // permissions to update fields:
    const isRolesFieldsetEnabled = Permissions.strictAdmin;
    const isDataInputsEnabled = Permissions.strictAdminOwner;
    const isActiveCheckboxEnabled = Permissions.strictAdminManager;

    // Update the form data state when user data arrives from api
    useEffect(() => {
        if (fetchError) {
            setErrorAlert(fetchError.message);
        }
        if (user) {
            const userData = {
                username: user.username,
                active: user.active,
                roles: { ...initialFormData.roles, ...getActiveRoles() },
            };

            setFormData({ ...initialFormData, ...userData });
        }
    }, [fetchError, getActiveRoles, user]);

    // Handles change in form data
    const handleFormDataChange = (e) => {
        if (e.target.name === "active") {
            setFormData({ ...formData, [e.target.name]: e.target.checked });
            return;
        }

        if (e.target.type === "checkbox") {
            setFormData({
                ...formData,
                roles: { ...formData.roles, [e.target.name]: e.target.checked },
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Handles form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        let updates = { id: targetUserId };

        if (formData.username !== user.username) {
            updates = { ...updates, username: formData.username };
        }

        if (formData.password) {
            updates = { ...updates, password: formData.password };
        }

        if (
            JSON.stringify(formData.roles) !== JSON.stringify(getActiveRoles())
        ) {
            const rolesArray = [];

            // Transform roles object into an array
            for (let [key, value] of Object.entries(formData.roles)) {
                if (value) {
                    rolesArray.push(key);
                }
            }

            updates = { ...updates, roles: rolesArray };
        }

        if (formData.active !== user.active) {
            updates = { ...updates, active: formData.active };
        }

        // just return if there are no updates to send
        if (Object.values(updates).length === 1) {
            setErrorAlert("You didn't provide new data to update");
            return;
        }

        updateMutation.mutate(updates, {
            onSuccess: (res) => {
                const { id, username, active, roles } = res;
                // Only update the user info. if the user is trying to update his own account info. so admins and managers don't update the user info. state with wrong info when they try to update another user info.
                if (id === currentUserId) {
                    updateCredentials({ username, active, roles });
                }
                showSnackbar("Edit Successful! Your changes have been saved.");
                navigate("/dashboard");
            },
            onError: ({ message }) => {
                setErrorAlert(message);
            },
        });
    };

    return {
        formData,
        isLoading,
        errorAlert,
        handleFormDataChange,
        handleSubmit,
        isRolesFieldsetEnabled,
        isDataInputsEnabled,
        isActiveCheckboxEnabled,
        fetchError,
    };
};

export default useEditUser;
