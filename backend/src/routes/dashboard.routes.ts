import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  getWeeklySales,
  getLastTransactions,
} from "../controllers/dashboard.controller";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/weekly-sales",
  verifyToken,
  authorizeRoles("admin"),
  getWeeklySales,
);

router.get(
  "/last-transactions",
  verifyToken,
  authorizeRoles("admin"),
  getLastTransactions,
);

export default router;
