import asyncHandler from "express-async-handler";
import NoteModel from "../../models/Note";
import { toNoteRequestBody } from "../../utils/helpers/type_helpers";
import { PopulatedNote } from "../../types/types";

/* Permissions:
- Employee: Edit his own tasks only
- Manager: Modify tasks assigned to his employees and himself
- Admin: Modify tasks assigned to any user

*/

/* Checks:
- Target note0 doesn't exist
- Employee trying to edit another user task
- Manager trying to Modify a task assigned to another manager or admin
*/
const checkNotePermission = asyncHandler(async (req, _res, next) => {
    const { id: targetNoteId } = toNoteRequestBody(req.body);

    const targetNote = (await NoteModel.findById(targetNoteId)
        .populate("user")
        .lean()) as PopulatedNote;

    // Target note to update doesn't exist
    if (!targetNote) {
        throw Error("This note doesn't exist");
    }

    // The current task owner (before the update)
    const currentNoteOwner = targetNote.user;
    const { _id: currentNoteOwnerId } = currentNoteOwner;
    const isCurrentNoteOwnerAdminOrManager =
        currentNoteOwner.roles.includes("admin") ||
        currentNoteOwner.roles.includes("manager");

    // Requesting user
    const requestingUser = req.user;
    if (!requestingUser)
        throw new Error("Access denied: You lack the necessary permissions.");

    const { _id: requestingUserId } = requestingUser;
    const isRequesterAdmin = requestingUser.roles.includes("admin");
    const isRequesterManager = requestingUser.roles.includes("manager");
    const isRequesterManagerOrAdmin = isRequesterAdmin || isRequesterManager;

    // Requesting user is the user which the task is currently assigned to.
    const isRequestingUserCurrentNoteOwner =
        requestingUserId.toString() === currentNoteOwnerId.toString();

    // Employee trying to edit another user task
    if (!isRequesterManagerOrAdmin && !isRequestingUserCurrentNoteOwner) {
        throw Error(
            "You do not have the necessary permissions to perform this action."
        );
    }

    // Manager trying to modify a task assigned to another manager or admin
    if (
        isRequesterManager &&
        isCurrentNoteOwnerAdminOrManager &&
        !isRequestingUserCurrentNoteOwner
    ) {
        throw Error(
            "You do not have the necessary permissions to perform this action."
        );
    }

    next();
});

export default checkNotePermission;
