const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { pid } = require("process");

const fileCart = "../carritos.json";
let cart = [];
let firstId = 0;

function newID() {
    firstId++;
    return firstId;
}

router.post('/', (req, res) => {
    try {
        const newCart = {
            id: newID(),
            products: []
        };
        // Añadir productos al nuevo carrito si se proporcionan en la solicitud
        if (req.body.products && Array.isArray(req.body.products)) {
            newCart.products = req.body.products;
        }
        cart.push(newCart);

        fs.writeFile(path.join(__dirname, fileCart), JSON.stringify(cart, null, 2), (err) => {
            if (err) {
                // Manejar el error correctamente
                res.status(500).json({ error: "Error al escribir en el archivo.", message: err.message });
            } else {
                res.status(200).json({ message: "Carrito creado exitosamente.", cart: newCart });
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto.", message: error.message });
    }
});


//La ruta GET /:cid deberá listar los productos que pertenezcan al
//carrito con el parámetro cid proporcionados.

router.get('/:cid', (req, res) => {
    try {
        // Leer los datos del archivo JSON
        const rawData = fs.readFileSync(path.join(__dirname, fileCart));
        const carts = JSON.parse(rawData);

        // Encontrar el carrito por ID
        const cartId = parseInt(req.params.cid);
        const cart = carts.find(cart => cart.id === cartId);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado." });
        }

        // Retornar los productos del carrito encontrado
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos del carrito.", message: error.message });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    try {
        // Leer y parsear el archivo JSON
        const rawData = fs.readFileSync(path.join(__dirname, fileCart));
        const rawCart = JSON.parse(rawData);

        // Obtener el carrito seleccionado por su ID (cid)
        const cid = parseInt(req.params.cid);
        const cart = rawCart.find(cart => cart.id === cid);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado." });
        }

        // Obtener el ID del producto (pid) y convertirlo a entero
        const pid = parseInt(req.params.pid);

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(product => product.pid === pid);

        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementar su cantidad
            cart.products[existingProductIndex].quantity++;
        } else {
            // Si el producto no está en el carrito, agregarlo con cantidad 1
            cart.products.push({ pid: pid, quantity: 1 });
        }

        // Guardar los cambios en el archivo JSON
        fs.writeFileSync(path.join(__dirname, fileCart), JSON.stringify(rawCart, null, 2));

        res.status(200).json({ message: "Producto agregado al carrito exitosamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto al carrito.", message: error.message });
    }
});










module.exports = router;
