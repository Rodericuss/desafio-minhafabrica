import { Router } from "express";
import { userController } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", userController.listUsers);
userRouter.post("/", userController.createUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export { userRouter };
