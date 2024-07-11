const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController.js");
const manager = new ProductController();

router.post('/', manager.addProduct.bind(manager));
router.get('/', manager.getProducts.bind(manager));
router.get('/:id', manager.getProductById.bind(manager));
router.put('/:id', manager.updateProduct.bind(manager));
router.delete('/:id', manager.deleteProduct.bind(manager));

module.exports = router;
