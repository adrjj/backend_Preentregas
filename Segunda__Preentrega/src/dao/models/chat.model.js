
const mongoose = require('mongoose');
const chatCollection = "messages"

const chatSchema = new mongoose.Schema({
    
    
        message: { type: String, required: true },
        user: { type: String, required: true },
    


});
const chatModel = mongoose.model(chatCollection,chatSchema)

module.exports = chatModel;


