
const express = require("express");
const router = express.Router();
const viewsController = require("../controllers/viewsController");

router.get("/home", viewsController.loadHome.bind(viewsController));

router.get("/realTimeProducts", viewsController.loadRealTimeProducts.bind(viewsController));

router.get("/products", viewsController.loadProducts.bind(viewsController));

router.get("/cart/:cid", viewsController.loadCart.bind(viewsController));

module.exports = router;

