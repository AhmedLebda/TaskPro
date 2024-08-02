export const initialErrorState = { isVisible: false, message: "" };

export const showError = (message, previousState, setErrorAlert) => {
    setErrorAlert({ ...previousState, isVisible: true, message: message });
};
