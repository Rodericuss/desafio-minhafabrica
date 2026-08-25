import cors from "cors";
import express from "express";
import { env } from "./config/environment.js";
import { authRouter } from "./routes/authRoutes.js";
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

app.use((error, _request, response, next) => {
  if (error?.type === "entity.parse.failed") {
    return response.status(400).json({ message: "Request body must contain valid JSON" });
  }

  return next(error);
});

export { app };
