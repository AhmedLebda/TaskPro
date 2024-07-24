import AuthHelper from "../../utils/helpers/auth_helpers.js";
import asyncHandler from "express-async-handler";

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

    // Check if user is active
    const isManager = await AuthHelper.isActiveUser(decodedToken.id);

    // Throw error if user isn't active
    if (!isManager) {
        return res.status(401).json({
            error: "Your account is currently inactive",
            isError: true,
        });
    }

    // add the user id to the request object
    req.userId = decodedToken.id;

    next();
});

export default requireAccessToken;
