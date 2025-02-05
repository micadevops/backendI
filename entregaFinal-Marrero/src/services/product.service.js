import  { productModel } from "../db/models/product.model.js";
import mongoose from 'mongoose';

export class ProductService {

    
    async getAll() {
        const allProduct = await productModel.find();
        return allProduct;
    }


    async getById(id) {
       try {
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        const product = await productModel.findById(id);

        if (!product) {
            null;
        }

        return product

        } catch (error) {
            console.error(`Error occurred while trying to get the product with ID: ${id} - ${error.message}`);
            return error;        
        }
    }


    async create({
        title,
        description,
        code,
        price,
        status = true,
        stock,
        category,
        thumbnail,
    }){

        try{

            const newProduct = productModel.create({title, description, code, price, status, stock, category, thumbnail});  
            return newProduct;

        }
        catch(error) {
            console.error(`An error occurred while try to create a product with error message: ${error.message}`);
            return error;        

        }
    }

    async update({
        id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
    }){
    
        try{
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }

            
            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                {
                    $set: {
                        title,
                        description,
                        code,
                        price,
                        status,
                        stock,
                        category,
                        thumbnail,
                    },
                },
                { new: true, omitUndefined: true }  
            )

            if (!updatedProduct) {
                null;
            }
    
            return updatedProduct;

        }catch(error) {
            console.error(`An error occurred while try to update the product: ${id} with error message: ${error.message}`);
            return error;        
        }
    }

    async delete( id ) {

        try{

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }

            
            const deletedProduct = await productModel.deleteOne({_id: id});

            if (!deletedProduct) {
                null;
            }

            return deletedProduct;
        }catch(error) {
            console.error(`An error occurred while try to delete the product: ${id} with error message: ${error.message}`);
            return error;        
        }
    }
}

