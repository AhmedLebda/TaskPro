import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import User from "../../models/User";
import { Request } from "express";
import { Types } from "mongoose";

interface Payload {
    id: Types.ObjectId;
}

const generateHashedPassword = async (password: string) => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
};

const createAccessToken = (payload: Payload) => {
    if (!config.ACCESS_TOKEN_SECRET) throw Error("No token provided");

    return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
        expiresIn: config.ACCESS_TOKEN_EXPIRY,
    });
};

const createRefreshToken = (payload: Payload) => {
    if (!config.REFRESH_TOKEN_SECRET) throw Error("No token provided");

    return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRY,
    });
};

const verifyAccessToken = (token: string) => {
    if (!config.ACCESS_TOKEN_SECRET) throw Error("No token provided");
    return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token: string) => {
    if (!config.REFRESH_TOKEN_SECRET) throw Error("No token provided");

    return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
};

// Log user with username and password and if credentials are valid it returns the user from db
const login = async (username: string, password: string) => {
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
const getBearerToken = (req: Request) => {
    const authorization = req.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw Error("No token provided");
    }
    return authorization.replace("Bearer ", "");
};

const AuthHelpers = {
    generateHashedPassword,
    createAccessToken,
    verifyAccessToken,
    login,
    getBearerToken,
    createRefreshToken,
    verifyRefreshToken,
};

export default AuthHelpers;
