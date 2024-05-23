const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http); // Importing the Socket.IO server
const path = require('path');
const exphbs = require("express-handlebars");
//const ProductManager = require("./dao/ProductsManager.js");
const ProductManager = require("./dao/productManagerDb.js");
const manager = new ProductManager();
//chat
const ChatManager = require("./dao/chatManagerdb.js")
const chat= new ChatManager


const mongoose = require('mongoose');

const socketLogic = require("./socket/socketLogica.js");
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars setup
const hbs = exphbs.create();
app.engine("handlebars", hbs.engine);
app.set('views', path.join(__dirname, './public/views'));
console.log("esta es la ubicaccion", __dirname)
app.set("view engine", "handlebars");

// Importing routers
const productRouter = require('./router/products.router.js');
const cartRouter = require("./router/carts.router.js");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const viewRouter = require('./router/views.router.js');
app.use("/",viewRouter)

const chatRouter = require('./router/chat.router.js')
app.use("/chat",chatRouter)

// Configuración y manejo de eventos de WebSocket
socketLogic(io, manager,chat);

//coneccion con mongoose
mongoose.connect(process.env.CONECCCION,)
.then(()=>{console.log ("campeon del mundo, te conectaste a la base")})
.catch(error=>console.error("te rechasaron, no pudiste conectarte a la base de datos",error))

http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
