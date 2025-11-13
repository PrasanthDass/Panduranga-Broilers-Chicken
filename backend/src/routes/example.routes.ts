import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import type { Request, Response } from "express";

const router = Router();

router.get(
  "/admin-area",
  verifyToken,
  authorizeRoles("admin"),
  (req: Request, res: Response) => {
    res.json({ message: "Welcome to the admin area!" });
  },
);

router.get(
  "/user-area",
  verifyToken,
  authorizeRoles(["customer", "labor", "admin"]),
  (req: Request, res: Response): void => {
    res.json({ message: "Welcome to the user area!" });
  },
);

export default router;
