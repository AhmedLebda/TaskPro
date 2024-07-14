// Validation
import { validationResult } from "express-validator";
import userValidation from "../middlewares/validation/userValidation.js";
// Models
import userModel from "../models/User.js";
// Utils
import AuthHelpers from "../utils/helpers/auth_helpers.js";
import asyncHandler from "express-async-handler";
import { validateUpdateInput } from "../utils/helpers/userController_helpers.js";

// @desc: get all users
// @route: GET /users
// @access: Private

const users_list = asyncHandler(async (req, res) => {
    const users = await userModel.find({}, { password: 0 }).lean();
    if (users.length === 0) {
        throw Error("There are no users");
    }
    return res.json(users);
});

// @desc: create new users in db
// @route: POST /users
// @access: Private

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
        const user = new userModel(userObj);
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

const user_update = asyncHandler(async (req, res) => {
    const { id, username, password, roles, active } = req.body;

    let updates = await validateUpdateInput(
        id,
        username,
        password,
        roles,
        active
    );

    const updatedUser = await userModel.findByIdAndUpdate(id, updates, {
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

    if (!id) throw Error("user doesn't exist");

    await userModel.findByIdAndDelete(id);

    res.sendStatus(204);
});

// Log-in Controller
// ==> Validate the request username and password
// ==> Log-in with login function in auth_helpers module
// ==> Create an access token with username and id
// ==> Send response with user data
// ==> Catch any errors with express-async-errors middleware
// const user_login = [
//     validateLogin,

//     asyncHandler(async (req, res) => {
//         const errors = validationResult(req);

//         // Throw error if there are errors returned from validateLogin middleware
//         if (!errors.isEmpty()) {
//             const errorObj = errors.array().reduce((acc, curr) => {
//                 acc[curr.path] = curr.msg;
//                 return acc;
//             }, {});
//             throw Error(JSON.stringify(errorObj));
//         }

//         const { username, password } = req.body;

//         const user = await AuthHelpers.login(username, password);

//         const token = AuthHelpers.createAccessToken({
//             username: user.username,
//             id: user._id,
//         });

//         res.json({
//             access_token: token,
//             username: user.username,
//             email: user.email,
//             name: user.fullName,
//             id: user.id,
//         });
//     }),
// ];

// Sign-up Controller

const userController = { users_list, user_create, user_update, user_delete };

export default userController;
