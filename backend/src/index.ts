import type { Request, Response } from "express";
import express from "express";
import healthRoutes from "./routes/health.routes";
import usersRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import exampleRoutes from "./routes/example.routes";
import adminRoutes from "./routes/admin.routes";
import dotenv from "dotenv";

// configure env
dotenv.config();

const app = express();

app.listen(3000, () => {
  console.log("listening on port 3000");
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    company: "Panduranga-Broilers-Chicken",
  });
});

app.use("/", healthRoutes);
app.use("/", usersRoutes);
app.use("/", authRoutes);
app.use("/example", exampleRoutes);
app.use("/admin", adminRoutes);
