const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartCollection = "carts"

const cartSchema = new mongoose.Schema({

    productos: [{
       
    
           pid: { type: Schema.Types.ObjectId, ref: 'products' },
            quantity:  { type: Number, required: true }
        
       
      
    }]
      
 
                    


})
const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = cartModel;