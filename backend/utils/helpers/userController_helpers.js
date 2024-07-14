import UserModel from "../../models/User.js";
import mongoose from "mongoose";

export const validateUpdateInput = async (
    id,
    username,
    password,
    roles,
    active
) => {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw Error("invalid id");
    }

    const user = await UserModel.findById(id);

    if (!user) {
        throw Error("user not found");
    }

    let updates = null;

    if (username) {
        updates = { username };
    }
    if (roles && Array.isArray(roles) && roles.length !== 0) {
        updates = { ...updates, roles };
    }
    if (typeof active === "boolean") {
        updates = { ...updates, active };
    }
    if (password) {
        updates = { ...updates, password };
    }

    if (!updates) {
        throw Error("No provided values to update");
    }

    return updates;
};
