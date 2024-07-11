const express = require("express");
const router = express.Router();

const CartManager = require('../controllers/cartController.js')

const cartManager = new CartManager();
//crea un nuevo carrito y guarda sus productos
router.post('/', cartManager.createCart.bind(cartManager));

router.get('/', cartManager.getCartProducts.bind(cartManager));
//vacia el carrito
router.delete('/:cid', cartManager.emptyCart.bind(cartManager));

router.delete('/:cid/products/:pid', cartManager.deleteProduct.bind(cartManager));
//agrega cantidad al producto ya existente
router.put('/:cid/products/:pid', cartManager.addProductToCart.bind(cartManager));
// agrega un porducto al carrito que ya existe
router.put('/:cid', cartManager.modifyCart.bind(cartManager));


module.exports = router;
