
const express = require("express");
const router = express.Router();
const viewsController = require("../controllers/viewsController");
const { admin  }=require("../middleware/roles.js")
const {isAuthenticated}=require("../middleware/authenticated.js")

router.get("/home", isAuthenticated, admin,viewsController.loadHome.bind(viewsController));

router.get("/realTimeProducts", isAuthenticated, admin,viewsController.loadRealTimeProducts.bind(viewsController));

router.get("/products", viewsController.loadProducts.bind(viewsController));

router.get("/cart/:cid", viewsController.loadCart.bind(viewsController));

router.get("/confirmation",)

module.exports = router;

