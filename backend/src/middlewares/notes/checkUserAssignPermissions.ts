import UserModel from "../../models/User";
import asyncHandler from "express-async-handler";
import { toNoteRequestBody } from "../../utils/helpers/type_helpers";
import { NotePermissionsService } from "../permissions/permissions_services";
import { UserWithId } from "../../types/types";

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

const checkUserAssignPermissions = asyncHandler(async (req, _res, next) => {
	const { user: userToAssignId } = toNoteRequestBody(req.body);

	if (userToAssignId) {
		const userToAssign = (await UserModel.findById(
			userToAssignId
		).lean()) as UserWithId;

		// user to assign a note to doesn't exist
		if (!userToAssign) throw Error("This user doesn't exist");

		const requestingUser = req.user;
		if (!requestingUser)
			throw new Error(
				"Access denied: You lack the necessary permissions."
			);

		await NotePermissionsService.hasNotePermission(
			requestingUser,
			userToAssign
		);
	}

	next();
});

export default checkUserAssignPermissions;
