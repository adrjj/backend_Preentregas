const express = require("express");
const router = express.Router();
//const CartManager = require('../dao/CartManager.js');
const CartManager = require('../dao/cartManagerDb.js')

const cartManager = new CartManager();
//crea un nuevo carrito y guarda sus productos
router.post('/', cartManager.createCart.bind(cartManager));
//muestra el carrito pasando el id
router.get('/:cid', cartManager.getCartProducts.bind(cartManager));
//vacia el carrito
router.delete('/:cid', cartManager.emptyCart.bind(cartManager));
//eleminar el carrito
router.delete('/:cid',cartManager.deleteCart.bind(cartManager))
//elimina el porducto del carrito selecionado
router.delete('/:cid/products/:pid', cartManager.deleteProduct.bind(cartManager));
//agrega cantidad al producto ya existente
router.put('/:cid/product/:pid', cartManager.addProductToCart.bind(cartManager));
// agrega un porducto al carrito que ya existe
router.put('/:cid', cartManager.modifyCart.bind(cartManager));


module.exports = router;
