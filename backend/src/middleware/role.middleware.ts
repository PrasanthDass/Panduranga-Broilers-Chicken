import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";

export function authorizeRoles(allowedRoles: string | string[]) {
  const rolesArray = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!rolesArray.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    next();
  };
}
