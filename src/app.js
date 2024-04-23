//app archivo principal

const express = require("express")
const app = express()
const PORT = 8080





app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const productRouter = require("../router/products.js")
const cartRouter = require("../router/carts.js")


app.use('/api/products', productRouter);
app.use('/api/carts',cartRouter);


app.listen(PORT, () => {

    console.log("probando coneccion con el puerto 8080")
})