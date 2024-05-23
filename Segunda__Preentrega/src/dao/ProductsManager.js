const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, "../dao/data/productos.json");
        this.products = [];
    }

    async addProduct(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            throw new Error("Todos los campos son obligatorios.");
        }

        if (this.products.some(product => product.code === code)) {
            throw new Error("El codigo del producto ya existe.");
        }

        await this.loadProducts();
        const nextProductId = await this.getNextProductId();
        const newProduct = {
            id: nextProductId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status: true,
            category
        };

        this.products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }

    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, { encoding: "utf8" });
            this.products = JSON.parse(data);
            return this.products;
        } catch (error) {
            throw error;
        }
    }

    async getProductsById(id) {
        const productId = this.products.find(product => product.id === parseInt(id));
        if (productId) {
            return productId;
        } else {
            throw new Error("No se encontró ningún producto con el ID proporcionado.");
        }
    }

    async getNextProductId() {
        await this.loadProducts();
        if (this.products.length === 0) {
            return 1;
        } else {
            const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
            return maxId + 1;
        }
    }

    async updateProduct(id, newData) {
        const index = this.products.findIndex(product => product.id === parseInt(id));
        if (index === -1) {
            throw new Error("No se encontró ningún producto con el ID proporcionado.");
        }

        if ('code' in newData && newData.code !== this.products[index].code && this.products.some(product => product.code === newData.code)) {
            throw new Error("El código de producto ya existe.");
        }

        this.products[index] = { ...this.products[index], ...newData };
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }

    async deleteProduct(id) {
        console.log("esto llega a la funcion delete",id," o esto" ,this.products)
      //  await this.loadProducts();
        console.log("Después de cargar los productos:", this.products)
        const index = this.products.findIndex(product => product.id === parseInt(id));
        if (index !== -1) {
            this.products.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } else {
            throw new Error("No se encontró ningún producto con el ID proporcionado mensaje enviado de productmanager.");
        }
    }
}

module.exports = ProductManager;
