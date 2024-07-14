import AuthHelper from "../../utils/helpers/auth_helpers";

// Checks For access token in Authorization as a Bearer token
// if found: it adds the user id to the request (req.userId)

const requireAccessToken = (req, res, next) => {
    const token = AuthHelper.getBearerToken(req);

    const decodedToken = AuthHelper.verifyAccessToken(token);

    if (!decodedToken.id) {
        return res.status(401).json({ error: "invalid token" });
    }

    req.userId = decodedToken.id;
    next();
};

export default requireAccessToken;
