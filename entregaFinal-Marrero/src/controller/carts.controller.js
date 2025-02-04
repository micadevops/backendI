
import { CartService } from "../services/cart.service.js";


export class CartsController {
    async getAllCarts (req, res) {
       try {
            const carts = await CartService.getAllCarts();
       
            if (carts.length === 0) {
                return res.status(200).json({ message: "No product in the database" });
            }
           
            res.status(200).json(carts);
        } catch (error) {
               return res.status(500).json({ message: `An error occurred while try to get all carts: ${error.message}` });
        }
    }

    async getCartById (req, res) {
        
        const { cid } = req.params;
    
        try {
    
            if (!cid) {
                return res.status(404).json({ message: "Please provide a cart ID" });
            }

            const cart = await CartService.getById(cid); 
    
            if (cart.products.length === 0) {
                return res.status(200).json({ message: "The cart is empty" });
            }
    
            return res.status(200).json(cart);

        
        } catch (error) {
            if (error.message.includes("not found")) {
                return res.status(404).json({ message: error.message });
            }
            
            return res.status(500).json({ message: `An error occurred while try to get the cart with ID: ${cid}: ${error.message}` });
        }   
    }
    
}
