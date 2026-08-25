import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController.js";
import { authenticateRequest } from "../middlewares/authenticateRequest.js";

const dashboardRouter = Router();

dashboardRouter.use(authenticateRequest);
dashboardRouter.get("/", dashboardController.getSummary);

export { dashboardRouter };
