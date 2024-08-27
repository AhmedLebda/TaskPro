import mongoose from "mongoose";
// Models
import UserModel from "../../models/User";
// Utils
import asyncHandler from "express-async-handler";
// utils
import { toUserRequestBody } from "../../utils/helpers/type_helpers";
import { UserWithId } from "../../types/types";
/**
 * Middleware function to validate and retrieve user data for subsequent processing.
 *
 * This middleware performs the following checks:
 *
 * 1. **User ID Validation**:
 *    - Extracts the target user ID from either the request body or parameters. Ensures the provided ID
 *      is valid and in the correct MongoDB ObjectId format. Throws an error if the ID is missing or invalid.
 *
 * 2. **User Existence Check**:
 *    - Retrieves the user document from the database using the validated ID. Checks if the user exists.
 *      Throws an error if the user is not found.
 *
 * If all checks pass, the target user data is attached to the `req` object as `req.targetUser` and
 * the middleware proceeds by calling `next()` to continue with the request handling.
 */

const checkTargetUserExists = asyncHandler(async (req, _res, next) => {
    // Provided data for the target user ( from request body or request parameters )
    const { id: providedUserId } = toUserRequestBody(req.body);
    const { id: paramUserId } = req.params;
    const targetUserId = providedUserId || paramUserId;

    // In valid mongo id
    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
        throw Error("Invalid id");
    }

    const targetUser = await UserModel.findById(targetUserId).lean();

    // Target user doesn't exist
    if (!targetUser) {
        throw Error("User not found");
    }

    req.targetUser = targetUser as UserWithId;

    next();
});

export default checkTargetUserExists;
