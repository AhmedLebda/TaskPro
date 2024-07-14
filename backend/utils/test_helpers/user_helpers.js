import User from "../../models/User.js";

export const usersInDb = async () => {
    const users = await User.find({});
    return users.map((user) => user.toJSON());
};
