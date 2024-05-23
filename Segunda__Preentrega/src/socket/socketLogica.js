const socketLogic = (io, manager,chat) => {
    io.on("connection", (socket) => {
        console.log("User connected");

   
        
     
        
       socket.on("productAdded", async (newProduct) => {
            try {
                console.log("2//esto trae ",newProduct)
                const productos = await manager.loadProducts();
                console.log("3//esto trae ",productos)
                //const addedProduct = productos.find(product => product.code === newProduct.code);
                io.emit("productos", productos);
                //console.log("4//datos de socketlogica.js enviados",addedProduct)
                console.log("5// esto se emite",productos)
            } catch (error) {
                console.log("Error al cargar el producto", error.message);
            }
        });

        socket.on("productDeleted", async (productId) => {
            console.log("17// esto es lo que recibo del handlebars", productId)
            try {
                io.emit("idDeleted", productId);
                await manager.deleteProduct(productId);
                console.log("19//después de la promesa que llega", idObjeto)
                console.log(`20//Product with ID ${productId} successfully deleted`);
              
                console.log("21//después de la promesa que llega", productId)
            } catch (error) {
                console.error("Error al eliminar el producto", error);
            }
        });

        //-----------------CHAT---------------------------//
        
        socket.on("message", async (data) => {
            try {
                // Guardar el mensaje en MongoDB Atlas
                await chat.saveMessage(data);
                // Emitir el mensaje a todos los clientes conectados
                io.emit("messageLog", [data]);
                console.log("9// esto emtimos el mensje",data)
            } catch (error) {
                console.error("Error al guardar el mensaje en MongoDB Atlas", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });




};

module.exports = socketLogic;
