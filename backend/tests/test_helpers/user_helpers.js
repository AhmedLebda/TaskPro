import User from "../../src/models/User";

export const usersInDb = async () => {
    const users = await User.find({});
    return users.map((user) => user.toJSON());
};
