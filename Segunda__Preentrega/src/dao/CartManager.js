const fs = require('fs');
const path = require('path');

class CartController {
    constructor() {
        this.fileCart = "../dao/data/carritos.json";
        this.cart = [];
        this.firstId = 0;
    }

    newID() {
        this.firstId++;
        return this.firstId;
    }


    createCart(req, res) {
        try {
            const newCart = {
                id: this.newID(),
                productos: []
            };

            // Verifica si el cuerpo de la solicitud tiene productos y es un array
            if (req.body.productos && Array.isArray(req.body.productos)) {
                // Itera sobre los productos entrantes para agregarlos al nuevo carrito
                req.body.productos.forEach(producto => {
                    if (producto.pid && producto.quantity) {
                        newCart.productos.push({
                            pid: producto.pid,
                            quantity: producto.quantity
                        });
                    }
                });
            }

            // Añade el nuevo carrito al array de carrit
            this.cart.push(newCart);

            // Escribe el array de carritos actualizado en el archivo
            fs.writeFile(path.join(__dirname, this.fileCart), JSON.stringify(this.cart, null, 2), (err) => {
                if (err) {
                    res.status(500).json({ error: "Error al escribir en el archivo.", message: err.message });
                } else {
                    res.status(200).json({ message: "Carrito creado exitosamente.", cart: newCart });
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el producto.", message: error.message });
        }
    }


    getCartProducts(req, res) {
        try {
            const rawData = fs.readFileSync(path.join(__dirname, this.fileCart));
            const carts = JSON.parse(rawData);

            const cartId = parseInt(req.params.cid);
            const cart = carts.find(cart => cart.id === cartId);

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado." });
            }

            res.json(cart.productos);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los productos del carrito.", message: error.message });
        }
    }

    addProductToCart(req, res) {
        try {
            const rawData = fs.readFileSync(path.join(__dirname, this.fileCart));
            const rawCart = JSON.parse(rawData);

            const cid = parseInt(req.params.cid);
            const cart = rawCart.find(cart => cart.id === cid);

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado." });
            }

            const pid = parseInt(req.params.pid);

            const existingProductIndex = cart.productos.findIndex(product => product.pid === pid);

            if (existingProductIndex !== -1) {
                cart.productos[existingProductIndex].quantity++;
            } else {
                cart.productos.push({ pid: pid, quantity: 1 });
            }

            fs.writeFileSync(path.join(__dirname, this.fileCart), JSON.stringify(rawCart, null, 2));

            res.status(200).json({ message: "Producto agregado al carrito exitosamente." });
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el producto al carrito.", message: error.message });
        }
    }








}



module.exports = CartController;
