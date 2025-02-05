import { Router } from "express";
import { ProductsController } from "../controller/products.controller.js";

export const productRouter = Router();
const productController = new ProductsController();

productRouter.get("/", productController.getAll)
productRouter.post("/", productController.create)

productRouter.get("/:pid", productController.getById)
productRouter.put("/:pid", productController.update)
productRouter.delete("/:pid", productController.delete)