import AuthHelper from "../../utils/helpers/auth_helpers.js";
import asyncHandler from "express-async-handler";
import UserModel from "../../models/User.js";

// Gives access only to authenticated active users (with a valid access token)
const requireAccessToken = asyncHandler(async (req, res, next) => {
    // get access token from Authorization
    const token = AuthHelper.getBearerToken(req);

    // Verify access token
    const decodedToken = AuthHelper.verifyAccessToken(token);

    // Throw error if token is invalid
    if (!decodedToken.id) {
        return res.status(401).json({ error: "invalid token", isError: true });
    }

    // Find the user in the db by the id in the token
    const currentUser = await UserModel.findById(decodedToken.id)
        .select("username active roles")
        .lean();

    // Check if user is active
    const isActive = currentUser.active;

    // Throw error if user isn't active
    if (!isActive) {
        return res.status(401).json({
            error: "Your account is currently inactive",
            isError: true,
        });
    }

    // add the user data to the request object
    req.user = currentUser;

    next();
});

export default requireAccessToken;
