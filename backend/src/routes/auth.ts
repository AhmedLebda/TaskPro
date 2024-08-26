import { Router } from "express";
import AuthControllers from "../controllers/authControllers";
import loginLimiter from "../middlewares/auth/loginLimiter";

const router = Router();

router.route("/").post(loginLimiter, AuthControllers.login);

router.route("/refresh").get(AuthControllers.refresh);

router.route("/logout").post(AuthControllers.logout);

const auth_Routes = router;
export default auth_Routes;
