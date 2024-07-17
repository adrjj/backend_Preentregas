const express = require("express");
const router = express.Router();
const { user }=require("../middleware/roles.js")
const {isAuthenticated}=require("../middleware/authenticated.js")
const CartManager = require('../controllers/cartController.js')




const cartManager = new CartManager();
//crea un nuevo carrito y guarda sus productos
router.post('/',isAuthenticated,user, cartManager.createCart.bind(cartManager));

router.get('/', cartManager.getCartProducts.bind(cartManager));
//vacia el carrito
router.delete('/:cid', cartManager.emptyCart.bind(cartManager));

router.delete('/:cid/products/:pid', cartManager.deleteProduct.bind(cartManager));
//agrega cantidad al producto ya existente
router.put('/:cid/products/:pid',isAuthenticated,user, cartManager.addProductToCart.bind(cartManager));
// agrega un porducto al carrito que ya existe
router.put('/:cid',isAuthenticated,user, cartManager.modifyCart.bind(cartManager));
//comprar carrito

// Ruta para comprar el carrito

router.get('/:cid/purchase',isAuthenticated,user,  cartManager.getCartTickets.bind(cartManager))

//ruta para confirmar la compra del carrito
router.post('/:cid/confirmPurchase', cartManager.confirmPurchase.bind(cartManager))






module.exports = router;
