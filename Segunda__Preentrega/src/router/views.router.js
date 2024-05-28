const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/productManagerDb.js");
const cartManager   =require("../dao/cartManagerDb.js")
const carroManager = new cartManager()
const manager = new ProductManager();
const productModel =require("../dao/models/products.model.js")

router.get("/home", async (req, res) => {
    try {
        const productos = await manager.loadProducts();
 
        res.render("home", { productos });
    } catch (error) {
        res.status(500).json({ error: "Error al cargar los datos", message: error.message });
    }
});

router.get("/realTimeProducts", async (req, res) => {
    try {
        const productos = await manager.loadProducts();
        res.render("realTimeProducts", { productos});

    } catch (error) {
        res.status(500).json({ error: "Error al cargar los datos", message: error.message });
    }
});


router.get("/products", async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1; // Definir la página antes de usarla

        // Obtener los productos paginados directamente desde la base de datos
        const productos = await productModel.paginate({}, { page, limit: 6, lean: true });

        productos.prevLink = productos.hasPrevPage ? `http://localhost:8080/products?page=${productos.prevPage}` : '#';
        productos.nextLink = productos.hasNextPage ? `http://localhost:8080/products?page=${productos.nextPage}` : '#';
        productos.isValid = !(page <= 0 || page > productos.totalPages);

        // Renderizar la vista 'products' con los productos paginados
        res.render("products", { productos });

    } catch (error) {
        res.status(500).json({ error: "Error al cargar los datos", message: error.message });
    }
});




router.get("/cart/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productos = await carroManager.getCartWithProducts(cartId);
        
        console.log("1//,ruter.get" ,productos)
        res.render("cart", { productos });
       
    } catch (error) {
        res.status(500).json({ error: "Error al cargar los datos", message: error.message });
    }
});


module.exports = router;
