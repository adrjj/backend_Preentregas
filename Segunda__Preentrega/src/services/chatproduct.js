const Product = require("../dao/models/products.model");

class ProductManager {
    async addProduct(title, description, price, thumbnail, code, stock, status, category) {
        try {
            const newProduct = new Product({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status: true,
                category
            });
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw new Error("Error al agregar el producto: " + error.message);
        }
    }

    async getProductsById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }
            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto: " + error.message);
        }
    }

    async updateProduct(id, newData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, newData, { new: true });
            if (!updatedProduct) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }
            return updatedProduct;
        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }
        } catch (error) {
            throw new Error("Error al eliminar el producto: " + error.message);
        }
    }
}

module.exports = ProductManager;
