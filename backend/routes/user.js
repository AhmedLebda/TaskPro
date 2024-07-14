import { Router } from "express";
import userController from "../controllers/userControllers.js";

const router = Router();

router
    .route("/")
    .get(userController.users_list)
    .post(userController.user_create)
    .patch(userController.user_update)
    .delete(userController.user_delete);

// router.post("/login", userController.user_login);

export default router;
