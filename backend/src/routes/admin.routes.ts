import { Router } from "express";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getWeeklySales,
  getLastTransactions,
  createCustomer,
  getCustomers,
  createBill,
  getBillsReport,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.get("/users", verifyToken, authorizeRoles("admin"), listUsers);
router.post("/users", verifyToken, authorizeRoles("admin"), createUser);
router.put("/users/:id", verifyToken, authorizeRoles("admin"), updateUser);
router.delete("/users/:id", verifyToken, authorizeRoles("admin"), deleteUser);

router.post("/customer", verifyToken, authorizeRoles("admin"), createCustomer);
router.get("/customers", verifyToken, authorizeRoles("admin"), getCustomers);

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

router.post("/bills", verifyToken, authorizeRoles("admin"), createBill);

router.get(
  "/reports/bills",
  verifyToken,
  authorizeRoles("admin"),
  getBillsReport,
);

export default router;
