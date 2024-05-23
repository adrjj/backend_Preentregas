const mongoose = require('mongoose');
const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    
    productos: [{
        pid: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }]


})
const cartModel = mongoose.model(cartCollection,cartSchema)

module.exports = cartModel;