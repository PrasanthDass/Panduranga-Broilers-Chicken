import { Router } from "express";
import type { Response, Request } from "express";
const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toString(),
  });
});

export default router;
