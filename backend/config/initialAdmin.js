import UserModel from "../models/User.js";
import AuthHelpers from "../utils/helpers/auth_helpers.js";

const createAdmin = async () => {
    try {
        // Check if there is a user with admin role exists in the db
        const adminExists = await UserModel.findOne({
            roles: "admin",
        });
        if (adminExists) {
            console.log("Admin already exists");
            return;
        }

        // Hash user password
        const hashedPassword = await AuthHelpers.generateHashedPassword(
            "admin"
        );

        // Create an admin user if it doesn't exist in the db
        const adminUser = new UserModel({
            username: "admin",
            password: hashedPassword,
            roles: ["admin"],
        });

        await adminUser.save();

        console.log("Admin user created successfully");
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
};

export default createAdmin;
