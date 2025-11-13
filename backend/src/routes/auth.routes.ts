import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  changePassword,
} from "../controllers/auth.controller.js";
import { loginRateLimiter } from "../middleware/rateLimit.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginRateLimiter, loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);
router.post("/change-password", verifyToken, changePassword);

export default router;
