const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sessionCollection = "users"

const sessionSchema = new mongoose.Schema({



        first_name: { type: String, },
        last_name: { type: String, },
        email: { type: String, required: true },
        password: { type: String, },
       
        role:{type:String, default: 'user'},
        cart: {

                productos: [{


                        pid: { type: Schema.Types.ObjectId, ref: 'products' },
                        quantity: { type: Number, required: true }



                }]
        }

});
const sessionModel = mongoose.model(sessionCollection, sessionSchema)

module.exports = sessionModel;
