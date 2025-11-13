import type { Request, Response } from "express";
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import exampleRoutes from "./routes/example.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(morgan("combined"));
app.use(express.json());

app.listen(port, () => {});

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Dont try to play the fool with mr Niggesh !",
  });
});

app.use("/", healthRoutes);
app.use("/", usersRoutes);
app.use("/", authRoutes);
app.use("/example", exampleRoutes);
app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);
