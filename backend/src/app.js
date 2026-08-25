import cors from "cors";
import express from "express";
import { env } from "./config/environment.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { authRouter } from "./routes/authRoutes.js";
import { dashboardRouter } from "./routes/dashboardRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { userRouter } from "./routes/userRoutes.js";

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
