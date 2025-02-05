import { Router } from "express";
import { CartsController } from "../controller/carts.controller.js";

export const cartRouter = Router();
const cartsController = new CartsController();

cartRouter.get("/", cartsController.getAll);
cartRouter.post("/", cartsController.create);


cartRouter.get("/:cid", cartsController.getById);
cartRouter.delete("/:cid", cartsController.deleteAllProductsFromCart);



cartRouter.delete("/:cid/product/:pid", cartsController.deleteProductFromCart);
cartRouter.post("/:cid/product/:pid", cartsController.addProductToCart);