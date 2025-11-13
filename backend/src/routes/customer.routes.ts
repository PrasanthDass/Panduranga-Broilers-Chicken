import { Router } from "express";
import {
  getMyDetails,
  getMyBills,
} from "../controllers/customer.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

const auth = [verifyToken, authorizeRoles("customer")];

router.get("/me", auth, getMyDetails);
router.get("/my-bills", auth, getMyBills);

export default router;
