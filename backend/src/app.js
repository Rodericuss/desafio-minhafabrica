import cors from "cors";
import express from "express";
import { env } from "./config/environment.js";

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

export { app };
