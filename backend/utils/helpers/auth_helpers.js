import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import User from "../../models/User.js";

const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
};

// Log user with username and password and if credentials are valid it returns the user from db
const login = async (username, password) => {
    if (!username || !password) throw Error("Invalid username or password");

    const user = await User.findOne({ username });

    if (!user) {
        throw Error("Invalid username or password");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw Error("Invalid username or password");
    }

    return user;
};

// Only returns the token without the 'Bearer' word if there is a token otherwise it returns null
const getBearerToken = (req) => {
    const authorization = req.get("authorization");

    if (authorization && authorization.startsWith("Bearer ")) {
        return authorization.replace("Bearer ", "");
    }
    return null;
};

export default {
    generateHashedPassword,
    createAccessToken,
    verifyAccessToken,
    login,
    getBearerToken,
};
