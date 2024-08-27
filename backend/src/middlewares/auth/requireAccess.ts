import AuthHelper from "../../utils/helpers/auth_helpers";
import asyncHandler from "express-async-handler";
import UserModel from "../../models/User";
import { Request, Response } from "express";
import { UserWithId } from "../../types/types";

// Gives access only to authenticated active users (with a valid access token)
const requireAccessToken = asyncHandler(
    async (req: Request, res: Response, next) => {
        // get access token from Authorization
        const token = AuthHelper.getBearerToken(req);

        // Verify access token
        const decodedToken = AuthHelper.verifyAccessToken(token);

        // Throw error if token is invalid
        if (typeof decodedToken === "string" || !decodedToken.id) {
            res.status(401).json({ error: "invalid token", isError: true });
            return;
        }

        // Find the user in the db by the id in the token
        const currentUser = await UserModel.findById(decodedToken.id)
            .select("username active roles")
            .lean();
        if (!currentUser) throw Error("User not found");

        // Check if user is active
        const isActive = currentUser.active;

        // Throw error if user isn't active
        if (!isActive) {
            res.status(401).json({
                error: "Your account is currently inactive",
                isError: true,
            });
            return;
        }

        // add the user data to the request object
        req.user = currentUser as UserWithId;

        next();
    }
);

export default requireAccessToken;
