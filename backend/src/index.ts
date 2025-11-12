import type { Response } from "express";
import express from "express";
import healthRoutes from "./routes/health.routes";
import usersRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import exampleRoutes from "./routes/example.routes";
import adminRoutes from "./routes/admin.routes";
import customerRoutes from "./routes/customer.routes";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// configure env
dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(morgan("combined"));
app.use(express.json());

app.listen(3000, () => {
  console.log("listening on port 3000");
});

app.get("/", (res: Response) => {
  res.json({
    company: "Panduranga-Broilers-Chicken",
  });
});

app.use("/", healthRoutes);
app.use("/", usersRoutes);
app.use("/", authRoutes);
app.use("/example", exampleRoutes);
app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);
