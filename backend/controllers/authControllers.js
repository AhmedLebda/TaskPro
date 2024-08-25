// Utils
import AuthHelpers from "../utils/helpers/auth_helpers";
import asyncHandler from "express-async-handler";
import config from "../config/config";
import User from "../models/User";

const refCookieOptions = {
    httpOnly: true,
    maxAge: config.REFRESH_TOKEN_EXPIRY * 1000,
};

// @Desc: log user in
// @Route: POST /api/auth
// @Access: Public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await AuthHelpers.login(username, password);

    const accessToken = AuthHelpers.createAccessToken({
        id: user._id,
    });

    const refreshToken = AuthHelpers.createRefreshToken({
        id: user._id,
    });

    res.cookie("ref_jwt", refreshToken, refCookieOptions);

    res.json({
        access_token: accessToken,
        username: user.username,
        roles: user.roles,
        active: user.active,
        id: user.id,
    });
});

// @Desc: sends back an access token if refresh token is valid
// @Route: GET /api/auth/refresh
// @Access: Public
const refresh = asyncHandler(async (req, res) => {
    // Get refresh token from cookies
    const { ref_jwt } = req.cookies;

    // Throw error if cookies doesn't contain refresh token
    if (!ref_jwt) throw Error("Invalid Token");

    // Verify that it is valid
    const decoded = AuthHelpers.verifyRefreshToken(ref_jwt);

    // Throw error If refresh token isn't valid
    if (!decoded.id) throw Error("Expired refresh token");

    // Create a new access token
    const accessToken = AuthHelpers.createAccessToken({
        id: decoded.id,
    });

    // Get target user
    const user = await User.findById(decoded.id).lean();
    console.log(user);
    // Send a successful response with the new access token
    res.status(200).json({
        access_token: accessToken,
        id: decoded.id,
        username: user.username,
        roles: user.roles,
        active: user.active,
    });
});

// @Desc: logs user out
// @Route: POST /api/auth/logout
// @Access: Public
const logout = asyncHandler(async (req, res) => {
    res.clearCookie("ref_jwt");
    res.status(200).json({ message: "Cookies cleared!" });
});

const AuthControllers = { login, refresh, logout };
export default AuthControllers;
