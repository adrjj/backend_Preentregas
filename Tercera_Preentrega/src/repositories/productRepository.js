const config = require('../config/config.js');
const { deleteProduct } = require('../dao/cartDao');
const ProductDao = require('../dao/productDao'); 


class ProductRepository {
    constructor() {
        this.dao = config.daoType === 'mongo' ? ProductDao : null;
    }

    async getProduct (filterQuery, options){
        try{
            return await this.dao.getProduct(filterQuery, options);
        }
        catch (error) {
            throw new Error(`Error al cargar los datos del producto ${error.message}`);
        }
    }

async addProduct (productData){
    try{
        return await this.dao.addProduct(productData);
    }
    catch(error){
        throw new Error (`Error al agregar un nuevo producto ${error.message}`)
    }
}

async getProductById(id){
    try{
        return await this.dao.getProductById(id);
    }
    catch(error){
        throw new Error (`Error al cargar el producto especifico ${error.message}`)
    }
}
 async updateProduct(id,newData){
    try{
        return await this.dao.updateProduct(id,newData);
        
    } catch(error){
        throw new Error (`Error al actualizar el producto ${error.message}`)
    }
 }
async deleteProduct (id){
    try{
        return await this.dao.deleteProduct(id);
    }
    catch(error){
        throw new Error (`Error al borar el producto ${error.message}`)
    }
}

async loadProducts (){
    try{
        return await this.dao.loadProducts();
    }
    catch(error){
        throw new Error (`Error al cargar el producto ${error.message}`)
    }
}

async updateStock(productId, quantity) {
    
    try {
        await this.dao.updateStock(productId, quantity);
    } catch (error) {
        throw new Error(`Error en el repositorio al actualizar el stock: ${error.message}`);
    }
}

}

module.exports = ProductRepository