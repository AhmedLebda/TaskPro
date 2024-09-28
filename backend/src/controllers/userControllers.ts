// Validation
import { validationResult } from "express-validator";
// Models
import UserModel from "../models/User";
// Utils
import AuthHelpers from "../utils/helpers/auth_helpers";
import asyncHandler from "express-async-handler";
import { User, UserQueryResponse } from "../types/types";
import { toUserRequestBody } from "../utils/helpers/type_helpers";
import { UserPermissionsService } from "../middlewares/permissions/permissions_services";

// @desc: get all users
// @route: GET /users
// @access: Private
const users_list = asyncHandler(async (req, res) => {
	if (!req.paginationOptions) throw new Error("pagination error");
	const { page, limit } = req.paginationOptions;

	// Perform aggregation to sort users based on roles and paginate the results
	const users = await UserModel.aggregate([
		{
			$addFields: {
				// Create a field for sorting based on roles
				sortOrder: {
					$switch: {
						branches: [
							{ case: { $in: ["admin", "$roles"] }, then: 1 },
							{ case: { $in: ["manager", "$roles"] }, then: 2 },
							{ case: { $in: ["employee", "$roles"] }, then: 3 },
						],
						default: 4,
					},
				},
			},
		},
		{
			$sort: { sortOrder: 1, _id: 1 },
		},
		{
			$skip: page * limit,
		},
		{
			$limit: limit,
		},
		{
			$project: {
				sortOrder: 0,
				password: 0,
				__v: 0,
			},
		},
	]);

	if (users.length === 0) {
		throw Error("There are no users");
	}
	const totalUsers = await UserModel.countDocuments();
	const totalPages = Math.ceil(totalUsers / limit);

	const response: UserQueryResponse = {
		data: users,
		totalPages: totalPages,
	};
	res.json(response);
});

// @desc: create new users in db
// @route: POST /users
// @access: Private
const user_create = asyncHandler(async (req, res) => {
	const errors = validationResult(req);

	// Throw error if there are errors returned from userValidation middleware
	if (!errors.isEmpty()) {
		const errorMessage = errors.array()[0].msg;
		throw Error(errorMessage);
	}

	const { username, password, roles } = toUserRequestBody(req.body);
	const ACCEPTED_ROLES = ["employee", "manager"];

	if (!username || !password || !Array.isArray(roles))
		throw new Error("invalid data");

	// Hash user password
	const hashedPassword = await AuthHelpers.generateHashedPassword(password);

	let userObj: Partial<User> = { username, password: hashedPassword };

	// Add roles to user object if it is provided
	if (roles) {
		const filteredRoles = roles.filter((role) =>
			ACCEPTED_ROLES.includes(role)
		);
		userObj = { ...userObj, roles: filteredRoles };
	}

	// Create a new user in the db
	const user = new UserModel(userObj);
	const savedUser = await user.save();

	// Send response with user data
	res.status(201).json({
		id: savedUser.id,
		username: savedUser.username,
		roles: savedUser.roles,
		active: savedUser.active,
	});
});

// @desc: update a user in db
// @route: PATCH /users
// @access: Private
const user_update = asyncHandler(async (req, res) => {
	const { id: targetUserId } = toUserRequestBody(req.body);

	const { providedUserUpdates } = req;

	const updatedUser = await UserModel.findByIdAndUpdate(
		targetUserId,
		providedUserUpdates,
		{
			runValidators: true,
			new: true,
		}
	);

	res.json(updatedUser);
});

// @desc: delete a user from db
// @route: DELETE /users
// @access: Private
const user_delete = asyncHandler(async (req, res) => {
	if (!req.targetUser) throw new Error("This user doesn't exist");
	const { targetUser } = req;
	await targetUser.deleteOne();
	res.sendStatus(204);
});

// @desc: get a single user details by id
// @route: GET /users/:id
// @access: Private
const user_details = asyncHandler(async (req, res) => {
	// Requesting User Data
	const { user: requestingUser } = req;
	if (!requestingUser) throw new Error("Access Denied");

	// Target User Data
	if (!req.targetUser) throw new Error("This user doesn't exist");
	const { targetUser } = req;

	await UserPermissionsService.canGetUserDetails(requestingUser, targetUser);

	res.status(200).json(targetUser);
});

const userController = {
	users_list,
	user_create,
	user_update,
	user_delete,
	user_details,
};

export default userController;
