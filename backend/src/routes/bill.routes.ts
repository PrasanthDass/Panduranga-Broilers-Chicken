import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import {
  createBill,
  getBills,
  updateBill,
  deleteBill,
} from "../controllers/bill.controller";

const router = Router();

// Only authenticated users can view their own bills
router.get("/", verifyToken, getBills);

// Only admins can create, update, delete bills
router.post("/", verifyToken, authorizeRoles("admin"), createBill);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateBill);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteBill);

export default router;
