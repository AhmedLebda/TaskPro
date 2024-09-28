import asyncHandler from "express-async-handler";
import NoteModel from "../../models/Note";
import { toNoteRequestBody } from "../../utils/helpers/type_helpers";
import { PopulatedNote } from "../../types/types";
import { NotePermissionsService } from "../permissions/permissions_services";
/* Permissions:
- Employee: Edit his own tasks only
- Manager: Modify tasks assigned to his employees and himself
- Admin: Modify tasks assigned to any user

*/

/* Checks:
- Target note doesn't exist
- Employee trying to edit another user task
- Manager trying to Modify a task assigned to another manager or admin
*/
const checkNotePermission = asyncHandler(async (req, _res, next) => {
	const targetNoteId = req.params.id ?? toNoteRequestBody(req.body).id;

	const targetNote = (await NoteModel.findById(targetNoteId)
		.populate("user")
		.lean()) as PopulatedNote;

	// Target note to update doesn't exist
	if (!targetNote) {
		throw Error("This note doesn't exist");
	}

	// The current task owner (before the update)
	const currentNoteOwner = targetNote.user;

	// Requesting user
	const requestingUser = req.user;
	if (!requestingUser)
		throw new Error("Access denied: You lack the necessary permissions.");

	await NotePermissionsService.hasNotePermission(
		requestingUser,
		currentNoteOwner
	);

	next();
});

export default checkNotePermission;
