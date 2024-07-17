const CartModel = require("../models/carts.model");
const UserModel = require("../models/user.model");

class CartDAO {
    async createCart(userId, productos) {
        let userData = await UserModel.findById(userId);
        if (!userData) {
            throw new Error("Usuario no encontrado.");
        }

        productos.forEach(producto => {
            if (producto.pid && producto.quantity) {
                const existingProductIndex = userData.cart.productos.findIndex(p => p.pid.toString() === producto.pid.toString());
                if (existingProductIndex !== -1) {
                    userData.cart.productos[existingProductIndex].quantity += producto.quantity;
                } else {
                    userData.cart.productos.push({
                        pid: producto.pid,
                        quantity: producto.quantity
                    });
                }
            }
        });

        return await userData.save();
    }

    async getCartProducts(userId) {
        return await UserModel.findById(userId).populate({
            path: 'cart.productos.pid',
            model: 'products'
        });
    }

    async deleteCart(cid) {
        return await CartModel.findByIdAndDelete(cid);
    }

    async emptyCart(cid) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("Carrito no encontrado.");
        }
        cart.productos = [];
        return await cart.save();
    }

    async modifyCart(cid, productos) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("Carrito no encontrado.");
        }

        productos.forEach(producto => {
            const existingProductIndex = cart.productos.findIndex(p => p.pid === producto.pid);
            if (existingProductIndex !== -1) {
                cart.productos[existingProductIndex].quantity += producto.quantity;
            } else {
                cart.productos.push({
                    pid: producto.pid,
                    quantity: producto.quantity
                });
            }
        });

        return await cart.save();
    }

    async deleteProduct(cid, pid) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("Carrito no encontrado.");
        }

        const productIndex = cart.productos.findIndex(product => product.pid.equals(pid));
        if (productIndex === -1) {
            throw new Error("Producto no encontrado en el carrito.");
        }

        cart.productos.splice(productIndex, 1);
        return await cart.save();
    }

    async getCartWithProducts(cartId) {
        const cart = await CartModel.findById(cartId).populate('productos.pid').exec();
        if (!cart) {
            throw new Error("Carrito no encontrado.");
        }

        return cart.productos.map(item => ({
            title: item.pid.title,
            description: item.pid.description,
            price: item.pid.price,
            thumbnail: item.pid.thumbnail,
            id: item.pid._id,
            quantity: item.quantity
        }));
    }

    async addProductToCart(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const quantityToAdd = parseInt(quantity, 10);
        const productIndex = cart.productos.findIndex(p => p.pid.toString() === pid);

        if (productIndex > -1) {
            cart.productos[productIndex].quantity += quantityToAdd;
        } else {
            cart.productos.push({ pid: pid, quantity: quantityToAdd });
        }

        return await cart.save();
    }
}

module.exports = new CartDAO();
