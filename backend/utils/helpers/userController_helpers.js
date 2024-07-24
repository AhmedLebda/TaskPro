import UserModel from "../../models/User.js";
import mongoose from "mongoose";

//@desc: Validate the user request body values and return an object with the updates if they are provided

export const validateUserUpdateInput = async (
    id,
    username,
    password,
    roles,
    active
) => {
    // Throw error if id isn't provided or not a valid ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw Error("invalid id");
    }

    // Check user exists in the db
    const user = await UserModel.findById(id);

    if (!user) {
        throw Error("user not found");
    }

    let updates = null;

    if (username) {
        updates = { username };
    }

    // Throw error if roles exist but not an array or an  empty array
    if (roles) {
        if (!Array.isArray(roles) || roles.length === 0)
            throw Error(
                "user roles must be an array and contains one value or more"
            );

        updates = { ...updates, roles };
    }

    // Throw error if active status exist but not a boolean value
    if (active !== undefined) {
        if (typeof active !== "boolean")
            throw Error("user active status must be only true or false");

        updates = { ...updates, active };
    }

    if (password) {
        updates = { ...updates, password };
    }

    // Throw error if there are no provided values to update
    if (!updates) {
        throw Error("No provided values to update");
    }

    // return an object with the provided updates
    return updates;
};
