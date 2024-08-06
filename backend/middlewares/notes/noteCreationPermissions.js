import asyncHandler from "express-async-handler";
import UserModel from "../../models/User.js";

const noteCreationPermissions = asyncHandler(async (req, res, next) => {
    const { user: assignedUserId } = req.body;

    const requestingUser = req.user;
    const { _id } = requestingUser;
    const requestingUserId = _id.toString();

    // Requesting user roles checks
    const isRequesterAdmin = requestingUser.roles.includes("admin");
    const isRequesterManager = requestingUser.roles.includes("manager");
    const isRequesterManagerOrAdmin = isRequesterAdmin || isRequesterManager;

    // Getting the assigned user from db
    const assignedUser = await UserModel.findById(assignedUserId).lean();

    // Assigned user doesn't exist in the db
    if (!assignedUser) throw Error("This user doesn't exist");

    // Assigned user roles checks
    const isAssignedUserAdmin = assignedUser.roles.includes("admin");
    const isAssignedUserManager = assignedUser.roles.includes("manager");

    // Requesting user is neither the owner of the note nor Admin/manager. (Employees can't assign tasks to someone else)
    if (requestingUserId !== assignedUserId && !isRequesterManagerOrAdmin)
        throw Error("You aren't authorized to assign notes to another user");

    // The requesting user is not an Admin and is attempting to assign a task to an Admin.
    if (isAssignedUserAdmin && !isRequesterAdmin)
        throw Error("You can't assign tasks to an admin");

    // Requesting user is Manager and is Attempting to assign task to another manager (Only admin can assign tasks to other managers)
    if (
        isAssignedUserManager &&
        requestingUserId !== assignedUserId &&
        !isRequesterAdmin
    )
        throw Error("You can't assign tasks to another manager");

    next();
});

export default noteCreationPermissions;
