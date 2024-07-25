import { Router } from "express";
import userController from "../controllers/userControllers.js";
import requireAccessToken from "../middlewares/auth/requireAccess.js";
import requireManagerialRole from "../middlewares/auth/requireManagerialAccess.js";
import checkUserUpdatePermissions from "../middlewares/users/checkUserUpdatePermissions.js";

const router = Router();

router.use(requireAccessToken);

router
    .route("/")
    .get(requireManagerialRole, userController.users_list)
    .post(requireManagerialRole, userController.user_create)
    .patch(checkUserUpdatePermissions, userController.user_update)
    .delete(requireManagerialRole, userController.user_delete);

export default router;
