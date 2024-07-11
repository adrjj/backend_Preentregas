// controllers/views.controller.js
const ProductController = require("./productController.js");
const CartController = require("./cartController.js");
const productModel = require("../models/products.model");

class ViewsController {
    constructor() {
        this.manager = new ProductController();
        this.cartManager = new CartController();
    }

    async loadHome(req, res) {
        try {
            const productos = await this.manager.loadProducts();
            res.render("home", { productos });
        } catch (error) {
            res.status(500).json({ error: "Error al cargar los datos", message: error.message });
        }
    }

    async loadRealTimeProducts(req, res) {
        try {
            const productos = await this.manager.loadProducts();
            res.render("realTimeProducts", { productos });
        } catch (error) {
            res.status(500).json({ error: "Error al cargar los datos", message: error.message });
        }
    }

    async loadProducts(req, res) {
        try {
            let page = parseInt(req.query.page) || 1;
            const welcome = req.query.welcome || '';
            const username = req.session.user ? (req.session.user.username || req.session.user.email) : '';

            const productos = await productModel.paginate({}, { page, limit: 6, lean: true });

            productos.prevLink = productos.hasPrevPage ? `http://localhost:8080/products?page=${productos.prevPage}` : '#';
            productos.nextLink = productos.hasNextPage ? `http://localhost:8080/products?page=${productos.nextPage}` : '#';
            productos.isValid = !(page <= 0 || page > productos.totalPages);

            let welcomeMessage = "";
            if (welcome === "1") {
                welcomeMessage = `¡Bienvenido/a, <strong>${username}</strong>, a nuestra tienda en línea!`;
            }

            if (req.headers['content-type'] === 'application/json') {
                return res.json(productos.docs);
            }

            res.render("products", { productos, welcomeMessage });
        } catch (error) {
            res.status(500).json({ error: "Error al cargar los datos", message: error.message });
        }
    }

    async loadCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productos = await this.cartManager.getCartWithProducts(cartId);
            res.render("cart", { productos });
        } catch (error) {
            res.status(500).json({ error: "Error al cargar los datos", message: error.message });
        }
    }
}

module.exports = new ViewsController();
