import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { authenticateRequest } from "../middlewares/authenticateRequest.js";

const productRouter = Router();

productRouter.use(authenticateRequest);
productRouter.get("/", productController.listProducts);
productRouter.post("/", productController.createProduct);
productRouter.put("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);

export { productRouter };
