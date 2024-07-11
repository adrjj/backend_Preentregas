// dao/productDAO.js
const productModel = require("../models/products.model.js");

class ProductDAO {
    async getProduct(filter, options) {
        try {
            const result = await productModel.paginate(filter, options);
            return result;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async addProduct(productData) {
        try {
            const newProduct = new productModel(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw new Error("Error al agregar el producto: " + error.message);
        }
    }

    async getProductById(_id) {
        try {
            const product = await productModel.findById(_id);
            if (!product) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }
            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto: " + error.message);
        }
    }

    async updateProduct(_id, newData) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(_id, newData, { new: true });
            if (!updatedProduct) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }
            return updatedProduct;
        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    }

    async deleteProduct(_id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(_id);
            if (!deletedProduct) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }
        } catch (error) {
            throw new Error("Error al eliminar el producto: " + error.message);
        }
    }

    async loadProducts() {
        try {
            const products = await productModel.find();
            return products.map(product => ({
                title: product.title,
                price: product.price,
                description: product.description,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
                category: product.category,
                status: product.status,
                id: product._id
            }));
        } catch (error) {
            throw new Error("Error al cargar los productos: " + error.message);
        }
    }
}

module.exports = ProductDAO;
