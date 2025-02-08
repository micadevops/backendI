
import { CartService } from "../services/cart.service.js";


export class CartsController {

    constructor() {
        this.cartService = new CartService();
    }

    getAll = async (req, res) => { 
       try {
            const carts = await this.cartService.getAll();
       
            if (carts.length === 0) {
                return res.status(200).json({ message: "No carts active in the system" });
            }
           
            res.status(200).json(carts);
        } catch (error) {
               return res.status(500).json({ message: `An error occurred while try to get all carts: ${error.message}` });
        }
    }

    getById = async (req, res) => { 
        
        const { cid } = req.params;
    
        try {
    
            if (!cid) {
                return res.status(404).json({ message: "Please provide a cart ID" });
            }

            const cart = await this.cartService.getById(cid); 
            
            if (cart.products.length === 0) {
                return res.status(200).json({ message: "The cart is empty" });
            }
    
            return res.status(200).json(cart);

        
        } catch (error) {
            if (error.message.includes("not found")) {
                return res.status(404).json({ message: `Cart no found: ${error.message}`});
            }
            
            return res.status(500).json({ message: `An error occurred while try to get the cart with ID: ${cid}: ${error.message}` });
        }   
    }
    
    create = async (req, res) => { 
         try {
                const cart = await this.cartService.create();
        
                res.status(200).json({
                    message: `Successfully created Cart with ID: ${cart}.`
                  });
        
            } catch (error) {
                return res.status(500).json({ message: `An error occurred while try to create the cart: ${error.message}` });
                
            }
    }
    updateQuantityProduct = async (req, res) => { 
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
    
            const updatedCart = await this.cartService.updateQuantityProduct(cid, pid, quantity);
    
            if (!updatedCart) {
                return res.status(404).json({ message: `Product out of stock    ` });
            }
    
            return res.status(200).json({
                message: `Successfully updated quantity for product ${pid} in cart with ID: ${cid}.`,
                cart: updatedCart
            });
    
        } catch (error) {
            return res.status(500).json({ 
                message: `An error occurred while trying to update the quantity in the cart: ${error.message}` 
            });
        }
    }
    

    addProductToCart = async (req, res) => { 
        const { cid, pid } = req.params;

        try {
            
            if (!cid) {
                return res.status(404).json({ message: "Please provide a cart ID" });
            }
        
            if (!pid) {
                return res.status(404).json({ message: "Please provide a product ID" });
            }

            const updatedCart = await this.cartService.addProductToCart(cid, pid);

            res.status(200).json({
                message: `Successfully added product with ID: ${pid} to cart with ID: ${cid}.`
            });

        } catch (error) {
            if (error.message.includes("not found")) {
                return res.status(404).json({ message: `Cart or product no found: ${error.message}`});
            }
            return res.status(500).json({ message: `An error occurred while try to add the product in the cart: ${error.message}` });
        }

    }

    
    deleteProductFromCart = async (req, res) => { 
         const { cid, pid } = req.params;
        
            try {
        
                if (!cid) {
                    return res.status(404).json({ message: "Please provide a cart ID" });
                }
            
                if (!pid) {
                    return res.status(404).json({ message: "Please provide a product ID" });
                }
        
                const deleteProductFromCart = await this.cartService.deleteProductFromCart(cid, pid);
        
                res.status(200).json({
                    message: `Successfully deleted product with ID: ${pid} from cart with ID: ${cid}.`
                  });
        
            } catch (error) {
                if (error.message.includes("not found")) {
                    return res.status(404).json({ message: `Cart or product no found: ${error.message}`});
                }
                return res.status(500).json({ message: `An error occurred while try to delete the cart: ${error.message}` });
            }
    }

    deleteAllProductsFromCart = async (req, res) => { 
        const { cid } = req.params;
        try {
            if (!cid) {
                return res.status(404).json({ message: "Please provide a cart ID" });
            }

            const deleteAllProduct = await this.cartService.deleteAllProductsFromCart(cid);

            if(!deleteAllProduct) {
                return res.status(404).json({ error: `Cart not found` });
            }

            res.status(200).json({
                message: `Successfully deleted all products from cart with ID: ${cid}.`
            });
        } 
        catch (error) {
            if (error.message.includes("not found")) {
                return res.status(404).json({ message: `Cart no found: ${error.message}`});
            }
            return res.status(500).json({ message: `An error occurred while try to delete all product from the cart: ${error.message}` });
        }

    }
}
