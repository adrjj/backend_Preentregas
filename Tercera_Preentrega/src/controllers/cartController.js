
const RepositoryP = require("../repositories/productRepository.js")
const ProductRepository = new RepositoryP()
const Repository = require("../repositories/cartReposytories.js")
const CartRepository = new Repository
const { v4: uuidv4 } = require('uuid'); // para generar códigos únicos
//const TicketModel = require("../models/ticket.model.js")
const { transporter } = require('../config/config');
const TicketRepository = require('../repositories/ticket.repositoy.js');


class CartController {
    async createCart(req, res) {
        try {
            const userId = req.user.id;
            const productos = req.body.productos || [];

            const updatedData = await CartRepository.createCart(userId, productos);
            res.status(200).json({ message: "Carrito actualizado exitosamente.", cart: updatedData.cart });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el carrito.", message: error.message });
        }
    }

    async getCartProducts(req, res) {
        try {
            const userId = req.user.id;
            const user = await CartRepository.getCartProducts(userId);

            if (!user || !user.cart || !Array.isArray(user.cart.productos)) {
                return res.status(404).render('cart', { error: "Carrito no encontrado o productos vacíos." });
            }

            const transformedProducts = user.cart.productos.map(product => ({
                pid: product.pid._id,
                _id: product._id,
                title: product.pid.title,
                description: product.pid.description,
                price: product.pid.price,
                thumbnail: product.pid.thumbnail,
                quantity: product.quantity
            }));

            res.render('cart', { products: transformedProducts, userId });
        } catch (error) {
            console.error('Error al obtener los productos del carrito:', error);
            res.status(500).render('cart', { error: "Error al obtener los productos del carrito." });
        }
    }

    async deleteCart(req, res) {
        const cid = req.params.cid;
        try {
            const deletedCart = await CartRepository.deleteCart(cid);
            if (!deletedCart) {
                return res.status(404).json({ message: "No se encontró ningún producto con el ID proporcionado." });
            }
            return res.status(200).json({ message: "Producto eliminado exitosamente." });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar el producto: " + error.message });
        }
    }

    async emptyCart(req, res) {
        const cid = req.params.cid;
        try {
            await CartRepository.emptyCart(cid);
            return res.json({ message: "El carrito se ha vaciado exitosamente." });
        } catch (error) {
            return res.status(500).json({ error: "Error al vaciar el carrito." });
        }
    }

    async modifyCart(req, res) {
        try {
            const cid = req.params.cid;
            const productos = req.body.productos;

            if (!Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ error: "El cuerpo de la solicitud debe contener un array de productos." });
            }

