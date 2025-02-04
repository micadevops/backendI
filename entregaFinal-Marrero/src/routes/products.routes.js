import { ProductService } from "../services/product.service.js";
import { validate as uuidValidate } from "uuid";
import { Router } from "express";
import { io } from "../server.js";

export const productRouter = Router();

productRouter.get("/", async (req, res) => {
    const products = await productService.getAll();
    if (products.length === 0) {
        return res.status(200).json({ message: "No product in the database" });
    }

    return res.status(200).json(products);
});

productRouter.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    if (!pid) {
        return res.status(404).json({ message: "Please provide a product ID" });
    }

    const product = await productService.getById(pid);

    if(!product) {
        return res.status(404).json({ error: `Product with id: ${req.params.pid} no found` });
    }

    res.status(200).json(product);
});

productRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "All fields are required, except for the thumbnail." });
    }

    try{
        const product = await productService.create({ title, description, code, price, status, stock, category, thumbnail});
        
        io.emit("productCreated", {title, description, price});

        res.status(201).json(product);

    } catch(error) {
        return res.status(500).json({ errors: error.message });
    }

});


productRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!pid) {
        return res.status(404).json({ message: "Please provide a product ID" });
    }

    try {
        const product = await productService.update({ id: pid, title, description, code, price, status, stock, category, thumbnail });

        if (!product) {
            return res.status(404).json({ error: `Product with id: ${req.params.pid} no found` });
        }
        
        res.status(200).json({
            message: `Successfully updated product with ID: ${pid}`
        });

    } catch (error)  {
          return res.status(500).json({ errors: error.message });
    }
});

productRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    if (!pid) {
        return res.status(404).json({ message: "Please provide a product ID" });
    }

    if (!uuidValidate(pid)) {
        return res.status(400).json({ message: "The provided cart ID format is invalid" });
    }

    try{
        const product = await productService.delete(pid);

        if (!product)
            return res.status(404).json({ error: `Product with id: ${req.params.pid} no found` });
        
        res.status(200).json({
            message: `Successfully deleted product with ID: ${pid}`

          });
    } catch(error) {
          return res.status(500).json({ errors: error.message });
    }
});