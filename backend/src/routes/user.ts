import { Router } from "express";
import userController from "../controllers/userControllers";
import requireAccessToken from "../middlewares/auth/requireAccess";
import requireManagerialRole from "../middlewares/auth/requireManagerialAccess";
import userValidation from "../middlewares/users/userValidation";
// import paginationSorting from "../middlewares/notes/paginationSorting";
import checkTargetUserExists from "../middlewares/users/checkTargetUserExists";
import createUserPermissions from "../middlewares/users/createUserPermissions";
import updateUserPermissions from "../middlewares/users/updateUserPermissions";
import deleteUserPermissions from "../middlewares/users/deleteUserPermissions";
import validateUserUpdateInput from "../middlewares/users/validateUserUpdateInput";
import usersPaginationSorting from "../middlewares/users/usersPaginationSorting";
const router = Router();

const usersListMiddlewares = [usersPaginationSorting];
const userCreateMiddlewares = [createUserPermissions];
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
router.post(
    "/",
    userValidation,
    userCreateMiddlewares,
    userController.user_create
);
router.delete("/", userDeleteMiddlewares, userController.user_delete);
export default router;
