const CartDAO = require("../dao/cartDao.js");

class CartController {
    async createCart(req, res) {
        try {
            const userId = req.user.id;
            const productos = req.body.productos || [];

            const updatedData = await CartDAO.createCart(userId, productos);
            res.status(200).json({ message: "Carrito actualizado exitosamente.", cart: updatedData.cart });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el carrito.", message: error.message });
        }
    }

    async getCartProducts(req, res) {
        try {
            const userId = req.user.id;
            const user = await CartDAO.getCartProducts(userId);

            if (!user || !user.cart || !Array.isArray(user.cart.productos)) {
                return res.status(404).render('cart', { error: "Carrito no encontrado o productos vacíos." });
            }

            const transformedProducts = user.cart.productos.map(product => ({
                _id: product._id,
                title: product.pid.title,
                description: product.pid.description,
                price: product.pid.price,
                thumbnail: product.pid.thumbnail,
                quantity: product.quantity
            }));

            res.render('cart', { products: transformedProducts });
        } catch (error) {
            console.error('Error al obtener los productos del carrito:', error);
            res.status(500).render('cart', { error: "Error al obtener los productos del carrito." });
        }
    }

    async deleteCart(req, res) {
        const cid = req.params.cid;
        try {
            const deletedCart = await CartDAO.deleteCart(cid);
            if (!deletedCart) {
                return res.status(404).json({ message: "No se encontró ningún producto con el ID proporcionado." });
            }
            return res.status(200).json({ message: "Producto eliminado exitosamente." });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar el producto: " + error.message });
        }
    }

    async emptyCart(req, res) {
        const cid = req.params.cid;
        try {
            await CartDAO.emptyCart(cid);
            return res.json({ message: "El carrito se ha vaciado exitosamente." });
        } catch (error) {
            return res.status(500).json({ error: "Error al vaciar el carrito." });
        }
    }

    async modifyCart(req, res) {
        try {
            const cid = req.params.cid;
            const productos = req.body.productos;

            if (!Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ error: "El cuerpo de la solicitud debe contener un array de productos." });
            }

            await CartDAO.modifyCart(cid, productos);
            res.status(200).json({ message: "Producto(s) agregado(s) al carrito exitosamente." });
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el producto al carrito.", message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;

            await CartDAO.deleteProduct(cid, pid);
            res.status(200).json({ message: "Producto eliminado del carrito exitosamente." });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el producto del carrito.", message: error.message });
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const cart = await CartDAO.addProductToCart(cid, pid, quantity);
            res.status(200).json({ message: 'Producto agregado al carrito', cart });
        } catch (error) {
            res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
        }
    }
}

module.exports = CartController;
