import { Router } from "express";
import { ProductService } from "../services/product.service.js";
import { CartService } from "../services/cart.service.js";

export const viewsRouter = Router();

const productService = new ProductService();
const cartService = new CartService();


viewsRouter.get("/", async (req, res) => {
    try {
        const { limit, page, sort, query, stock } = req.query;

        const isAsc = sort === "asc";
        const isDesc = sort === "desc";

        const isTrue = stock == "true";
        const isFalse = stock == "false";


        const products = await productService.getAll(limit, page, sort, query, stock);
        const carts = await cartService.getAll();
   
        const simplifiedCarts = carts.map(cart => ({
            _id: cart._id.toString(),
            products: cart.products
        }));

        res.render("home", { products, carts: simplifiedCarts });
    } catch (error) {
        res.status(500).send("Error fetching products: " + error.message);
    }
});

viewsRouter.get("/cart/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;

        const cart = await cartService.getById(cartId)

        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        // console.log(cart)

        if (!cart._id) {
            return res.status(500).send("Carrito sin ID encontrado");
        }

        // console.log(cart._id)

       const cartWithStringId = cart.toObject ? cart.toObject() : cart;

        res.render("cart", { cart: cartWithStringId });
    } catch (error) {
        res.status(500).send("Error fetching cart: " + error.message);
    }
});


viewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
});