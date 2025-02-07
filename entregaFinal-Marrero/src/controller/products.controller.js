import { ProductService } from "../services/product.service.js";
import { io } from "../server.js";


export class ProductsController {
    constructor() {
        this.productService = new ProductService();
    }

    getAll = async (req, res) => { 
          
        try {
            const { limit, page, sort, query, stock} = req.query;

            const products = await this.productService.getAll( limit, page, sort, query, stock);
        
            if (products.length === 0) {
                return res.status(200).json({ message: "No product in the database" });
            }
        
            return res.status(200).json(products);

        } catch (error) {
            return res.status(500).json({ message: `An error occurred while try to get all products: ${error.message}` });
        }
     }

    getById = async (req, res) => {
        const { pid } = req.params;
        try {
            const product = await this.productService.getById(pid);
            
            if (!product) {
                return res.status(404).json({ message: `Product not found with ID: ${pid}` });
            }
            
            res.status(200).json(product);
        } 
        catch (error) {
            return res.status(500).json({ message: `An error occurred while trying to get the product with ID: ${pid}: ${error.message}` });
        
        }   
    }

    create  = async (req, res) => {

        const { title, description, code, price, status, stock, category, thumbnail } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ message: "All fields are required, except for the thumbnail." });
        }
        
        try{
            const product = await this.productService.create({ title, description, code, price, status, stock, category, thumbnail});
            
            io.emit("productCreated", {title, description, price});
    
            res.status(201).json(product);
    
        } catch (error) {
            return res.status(500).json({ message: `An error occurred while try to create a product: ${error.message}` });
        }   

    }

    update = async (req, res) => {
        const { pid } = req.params;
        const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    
        if (!pid) {
            return res.status(404).json({ message: "Please provide a product ID" });
        }
    
        try {
            const product = await this.productService.update({ id: pid, title, description, code, price, status, stock, category, thumbnail });
            
            if (!product) {
                return res.status(404).json({ message: `Product not found with ID: ${pid}` });
            }
            
    
            res.status(200).json({
                message: `Successfully updated product with ID: ${pid}`
            });
            

        }
        catch (error) {
            return res.status(500).json({ message: `An error occurred while trying to update the product with ID: ${pid}: ${error.message}` });
        }    
    }
    
    delete = async (req, res) => {
        const { pid } = req.params;

        if (!pid) {
            return res.status(404).json({ message: "Please provide a product ID" });
        }
        
        try{
            const product = await this.productService.delete(pid);

                        
            if (!product) {
                return res.status(404).json({ message: `Product not found with ID: ${pid}` });
            }

            res.status(200).json({
                message: `Successfully deleted product with ID: ${pid}`

            });
        } 
        catch (error) {
            console.error(`Error occurred while trying to delete the product with ID: ${pid} - ${error.message}`);
            return res.status(500).json({ message: `An error occurred while trying to delete the product with ID: ${pid}: ${error.message}` });
        
        } 
    }
    
}
