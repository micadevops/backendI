import  { productModel } from "../db/models/productModel.js";

class ProductService {

    
    async getAll() { //TODO : agregar filter y demas
        return this.products;
    }


    async getById(id) {
       try {
        const product = await productModel.findOne({_id: id});

        if (!product) {
            return null;
        }

        } catch (error) {
            console.error(`An error occurred while try to get the product: ${id} with error message: ${error.message}`);
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
            
            return updatedProduct;

        }catch(error) {
            console.error(`An error occurred while try to update the product: ${id} with error message: ${error.message}`);
            return null;
        }
    }

    async delete( id ) {

        try{
            const deletedProduct = await productModel.deleteOne({_id: id});
            return deletedProduct;
        }catch(error) {
            console.error(`An error occurred while try to delete the product: ${id} with error message: ${error.message}`);
            return null;
        }
    }
}

export { ProductService }