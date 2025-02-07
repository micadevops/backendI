import  { productModel } from "../db/models/product.model.js";
import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

export class ProductService {


    async getAll(limit = 10, page = 1, sort = "", query = "", stock) {
        try {
            let sortOption = {};
            let filterOptions = {};
            
            //query
            if (query) {
                filterOptions = { category: { $regex: query, $options: 'i' } };
            }
            
            //Filter using stock == true or stock == false
            if (stock === 'true') {
               filterOptions.stock = { $gt: 0 };
            } else if (stock === 'false') {
                filterOptions.stock = { $lt: 1 };
            }

            
            //ordenar
            if (sort === 'asc' || sort === 'desc') {
                sortOption = { price: sort === 'asc' ? 1 : -1 };
            }
    
            const options = {
                limit: parseInt(limit),
                page: parseInt(page), 
                lean: true,
                sort: sortOption
            };

            const result = await productModel.paginate(filterOptions, options);


            const prevLink = result.hasPrevPage
            ? `/api/products/?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}`
            : null;

            const nextLink = result.hasNextPage
            ? `/api/products/?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}`
            : null;
    
            return {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink,
                nextLink,
            };

        } catch (error) {
            return { status: "error", message: error.message };
        }
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

