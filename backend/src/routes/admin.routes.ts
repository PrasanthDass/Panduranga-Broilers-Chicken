import { Router } from "express";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getWeeklySales,
  getLastTransactions,
} from "../controllers/admin.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get("/users", verifyToken, authorizeRoles("admin"), listUsers);
router.post("/users", verifyToken, authorizeRoles("admin"), createUser);
router.put("/users/:id", verifyToken, authorizeRoles("admin"), updateUser);
router.delete("/users/:id", verifyToken, authorizeRoles("admin"), deleteUser);
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
