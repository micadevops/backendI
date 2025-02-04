import { ProductService } from "./product.service.js";
import { cartModel } from "../db/models/cartModel.js";
class CartService {

    async getAllCarts() {
        try {
            const getAllCarts = await cartModel.find();
            return getAllCarts;
        }
        catch (error) {
            throw new Error('Error while fetching all the carts');
        }

    }

    async getById(cid) {
        try {
            const cartById = await cartModel.findOne({_id: cid}).populate('products.product');
            
            if (!cartById) {
                throw new Error(`Cart with id: ${cid} not found`);
            }

            return cartById;
        }
        catch (error) {
            throw new Error('Error while fetching the cart by ID');
        }
    }

    async create() {
        try {
            const newCart = await cartModel.create({products: []});
            return newCart
        } catch (error) {
            console.error(`An error occurred while try to create a cart with error message: ${error.message}`);
        }
    }

    async addProductToCart(cid, pid) {

        try {
            const productId = await productService.getById(pid);

            if(!productId) {
                throw new Error(`Product with ID ${pid} not found`);
            }
    
            const cartId = await this.getById(cid);
    
            if(!cartId) {
                throw new Error(`Cart with ID ${cid} not found`);
            }

            if (productId.stock < 1) {
                throw new Error(`Product ${pid} is out of stock`);
            }

            const addProductByID = await cartModel.findOneAndUpdate(
                {
                    _id: cid,
                    "products.product": pid,
                    "products.quantity": { $lt: productId.stock }
                },
                { 
                    $inc: { "products.$.quantity": 1 }
                },
                { new: true }
            )
            if (!addProductByID) {
                await cartModel.findByIdAndUpdate(
                    cid,
                    { 
                        $push: { 
                            products: { 
                                product: pid, 
                                quantity: 1 
                            } 
                        } 
                    },
                    { new: true }
                );
            }
    
            return await this.getById(cid);  
            
        } catch (error) {
            console.error(`An error occurred while try to add the product: ${productId} to the cart: ${cartId} with error message: ${error.message}`);
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const productId = await productService.getById(pid);

            if(!productId) {
                throw new Error(`Product with ID ${pid} not found`);
            }
    
            const cartId = await this.getById(cid);
            if(!cartId) {
                throw new Error(`Cart with ID ${cid} not found`);
            }
    
            const productIndex = cartId.products.findIndex(
                item => item.product.toString() === pid
            );
    
            if (productIndex === -1) {
                return null;
            }
    
            if (cartId.products[productIndex].quantity === 1) {
                cartId.products.splice(productIndex, 1);
            } else {
                cartId.products[productIndex].quantity -= 1;
            }
    
            await cartId.save();
            return await this.getById(cid);  
    
        } catch (error) {
            throw error;
        }
    }

    async deleteAllProductsFromCart(cid) {
        try {
            const cartId = await this.getById(cid);

            if(!cartId) {
                throw new Error(`Cart with ID ${cid} not found`);
            }
    
            const result = await cartModel.updateOne({ _id: cid }, { products: [] });

            return await this.getById(cid);  
    
        } catch (error) {
            throw error;
        }
    }
}

export { CartService }