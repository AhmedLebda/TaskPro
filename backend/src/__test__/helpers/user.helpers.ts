import User from "../../models/User";
import createAdmin from "../../config/initialAdmin";

const deleteAllUsers = async (): Promise<void> => {
    console.log("INFO: Deleting all users");
    await User.deleteMany({});
};

export const resetUsersCollection = async (): Promise<void> => {
    try {
        console.log("INFO: Resetting db...");

        await deleteAllUsers();

        await createAdmin();
    } catch (error) {
        console.error("ERROR: Failed to reset users collection", error);
        throw error;
    }
};
