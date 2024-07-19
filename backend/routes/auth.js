import { Router } from "express";
import AuthControllers from "../controllers/authControllers.js";
import loginLimiter from "../middlewares/auth/loginLimiter.js";
import requireAccessToken from "../middlewares/auth/requireAccess.js";

const router = Router();

router.route("/").post(loginLimiter, AuthControllers.login);

router.route("/refresh").get(AuthControllers.refresh);

router.route("/logout").post(requireAccessToken, AuthControllers.logout);

const auth_Routes = router;
export default auth_Routes;
