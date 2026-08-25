import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { authenticateRequest } from "../middlewares/authenticateRequest.js";

const userRouter = Router();

userRouter.use(authenticateRequest);

userRouter.get("/", userController.listUsers);
userRouter.post("/", userController.createUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export { userRouter };
