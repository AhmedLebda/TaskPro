import { Router } from "express";
import userController from "../controllers/userControllers.js";
import requireAccessToken from "../middlewares/auth/requireAccess.js";
import requireManagerialRole from "../middlewares/auth/requireManagerialAccess.js";
import userValidation from "../middlewares/users/userValidation.js";
import paginationSorting from "../middlewares/notes/paginationSorting.js";
import checkTargetUserExists from "../middlewares/users/checkTargetUserExists.js";
import createUserPermissions from "../middlewares/users/createUserPermissions.js";
import updateUserPermissions from "../middlewares/users/updateUserPermissions.js";
import deleteUserPermissions from "../middlewares/users/deleteUserPermissions.js";
import validateUserUpdateInput from "../middlewares/users/validateUserUpdateInput.js";
import usersPaginationSorting from "../middlewares/users/usersPaginationSorting.js";
const router = Router();

const usersListMiddlewares = [usersPaginationSorting];
const userCreateMiddlewares = [createUserPermissions, userValidation];
const userUpdateMiddlewares = [
    checkTargetUserExists,
    updateUserPermissions,
    validateUserUpdateInput,
];
const userDeleteMiddlewares = [checkTargetUserExists, deleteUserPermissions];
const userDetailsMiddlewares = [checkTargetUserExists];
router.use(requireAccessToken);

router.patch("/", userUpdateMiddlewares, userController.user_update);
router.get("/:id", userDetailsMiddlewares, userController.user_details);

router.use(requireManagerialRole);

router.get("/", usersListMiddlewares, userController.users_list);
router.post("/", userCreateMiddlewares, userController.user_create);
router.delete("/", userDeleteMiddlewares, userController.user_delete);
export default router;
