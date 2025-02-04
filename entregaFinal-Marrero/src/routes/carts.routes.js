import { Router } from "express";
import { CartsController } from "../controller/carts.controller.js";

export const cartRouter = Router();

cartRouter.get("/", CartsController.getAllCarts);


cartRouter.get("/:cid", CartsController);


cartRouter.post("/", async (req, res) => {
    
    try {
        const cart = await cartService.create();

        res.status(200).json({
            message: `Successfully created Cart with ID: ${cart}.`
          });

    } catch (error) {
        return res.status(500).json({ errors: error.message });
        
    }
});


cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {

        if (!cid) {
            return res.status(404).json({ message: "Please provide a cart ID" });
        }
    
        if (!pid) {
            return res.status(404).json({ message: "Please provide a product ID" });
        }

        const deleteProductFromCart = await cartService.deleteProductFromCart(cid, pid);

        if(!deleteProductFromCart) {
            return res.status(404).json({ error: `Cart or product no found` });
        }

        res.status(200).json({
            message: `Successfully deleted product with ID: ${pid} from cart with ID: ${cid}.`
          });

    } catch (error) {
        return res.status(500).json({ errors: error.message });
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        
        if (!cid) {
            return res.status(404).json({ message: "Please provide a cart ID" });
        }
    
        if (!pid) {
            return res.status(404).json({ message: "Please provide a product ID" });
        }

        const updatedCart = await cartService.addProductToCart(cid, pid);


        if(!updatedCart) {
            return res.status(404).json({ error: `Cart or product no found` });
        }

        res.status(200).json({
            message: `Successfully added product with ID: ${pid} to cart with ID: ${cid}.`
          });

    } catch (error) {

        return res.status(500).json({ "error aqui " : error.message });
    }
});