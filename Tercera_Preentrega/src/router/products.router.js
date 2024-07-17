const express = require("express");
const { admin  }=require("../middleware/roles.js")
const {isAuthenticated}=require("../middleware/authenticated.js")
const router = express.Router();
const ProductController = require("../controllers/productController.js");
const manager = new ProductController();

router.post('/',isAuthenticated, admin,  manager.addProduct.bind(manager));
router.get('/', manager.getProducts.bind(manager));
router.get('/:id', manager.getProductById.bind(manager));
router.put('/:id',isAuthenticated,admin, manager.updateProduct.bind(manager));
router.delete('/:id',isAuthenticated,admin, manager.deleteProduct.bind(manager));

module.exports = router;
