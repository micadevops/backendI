import { Router } from "express";
import { CartsController } from "../controller/carts.controller.js";

export const cartRouter = Router();
const cartsController = new CartsController();

cartRouter.get("/", cartsController.getAll);
cartRouter.post("/", cartsController.create);


cartRouter.get("/:cid", cartsController.getById);
cartRouter.delete("/:cid", cartsController.deleteAllProductsFromCart);


//TODO: AGREGAR PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.

cartRouter.delete("/:cid/product/:pid", cartsController.deleteProductFromCart);
cartRouter.post("/:cid/product/:pid", cartsController.addProductToCart);
cartRouter.put("/:cid/product/:pid", cartsController.updateQuantityProduct);