            await CartRepository.modifyCart(cid, productos);
            res.status(200).json({ message: "Producto(s) agregado(s) al carrito exitosamente." });
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el producto al carrito.", message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            console.log("deleteProduct()//", cid, pid)
            await CartRepository.deleteProduct(cid, pid);
            res.status(200).json({ message: "Producto eliminado del carrito exitosamente." });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el producto del carrito.", message: error.message });
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const cart = await CartRepository.addProductToCart(cid, pid, quantity);
            res.status(200).json({ message: 'Producto agregado al carrito', cart });
        } catch (error) {
            res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
        }
    }


    async getCartTickets(req, res) {
        try {
            const userId = req.user.id;
            console.log('User ID:', userId);

            const user = await CartRepository.getCartProducts(userId);
            console.log('User Cart:', user);

            if (!user || !user.cart || !Array.isArray(user.cart.productos)) {
                return res.status(404).render('ticket', { error: "Carrito no encontrado o productos vacíos." });
            }

            const transformedProducts = user.cart.productos.map(product => ({
                pid: product.pid._id,
                _id: product._id,
                title: product.pid.title,
                description: product.pid.description,
                price: product.pid.price,
                thumbnail: product.pid.thumbnail,
                quantity: product.quantity
            }));

            const totalPrice = transformedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
            const totalQuantity = transformedProducts.reduce((acc, product) => acc + product.quantity, 0);

            res.render('ticket', {
                products: transformedProducts,
                userId,
                totalPrice,
                totalQuantity
            });
        } catch (error) {
            console.error('Error al obtener los productos del carrito:', error);
            res.status(500).render('cart', { error: "Error al obtener los productos del carrito." });
        }
    }

   /* async confirmPurchase(req, res) {
        try {
            const userId = req.user.id;
            const userEmail = req.user.email;
            console.log("confirmPurchase() userId", userId);
            const user = await CartRepository.getCartProducts(userId);

            if (!user || !user.cart || !Array.isArray(user.cart.productos)) {
                return res.status(404).render('ticket', { error: "Carrito no encontrado o productos vacíos." });
            }

            let totalAmount = 0;
            // Actualizar stock y calcular el total
            for (const product of user.cart.productos) {
                await ProductRepository.updateStock(product.pid._id, product.quantity);
                console.log("confirmPurchase() product.pid._id, product.quantity", product.pid._id, product.quantity);
                totalAmount += product.quantity * product.pid.price;
            }
            console.log("confirmPurchase() Stock actualizado para todos los productos.");

            // Crear el ticket
            const ticket = await TicketModel.create({
                code: uuidv4(),
                amount: totalAmount,
                purchaser: userEmail
            });
            console.log("confirmPurchase() Ticket creado:", ticket);

            // Limpiar el carrito del usuario (opcional, pero recomendado)
            await CartRepository.emptyCart(userId);
       
          
            // Enviar correo electrónico
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: 'Confirmación de compra',
                text: `Gracias por tu compra. Aquí están los detalles de tu ticket:
                   \nCódigo: ${ticket.code}
                   \nMonto $: ${ticket.amount}
                   \nComprador: ${ticket.purchaser}`
            };
            console.log("mail",mailOptions)

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo electrónico:', error);
                } else {
                    console.log('Correo electrónico enviado:', info.response);
                }
            });
            return res.render('confirmation', { ticket: ticket.toObject() });
        } catch (error) {
            console.error('Error al confirmar la compra:', error);
            res.status(500).render('ticket', { error: "Error al confirmar la compra." });
        }
    }*/

    

async confirmPurchase(req, res) {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;
        console.log("confirmPurchase() userId", userId);
        const user = await CartRepository.getCartProducts(userId);

        if (!user || !user.cart || !Array.isArray(user.cart.productos)) {
            return res.status(404).render('ticket', { error: "Carrito no encontrado o productos vacíos." });
        }

        let totalAmount = 0;
        // Actualizar stock y calcular el total
        for (const product of user.cart.productos) {
            await ProductRepository.updateStock(product.pid._id, product.quantity);
            console.log("confirmPurchase() product.pid._id, product.quantity", product.pid._id, product.quantity);
            totalAmount += product.quantity * product.pid.price;
        }
        console.log("confirmPurchase() Stock actualizado para todos los productos.");

        // Crear el ticket utilizando el repositorio
        const ticketData = {
            code: uuidv4(),
            amount: totalAmount,
            purchaser: userEmail
        };

        const ticket = await TicketRepository.createTicket(ticketData);
        console.log("confirmPurchase() Ticket creado:", ticket);

        // Limpiar el carrito del usuario (opcional, pero recomendado)
        await CartRepository.emptyCart(userId);

        // Enviar correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Confirmación de compra',
            text: `Gracias por tu compra. Aquí están los detalles de tu ticket:
                   \nCódigo: ${ticket.code}
                   \nMonto $: ${ticket.amount}
                   \nComprador: ${ticket.purchaser}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo electrónico:', error);
            } else {
                console.log('Correo electrónico enviado:', info.response);
            }
        });

        return res.render('confirmation', { ticket: ticket.toObject() });
    } catch (error) {
        console.error('Error al confirmar la compra:', error);
        res.status(500).render('ticket', { error: "Error al confirmar la compra." });
    }
}




};



module.exports = CartController;
