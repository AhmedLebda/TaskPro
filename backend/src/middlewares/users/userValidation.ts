import { body } from "express-validator";

export default [
    body("username")
        .trim()
        .toLowerCase()
        .notEmpty()
        .withMessage("This field can't be empty")
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage(
            "username can't be lower than 3 chars or longer than 30 chars"
        )
        .escape(),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("This field can't be empty")
        .bail()
        .isLength({ min: 6 })
        .withMessage("Password must be longer than 6 characters")
        .escape(),
];
