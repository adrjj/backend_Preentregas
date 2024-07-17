const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const ticketCollection = "tickets"

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
 })
const ticketModel = mongoose.model(ticketCollection, ticketSchema)

module.exports = ticketModel;