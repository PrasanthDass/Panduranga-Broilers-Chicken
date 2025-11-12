import { Router } from "express";
import { getMyDetails, getMyBills } from "../controllers/customer.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

const auth = [verifyToken, authorizeRoles("customer")];

router.get("/me", auth, getMyDetails);
router.get("/my-bills", auth, getMyBills);

export default router;
