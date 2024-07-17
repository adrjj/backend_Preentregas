


const config = require('../config/config.js');
const CartDAO = require('../dao/cartDao'); 
//const FileSystemCartDAO = require('../dao/FileSystemCartDAO');



class CartRepository {
    constructor() {
        this.dao = config.daoType === 'mongo' ? CartDAO : null;
    }
    async createCart(userId, productos) {
        try {
            return await this.dao.createCart(userId, productos);
        } catch (error) {
            throw new Error(`Error al crear el carrito ${error.message}`);
        }
    }

    async getCartProducts(userId) {
        try {
            return await this.dao.getCartProducts(userId);
        } catch (error) {
            throw new Error(`Error al cargar los datos del carrito ${error.message}`);
        }
    }

    async deleteCart(cid) {
        try {
            return await this.dao.deleteCart(cid);
        } catch (error) {
            throw new Error(`Error al borar el carrito ${error.message}`);
        }
    }

    async emptyCart(cid) {
        try {
         
            return await this.dao.emptyCart(cid);
        } catch (error) {
            throw new Error(`Error al vaciar el carrito ${error.message}`);
        }
    }

    async modifyCart(cid, productos) {
        try {
            return await this.dao.modifyCart(cid, productos);
        } catch (error) {
            throw new Error(`Error modificar el carrito ${error.message}`);
        }
    }

    async deleteProduct(cid, pid) {
        try {
            return await this.dao.deleteProduct(cid, pid);
        } catch (error) {
            throw new Error(`Erroral borar los productis del carrito ${error.message}`);
        }
    }

    async getCartWithProducts(cartId) {
        try {
            return await this.dao.getCartWithProducts(cartId);
        } catch (error) {
            throw new Error(`Error al recuperar el carrito con productos: ${error.message}`);
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
            return await this.dao.addProductToCart(cid, pid, quantity);
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }
}

module.exports = CartRepository;
