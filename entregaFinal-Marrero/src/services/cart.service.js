import { ProductService } from "./product.service.js";
import { cartModel } from "../db/models/cart.model.js";
import { productModel } from "../db/models/product.model.js";

export class CartService {
    constructor() {
        this.productService = new ProductService();
    }
    
    async getAll() {
        try {
            
            const getAllCarts = await cartModel.find();
            return getAllCarts;
        }
        catch (error) {
            throw new Error('Error while fetching all the carts');
        }

    }

    async getById(id) {
        try {
            const cartById = await cartModel.findById(id).populate('products.product');
            
            if (!cartById) {
                throw new Error(`Cart with id: ${id} not found`);
            }
    
            return cartById;
        }
        catch (error) {
            console.error(`Error fetching cart: ${error.message}`);
            throw new Error(`Error while fetching the cart with ID: ${id}`);
        }
    }

    async create() {
        try {
            const newCart = await cartModel.create({products: []});
            return newCart.id
            
        } catch (error) {
            console.error(`An error occurred while try to create a cart with error message: ${error.message}`);
        }
    }


    async updateQuantityProduct(id, pid, quantity) {
        try {
            const cart = await cartModel.findById(id);
            if (!cart) {
                throw new Error(`Cart with ID ${id} not found`);
            }
    
            const product = await this.productService.getById(pid);

            if (!product) {
                throw new Error(`Product with ID ${pid} not found`);
            }

            if (product.stock < quantity) {
                throw new Error(`Product ${pid} is out of stock`);
            }

            const cartProduct = cart.products.find(p => p.product.toString() === pid);
            console.log(cartProduct.quantity)
            const quantityDifference = quantity + cartProduct.quantity;

            

            const updatedCart = await cartModel.findOneAndUpdate(
                { _id: id, "products.product": pid },
                { $set: { "products.$.quantity": quantityDifference } },
                { new: true }
            );
    
            if (!updatedCart) {
                throw new Error(`Product with ID ${pid} is not in the cart`);
            }
    
            const updatedProductStock = await productModel.findOneAndUpdate(
                { _id: pid, stock: { $gt: 0 } },
                { $inc: { stock: - quantity } }, 
                { new: true }
            );

            return updatedCart;
    
        } catch (error) {
            console.error(`An error occurred while updating product quantity: ${error.message}`);
        }
    }
    

    

    async addProductToCart(id, pid) {
        try {
            const productId = await this.productService.getById(pid);
    
            if(!productId) {
                throw new Error(`Product with ID ${pid} not found`);
            }
            
            const cartId = await cartModel.findById(id)
    
            if(!cartId) {
                throw new Error(`Cart with ID ${id} not found`);
            }
    
            if (productId.stock < 1) {
                throw new Error(`Product ${pid} is out of stock`);
            }


            const cart = await cartModel.findOneAndUpdate(
                { _id: id, 'products.product': pid },
                { 
                    $inc: { 'products.$.quantity': 1 } 
                },
                { 
                    new: true,
                    upsert: false 
                }
            );
        
            if (!cart) {
                return await cartModel.findOneAndUpdate(
                    { _id: id },
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
    
            const updatedProductStock = await productModel.findOneAndUpdate(
                { _id: pid, stock: { $gt: 0 } },
                { $inc: { stock: -1 } }, 
                { new: true }
            );
            
            return cart;

            } catch (error) {
                console.error(`An error occurred while try to add the product: ${productId} to the cart: ${cartId} with error message: ${error.message}`);
            }
        }

    async deleteProductFromCart(id, pid) {
        try {
            
            const cart = await cartModel.findOneAndUpdate(
                { _id: id, 'products.product': pid },
                { 
                    $inc: { 'products.$.quantity': -1 } 
                },
                { 
                    new: true,
                    upsert: false 
                }
            );
            
            const updatedCart = await cartModel.findOneAndUpdate(
                { _id: id },
                { 
                    $pull: { 
                        products: { 
                            product: pid, 
                            quantity: 0 
                        } 
                    }
                },
                { new: true }
            );
    
            return updatedCart || cart;
  
        } catch (error) {
            console.error(`Error removing product from cart: ${error.message}`);
            throw error;
        }
    }

    async deleteAllProductsFromCart(id) {
        try {

            const cartId = await cartModel.findById(id)
    
            if(!cartId) {
                throw new Error(`Cart with ID ${id} not found`);
            }
    
            const result = await cartModel.updateOne({ id }, { products: [] });

            return await this.getById(id);  
    
        } catch (error) {
            console.error(`An error occurred while try to delete all the products to the cart: ${cartId} with error message: ${error.message}`);
        }
    }
}
