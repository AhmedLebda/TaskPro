import asyncHandler from "express-async-handler";
import { toUserRequestBody } from "../../utils/helpers/type_helpers";
import { User } from "../../types/types";
/**
 * Middleware function to validate and process user update input data.
 *
 * This middleware performs the following validations and updates:
 *
 * 1. **Role-Based Update Permissions**:
 *    - Admins can update any provided fields including username, password, roles, and active status.
 *    - Non-admin users (e.g., managers) are restricted to updating only the `active` status.
 *
 * 2. **Username and Password Update**:
 *    - Processes and includes the username and password in the update if provided.
 *
 * 3. **Roles Validation**:
 *    - Validates that the `roles` field, if provided, is an array and contains at least one role. Throws an
 *      error if the `roles` field is not an array or is empty.
 *
 * 4. **Active Status Validation**:
 *    - Validates that the `active` status, if provided, is a boolean value. Throws an error if it is not
 *      a boolean.
 *
 * 5. **No Updates Provided Check**:
 *    - Ensures that at least one value is provided for updating. Throws an error if no valid fields are
 *      present for update.
 *
 * If all validations pass, the middleware attaches the validated update data to the `req` object as
 * `req.providedUserUpdates` and proceeds by calling `next()` to continue with the request handling.
 */

const validateUserUpdateInput = asyncHandler(async (req, _res, next) => {
    const { username, password, roles, active } = toUserRequestBody(req.body);

    const ACCEPTED_ROLES = ["employee", "manager"];

    let updates: Partial<User> | null = null;

    if (username) {
        updates = { username };
    }

    if (password) {
        updates = { ...updates, password };
    }

    // Throw error if roles exist but not an array or an  empty array
    if (roles) {
        if (!Array.isArray(roles) || roles.length === 0)
            throw Error(
                "user roles must be an array and contains one value or more"
            );

        const filteredRoles = roles.filter((role) =>
            ACCEPTED_ROLES.includes(role)
        );
        updates = { ...updates, roles: filteredRoles };
    }

    // Throw error if active status exist but not a boolean value
    if (active !== undefined) {
        if (typeof active !== "boolean")
            throw Error("user active status must be only true or false");

        updates = { ...updates, active };
    }

    // Throw error if there are no provided values to update
    if (!updates) {
        throw Error("No provided values to update");
    }

    req.providedUserUpdates = updates;
    next();
});

export default validateUserUpdateInput;
