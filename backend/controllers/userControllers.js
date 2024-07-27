import mongoose from "mongoose";
// Validation
import { validationResult } from "express-validator";
import userValidation from "../middlewares/validation/userValidation.js";
// Models
import UserModel from "../models/User.js";
import NoteModel from "../models/Note.js";
// Utils
import AuthHelpers from "../utils/helpers/auth_helpers.js";
import asyncHandler from "express-async-handler";
import { validateUserUpdateInput } from "../utils/helpers/userController_helpers.js";

// @desc: get all users
// @route: GET /users
// @access: Private
const users_list = asyncHandler(async (req, res) => {
    const users = await UserModel.find({}, { password: 0 }).lean();
    if (users.length === 0) {
        throw Error("There are no users");
    }
    return res.json(users);
});

// @desc: create new users in db
// @route: POST /users
// @access: Private
// @permissions: Admin and Manager only
// @permissions: Admin => create another admins
const user_create = [
    // Validate the request username, password, role
    userValidation,

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        // Throw error if there are errors returned from userValidation middleware
        if (!errors.isEmpty()) {
            const errorObj = errors.array().reduce((acc, curr) => {
                acc[curr.path] = curr.msg;
                return acc;
            }, {});
            throw Error(JSON.stringify(errorObj));
        }

        const { username, password, roles } = req.body;

        // Id of the user who made the request
        const requesterUserId = req.userId;

        // Throw an error if the requester is not an admin and attempts to create a user with an admin role.
        const isAdmin = await AuthHelpers.isAdminUser(requesterUserId);

        if (!isAdmin && roles.includes("admin")) {
            return res.status(401).json({
                error: "Access Denied: Only Admin are permitted to create users with admin permissions.",
                isError: true,
            });
        }

        // Hash user password
        const hashedPassword = await AuthHelpers.generateHashedPassword(
            password
        );

        let userObj = { username, password: hashedPassword };

        // Add roles to user object if it is provided
        if (roles) {
            userObj = { ...userObj, roles };
        }

        // Create a new user in the db
        const user = new UserModel(userObj);
        const savedUser = await user.save();

        // Create an access token with username and id
        const token = AuthHelpers.createAccessToken({
            username: savedUser.username,
            id: savedUser._id,
        });

        // Send response with user data
        res.status(201).json({
            access_token: token,
            id: savedUser.id,
            username: savedUser.username,
            roles: savedUser.roles,
            active: savedUser.active,
        });
    }),
];

// @desc: update a user in db
// @route: PATCH /users
// @access: Private
// @permissions: Admin and Manager or account owner
// @permissions: Admin and Manager => update roles
// @permissions: Admin => update roles to admin
const user_update = asyncHandler(async (req, res) => {
    const { id, username, password, roles, active } = req.body;

    let updates = await validateUserUpdateInput(
        username,
        password,
        roles,
        active
    );

    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
        runValidators: true,
        new: true,
    });

    res.json(updatedUser);
});

// @desc: delete a user from db
// @route: DELETE /users
// @access: Private
const user_delete = asyncHandler(async (req, res) => {
    const { id } = req.body;

    const requesterUserId = req.userId;

    const isAdmin = await AuthHelpers.isAdminUser(requesterUserId);

    // Throw error if id is not provided or isn't a valid ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) throw Error("invalid id");

    // Check if user with the provided id exists in the db
    const user = await UserModel.findById(id);

    // Throw error if there isn't a user with the provided id in the db
    if (!user) throw Error("user doesn't exist");

    // Throw error if non admin user tries to delete an admin user
    if (user.roles.includes("admin") && !isAdmin) {
        return res.status(401).json({
            error: "Access Denied: Only admins are permitted to perform this action.",
            isError: true,
        });
    }

    // Check if the user still have any notes associated to him
    const associatedNotes = await NoteModel.find({ user: id });

    // if the user have notes then it can't be deleted
    if (associatedNotes.length > 0) {
        throw Error(
            "This user still have opened tasks and it can't be deleted"
        );
    }

    // Delete the user and send a deleted status code
    await user.deleteOne();
    res.sendStatus(204);
});

// @desc: get a single user details by id
// @route: GET /users/:id
// @access: Private
// @permissions: Admin, Manager, Account owner
const user_details = asyncHandler(async (req, res) => {
    // Id of user which we request to get his details
    const targetUserId = req.params.id;

    // Id of user who made the request
    const requesterUserId = req.userId;

    // Check requester roles
    const isManagerOrAdmin = await AuthHelpers.isManagerUser(requesterUserId);
    const isAdmin = await AuthHelpers.isAdminUser(requesterUserId);

    // Throw error if id isn't provided or not a valid ObjectId
    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
        throw Error("invalid id");
    }

    // Check user exists in the db
    const user = await UserModel.findById(targetUserId)
        .select("username active roles")
        .lean();

    if (!user) {
        throw Error("user not found");
    }

    // Throw Error if user who made request isn't the account owner or an admin or manager
    if (requesterUserId !== targetUserId && !isManagerOrAdmin) {
        return res.status(401).json({
            error: "Access Denied: Only managers are permitted to perform this action.",
            isError: true,
        });
    }

    // Throw error if user is not an admin and tries to update info of a user with admin role
    if (user.roles.includes("admin") && !isAdmin) {
        return res.status(401).json({
            error: "Access Denied: Only admins are permitted to perform this action.",
            isError: true,
        });
    }
    res.status(200).json(user);
});

const userController = {
    users_list,
    user_create,
    user_update,
    user_delete,
    user_details,
};

export default userController;
