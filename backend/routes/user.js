import { Router } from "express";
import userController from "../controllers/userControllers.js";
import requireAccessToken from "../middlewares/auth/requireAccess.js";

const router = Router();

router.use(requireAccessToken);

router
    .route("/")
    .get(userController.users_list)
    .post(userController.user_create)
    .patch(userController.user_update)
    .delete(userController.user_delete);

// router.post("/login", userController.user_login);

export default router;
