const CartModel = require("../dao/models/carts.model");
const productModel = require("./models/products.model");

class CartController {
    // Constructor and other methods remain unchanged

    async createCart(req, res) {
        try {
            const newCart = {
                productos: []
            };

            if (req.body.productos && Array.isArray(req.body.productos)) {

                req.body.productos.forEach(producto => {
                    console.log("//1 createCart () ", producto);
                    if (producto.pid && producto.quantity) {
                        newCart.productos.push({
                            pid: producto.pid,
                            quantity: producto.quantity
                        });

                    }

                });
                console.log("//2 createCart () newCart ", newCart);
            }

            // Save new cart to MongoDB using Mongoose
            const cart = await CartModel.create(newCart);
            console.log("Carrito guardado en la base de datos:", cart);

            res.status(200).json({ message: "Carrito creado exitosamente.", cart: cart });
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el producto.", message: error.message });
        }
    }



    async getCartProducts(req, res) {
        try {
            const cartId = (req.params.cid);
            console.log("datos del req ", cartId)
            const cart = await CartModel.findById(cartId);
            console.log("esto tiene el cart", cart)

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado." });
            }

            res.json(cart.productos);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los productos del carrito.", message: error.message });
        }
    }

    async addProductToCart(req, res) {
        const cid = req.params.cid;
        const productos = req.body.productos;
    
        // Verificar si productos es un array y no está vacío
        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ message: "Debe proporcionar una lista de productos." });
        }
    
        try {
            // Buscar carrito por id
            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado." });
            }
    
            productos.forEach(({ pid, quantity }) => {
                const productId = parseInt(pid, 10);
                const quantityToAdd = parseInt(quantity, 10);
    
                // Verificar si pid y quantityToAdd son números válidos
                if (isNaN(productId) || isNaN(quantityToAdd) || quantityToAdd <= 0) {
                    return res.status(400).json({ message: "Producto o cantidad proporcionados no son válidos." });
                }
    
                // Comprobar si el producto ya existe en el carrito
                const existingProductIndex = cart.productos.findIndex(product => product.pid === productId);
    
                if (existingProductIndex !== -1) {
                    cart.productos[existingProductIndex].quantity += quantityToAdd;
                } else {
                    cart.productos.push({ pid: productId, quantity: quantityToAdd });
                }
            });
    
            // Guardar el carrito actualizado
            await cart.save();
    
            res.status(200).json({ message: "Productos agregados al carrito exitosamente." });
        } catch (error) {
            res.status(500).json({ error: "Error al agregar los productos al carrito.", message: error.message });
        }
    }
    


    async deleteCart(req, res) {

        const cid = req.params.cid;
        console.log("//1 deleteCart() esto es cid", cid)
        try {
            const deletedCart = await CartModel.findByIdAndDelete(cid);
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
        console.log("//1 esto es el _id", cid);
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado." });
            }
    
            // Vaciar el arreglo de productos del carrito
            cart.productos = [];
    
            // Guardar el carrito actualizado
            await cart.save();
    
            return res.json({ message: "El carrito se ha vaciado exitosamente." });
    
        } catch (error) {
            return res.status(500).json({ error: "Error al vaciar el carrito." });
        }
    }

    async modifyCart(req, res) {
        try {
            const cid = req.params.cid;
            const productos = req.body.productos;
            console.log("//1 modifyCart() esto es cid y productos", cid, productos);

            // Verificar que productos sea un array y tenga al menos un producto
            if (!Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ error: "El cuerpo de la solicitud debe contener un array de productos." });
            }

            // Buscar carrito por id
            const cart = await CartModel.findById(cid);
            console.log("esto es cart", cart);

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado." });
            }

            // Procesar cada producto en el array
            productos.forEach(producto => {
                const pid = parseInt(producto.pid);
                const quantity = parseInt(producto.quantity);

                // Verificar que pid y quantity sean números válidos
                if (isNaN(pid) || isNaN(quantity)) {
                    return res.status(400).json({ error: "PID y quantity deben ser números." });
                }

                // Verificar si el producto ya existe en el carrito
                const existingProductIndex = cart.productos.findIndex(product => product.pid === pid);

                if (existingProductIndex !== -1) {
                    cart.productos[existingProductIndex].quantity += quantity;
                } else {
                    cart.productos.push({ pid: pid, quantity: quantity });
                }
            });

            // Guardar el carrito actualizado
            await cart.save();

            res.status(200).json({ message: "Producto(s) agregado(s) al carrito exitosamente." });
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el producto al carrito.", message: error.message });
        }
    }

    async deleteProduct(req, res) {

        try {
            const cid = req.params.cid;
            const pdi = parseInt(req.params.pid)

            const deletedProduct = await productModel.findByIdAndDelete(productos.pid);
            if (!deletedProduct) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }





        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el producto del carrito.", message: error.message });
        }


    }
}

module.exports = CartController;