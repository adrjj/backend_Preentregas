const mongoose = require('mongoose');
const mongoosePaginate = require ('mongoose-paginate-v2')
const productCollection = "products"

const productsSchema = new mongoose.Schema({
    
    title:{type: String, required:true, max:150, index:true },
    description:{type: String, required:true, max:200 },
    price:{type: Number, required:true,  },
    thumbnail:{type: String, required:true, },
    code:{type: Number, required:true,  },
    stock:{type: Number, required:true,  },
    status: {type: Boolean, default: true},
    category:{type: String, required:true, max:150 },
   
    

})

productsSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection,productsSchema)

module.exports = productModel;