import AuthHelper from "../../utils/helpers/auth_helpers.js";
import User from "../../models/User.js";

// Checks For access token in Authorization as a Bearer token
// Checks for user active status
// if found: it adds the user id to the request (req.userId)

const requireAccessToken = async (req, res, next) => {
    const token = AuthHelper.getBearerToken(req);

    const decodedToken = AuthHelper.verifyAccessToken(token);

    if (!decodedToken.id) {
        return res.status(401).json({ error: "invalid token" });
    }
    const user = await User.findById(decodedToken.id).lean();

    if (!user.active) {
        return res
            .status(401)
            .json({ error: "Your account is currently inactive" });
    }
    req.userId = decodedToken.id;
    next();
};

export default requireAccessToken;
