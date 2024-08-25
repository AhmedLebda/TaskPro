import UserModel from "../../models/User";
import asyncHandler from "express-async-handler";

/*
- Employee: himself Only
- Manager: himself and employees Only
- Admin: All Users
*/

/* Checks:
- user to assign a note to doesn't exist
- Employee trying to assign another user to a task
- Manager trying to assign a task to the admin or another manager
*/

const checkUserAssignPermissions = asyncHandler(async (req, res, next) => {
    const { user: userToAssignId } = req.body;

    if (userToAssignId) {
        const userToAssign = await UserModel.findById(userToAssignId).lean();

        const isUserToAssignAdminOrManager =
            userToAssign.roles.includes("admin") ||
            userToAssign.roles.includes("manager");

        // user to assign a note to doesn't exist
        if (!userToAssign) throw Error("This user doesn't exist");

        const requestingUser = req.user;
        const { _id: requestingUserId } = requestingUser;
        const { roles: requestingUserRoles } = requestingUser;

        const isRequesterAdmin = requestingUserRoles.includes("admin");
        const isRequesterManager = requestingUserRoles.includes("manager");
        const isRequesterManagerOrAdmin =
            isRequesterAdmin || isRequesterManager;

        // Employee trying to assign another user to a task
        if (
            !isRequesterManagerOrAdmin &&
            userToAssignId.toString() !== requestingUserId.toString()
        )
            throw Error(
                "You aren't authorized to assign notes to another user"
            );

        // Manager trying to assign a task to the admin or another manager
        if (
            isRequesterManager &&
            isUserToAssignAdminOrManager &&
            requestingUserId.toString() !== userToAssignId.toString()
        ) {
            throw Error(
                "You can't assign tasks to the admin or another manager"
            );
        }
    }

    next();
});

export default checkUserAssignPermissions;
